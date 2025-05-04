import { Todo } from '../type/todo.type';
import { readJsonFile, writeJsonFile } from '../utils/fs.utils';
import path from 'path';

const DATA_PATH = path.join(__dirname, '../data/todo.json');
// 纯IO操作函数（无业务逻辑）
export const loadTodos = (): Promise<Todo[]> => 
  readJsonFile<Todo[]>(DATA_PATH).catch(() => []);

export const saveTodos = (todos: Todo[]): Promise<void> => 
  writeJsonFile(DATA_PATH, todos);

// 辅助函数（纯函数）
export const findTodo = (todos: Todo[], id: number): Todo | undefined =>
  todos.find(t => t.id === id);

export const insertTodo = (todos: Todo[], todo: Todo): Todo[] =>
  [...todos, todo];

export const updateTodo = (todos: Todo[], id: number, patch: Partial<Todo>): Todo[] =>
  todos.map(t => t.id === id ? { ...t, ...patch } : t);

export const deleteTodo = (todos: Todo[], id: number): Todo[] =>
  todos.filter(t => t.id !== id);