#!/bin/bash

# Script para rodar o servidor e frontend simultaneamente no macOS/Linux

echo "==================================="
echo "DETOX 7PRO - Iniciando aplicação"
echo "==================================="
echo ""

# Terminal 1: Backend
echo "Iniciando Backend na porta 5000..."
npm run server &
BACKEND_PID=$!

# Aguardar o backend iniciar
sleep 3

# Terminal 2: Frontend
echo "Iniciando Frontend na porta 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==================================="
echo "Backend rodando em: http://localhost:5000"
echo "Frontend rodando em: http://localhost:5173"
echo "==================================="
echo ""
echo "Pressione CTRL+C para parar tudo"
echo ""

# Aguardar sinais de interrupção
wait
