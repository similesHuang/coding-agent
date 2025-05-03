import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import todoRouter from './router/todo.router';

const app = new Koa();


app.use(bodyParser());


app.use(todoRouter.routes());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});