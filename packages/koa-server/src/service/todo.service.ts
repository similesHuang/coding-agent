import * as repo from '../model/todo.model';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../type/todo.type';

// 纯业务函数（无副作用）
export const validateTodo = (dto: CreateTodoDTO): boolean =>
  !!dto.title?.trim();

export const generateTodo = (dto: CreateTodoDTO, todos: Todo[]): Todo => ({
  id: Math.max(0, ...todos.map(t => t.id)) + 1,
  title: dto.title,
  completed: dto.completed || false
});

// 组合业务与持久化操作
export const getTodos = async (): Promise<Todo[]> => 
  await repo.loadTodos();

export const getTodo = async (id: number): Promise<Todo | null> => {
  const todos = await repo.loadTodos();
  return repo.findTodo(todos, id) || null;
};

export const createTodo = async (dto: CreateTodoDTO): Promise<Todo> => {
  if (!validateTodo(dto)) throw new Error('Invalid todo data');
  
  const todos = await repo.loadTodos();
  const newTodo = generateTodo(dto, todos);
  await repo.saveTodos(repo.insertTodo(todos, newTodo));
  return newTodo;
};

export const updateTodo = async (
  id: number,
  dto: UpdateTodoDTO
): Promise<Todo | null> => {
  const todos = await repo.loadTodos();
  const existing = repo.findTodo(todos, id);
  if (!existing) return null;

  const updated = { ...existing, ...dto };
  await repo.saveTodos(repo.updateTodo(todos, id, updated));
  return updated;
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  const todos = await repo.loadTodos();
  const newTodos = repo.deleteTodo(todos, id);
  
  if (newTodos.length === todos.length) return false;
  
  await repo.saveTodos(newTodos);
  return true;
};