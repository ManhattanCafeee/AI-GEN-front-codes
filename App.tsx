
import React, { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from './types';
import TodoItem from './components/TodoItem';
import TodoStats from './components/TodoStats';
import { getAISubtasks } from './services/geminiService';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zendo-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('zendo-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, p: Todo['priority'] = priority) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: p,
      category: 'General'
    };
    setTodos(prev => [newTodo, ...prev]);
    setInputText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const handleDecompose = async () => {
    if (!inputText.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await getAISubtasks(inputText);
      setAiSuggestions(response.subtasks);
      setShowAiModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const addAllSuggestions = () => {
    aiSuggestions.forEach(s => addTodo(s));
    setAiSuggestions([]);
    setShowAiModal(false);
    setInputText('');
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          Zen<span className="text-indigo-600">Do</span>
        </h1>
        <p className="text-slate-500 font-medium italic">Simplify your life, one task at a time.</p>
      </header>

      {/* Stats Dashboard */}
      <TodoStats todos={todos} />

      {/* Input Section */}
      <div className="glass-effect rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo(inputText)}
              placeholder="What needs to be done?"
              className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
            <button 
              onClick={handleDecompose}
              disabled={isAiLoading || !inputText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-700 disabled:text-slate-300 transition-colors"
              title="Break down with Gemini AI"
            >
              {isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
            </button>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    priority === p 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={() => addTodo(inputText)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                filter === f 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button 
          onClick={clearCompleted}
          className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
        >
          Clear Completed
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-1">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={toggleTodo} 
              onDelete={deleteTodo} 
            />
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <i className="fas fa-tasks text-2xl"></i>
            </div>
            <h3 className="text-slate-400 font-medium">No tasks found</h3>
            <p className="text-slate-300 text-sm">Enjoy your productivity!</p>
          </div>
        )}
      </div>

      {/* AI Decomposition Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-indigo-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <i className="fas fa-wand-magic-sparkles text-xl"></i>
                <h2 className="text-lg font-bold">AI Task Breakdown</h2>
              </div>
              <p className="text-indigo-100 text-sm opacity-90">Gemini decomposed "{inputText}" into these steps:</p>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setShowAiModal(false)}
                className="flex-1 py-3 px-4 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={addAllSuggestions}
                className="flex-[2] py-3 px-4 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-100"
              >
                Add All as Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
