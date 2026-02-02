# ✅ Checklist de Configuração - Banco de Dados Neon

Complete os passos abaixo para ter seu banco de dados totalmente funcional:

## 1️⃣ Configuração Inicial
- [ ] Criar conta em [neon.tech](https://neon.tech)
- [ ] Criar um novo projeto Neon
- [ ] Copiar a `DATABASE_URL` (Connection String)

## 2️⃣ Variáveis de Ambiente
### Opção A: Vercel (Recomendado)
- [ ] Ir para o painel do Vercel
- [ ] Ir para **Settings > Environment Variables**
- [ ] Adicionar `DATABASE_URL` com a string de conexão do Neon
- [ ] Adicionar `JWT_SECRET` com uma chave segura

### Opção B: Local (.env)
- [ ] Criar arquivo `.env` na raiz do projeto
- [ ] Copiar conteúdo de `.env.example`
- [ ] Adicionar sua `DATABASE_URL`
- [ ] **⚠️ NUNCA commitar `.env` no Git**

## 3️⃣ Instalar Dependências
```bash
npm install
```

Deve instalar automaticamente:
- ✅ `pg` - Driver PostgreSQL
- ✅ `@types/pg` - Types TypeScript
- ✅ `@types/node` - Types Node.js

## 4️⃣ Inicializar Banco de Dados
```bash
npm run db:init
```

Este comando:
- ✅ Conecta ao Neon
- ✅ Cria as tabelas (users, user_sessions, daily_tasks, progress_log)
- ✅ Cria índices para performance
- ✅ Valida a configuração

## 5️⃣ Verificar Estrutura de Arquivos
Verifique se os seguintes arquivos foram criados:

```
projeto/
├── scripts/
│   ├── init-database.sql      ✅ Script SQL
│   └── setup-db.js            ✅ Setup Node.js
├── src/
│   ├── config/
│   │   └── db.ts              ✅ Configuração de conexão
│   ├── utils/
│   │   └── db.ts              ✅ Utilitários e funções
│   └── examples/
│       └── DatabaseExample.tsx ✅ Exemplo de uso
├── .env.example               ✅ Exemplo de variáveis
├── DATABASE_SETUP.md          ✅ Documentação completa
├── SETUP_CHECKLIST.md         ✅ Este arquivo
└── package.json               ✅ Atualizado com deps
```

## 6️⃣ Testar Conexão
```bash
# Criar uma tarefa de teste
npm run dev
# Abrir http://localhost:5173
# Navegar para o componente exemplo
```

## 📊 Tabelas Criadas

### `users`
Armazena informações dos usuários
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `user_sessions`
Armazena sessões de autenticação
```sql
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `daily_tasks`
Armazena tarefas diárias
```sql
CREATE TABLE daily_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `progress_log`
Armazena log de progresso
```sql
CREATE TABLE progress_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity VARCHAR(255) NOT NULL,
  duration_minutes INTEGER,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Usar o Banco em Seus Componentes

### Importar Utilitários
```typescript
import { 
  createUser, 
  createTask, 
  getUserTasks, 
  completeTask,
  logProgress,
  getUserProgress
} from '@/utils/db';
```

### Exemplo: Criar Tarefa
```typescript
const task = await createTask({
  userId: 1,
  title: 'Minha tarefa',
  description: 'Descrição opcional'
});
```

### Exemplo: Obter Tarefas
```typescript
const tasks = await getUserTasks(userId);
tasks.forEach(task => {
  console.log(task.title, task.completed);
});
```

### Exemplo: Registrar Progresso
```typescript
await logProgress({
  userId: 1,
  activity: 'Meditação',
  duration_minutes: 15,
  mood_rating: 5,
  notes: 'Excelente sessão!'
});
```

## 🆘 Troubleshooting

### Erro: "DATABASE_URL not found"
**Solução:**
- Verifique se a variável foi adicionada no Vercel ou no `.env`
- Reinicie o servidor de desenvolvimento

### Erro: "getaddrinfo ENOTFOUND"
**Solução:**
- Confirme que a URL tem o formato correto
- Certifique-se de incluir `?sslmode=require`
- Teste a URL diretamente no psql ou pgAdmin

### Erro: "relation does not exist"
**Solução:**
- Execute novamente: `npm run db:init`
- Verifique se o script SQL rodou sem erros

### Erro: "permission denied"
**Solução:**
- Verifique as permissões da role no Neon
- Crie um novo projeto Neon se necessário

## 📚 Próximos Passos

1. **Implementar Autenticação**
   - Hash de senhas com `bcrypt`
   - Gerenciamento de sessões
   - JWT tokens

2. **Adicionar API Routes**
   - CRUD endpoints para cada tabela
   - Validação de entrada
   - Tratamento de erros

3. **Implementar Frontend**
   - Componentes de formulário
   - Estados com React Hooks
   - Tratamento de erros

4. **Deploy**
   - Conectar repositório Git
   - Fazer push das mudanças
   - Deploy automático no Vercel

## 🔒 Segurança

- ✅ Use `?sslmode=require` em produção
- ✅ Hash senhas com bcrypt
- ✅ Use variáveis de ambiente para secrets
- ✅ Implemente validação de input
- ✅ Use prepared statements
- ✅ Implemente rate limiting
- ✅ Adicione CORS appropriately

## 📞 Suporte

Se tiver problemas:
1. Consulte [DATABASE_SETUP.md](./DATABASE_SETUP.md)
2. Verifique [Documentação Neon](https://neon.tech/docs)
3. Abra um ticket em [vercel.com/help](https://vercel.com/help)

---

✨ **Status:** Banco de dados pronto para desenvolvimento!
