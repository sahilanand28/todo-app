export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface TodoList {
  id: string;
  title: string;
  tasks: Task[];
}
