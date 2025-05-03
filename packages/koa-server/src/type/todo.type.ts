export interface Todo {
    id: number;
    title: string;
    completed: boolean;
  }
  
  export type CreateTodoDTO = Pick<Todo, 'title'|'completed'>;
  export type UpdateTodoDTO = Partial<Omit<Todo, 'id'>>;