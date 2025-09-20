import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Fallback to local storage if Supabase fails
      const localTodos = localStorage.getItem('todos');
      if (localTodos) {
        setTodos(JSON.parse(localTodos));
      }
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // Try to save to Supabase first
      const { error } = await supabase
        .from('todos')
        .insert([todo]);

      if (error) throw error;
      setTodos([todo, ...todos]);
    } catch (error) {
      console.error('Error saving to Supabase, using local storage:', error);
      // Fallback to local storage
      const updatedTodos = [todo, ...todos];
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }

    setNewTodo('');
  };

  const toggleTodo = async (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed, updated_at: new Date().toISOString() } : todo
    );

    try {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const { error } = await supabase
          .from('todos')
          .update({ completed: !todo.completed, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      }
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
      // Fallback to local storage
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Fallback to local storage
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          TODO List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new todo */}
        <div className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button onClick={addTodo} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({todos.filter(t => !t.completed).length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed ({todos.filter(t => t.completed).length})
          </Button>
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {filter === 'all' ? 'No todos yet. Add one above!' : 
               filter === 'active' ? 'No active todos!' : 'No completed todos!'}
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.text}
                </span>
                <Badge className={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;
