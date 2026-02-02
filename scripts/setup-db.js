#!/usr/bin/env node

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Validar que DATABASE_URL está configurado
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não está configurado');
  console.error('Por favor, adicione DATABASE_URL nas suas variáveis de ambiente');
  console.error('Formato: postgresql://user:password@host/database?sslmode=require');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  try {
    console.log('🔄 Conectando ao banco de dados Neon...');
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida');

    // Ler e executar o script SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'init-database.sql'),
      'utf8'
    );

    console.log('🔄 Criando tabelas e índices...');
    await client.query(sqlScript);
    console.log('✅ Tabelas e índices criados com sucesso!');

    client.release();
    console.log('\n✨ Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
