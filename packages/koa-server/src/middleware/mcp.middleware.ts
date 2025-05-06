import { MCPClient } from "@mcp/mcp-client";

import { Context, Next } from 'koa';
import * as MCPService  from '../service/mcp.service';
import { MCPConnection } from "../type/mcp.type";

declare module 'koa' {
  interface DefaultState {
    mcp: {
      client: Awaited<ReturnType<typeof MCPService.getClient>>;
      currentServer: string;
    };
  }
}

export const mcpContext = () => {
  return async (ctx: Context, next: Next) => {
    const { serverPath, serverName } = ctx.request.body as MCPConnection;
     console.log('mcpContext', serverPath, serverName);
    if (!serverPath) {
      ctx.throw(400, 'Missing serverPath in request body');
      return;
    }

    try {
      ctx.state.mcp = {
        client: await MCPService.getClient(serverPath, serverName),
        currentServer: serverPath
      };
      await next();
    } catch (err) {
      ctx.throw(502, `MCP Connection Failed: ${err.message}`);
    }
  };
};