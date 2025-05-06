// mcp.middleware.ts
import { Context, Next } from 'koa';
import * as MCPService from '../service/mcp.service';
import { MCPClient } from '@mcp/mcp-client';
import { MCPQuery } from '../type/mcp.type';

declare module 'koa' {
  interface DefaultState {
    mcpClient?: InstanceType<typeof MCPClient>;
  }
}

export const connectionMiddleware = () => {
  return async (ctx: Context, next: Next) => {
    const { serverName } = ctx.request.body as MCPQuery;
    console.log('connectionMiddleware', serverName);
    if (serverName) {
      const client = MCPService.getConnection(serverName);
      if (!client) {
        ctx.throw(404, `Connection ${serverName} not found`);
        return;
      }
      ctx.state.mcp = {
        client,
        serverName
      };
    }

    await next();
  };
};