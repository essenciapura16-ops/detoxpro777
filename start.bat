@echo off
REM Script para rodar o servidor e frontend simultaneamente no Windows

echo ===================================
echo DETOX 7PRO - Iniciando aplicacao
echo ===================================
echo.

REM Terminal 1: Backend
echo Iniciando Backend na porta 5000...
start cmd /k npm run server

REM Aguardar o backend iniciar
timeout /t 3

REM Terminal 2: Frontend
echo Iniciando Frontend na porta 5173...
start cmd /k npm run dev

echo.
echo ===================================
echo Backend rodando em: http://localhost:5000
echo Frontend rodando em: http://localhost:5173
echo ===================================
echo.
echo Feche os terminais para parar tudo
echo.
