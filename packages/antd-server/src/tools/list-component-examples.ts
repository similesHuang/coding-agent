import { McpServer,z,StdioServerTransport } from "@mcp/core";
import {  listComponentExamples } from "../utils/components.js";

/** 获取 Ant Design 特定组件示例 */
const registryTool = (server: McpServer) => {
  server.tool(
    "list-component-examples",
    `获取 Ant Design 特定组件的代码示例
适用场景：
1. 用户询问特定组件的示例时
2. 用户想要实现某个功能时直接告知可使用的例子
3. 生成页面前需要获取组件的示例代码`,
    { componentName: z.string() },
    async ({ componentName }) => {
      const componentExamples = await listComponentExamples(componentName);
  
      return {
        content: [
          {
            type: "text",
            text: `${componentName} 组件的代码示例文档：
${componentExamples || '暂无代码示例'}`,
          },
        ],
      };
    },
  );
}

export default registryTool;
