import { Context } from 'koa';
import { MCPConnection, MCPQuery } from '../type/mcp.type';
import * as MCPService from '../service/mcp.service';


  /**
   * 添加新MCP服务连接
   */
   const addConnection =async (ctx: Context) =>{
    const { serverPath, serverName } = ctx.request.body as MCPConnection;
    const client = await MCPService.getClient(serverPath,serverName);
    
    ctx.body = {
      success: true,
      tools: client.tools.map(t => t.function.name),
      connectionId: serverName || serverPath
    };
  }

  /**
   * 处理用户查询
   */
  const  processQuery= async(ctx: Context)=> {
    const { query } = ctx.request.body as MCPQuery;
    const { client } = ctx.state.mcp;

    const response = await client.processQuery(query);
    ctx.body = {
      response,
      server: ctx.state.mcp.currentServer
    };
  }

  /**
   * 列出所有活跃连接
   */
   const listConnection=(ctx: Context)=> {
    console.log('listConnection');
    ctx.body = MCPService.listConnections();
  }

  /**
   * 关闭指定连接
   */
  const  closeConnection = async(ctx: Context)=> {
    const { connectionId } = ctx.params;
    await MCPService.cleanup(connectionId);
    ctx.body = { success: true };
  }
export {
     addConnection,
     processQuery,
     listConnection,
     closeConnection
}