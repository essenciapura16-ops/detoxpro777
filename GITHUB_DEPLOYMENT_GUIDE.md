# Guia: Conectar GitHub e Publicar no Vercel

## Problema 1: GitHub não Conectado

### Solução Passo a Passo:

1. **Abra a barra lateral esquerda do v0**
   - Procure pelo ícone do GitHub com o label "Git"

2. **Clique em "Connect"**
   - Isso abrirá um modal para conectar seu GitHub

3. **Autorize v0 no GitHub**
   - Clique em "Authorize v0"
   - Você será redirecionado para GitHub para dar permissão
   - Aceite as permissões solicitadas

4. **Escolha o repositório**
   - **Opção A**: Criar novo repositório
     - v0 criará um novo repo em sua conta
     - Escolha um nome (ex: "detox7pro")
   
   - **Opção B**: Usar repositório existente
     - Selecione um repo que já existe
     - v0 sincronizará o código

5. **Confirme a conexão**
   - Após conectar, você verá o nome do repo na barra lateral

---

## Problema 2: Erro ao Publicar

### Causas Comuns:

#### ❌ Erro: "An error occurred while deploying"

**Causa 1: Variáveis de Ambiente Faltando**
- Vá para **"Vars"** na barra lateral
- Adicione: `DATABASE_URL=postgresql://...` (sua string Neon)
- Clique "Save"

**Causa 2: Build Failure**
- Verifique se `vite.config.ts` existe (✅ acabamos de criar)
- Verifique se `package.json` está correto

**Causa 3: GitHub não conectado**
- Primeiro resolva o Problema 1 acima
- Depois tente publicar novamente

### Passos para Publicar:

1. **Conecte o GitHub** (veja Problema 1 acima)

2. **Adicione variáveis de ambiente**
   - Clique em "Vars" na barra lateral
   - Adicione todas as variáveis necessárias
   - DATABASE_URL (obrigatório para Neon)

3. **Clique em "Publish"**
   - Botão azul no topo direito
   - v0 fará push do código para GitHub
   - Vercel construirá e publicará automaticamente

4. **Acompanhe o deployment**
   - Você verá o progresso na tela
   - Após publicado, receberá um link público

---

## Se Ainda Tiver Problemas:

1. **Verifique se o build é bem-sucedido localmente**
   - Execute: `npm install`
   - Execute: `npm run build`
   - Se falhar, corrija os erros

2. **Verifique os logs de deployment**
   - No painel Vercel, clique no seu projeto
   - Vá para "Deployments"
   - Clique no deployment com erro
   - Veja os "Build Logs"

3. **Abra um ticket de suporte**
   - Visite: https://vercel.com/help
   - Descreva o erro específico

---

## Checklist Final:

- ✅ vite.config.ts existe
- ✅ package.json contém "pg" como dependência
- ✅ GitHub conectado na barra lateral (Git)
- ✅ DATABASE_URL adicionada em "Vars"
- ✅ Todos os arquivos enviados para Git
- ✅ Deploy bem-sucedido no Vercel
