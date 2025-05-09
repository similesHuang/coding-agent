// mcp.service.ts
import { MCPClient } from "@mcp/mcp-client";
import { ToolMessage } from "./types";
import { Context } from "vm";
import path from "path";
import { Worker } from "worker_threads";
interface Connection {
  client: MCPClient;
  serverName: string;
  serverPath: string;
  connectedAt: Date;
}

const connections = new Map<string, Connection>();

export const createConnection = async (
  serverPath: string,
  serverName: string
) => {
  if (connections.has(serverName)) {
    throw new Error(`Connection ${serverName} already exists`);
  }

  const client = new MCPClient();
  const isConnected = await client.connectToServer(serverPath);

  if (!isConnected) {
    throw new Error("Failed to connect to MCP server");
  }

  const connection = {
    client,
    serverName,
    serverPath,
    connectedAt: new Date(),
  };

  connections.set(serverName, connection);
  return client;
};

export const getConnection = (serverName: string) => {
  return connections.get(serverName)?.client;
};

export const listConnections = () => {
  return Array.from(connections.values());
};

export const closeConnection = async (serverName: string) => {
  const connection = connections.get(serverName);
  if (connection) {
    await connection.client.cleanup();
    connections.delete(serverName);
  }
};

// 处理查询（适配阿里云千问API）
// export const processQuery = async (query: string, client: MCPClient,ctx:Context) => {
//   const { tools, qianwen, mcp } = await client;
//   try {
//     const response = await qianwen.chat.completions.create({
//       model: "qwen-max",
//       messages: [
//         {
//           role: "system",
//           content: "你是一个专业的前端AI智能助手。",
//         },
//         {
//           role: "user",
//           content: query,
//         },
//       ],
//       tools: tools.length > 0 ? tools : undefined,
//     });
//     const assistantMessage = response.choices[0].message;

//     let result = assistantMessage.content;
//     // 处理工具调用
//     if (assistantMessage?.tool_calls?.length ?? 0 > 0) {
//       const toolResults: ToolMessage[] = [];
//       for (const toolcall of assistantMessage?.tool_calls ?? []) {
//         try {
//           // 通过mcp执行工具
//           const toolResult = await mcp.callTool({
//             name: toolcall.function.name,
//             arguments: JSON.parse(toolcall.function.arguments),
//           });

//           toolResults.push({
//             role: "tool",
//             name: toolcall.function.name,
//             content: JSON.stringify(toolResult),
//             tool_call_id: toolcall.id, // 必须提供工具调用ID
//           });
//         } catch (err) {
//           console.log(`执行工具 ${toolcall.function.name} 失败:`, err);
//           toolResults.push({
//             role: "tool",
//             name: toolcall.function.name,
//             content: JSON.stringify({ err }),
//             tool_call_id: toolcall.id,
//           });
//         }
//       }

//       // 将工具结果发送回模型 - 改为流式调用
//       console.log("发送工具结果回模型，使用流式响应...");
//       const toolResponse = await qianwen.chat.completions.create({
//         model: "qwen-max",
//         messages: [
//           { role: "user", content: query },
//           assistantMessage,
//           ...toolResults,
//         ] as const,
//         tools: tools,
//         stream: true  // 开启流式响应
//       });

//       // 处理流式响应
//       result = '';  // 重置结果
//       console.log("开始接收工具调用后的流式响应...");

//       // 遍历流式响应
//       for await (const chunk of toolResponse) {
//         if (chunk.choices[0]?.delta?.content) {
//           result += chunk.choices[0].delta.content;
//           console.log("接收到流式响应:", chunk.choices[0].delta.content);
//         }
//       }

//       console.log("工具调用后的流式响应接收完毕");
//     }

//     return result;
//   } catch (err) {
//     console.error("处理查询时出错:", err);
//     return `处理查询时发生错误: ${err instanceof Error ? err.message : String(err)}`;
//   }
// };

// export const processQuery = async (query: string, client: MCPClient, ctx: Context) => {
//   const { tools, qianwen, mcp } = await client;
//   try {
//     // 使用流式响应获取初始回复
//     const response = await qianwen.chat.completions.create({
//       model: "qwen3-235b-a22b",
//       messages: [
//         {
//           role: "system",
//           content: "你是一个专业的前端AI智能助手。",
//         },
//         {
//           role: "user",
//           content: query,
//         },
//       ],
//       tools: tools.length > 0 ? tools : undefined,
//       stream: true, // 开启流式响应
//     });

//     // 创建响应写入器
//     const responseWriter = ctx.res;

//     // 设置响应头
//     ctx.set('Content-Type', 'text/event-stream');
//     ctx.set('Cache-Control', 'no-cache');
//     ctx.set('Connection', 'keep-alive');
//     ctx.status = 200;

