import { Context } from 'koa';
import * as todoService from '../service/todo.service';
import { CreateTodoDTO, UpdateTodoDTO } from '../type/todo.type';
import { successResponse, errorResponse } from '../utils/response';

// 获取所有待办事项 (函数式导出)
export const listTodos = async (ctx: Context) => {
  try {
    const todos = todoService.findAll();
    successResponse(ctx, { data: todos });
  } catch (err) {
    errorResponse(ctx, 'Failed to fetch todos');
  }
};

// 获取单个待办事项
export const getTodo = async (ctx: Context) => {
  const id = parseInt(ctx.params.id);
  if (isNaN(id)) {
    return errorResponse(ctx, 'Invalid ID', 400);
  }

  const todo = todoService.findById(id);
  if (!todo) {
    return errorResponse(ctx, 'Todo not found', 404);
  }

  successResponse(ctx, { data: todo });
};

// 创建待办事项 (带完整类型校验)
export const createTodo = async (ctx: Context) => {
  const dto = ctx.request.body as Partial<CreateTodoDTO>;
  
  if (!dto?.title?.trim()) {
    return errorResponse(ctx, 'Title is required', 400);
  }

  try {
    const newTodo = todoService.create({
      title: dto.title,
      completed: dto.completed || false
    });
    successResponse(ctx, { data: newTodo }, 201);
  } catch (err) {
    errorResponse(ctx, 'Create failed', 500);
  }
};

// 更新待办事项
export const updateTodo = async (ctx: Context) => {
  const id = parseInt(ctx.params.id);
  const dto = ctx.request.body as UpdateTodoDTO;

  if (isNaN(id)) {
    return errorResponse(ctx, 'Invalid ID', 400);
  }

  try {
    const updated = todoService.update(id)(dto);
    if (!updated) {
      return errorResponse(ctx, 'Todo not found', 404);
    }
    successResponse(ctx, { data: updated });
  } catch (err) {
    errorResponse(ctx, 'Update failed', 500);
  }
};
export const deleteTodo = async (ctx: Context) => { 
    const id = parseInt(ctx.params.id);
    if(isNaN(id)){
         return errorResponse(ctx,'Invalid ID',400);
    }
    
    try{
         const deleted = todoService.deleteById(id);
         successResponse(ctx,{data:deleted});
    }catch(err){ 
         errorResponse(ctx,'Delete failed',500);
    }

};