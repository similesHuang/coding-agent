import { Anthropic } from "@anthropic-ai/sdk";
import {
  MessageParam,
  Tool,
} from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";

dotenv.config();

//设置apikey
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY 未设置");
}
class MCPClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  // 连接mcp服务器
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
      this.tools = toolsResults.tools.map((tool)=>{
        const {name,description,inputSchema} = tool;
         return {
             name,
             description,
             input_schema:inputSchema,
         }
      })
      console.log("已连接到服务器，工具包括:",
        this.tools.map((tool)=>tool.name)
      )
    } catch (e) {
      console.error("无法连接到MCP服务器:",e);
    }
  }

  // 处理查询和工具调用逻辑
   async processQuery(query: string) {  
     const messages:MessageParam[] = [
        {
             role:'user',
             content:query
        }
     ];
     // 这里需要替换为自己的模型接口
     const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages,
        tools: this.tools,
      });
     
     const finalText = [];
     const toolResults =[];
    //  for(const content )
  }
}
