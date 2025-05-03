import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../type/todo.type';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(__dirname, '../data/todo.json');

// 纯函数：读取数据
const readTodos = (): Todo[] => {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
};

// 纯函数：写入数据
const writeTodos = (todos: Todo[]): void => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2));
};

// 纯函数：生成新ID
const generateNewId = (todos: Todo[]): number => 
  todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

// 纯函数：创建新Todo项
const createNewTodo = (dto: CreateTodoDTO, todos: Todo[]): Todo => ({
  id: generateNewId(todos),
  title: dto.title,
  completed: false
});

// 纯函数：更新Todo项
const updateTodoItem = (todo: Todo, dto: UpdateTodoDTO): Todo => ({
  ...todo,
  ...dto
});

// 纯函数：删除Todo项
const removeTodoItem = (id: number, todos: Todo[]): Todo[] =>
  todos.filter(t => t.id !== id);