//     let assistantContent = '';
//     let assistantMessage: any = null;
//     let toolCalls: any[] = [];

//     // 处理初始流式响应
//     for await (const chunk of response) {
//       if (chunk.choices[0]?.delta?.content) {
//         const toolContent = chunk.choices[0].delta.content;
//         assistantContent += toolContent;

//         // 向客户端发送事件
//         responseWriter.write(`data: ${JSON.stringify({ type: 'toolContent', toolContent })}\n\n`);
//       }

//       // 收集工具调用信息
//       if (chunk.choices[0]?.delta?.tool_calls) {
//         for (const toolCall of chunk.choices[0].delta.tool_calls) {
//           // 初始化工具调用对象
//           if (toolCall.index !== undefined && !toolCalls[toolCall.index]) {
//             toolCalls[toolCall.index] = {
//               id: toolCall.id || '',
//               function: { name: '', arguments: '' }
//             };
//           }

//           // 更新工具调用ID
//           if (toolCall.id && toolCall.index !== undefined) {
//             toolCalls[toolCall.index].id = toolCall.id;
//           }

//           // 更新函数名称
//           if (toolCall.function?.name && toolCall.index !== undefined) {
//             toolCalls[toolCall.index].function.name = toolCall.function.name;
//           }

//           // 追加函数参数
//           if (toolCall.function?.arguments && toolCall.index !== undefined) {
//             toolCalls[toolCall.index].function.arguments += toolCall.function.arguments;
//           }
//         }
//       }

//       // 判断是否结束
//       if (chunk.choices[0]?.finish_reason) {
//         assistantMessage = {
//           role: 'assistant',
//           content: assistantContent,
//           tool_calls: toolCalls.length > 0 ? toolCalls : undefined
//         };
//       }
//     }
//     // 处理工具调用
//     if (toolCalls.length > 0 && assistantMessage) {
//       // 向客户端发送工具调用开始事件
//       responseWriter.write(`data: ${JSON.stringify({ type: 'tool_calling', message: '正在执行工具调用...' })}\n\n`);

//       const toolResults: ToolMessage[] = [];
//       for (const toolcall of toolCalls) {
//         try {
//           // 发送正在调用特定工具的消息
//           responseWriter.write(`data: ${JSON.stringify({
//             type: 'tool_progress',
//             message: `正在调用工具: ${toolcall.function.name}...`
//           })}\n\n`);

//           // 通过mcp执行工具
//           const toolResult = await mcp.callTool({
//             name: toolcall.function.name,
//             arguments: JSON.parse(toolcall.function.arguments),
//           });

//           toolResults.push({
//             role: "tool",
//             name: toolcall.function.name,
//             content: JSON.stringify(toolResult),
//             tool_call_id: toolcall.id,
//           });

//           // 发送工具调用结果
//           responseWriter.write(`data: ${JSON.stringify({
//             type: 'tool_result',
//             name: toolcall.function.name,
//             result: toolResult
//           })}\n\n`);
//         } catch (err) {
//           console.log(`执行工具 ${toolcall.function.name} 失败:`, err);

//           const errorMessage = err instanceof Error ? err.message : String(err);
//           toolResults.push({
//             role: "tool",
//             name: toolcall.function.name,
//             content: JSON.stringify({ error: errorMessage }),
//             tool_call_id: toolcall.id,
//           });

//           // 发送工具调用错误
//           responseWriter.write(`data: ${JSON.stringify({
//             type: 'tool_error',
//             name: toolcall.function.name,
//             error: errorMessage
//           })}\n\n`);
//         }
//       }

//       // 发送工具调用完成的消息
//       responseWriter.write(`data: ${JSON.stringify({
//         type: 'tools_complete',
//         message: '工具调用完成，正在生成最终响应...'
//       })}\n\n`);

//       // 将工具结果发送回模型 - 使用流式调用
//       const toolResponse = await qianwen.chat.completions.create({
//         model: "qwen3-235b-a22b",
//         messages: [
//           { role: "user", content: query },
//           assistantMessage,
//           ...toolResults,
//         ] as const,
//         tools: tools,
//         stream: true
//       });

//       const res = await qianwen.chat.completions.create({
//         model: "qwen-plus",
//         messages: [
//           { role: "user", content: query },
//           assistantMessage,
//           ...toolResults,
//         ] as const,
//         tools: tools,
//       });
//       console.log('res:',JSON.stringify(res));
//       // 处理工具调用后的流式响应
//       for await (const chunk of toolResponse) {
//         if (chunk.choices[0]?.delta?.content) {
//           const content = chunk.choices[0].delta.content;
//           console.log("接收到流式响应:", content);
//           // 向客户端发送最终内容
//           responseWriter.write(`data: ${JSON.stringify({ type: 'final_content', content })}\n\n`);
//         }
//       }
//     }

