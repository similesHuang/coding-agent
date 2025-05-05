import Router from '@koa/router';
import * as todoController from '../controller/todo.controller';

const router = new Router({ prefix: '/api/todos' });

router.get('/', todoController.listTodos);
router.get('/:id', todoController.getTodo);
router.post('/', todoController.createTodo);
router.delete('/:id',todoController.deleteTodo);
// 添加其他路由...

export default router;