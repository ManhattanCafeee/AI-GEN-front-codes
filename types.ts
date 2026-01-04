
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface AIResponse {
  subtasks: string[];
}
