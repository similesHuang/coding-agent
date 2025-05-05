import Router from '@koa/router';
import { mcpContext } from '../middleware/mcp.middleware';
import { addConnection,listConnection,closeConnection,processQuery } from '../controller/mcp.controller';

const router = new Router({ prefix: '/api/mcp' });

// 连接管理接口
router.post('/connection', addConnection);
router.get('/connection', listConnection);
router.delete('/connection/:connectionId',closeConnection);

// 需要MCP上下文的接口
router.post('/query', 
  mcpContext(), 
  processQuery
);

export default router;