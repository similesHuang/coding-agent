const { parentPort, workerData } = require('worker_threads');

// 初始状态
const state = {
    messageHistory: workerData.messageHistory || [],
    currentRound: 0,  // 修正拼写错误 (currentData → currentRound)
    maxRounds: 5,     // 修正拼写错误 (maxRound → maxRounds)
    pendingToolCalls: [],
    toolResults: [],
    initialQuery: workerData.initialQuery,
}

// 发送日志信息
const log = (message) => {
    parentPort.postMessage({
        type: 'log',
        message,
    });
}

// 主处理流程
const main = async () => {
  try {
     let continueProcessing = true;
     // 循环处理对话，直到没有工具调用或达到最大轮次
     while (continueProcessing && state.currentRound < state.maxRounds) {
           state.currentRound++;
           log(`开始第 ${state.currentRound} 轮处理`);
           
           // 请求主线程调用模型
           parentPort.postMessage({
              type: 'requestModelCall',
              round: state.currentRound,
              messages: state.messageHistory,
           });

           // 等待模型响应结果
           const modelResponse = await waitForMessage('modelResponse');

           if (modelResponse.error) {
              throw new Error(`调用模型失败：${modelResponse.error}`);
           }
           
           // 将模型响应结果添加到消息历史记录中
           state.messageHistory.push(modelResponse.message);
           const hasToolCalls = modelResponse.hasToolCalls;  
           
           if (hasToolCalls) {
               const toolCalls = modelResponse.message.tool_calls || [];
               log(`模型回复包含 ${toolCalls.length} 个工具调用`);

               // 通知工具调用开始
               parentPort.postMessage({
                 type: 'toolsStart',  // 修正拼写错误 (toolStart → toolsStart)
                 round: state.currentRound,
                 toolCount: toolCalls.length,
               });
              
               // 清空工具结果
               state.toolResults = [];

               // 依次处理工具调用
               for (let i = 0; i < toolCalls.length; i++) {
                   const toolCall = toolCalls[i];

                   // 请求主线程执行工具
                   parentPort.postMessage({
                       type: 'requestToolCall',
                       round: state.currentRound,
                       index: i + 1,
                       total: toolCalls.length,
                       tool: {
                          id: toolCall.id,
                          name: toolCall.function.name,
                          arguments: JSON.parse(toolCall.function.arguments)
                       }
                   });
                   
                   // 等待工具调用结果
                   const toolResult = await waitForMessage('toolCallResult');

                   const toolResultMessage = {
                       role: 'tool',
                       name: toolCall.function.name,
                       content: JSON.stringify(toolResult.success 
                           ? toolResult.result 
                           : { error: toolResult.error }),
                       tool_call_id: toolCall.id,  // 修正拼写错误 (too_call_id → tool_call_id)
                   };

                   // 添加工具结果到列表
                   state.toolResults.push(toolResultMessage);
               }

               // 将工具结果添加到消息历史
               state.messageHistory = state.messageHistory.concat(state.toolResults);
                     
               // 通知工具调用完成
               parentPort.postMessage({
                   type: 'toolsComplete',  // 修正拼写错误 (toolsCompleted → toolsComplete)
                   round: state.currentRound,
               });
               
               // 下一轮处理
               continueProcessing = true;
           } else {
               // 没有工具调用，处理完成
               log('没有工具调用，处理完成');
               parentPort.postMessage({
                   type: 'processComplete',  // 修正类型 (toolsComplete → processComplete)
                   round: state.currentRound,
               });
               
               continueProcessing = false;
           }
     }
        
     // 通知处理完成
     parentPort.postMessage({
         type: 'complete',
         totalRounds: state.currentRound,
     });
  } catch (error) {
    log(`处理过程出错: ${error.message}`);
    parentPort.postMessage({
        type: 'error',
        error: error.message,
    });
  }
}

// 等待特定类型的消息
const waitForMessage = (waitType) => {
    return new Promise((resolve) => {
        const messageHandler = (message) => {
          if (message.type === waitType) {
            // 收到符合条件的消息，移除监听器并解析Promise
            parentPort.off('message', messageHandler);
            resolve(message);
          } else if (message.type === 'error') {
            // 处理错误消息
            parentPort.off('message', messageHandler);
            resolve({ error: message.error });
          }
        };
        
        // 添加消息监听器
        parentPort.on('message', messageHandler);
    });
}

// 启动处理流程
log('Worker线程启动');
main().catch(err => {
  parentPort.postMessage({
    type: 'error',
    error: `Worker致命错误: ${err.message}`
  });
  process.exit(1);
});