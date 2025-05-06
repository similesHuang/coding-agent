import Router from '@koa/router';
import { connectionMiddleware } from '../middleware/mcp.middleware';
import { addConnection,listConnections,closeConnection,processQuery } from '../controller/mcp.controller';

const router = new Router({ prefix: '/api/mcp' });

// 连接管理接口
router.post('/connection', addConnection);
router.get('/connection', listConnections);
router.delete('/connection/:connectionId',closeConnection);

// 需要MCP上下文的接口
router.post('/query', 
  connectionMiddleware(), 
  processQuery
);

export default router;