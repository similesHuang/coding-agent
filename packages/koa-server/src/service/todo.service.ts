import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../type/todo.type';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(__dirname, '../data/todo.json');

const readData = (): Todo[] => {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 文件不存在时返回空数组
    return [];
  }
};

const writeData = (todos: Todo[]): void => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2));
};

const generateId = (todos: Todo[]): number => 
  todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

// 核心业务函数
export const findAll = (): Todo[] => readData();

export const findById = (id: number): Todo | undefined => 
  readData().find(t => t.id === id);

export const create = (dto: CreateTodoDTO): Todo => {
  const todos = readData();
  const newTodo: Todo = {
    id: generateId(todos),
    title: dto.title,
    completed: false
  };
  writeData([...todos, newTodo]);
  return newTodo;
};

export const update = (id: number) => (dto: UpdateTodoDTO): Todo | null => {
  const todos = readData();
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTodo = { ...todos[index], ...dto };
  const updatedTodos = [
    ...todos.slice(0, index),
    updatedTodo,
    ...todos.slice(index + 1)
  ];
  
  writeData(updatedTodos);
  return updatedTodo;
};

export const deleteById = (id: number): boolean => {
  const todos = readData();
  const newTodos = todos.filter(t => t.id !== id);
  
  if (newTodos.length === todos.length) return false;
  
  writeData(newTodos);
  return true;
};

// 可选：导出为命名空间
export const TodoModel = {
  findAll,
  findById,
  create,
  update,
  deleteById
};