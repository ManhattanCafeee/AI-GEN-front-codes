
import React from 'react';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Total</div>
        <div className="text-2xl font-bold text-slate-800">{total}</div>
      </div>
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Done</div>
        <div className="text-2xl font-bold text-indigo-600">{completed}</div>
      </div>
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Progress</div>
        <div className="text-2xl font-bold text-emerald-500">{progress}%</div>
      </div>
    </div>
  );
};

export default TodoStats;
