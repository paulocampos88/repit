# Configurando login, histórico e favoritos (Supabase)

O app funciona normalmente sem isso — os botões de login/histórico/favoritos
só aparecem depois que as variáveis do Supabase forem configuradas. Siga os
passos abaixo para ativar.

## 1. Criar o projeto no Supabase (grátis)

1. Acesse https://supabase.com e crie uma conta (dá pra usar login com GitHub/Google).
2. Clique em **New project**.
3. Escolha um nome (ex: `repit`), uma senha para o banco (guarde em local seguro)
   e a região mais próxima (ex: South America).
4. Aguarde alguns minutos até o projeto ficar pronto.

## 2. Rodar o schema SQL

1. No painel do projeto, vá em **SQL Editor** (menu lateral) → **New query**.
2. Abra o arquivo `supabase/schema.sql` deste repositório, copie todo o
   conteúdo e cole no editor.
3. Clique em **Run**. Isso cria as tabelas `history` e `favorites`, com
   Row Level Security habilitado — cada usuário só enxerga os próprios dados.

## 3. Pegar a URL e a chave pública

1. No painel, vá em **Project Settings** (ícone de engrenagem) → **API Keys**.
2. Você vai ver duas abas: **Publishable and secret API keys** (o modelo
   novo) e **Legacy anon, service_role API keys**. "Legacy" aqui só quer
   dizer "modelo antigo" — ainda funciona normalmente, não é nada quebrado
   ou inseguro. Mas como a Supabase vai descontinuar o modelo legado mais
   pra frente, use a aba **Publishable and secret API keys**, que é o
   padrão novo.
3. Copie o **Project URL** e a chave que começa com `sb_publishable_...`
   (a "Publishable key"). Ela é feita pra ficar exposta no navegador — é o
   equivalente novo da antiga "anon key". **Nunca** copie a "Secret key"
   (`sb_secret_...`) pro front-end — essa é o equivalente do antigo
   `service_role`, só pode ser usada em servidor.
4. Na raiz do projeto, copie `.env.example` para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

5. Preencha com os valores copiados:

   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx
   ```

   (o nome da variável ficou `ANON_KEY` por causa do nome antigo, mas o
   valor certo agora é a Publishable key — funciona igual.)

6. Rode `npm install` (para instalar o `@supabase/supabase-js`, que foi
   adicionado ao `package.json`) e depois `npm run dev` para testar local.

## 4. Ativar login com Google

### 4.1 Criar credenciais no Google Cloud

1. Acesse https://console.cloud.google.com/apis/credentials.
2. Crie um projeto (ou use um existente).
3. Configure a **tela de consentimento OAuth** (OAuth consent screen):
   tipo "External", preencha nome do app, e-mail de suporte etc.
4. Em **Credentials** → **Create Credentials** → **OAuth client ID**.
5. Tipo de aplicativo: **Web application**.
6. Em **Authorized redirect URIs**, adicione a URL de callback do Supabase.
   Você encontra o valor exato em: Supabase → **Authentication** →
   **Providers** → **Google** (ela tem o formato
   `https://SEU-PROJETO.supabase.co/auth/v1/callback`).
7. Salve e copie o **Client ID** e o **Client Secret** gerados.

### 4.2 Configurar no Supabase

1. No painel do Supabase, vá em **Authentication** → **Providers** → **Google**.
2. Ative o provider e cole o **Client ID** e **Client Secret** do passo anterior.
3. Em **Authentication** → **URL Configuration**, defina:
   - **Site URL**: a URL de produção (ex: `https://repit.vercel.app`).
   - **Redirect URLs**: adicione também `http://localhost:5173` (e a porta
     que o Vite usa) para funcionar em desenvolvimento, além da URL de
     produção.
4. Salve.

## 5. Configurar na Vercel (produção)

1. No painel do projeto na Vercel, vá em **Settings** → **Environment Variables**.
2. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   com os mesmos valores do `.env.local`.
3. Faça um novo deploy (push no GitHub já dispara, ou clique em **Redeploy**).

## Pronto

Com tudo configurado:

- O botão **Entrar** aparece no cabeçalho — login via conta Google.
- Ao assistir um vídeo logado, ele entra automaticamente no **Histórico**.
- O botão de estrela (⭐) ao lado do vídeo favorita/desfavorita.
- O ícone de relógio no cabeçalho abre o painel de **Histórico** e
  **Favoritos**, com opção de reabrir qualquer vídeo com um clique.

Sem as variáveis configuradas, nada disso aparece e o app continua
funcionando exatamente como antes (sem login, sem banco).
