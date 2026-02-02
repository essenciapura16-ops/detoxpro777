// Utilitários para trabalhar com o banco de dados Neon

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Executa uma query no banco de dados através da API
 */
export async function dbQuery(
  endpoint: string,
  options: FetchOptions = {}
) {
  const url = `${API_BASE_URL}/api${endpoint}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Criar um novo usuário
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
}) {
  return dbQuery('/users', {
    method: 'POST',
    body: userData,
  });
}

/**
 * Obter usuário por ID
 */
export async function getUser(userId: number) {
  return dbQuery(`/users/${userId}`);
}

/**
 * Atualizar usuário
 */
export async function updateUser(
  userId: number,
  userData: Partial<{
    username: string;
    email: string;
  }>
) {
  return dbQuery(`/users/${userId}`, {
    method: 'PUT',
    body: userData,
  });
}

/**
 * Deletar usuário
 */
export async function deleteUser(userId: number) {
  return dbQuery(`/users/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * Criar tarefa diária
 */
export async function createTask(taskData: {
  userId: number;
  title: string;
  description?: string;
}) {
  return dbQuery('/tasks', {
    method: 'POST',
    body: taskData,
  });
}

/**
 * Obter tarefas do usuário
 */
export async function getUserTasks(userId: number) {
  return dbQuery(`/tasks?userId=${userId}`);
}

/**
 * Marcar tarefa como concluída
 */
export async function completeTask(taskId: number) {
  return dbQuery(`/tasks/${taskId}/complete`, {
    method: 'PUT',
  });
}

/**
 * Deletar tarefa
 */
export async function deleteTask(taskId: number) {
  return dbQuery(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

/**
 * Registrar progresso
 */
export async function logProgress(progressData: {
  userId: number;
  activity: string;
  duration_minutes?: number;
  mood_rating?: number;
  notes?: string;
}) {
  return dbQuery('/progress', {
    method: 'POST',
    body: progressData,
  });
}

/**
 * Obter log de progresso do usuário
 */
export async function getUserProgress(userId: number) {
  return dbQuery(`/progress?userId=${userId}`);
}
