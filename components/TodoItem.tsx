
import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className={`todo-list-item flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-3 group ${todo.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && <i className="fas fa-check text-white text-xs"></i>}
        </button>
        <div className="flex flex-col">
          <span className={`text-sm font-medium transition-all ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
            {todo.text}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50"
      >
        <i className="far fa-trash-can"></i>
      </button>
    </div>
  );
};

export default TodoItem;
