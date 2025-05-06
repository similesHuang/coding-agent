// mcp.service.ts
import { MCPClient } from "@mcp/mcp-client";

interface Connection {
  client: MCPClient;
  serverName: string;
  serverPath: string;
  connectedAt: Date;
}

const connections = new Map<string, Connection>();

export const createConnection = async (serverPath: string, serverName: string) => {
  if (connections.has(serverName)) {
    throw new Error(`Connection ${serverName} already exists`);
  }

  const client = new MCPClient();
  const isConnected = await client.connectToServer(serverPath);
  
  if (!isConnected) {
    throw new Error('Failed to connect to MCP server');
  }

  const connection = {
    client,
    serverName,
    serverPath,
    connectedAt: new Date()
  };

  connections.set(serverName, connection);
  return client;
}

export const getConnection = (serverName: string) => {
  return connections.get(serverName)?.client;
}

export const listConnections = () => {
  return Array.from(connections.values());
}

export const closeConnection = async (serverName: string) => {
  const connection = connections.get(serverName);
  if (connection) {
    await connection.client.cleanup();
    connections.delete(serverName);
  }
}