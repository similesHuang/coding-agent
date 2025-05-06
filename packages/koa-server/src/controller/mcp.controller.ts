import { Context } from "koa";
import { MCPConnection, MCPQuery } from "../type/mcp.type";
import * as MCPService from "../service/mcp.service";

export const addConnection = async (ctx: Context) => {
  const { serverPath, serverName } = ctx.request.body as MCPConnection;
  
  if (!serverName) {
    ctx.throw(400, 'serverName is required');
    return;
  }

  try {
    const client = await MCPService.createConnection(serverPath, serverName);
    ctx.body = {
      success: true,
      tools: client.tools.map(t => t.function.name),
      serverName
    };
  } catch (err) {
    ctx.throw(500, `Connection failed: ${err.message}`);
  }
}

export const processQuery = async (ctx: Context) => {
  const { query } = ctx.request.body as MCPQuery;
  const { client, serverName } = ctx.state.mcp;
  debugger;
  console.log('processQuery', query);
  try {
    const response = await client.processQuery(query);
    ctx.body = { 
      success: true,
      response,
      serverName 
    };
  } catch (err) {
    ctx.throw(500, `Query failed: ${err.message}`);
  }
}

export const listConnections = (ctx: Context) => {
  ctx.body = MCPService.listConnections().map(conn => ({
    serverName: conn.serverName,
    tools: conn.client.tools.map(t => t.function.name),
    connectedAt: conn.connectedAt
  }));
}

export const closeConnection = async (ctx: Context) => {
  const { serverName } = ctx.params;
  await MCPService.closeConnection(serverName);
  ctx.body = { success: true };
}