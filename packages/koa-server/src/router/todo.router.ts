import Router from '@koa/router';
import * as todoController from '../controller/todo.controller';

const router = new Router({ prefix: '/todos' });

router.get('/', todoController.listTodos);
router.get('/:id', todoController.getTodo);
router.post('/', todoController.createTodo);
// 添加其他路由...

export default router;