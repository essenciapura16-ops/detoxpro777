'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { 
  createTask, 
  getUserTasks, 
  completeTask, 
  logProgress 
} from '@/utils/db';

/**
 * Exemplo de como usar o banco de dados Neon na sua aplicação React
 * Este componente demonstra operações CRUD básicas
 */
export function DatabaseExample() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = 1; // Substitua com o ID do usuário real

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserTasks(userId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    try {
      setError(null);
      await createTask({
        userId,
        title,
        description: description || undefined,
      });
      await fetchTasks();
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa');
      console.error('Erro:', err);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      setError(null);
      await completeTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao completar tarefa');
      console.error('Erro:', err);
    }
  };

  const handleLogProgress = async () => {
    try {
      setError(null);
      await logProgress({
        userId,
        activity: 'Meditação',
        duration_minutes: 15,
        mood_rating: 4,
        notes: 'Sessão matinal muito relaxante',
      });
      alert('Progresso registrado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar progresso');
      console.error('Erro:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Exemplo: Banco de Dados Neon</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Criar Nova Tarefa</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título da tarefa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição (opcional)
            </label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a descrição"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium"
          >
            Criar Tarefa
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Minhas Tarefas</h2>
          <button
            onClick={fetchTasks}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">Nenhuma tarefa criada ainda</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    task.completed
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {task.completed ? 'Concluída' : 'Pendente'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Registrar Progresso</h2>
        <button
          onClick={handleLogProgress}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 font-medium"
        >
          Registrar Progresso
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Clique para registrar uma atividade de meditação de 15 minutos
        </p>
      </div>
    </div>
  );
}

export default DatabaseExample;
