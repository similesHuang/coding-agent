import { MCPClient } from "@mcp/mcp-client";
import { resolve } from 'path';

const instances = new Map<string, MCPClient>();

  /**
   * 获取或创建MCP客户端实例
   * @param serverPath 服务端脚本路径
   * @param serverName 可选自定义标识名
   */
  const  getClient=async(serverPath: string, serverName?: string)=> {
    const resolvedPath = resolve(process.cwd(), serverPath);
    const instanceKey = serverName || resolvedPath;

    if (!instances.has(instanceKey)) {
      const client = new MCPClient();
      await client.connectToServer(resolvedPath);
      instances.set(instanceKey, client);
    }

    return instances.get(instanceKey)!;
  }

  /**
   * 获取所有活跃连接
   */
  const  listConnections= ()=> {
    return Array.from(instances.entries()).map(([key, client]) => ({
      name: key,
      tools: client.tools.map(t => t.function.name)
    }));
  }

  /**
   * 安全关闭连接
   */
  const  cleanup= async (instanceKey: string)=> {
    const client = instances.get(instanceKey);
    if (client) {
      await client.cleanup();
      instances.delete(instanceKey);
    }
  }
export {
    getClient,
    listConnections,
    cleanup
}