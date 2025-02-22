import React, { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Filter, Loader } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setTodos([...todos, {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date()
    }])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => 
    filter === 'all' ? true :
    filter === 'active' ? !todo.completed : todo.completed
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Filter className="text-purple-600" />
            Task Manager
          </h1>
          
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </form>

          <div className="space-y-4 mb-6">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {todo.completed ? (
                      <CheckCircle size={24} className="fill-current" />
                    ) : (
                      <Circle size={24} className="text-gray-300" />
                    )}
                  </button>
                  <span className={`${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{todos.filter(t => !t.completed).length} items left</span>
            <div className="flex gap-4">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`capitalize ${filter === f ? 'text-purple-600 font-medium' : 'hover:text-gray-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={clearCompleted}
              className="hover:text-purple-600"
            >
              Clear Completed
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Drag and drop to reorder list</p>
          <p className="mt-2">Double click to edit a todo</p>
        </div>
      </div>
    </div>
  )
}

export default App
