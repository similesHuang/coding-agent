export  { MCPClient } from "./client.js";

// async function main() {
//   if (process.argv.length < 3) {
//     console.log("使用方法: node index.ts <path_to_server_script>");
//     return;
//   }
//   const mcpClient = new MCPClient();
//   try {
//     await mcpClient.connectToServer(process.argv[2]);
//     await mcpClient.chatLoop();
//   } finally {
//     await mcpClient.cleanup();
//     process.exit(0);
//   }
// }

// main();