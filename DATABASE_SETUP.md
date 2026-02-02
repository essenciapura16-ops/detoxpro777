# Configuração do Banco de Dados Neon

## 📋 Pré-requisitos

- Conta Neon PostgreSQL (https://neon.tech)
- Node.js 18+
- Variáveis de ambiente configuradas

## 🚀 Passos de Configuração

### 1. Obter DATABASE_URL do Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie um novo projeto ou use um existente
3. Vá para **Connection String**
4. Copie a URL completa (inclua `?sslmode=require`)

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
JWT_SECRET=sua-chave-secreta-aqui
NODE_ENV=development
PORT=5000
```

Ou adicione as variáveis no Vercel:

1. Vá para Vercel Dashboard
2. Selecione seu projeto
3. Settings → Environment Variables
4. Adicione `DATABASE_URL`

### 3. Instalar Dependências

```bash
npm install pg
npm install -D @types/pg
```

### 4. Inicializar o Banco de Dados

Execute o script de setup:

```bash
npm run db:init
```

Ou manualmente com Node:

```bash
DATABASE_URL=postgresql://... node scripts/setup-db.js
```

## 📊 Estrutura das Tabelas

### `users`
- `id`: ID único
- `username`: Nome de usuário único
- `email`: Email único
- `password_hash`: Senha hasheada
- `created_at`: Data de criação
- `updated_at`: Última atualização

### `user_sessions`
- `id`: ID único
- `user_id`: Referência para usuário
- `session_token`: Token de sessão
- `expires_at`: Data de expiração
- `created_at`: Data de criação

### `daily_tasks`
- `id`: ID único
- `user_id`: Referência para usuário
- `title`: Título da tarefa
- `description`: Descrição (opcional)
- `completed`: Status de conclusão
- `completed_at`: Data de conclusão
- `created_at`: Data de criação
- `updated_at`: Última atualização

### `progress_log`
- `id`: ID único
- `user_id`: Referência para usuário
- `activity`: Tipo de atividade
- `duration_minutes`: Duração em minutos
- `mood_rating`: Avaliação de humor (1-5)
- `notes`: Notas adicionais
- `created_at`: Data de criação

## 🔧 Usando o Banco de Dados

### Com React (Frontend)

Importe os utilitários:

```typescript
import { 
  createUser, 
  createTask, 
  getUserTasks, 
  logProgress 
} from '@/utils/db';

// Criar usuário
const user = await createUser({
  username: 'john',
  email: 'john@example.com',
  password: 'senha123'
});

// Obter tarefas
const tasks = await getUserTasks(userId);

// Registrar progresso
await logProgress({
  userId,
  activity: 'Meditação',
  duration_minutes: 15,
  mood_rating: 4
});
```

## 📝 Scripts npm

Adicione ao seu `package.json`:

```json
{
  "scripts": {
    "db:init": "DATABASE_URL=$DATABASE_URL node scripts/setup-db.js",
    "db:reset": "DATABASE_URL=$DATABASE_URL node scripts/reset-db.js"
  }
}
```

## 🆘 Troubleshooting

### Erro: "getaddrinfo ENOTFOUND"
- Verifique se `DATABASE_URL` está configurado corretamente
- Certifique-se de incluir `?sslmode=require` na URL

### Erro: "Conexão recusada"
- Verifique se o projeto Neon está ativo
- Confirme que você está usando a URL de produção, não de teste

### Erro: "Tabelas não existem"
- Execute `npm run db:init` para criar as tabelas
- Verifique os logs de execução do script

## 🔒 Segurança

- **Nunca** commite o `.env` no Git
- Use variáveis de ambiente para chaves secretas
- Hash as senhas com bcrypt antes de armazenar
- Use SSL para todas as conexões (`?sslmode=require`)

## 📚 Recursos

- [Documentação Neon](https://neon.tech/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Node.js pg Library](https://node-postgres.com)
