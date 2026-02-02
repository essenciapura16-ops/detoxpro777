import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('[SERVER] Iniciando servidor...');
console.log('[SERVER] DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');
console.log('[SERVER] JWT_SECRET:', process.env.JWT_SECRET ? 'Configurada' : 'NÃO CONFIGURADA');

// Neon Database connection using Pool for better connection handling
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('[POOL ERROR]', err);
});

pool.on('connect', () => {
    console.log('[POOL] Nova conexão estabelecida');
});

// Test connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('[ERRO] Falha ao conectar ao banco de dados:', err.message);
    } else {
        console.log('[SUCESSO] Conectado ao banco de dados Neon!');
        console.log('[DATA] Hora do servidor:', result.rows[0].now);
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `, (err, result) => {
        if (err) {
            console.error('[ERRO] Falha ao criar tabelas:', err.message);
        } else {
            console.log('[SUCESSO] Tabelas criadas/verificadas com sucesso!');
        }
    });
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-detox7pro-2024';

// Routes
app.post('/api/auth/register', async (req, res) => {
    console.log('[REGISTER] Requisição recebida:', req.body);
    try {
        const { nome, email, senha } = req.body;

        // Validação básica
        if (!nome || !email || !senha) {
            console.log('[REGISTER] Validação falhou: campos obrigatórios');
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (senha.length < 6) {
            console.log('[REGISTER] Validação falhou: senha muito curta');
            return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
        }

        // Verificar se usuário já existe
        pool.query('SELECT * FROM users WHERE email = $1', [email], async (err, result) => {
            if (err) {
                console.error('[REGISTER] Erro ao verificar email:', err.message);
                return res.status(500).json({ message: 'Erro ao criar conta' });
            }

            if (result.rows.length > 0) {
                console.log('[REGISTER] Email já existe:', email);
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            try {
                // Hash da senha
                const senhaHash = await bcrypt.hash(senha, 10);
                console.log('[REGISTER] Senha criptografada');

                // Inserir usuário no banco
                pool.query(
                    'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
                    [nome, email, senhaHash],
                    (err, result) => {
                        if (err) {
                            console.error('[REGISTER] Erro ao inserir usuário:', err.message);
                            return res.status(500).json({ message: 'Erro ao criar conta' });
                        }

                        const user = result.rows[0];
                        console.log('[REGISTER] Usuário criado:', user.email);

                        // Gerar token JWT
                        const token = jwt.sign(
                            { id: user.id, email: user.email },
                            JWT_SECRET,
                            { expiresIn: '7d' }
                        );

                        console.log('[REGISTER] Token gerado com sucesso');
                        res.status(201).json({
                            success: true,
                            token,
                            user: {
                                id: user.id,
                                nome: user.nome,
                                email: user.email
                            }
                        });
                    }
                );
            } catch (error) {
                console.error('[REGISTER] Erro ao processar senha:', error.message);
                res.status(500).json({ message: 'Erro ao criar conta' });
            }
        });
    } catch (error) {
        console.error('[REGISTER] Erro geral:', error.message);
        res.status(500).json({ message: 'Erro ao criar conta' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log('[LOGIN] Requisição recebida:', { email: req.body.email });
    try {
        const { email, senha } = req.body;

        // Validação básica
        if (!email || !senha) {
            console.log('[LOGIN] Validação falhou: campos obrigatórios');
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        pool.query('SELECT * FROM users WHERE email = $1', [email], async (err, result) => {
            if (err) {
                console.error('[LOGIN] Erro ao buscar usuário:', err.message);
                return res.status(500).json({ message: 'Erro ao fazer login' });
            }

            if (result.rows.length === 0) {
                console.log('[LOGIN] Usuário não encontrado:', email);
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            const user = result.rows[0];

            try {
                // Verificar senha
                const senhaValida = await bcrypt.compare(senha, user.senha);

                if (!senhaValida) {
                    console.log('[LOGIN] Senha inválida para:', email);
                    return res.status(401).json({ message: 'Email ou senha incorretos' });
                }

                // Gerar token JWT
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                console.log('[LOGIN] Login bem-sucedido:', email);
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        nome: user.nome,
                        email: user.email
                    }
                });
            } catch (error) {
                console.error('[LOGIN] Erro ao comparar senha:', error.message);
                res.status(500).json({ message: 'Erro ao fazer login' });
            }
        });
    } catch (error) {
        console.error('[LOGIN] Erro geral:', error.message);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

app.post('/api/auth/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        res.json({
            success: true,
            user: {
                id: decoded.id,
                email: decoded.email
            }
        });
    } catch (error) {
        console.error('[VERIFY] Erro:', error.message);
        res.status(401).json({ message: 'Token inválido' });
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }

        res.status(200).json({ 
            message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.' 
        });
    } catch (error) {
        console.error('[FORGOT-PASSWORD] Erro:', error.message);
        res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Servidor rodando na porta ${PORT}`);
    console.log(`[SERVER] URL: http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('[SERVER] Encerrando servidor...');
    pool.end();
    process.exit(0);
});
