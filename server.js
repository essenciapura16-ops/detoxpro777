import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Neon Database connection
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Connect to database
client.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados Neon com sucesso!');
        initializeDatabase();
    }
});

// Initialize database tables
async function initializeDatabase() {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabelas criadas com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
    }
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-detox7pro-2024';

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Validação básica
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
        }

        // Verificar se usuário já existe
        const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Inserir usuário no banco
        const result = await client.query(
            'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, senhaHash]
        );

        const user = result.rows[0];

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro ao registrar:', error);
        res.status(500).json({ message: 'Erro ao criar conta' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validação básica
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const user = result.rows[0];

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

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
        console.error('Erro ao fazer login:', error);
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
        res.status(401).json({ message: 'Token inválido' });
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório' });
        }

        // Verificar se usuário existe
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            // Não revelar se email existe ou não por segurança
            return res.status(200).json({ 
                message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.' 
            });
        }

        // Aqui você implementaria o envio de email com token de reset
        // Por enquanto, apenas retornamos a mensagem
        res.status(200).json({ 
            message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.' 
        });
    } catch (error) {
        console.error('Erro ao processar recuperação de senha:', error);
        res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
});

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    client.end();
    process.exit(0);
});
