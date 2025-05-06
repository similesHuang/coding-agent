import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai"; // 使用兼容OpenAI的SDK
import readline from "readline/promises";
import dotenv from "dotenv";
import {  resolve } from 'path';
import { error } from "console";
import { ToolMessage } from "./types.js";

// 加载环境变量
dotenv.config({
  path: resolve(__dirname, '../.env')  // 从build/src向上查找
});
// 设置API Key（阿里云百炼的Key）
console.log('path',resolve(__dirname, '../.env'))
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
if (!DASHSCOPE_API_KEY) {
  throw new Error("DASHSCOPE_API_KEY 未设置");
}

export class MCPClient {
  private mcp: Client;
  private qianwen: OpenAI; // 使用OpenAI兼容客户端
  private transport: StdioClientTransport | null = null;
  public tools: any[] = []; // 工具列表（类型需适配阿里云格式）

  constructor() {
    this.qianwen = new OpenAI({
      apiKey: DASHSCOPE_API_KEY,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1", // 阿里云兼容端点
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  // 连接MCP服务器（保持不变）
  async connectToServer(serverScriptPath: string) {
    try {
      const isJS = serverScriptPath.endsWith(".js");
      if (!isJS) {
        throw new Error("服务器脚本必须是js文件");
      }
      const command = process.execPath;
      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });

      this.mcp.connect(this.transport);
      const toolsResults = await this.mcp.listTools();
       // 转换工具格式为阿里云兼容格式
       this.tools = toolsResults.tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema || {
            type: "object",
            properties: {},
            required: []
          }
        }
      }));
      
      console.log("已连接到服务器，工具包括:", this.tools.map(tool => tool.function.name));
      if(this.tools.length>0){
         return true;
      }else{
         return false;
      }
    } catch (e) {
      console.error("无法连接到MCP服务器:", e);
    }
    return false;
  }

  // 处理查询（适配阿里云千问API）
  async processQuery(query: string) {
    try {
      const response = await this.qianwen.chat.completions.create({
        model: "qwen-max", // 模型名称：qwen-max/qwen-plus等
        messages: [
          { role: "system", content: "你是一个有帮助的助手。" },
          { role: "user", content: query },
        ],
        tools: this.tools.length > 0 ? this.tools : undefined,
      });
      const assistantMessage = response.choices[0].message;
      let result = assistantMessage.content;
      // 处理工具调用
      if (assistantMessage?.tool_calls?.length ?? 0 > 0) {
         const toolResults:ToolMessage[] = [];
         for(const toolcall of assistantMessage?.tool_calls ?? []){
           try{
             // 通过mcp执行工具
              const toolResult = await this.mcp.callTool({
                name:toolcall.function.name,
                arguments:JSON.parse(toolcall.function.arguments),
              });
              toolResults.push({
                role: "tool",
                name: toolcall.function.name,
                content: JSON.stringify(toolResult),
                tool_call_id: toolcall.id, // 必须提供工具调用ID
              });
           }catch(err){
             console.log(`执行工具 ${toolcall.function.name} 失败:`, error)
             toolResults.push({
              role: "tool",
              name: toolcall.function.name,
              content: JSON.stringify({ err}),
              tool_call_id:toolcall.id
            });
           }
           
         }

        // 将工具结果发送回模型
        const toolResponse = await this.qianwen.chat.completions.create({
          model: "qwen-max",
          messages: [
            { role: "user", content: query },
            assistantMessage,
            ...toolResults,
          ] as const,
          tools: this.tools,
        });
        result = toolResponse.choices[0].message.content;
      }
  
        
      return result;
    } catch (error) {
      console.error("调用千问API出错:", error);
      throw error;
    }
  }

  async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    try {
      console.log("\nMCP 客户端已启动！");
      console.log("输入你的查询或输入 'quit' 退出。");
  
      while (true) {
        const message = await rl.question("\n查询: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }
  
  async cleanup() {
    await this.mcp.close();
  }
}