//     // 发送结束事件
//     responseWriter.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
//     responseWriter.end();

//     return "流式响应已完成";
//   } catch (err) {
//     console.error("处理查询时出错:", err);
//     // 如果已经开始流式响应，发送错误消息
//     try {
//       if (ctx.res && !ctx.res.finished) {
//         ctx.res.write(`data: ${JSON.stringify({
//           type: 'error',
//           error: err instanceof Error ? err.message : String(err)
//         })}\n\n`);
//         ctx.res.end();
//       }
//     } catch (e) {
//       console.error("发送错误响应失败:", e);
//     }
//     return `处理查询时发生错误: ${err instanceof Error ? err.message : String(err)}`;
//   }
// };

export const processQuery = async (
  query: string,
  client: MCPClient,
  ctx: Context
) => {
  const { tools, qianwen, mcp } = client;
  try {
    // 设置响应头
    ctx.set("Content-Type", "text/event-stream");
    ctx.set("Cache-Control", "no-cache");
    ctx.set("Connection", "keep-alive");
    ctx.status = 200;
    const responseWriter = ctx.res;

    // 初始化消息历史
    const initialMessageHistory = [
      { role: "system", content: "你是一个专业的前端AI智能助手。" },
      { role: "user", content: query },
    ];

    // 创建一个worker线程
    const worker = new Worker(
      path.join(__dirname, "../utils/query-worker.js"),
      {
        workerData: {
          initialQuery: query,
          messageHistory: initialMessageHistory,
        },
      }
    );

    // 设置消息处理器
    worker.on("message", async (message) => {
      switch (message.type) {
        case "requestModelCall":
          // 处理模型调用请求
          try {
            console.log(`正在调用模型，轮次: ${message.round}`);

            // 向客户端发送轮次开始通知
            responseWriter.write(
              `data: ${JSON.stringify({
                type: "round_start",
                round: message.round,
                message: `第 ${message.round} 轮处理开始...`,
              })}\n\n`
            );

            // 调用大模型
            const response = await qianwen.chat.completions.create({
              model: "qwen3-235b-a22b",
              messages: message.messages,
              tools: tools.length > 0 ? tools : undefined,
              stream: true,
            });

            // 收集响应内容
            let assistantContent = "";
            let toolCalls = [];

            // 处理流式响应
            for await (const chunk of response) {
              // 处理内容部分
              if (chunk.choices[0]?.delta?.content) {
                const content = chunk.choices[0].delta.content;
                assistantContent += content;

                // 向客户端发送内容块
                responseWriter.write(
                  `data: ${JSON.stringify({
                    type: "content_chunk",
                    round: message.round,
                    content: content,
                  })}\n\n`
                );
              }

              // 使用类型断言处理 reasoning_content
              const delta = chunk.choices[0]?.delta as any;

              if (delta?.reasoning_content) {
                const reasonContent = delta.reasoning_content;
                responseWriter.write(
                  `data: ${JSON.stringify({
                    type: "reasoning_content_chunk",
                    round: message.round,
                    content: reasonContent,
                  })}\n\n`
                );
              }

              // 处理工具调用
              if (chunk.choices[0]?.delta?.tool_calls) {
                for (const toolCall of chunk.choices[0].delta.tool_calls) {
                  // 初始化工具调用对象
                  if (
                    toolCall.index !== undefined &&
                    !toolCalls[toolCall.index]
                  ) {
                    toolCalls[toolCall.index] = {
                      id: toolCall.id || "",
                      function: { name: "", arguments: "" },
                    };
                  }

                  // 更新工具调用ID
                  if (toolCall.id && toolCall.index !== undefined) {
                    toolCalls[toolCall.index].id = toolCall.id;
                  }

                  // 更新函数名称
                  if (toolCall.function?.name && toolCall.index !== undefined) {
                    toolCalls[toolCall.index].function.name =
                      toolCall.function.name;
                  }

                  // 追加函数参数
                  if (
                    toolCall.function?.arguments &&
                    toolCall.index !== undefined
                  ) {
                    toolCalls[toolCall.index].function.arguments +=
                      toolCall.function.arguments;
                  }
                }
              }
            }

            // 构建完整的助手消息
            const assistantMessage = {
              role: "assistant",
              content: assistantContent,
              tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
            };

            // 向Worker发送模型响应
            worker.postMessage({
              type: "modelResponse",
              round: message.round,
              message: assistantMessage,
              hasToolCalls: toolCalls.length > 0,
            });
          } catch (err) {
            console.error("模型调用错误:", err);
            worker.postMessage({
              type: "error",
              round: message.round,
              error: err instanceof Error ? err.message : String(err),
            });
          }
          break;

        case "requestToolCall":
          // 处理工具调用请求
          try {
            const { tool, round, index, total } = message;
            console.log(`执行工具: ${tool.name} (${index}/${total})`);

            // 向客户端发送工具调用进度
            responseWriter.write(
              `data: ${JSON.stringify({
                type: "tool_progress",
                round: round,
                index: index,
                total: total,
                name: tool.name,
                message: `正在调用工具 (${index}/${total}): ${tool.name}...`,
              })}\n\n`
            );

            // 执行工具调用
            const toolResult = await mcp.callTool({
              name: tool.name,
              arguments: tool.arguments,
            });

            // 向客户端发送工具调用结果
            responseWriter.write(
              `data: ${JSON.stringify({
                type: "tool_result",
                round: round,
                index: index,
                name: tool.name,
                result: toolResult,
              })}\n\n`
            );

            // 将结果发送回Worker
            worker.postMessage({
              type: "toolCallResult",
              round: round,
              toolId: tool.id,
              name: tool.name,
              result: toolResult,
              success: true,
            });
          } catch (err) {
            console.error(`工具调用错误:`, err);
            const errorMessage =
              err instanceof Error ? err.message : String(err);

            // 向客户端发送错误
            responseWriter.write(
              `data: ${JSON.stringify({
                type: "tool_error",
                round: message.round,
                index: message.index,
                name: message.tool.name,
                error: errorMessage,
              })}\n\n`
            );

            // 将错误发回Worker
            worker.postMessage({
              type: "toolCallResult",
              round: message.round,
              toolId: message.tool.id,
              name: message.tool.name,
              error: errorMessage,
              success: false,
            });
          }
          break;

        // 处理各种UI相关消息
        case "toolsStart":
          responseWriter.write(
            `data: ${JSON.stringify({
              type: "tools_start",
              round: message.round,
              toolCount: message.toolCount,
              message: `开始执行 ${message.toolCount} 个工具调用...`,
            })}\n\n`
          );
          break;

        case "toolsComplete":
          responseWriter.write(
            `data: ${JSON.stringify({
              type: "tools_complete",
              round: message.round,
              message: "本轮工具调用完成，准备进入下一轮处理...",
            })}\n\n`
          );
          break;

        case "processComplete":
          responseWriter.write(
            `data: ${JSON.stringify({
              type: "process_complete",
              round: message.round,
              message: "所有处理完成，无更多工具调用",
            })}\n\n`
          );
          break;

        case "complete":
          responseWriter.write(
            `data: ${JSON.stringify({
              type: "final_result",
              totalRounds: message.totalRounds,
              message: "处理完成",
            })}\n\n`
          );

          // 发送结束事件
          responseWriter.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          responseWriter.end();
          break;

        case "log":
          console.log(`Worker日志: ${message.message}`);
          break;

        case "error":
          console.error("Worker错误:", message.error);

          responseWriter.write(
            `data: ${JSON.stringify({
              type: "error",
              error: message.error,
            })}\n\n`
          );

          responseWriter.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          responseWriter.end();
          break;
      }
    });

    // 处理Worker错误
    worker.on("error", (err) => {
      console.error("Worker错误:", err);
      try {
        if (!responseWriter.writableEnded) {
          responseWriter.write(
            `data: ${JSON.stringify({
              type: "error",
              error: err.message,
            })}\n\n`
          );

          responseWriter.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          responseWriter.end();
        }
      } catch (e) {
        console.error("发送错误响应失败:", e);
      }
    });

    // 处理Worker退出
    worker.on("exit", (code) => {
      console.log(`Worker以代码${code}退出`);
      if (code !== 0 && !responseWriter.writableEnded) {
        try {
          responseWriter.write(
            `data: ${JSON.stringify({
              type: "error",
              error: `Worker进程以代码${code}退出`,
            })}\n\n`
          );

          responseWriter.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          responseWriter.end();
        } catch (e) {
          console.error("发送退出错误响应失败:", e);
        }
      }
    });

    // 等待Worker完成
    await new Promise((resolve, reject) => {
      worker.on("exit", (code) => {
        if (code === 0 || code === null) {
          resolve("Worker成功完成");
        } else {
          reject(new Error(`Worker以代码${code}退出`));
        }
      });
    });

    return "流式响应已完成";
  } catch (err) {
    console.error("处理查询时出错:", err);
    // 如果已经开始流式响应，发送错误消息
    try {
      if (ctx.res && !ctx.res.writableEnded) {
        ctx.res.write(
          `data: ${JSON.stringify({
            type: "error",
            error: err instanceof Error ? err.message : String(err),
          })}\n\n`
        );
        ctx.res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
        ctx.res.end();
      }
    } catch (e) {
      console.error("发送错误响应失败:", e);
    }
    return `处理查询时发生错误: ${
      err instanceof Error ? err.message : String(err)
    }`;
  }
};
