# Guia de Desenvolvimento - Antigravity IDE + Claude Code

**Projeto:** CrescitechMD  
**Data:** 01/03/2026  
**Desenvolvedor:** Yan Guilherme  
**Ferramenta:** Antigravity IDE + Claude Code Agents

---

## 1. Contexto do Projeto

O CrescitechMD é um SaaS B2C de conversão de documentos para Markdown usando o framework Docling. O projeto está totalmente especificado em 7 documentos técnicos que servem como referência completa.

### Arquivos de Referência
- `crescitechmd-prd.md` - Requisitos do produto
- `crescitechmd-arquitetura.md` - Stack e arquitetura técnica
- `crescitechmd-database-schema.md` - Estrutura do banco
- `crescitechmd-roadmap.md` - Planejamento de 4 semanas
- `crescitechmd-fluxogramas.md` - Fluxos de processos
- `crescitechmd-mockups.md` - Designs das telas
- `crescitechmd-scripts-setup.md` - Scripts de automação

---

## 2. Setup Inicial no Antigravity

### Passo 1: Criar o projeto base
Peça ao Claude Code Agent:

```
Claude, preciso iniciar o projeto CrescitechMD. 

Referências disponíveis:
- PRD em crescitechmd-prd.md
- Arquitetura em crescitechmd-arquitetura.md
- Scripts em crescitechmd-scripts-setup.md

Execute o seguinte:
1. Crie um projeto Next.js 14 com TypeScript
2. Configure Tailwind CSS
3. Instale as dependências listadas em crescitechmd-scripts-setup.md (seção 3)
4. Configure o Prisma
5. Crie o arquivo .env.local com as variáveis necessárias
6. Gere um NEXTAUTH_SECRET aleatório

Use o script em crescitechmd-scripts-setup.md seção 1 como referência.
```

### Passo 2: Estrutura de pastas
```
Claude, crie a estrutura de pastas do projeto conforme definido em crescitechmd-arquitetura.md seção 6:

app/
  (auth)/
  (dashboard)/
  (admin)/
  api/
components/
lib/
prisma/
public/
styles/
```

### Passo 3: Configurar Prisma Schema
```
Claude, implemente o schema do banco de dados.

Referência: crescitechmd-database-schema.md

Tarefas:
1. Cole o schema Prisma completo em prisma/schema.prisma
2. Execute npx prisma generate
3. Crie o arquivo prisma/seed.ts com o código da seção 2
4. Configure o package.json para incluir o seed
```

---

## 3. Desenvolvimento Sprint por Sprint

### 🗓️ SEMANA 1: Fundação e Autenticação

#### Sprint 1.1: Setup (Dia 1-2)
**Prompt para Claude Code:**
```
Claude, vamos executar o Sprint 1.1 do roadmap (crescitechmd-roadmap.md).

Contexto completo em:
- crescitechmd-prd.md seção 3.1 (Autenticação)
- crescitechmd-arquitetura.md seção 7 (Variáveis de ambiente)

Tarefas:
✓ Projeto Next.js já criado
✓ Tailwind já configurado
- Configure shadcn/ui executando: npx shadcn-ui@latest init
- Instale componentes: button, input, card, form, toast
- Configure ESLint e Prettier
- Faça commit inicial: "chore: projeto base criado"

Aguarde minha confirmação antes de prosseguir para o próximo sprint.
```

#### Sprint 1.2: Autenticação (Dia 3-4)
**Prompt para Claude Code:**
```
Claude, implemente o sistema de autenticação completo.

Referências:
- crescitechmd-prd.md seção 3.1
- crescitechmd-fluxogramas.md seções 1 e 2 (fluxos de cadastro e login)
- crescitechmd-mockups.md seção 2 (tela de cadastro)
- crescitechmd-database-schema.md (models User e Credits)

Tarefas:
1. Instale NextAuth.js v5: npm install next-auth@beta
2. Crie app/api/auth/[...nextauth]/route.ts
3. Configure provider de credenciais (email + senha)
4. Implemente hash com bcrypt
5. Crie páginas:
   - app/(auth)/login/page.tsx
   - app/(auth)/signup/page.tsx
6. Implemente validação com Zod
7. Crie middleware de proteção de rotas
8. Teste: cadastro → login → redirecionamento

Siga exatamente o fluxo em crescitechmd-fluxogramas.md seção 1.
```

#### Sprint 1.3: Dashboard Básico (Dia 5)
**Prompt para Claude Code:**
```
Claude, crie o dashboard inicial do usuário.

Referências:
- crescitechmd-mockups.md seção 3 (layout do dashboard)
- crescitechmd-prd.md seção 3.2

Tarefas:
1. Crie app/(dashboard)/layout.tsx com sidebar
2. Implemente components/dashboard/Sidebar.tsx
3. Implemente components/dashboard/Header.tsx
4. Crie app/(dashboard)/dashboard/page.tsx
5. Mostre informações do usuário (nome, email, plano)
6. Exiba créditos disponíveis com barra de progresso
7. Adicione botão de logout

Design: Minimalista corporativo (azul #0066CC / branco)
Componentes shadcn/ui: Card, Badge, Avatar
```

#### Sprint 1.4: Landing Page (Dia 6-7)
**Prompt para Claude Code:**
```
Claude, desenvolva a landing page completa.

Referências:
- crescitechmd-prd.md seção 6
- crescitechmd-mockups.md seção 1

Estrutura (app/page.tsx):
1. Hero section
   - Headline: "Converta documentos para Markdown em segundos"
   - CTA: "Começar Grátis - 5 conversões"
   - Placeholder para GIF (adicionar depois)

2. Seção "Como Funciona" (3 cards)
   - Upload → Conversão → Download
   - Ícones e descrições

3. Pricing (4 cards lado a lado)
   - FREE: R$0, 5 conversões, 5MB
   - BÁSICO: R$9, 50 conversões, 10MB
   - PRO: R$19, 200 conversões, 20MB ⭐
   - BUSINESS: R$39, 1000 conversões, 50MB

4. FAQ (accordion)
   - "Quais formatos são suportados?"
   - "Como funciona o sistema de créditos?"
   - "Posso cancelar a qualquer momento?"
   - "Os arquivos ficam armazenados?"
   - "Qual o tempo de conversão?"

5. CTA final + Rodapé

Responsivo mobile-first.
```

**🎯 Checkpoint Semana 1:**
```
Claude, faça uma revisão completa do que foi desenvolvido:

1. Autenticação está funcionando? (cadastro + login + logout)
2. Dashboard exibe dados do usuário?
3. Landing page está responsiva?
4. Todos os commits foram feitos?

Gere um relatório de status e liste próximos passos.
```

---

### 🗓️ SEMANA 2: Core de Conversão

#### Sprint 2.1: Setup Docling (Dia 1-2)
**Prompt para Claude Code:**
```
Claude, configure o Docling para conversão de documentos.

Referências:
- crescitechmd-arquitetura.md seção 3 (fluxo de conversão)
- crescitechmd-prd.md seção 3.2

Tarefas:
1. Instale Docling: pip install docling --break-system-packages
2. Crie lib/docling/convert.py (script Python)
3. Implemente função de conversão:
   - Input: caminho do arquivo, opções
   - Output: string Markdown
   - Timeout: 60 segundos
   - Tratamento de erros
4. Crie lib/docling.ts (wrapper Node.js)
5. Teste com arquivo PDF de exemplo

Formatos suportados: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML
```

#### Sprint 2.2: API de Upload (Dia 3-4)
**Prompt para Claude Code:**
```
Claude, implemente a API de conversão.

Referências:
- crescitechmd-fluxogramas.md seção 3 (fluxo completo)
- crescitechmd-arquitetura.md seção 3

Crie app/api/convert/route.ts:

Fluxo:
1. Recebe FormData com arquivo + opções
2. Valida autenticação (NextAuth)
3. Verifica créditos disponíveis
4. Valida tipo MIME e tamanho
5. Salva temporariamente em /tmp
6. Executa Docling
7. Upload resultado para Vercel Blob
8. Deleta arquivo original
9. Decrementa crédito
10. Cria registro em Conversion
11. Retorna JSON com URLs

Implementar rate limiting: 10 req/min por usuário

Referência completa: crescitechmd-fluxogramas.md seção 3
```

#### Sprint 2.3: Interface de Conversão (Dia 5-6)
**Prompt para Claude Code:**
```
Claude, crie a interface de conversão de arquivos.

Referências:
- crescitechmd-mockups.md seção 4
- crescitechmd-prd.md seção 3.2

Criar app/(dashboard)/convert/page.tsx:

1. Componente de upload (dropzone)
   - Drag & drop
   - Click para selecionar
   - Validação frontend (tipo + tamanho)
   - Preview do nome do arquivo

2. Opções de customização (checkboxes)
   - ☑ Preservar imagens
   - ☑ Manter formatação de tabelas
   - ☑ Converter headers/títulos
   - ☑ Preservar listas numeradas

3. Botão "Converter para Markdown"

4. Loading state durante conversão
   - Barra de progresso
   - "Processando com Docling..."

5. Preview do Markdown gerado
   - Syntax highlighting
   - Botão de download

6. Mensagens de erro amigáveis (crescitechmd-prd.md seção 3.2)

Use componentes shadcn/ui: Card, Button, Checkbox, Progress
```

#### Sprint 2.4: Histórico (Dia 7)
**Prompt para Claude Code:**
```
Claude, implemente o histórico de conversões.

Referências:
- crescitechmd-mockups.md seção 5
- crescitechmd-database-schema.md (model Conversion)

Criar app/(dashboard)/history/page.tsx:

1. Lista paginada de conversões
2. Filtros:
   - Por data
   - Por formato
   - Por status
3. Busca por nome de arquivo
4. Ações por conversão:
   - Visualizar preview
   - Re-download
   - Deletar
5. Paginação (20 itens por página)

Query Prisma:
- findMany ordenado por createdAt DESC
- Include user relation
- Filtros dinâmicos
```

**🎯 Checkpoint Semana 2:**
```
Claude, teste o sistema de conversão end-to-end:

1. Upload arquivo PDF → conversão → preview → download
2. Verificar se crédito foi decrementado
3. Arquivo aparece no histórico?
4. Validações funcionando?
5. Erros sendo tratados corretamente?

Gere relatório de testes e liste bugs encontrados.
```

---

### 🗓️ SEMANA 3: Pagamentos e Admin

#### Sprint 3.1: Setup Stripe (Dia 1-2)
**Prompt para Claude Code:**
```
Claude, configure a integração com Stripe.

Tarefas manuais que EU farei:
1. Criar conta Stripe modo teste
2. Criar 3 produtos:
   - BÁSICO: R$ 9/mês
   - PRO: R$ 19/mês
   - BUSINESS: R$ 39/mês
3. Copiar Price IDs para .env.local

Tarefas para VOCÊ:
1. Instalar: npm install @stripe/stripe-js stripe
2. Criar lib/stripe.ts com configuração
3. Criar types para os planos
4. Implementar tabela Subscription no Prisma (já existe no schema)
```

#### Sprint 3.2: Checkout e Webhooks (Dia 3-4)
**Prompt para Claude Code:**
```
Claude, implemente o fluxo de pagamento completo.

Referências:
- crescitechmd-fluxogramas.md seção 4 (fluxo Stripe)
- crescitechmd-arquitetura.md seção 5

Tarefas:
1. Criar app/api/stripe/create-checkout/route.ts
   - Recebe planId
   - Cria Checkout Session
   - Retorna URL do Stripe

2. Criar app/api/webhooks/stripe/route.ts
   - Verificar assinatura do webhook
   - Eventos:
     * checkout.session.completed
     * customer.subscription.updated
     * customer.subscription.deleted
     * invoice.payment_failed
   
3. Atualizar página de pricing
   - Botões "Assinar" apontam para /api/stripe/create-checkout
   - Redireciona para Stripe Checkout

Fluxo completo em crescitechmd-fluxogramas.md seção 4.
```

#### Sprint 3.3: Gestão de Assinaturas (Dia 5)
**Prompt para Claude Code:**
```
Claude, crie a página de configurações com gestão de plano.

Referências:
- crescitechmd-mockups.md seção 6

Criar app/(dashboard)/settings/page.tsx:

Tabs:
1. Perfil
2. Assinatura ← foco aqui
3. Segurança
4. Notificações

Na tab Assinatura:
- Card mostrando plano atual
- Próxima cobrança
- Créditos disponíveis
- Botões: "Alterar Plano" | "Cancelar"
- Histórico de faturas
- Link para Portal do Cliente Stripe

Implementar:
- Modal de upgrade/downgrade
- Prorrateio automático (Stripe faz)
- Cancelamento com confirmação
```

#### Sprint 3.4: Dashboard Admin (Dia 6-7)
**Prompt para Claude Code:**
```
Claude, desenvolva o dashboard administrativo.

Referências:
- crescitechmd-mockups.md seção 8
- crescitechmd-prd.md seção 5

Criar app/(admin)/admin/page.tsx:

Proteção: apenas role='ADMIN' acessa

Métricas principais (cards):
1. MRR total
2. Total de usuários
3. Conversões hoje
4. Taxa de conversão free→pago

Gráficos (Recharts):
- Crescimento de usuários (últimos 30 dias)
- MRR mensal

Tabela de usuários:
- Filtros por plano
- Busca por email
- Ações:
  * Visualizar detalhes
  * Adicionar/remover créditos
  * Alterar plano
  * Suspender conta

Integrar Google Analytics 4 (opcional nesta sprint).
```

**🎯 Checkpoint Semana 3:**
```
Claude, teste o fluxo de pagamento completo:

1. Assinar plano PRO (modo teste Stripe)
2. Webhook atualiza plano?
3. Créditos foram atualizados para 200?
4. Dashboard admin mostra métricas?
5. Upgrade/downgrade funciona?
6. Cancelamento funciona?

IMPORTANTE: Usar cartões de teste Stripe.
```

---

### 🗓️ SEMANA 4: Polimento e Lançamento

#### Sprint 4.1: Sistema de Referência (Dia 1-2)
**Prompt para Claude Code:**
```
Claude, implemente o programa de indicações.

Referências:
- crescitechmd-fluxogramas.md seção 6
- crescitechmd-mockups.md seção 7
- crescitechmd-database-schema.md (model Referral)

Tarefas:
1. Instalar: npm install nanoid
2. Gerar código único ao cadastrar usuário
3. Criar app/(dashboard)/referral/page.tsx
4. Exibir código e link de compartilhamento
5. Botões de share (Email, WhatsApp, Twitter)
6. Dashboard de indicações
7. Lógica de bônus:
   - Indicado cadastra: +5 créditos
   - Indicado assina: +10 créditos para quem indicou

Fluxo em crescitechmd-fluxogramas.md seção 6.
```

#### Sprint 4.2: Emails Transacionais (Dia 3)
**Prompt para Claude Code:**
```
Claude, configure sistema de emails.

Referências:
- crescitechmd-prd.md seção 3.4

Tarefas:
1. Instalar: npm install resend react-email
2. Criar templates em emails/:
   - welcome.tsx (boas-vindas)
   - conversion-completed.tsx
   - credits-depleted.tsx
   - payment-confirmed.tsx
   - subscription-canceled.tsx

3. Criar lib/email.ts com funções:
   - sendWelcomeEmail()
   - sendConversionEmail()
   - sendCreditsDepletedEmail()
   - etc.

4. Integrar nos fluxos:
   - Após cadastro → welcome
   - Após conversão grande → completed
   - Créditos = 0 → depleted
   - Webhook Stripe → payment

Use React Email para templates responsivos.
```

#### Sprint 4.3: Suporte (Dia 4)
**Prompt para Claude Code:**
```
Claude, configure canais de suporte.

Referências:
- crescitechmd-prd.md seção 7

Tarefas:
1. Integrar chatbot (Crisp ou Tawk.to)
   - Adicionar script no layout
   - Configurar widget

2. Criar página FAQ (app/faq/page.tsx)
   - 5-7 perguntas com accordion
   - Conteúdo em crescitechmd-prd.md seção 6.1

3. Criar páginas legais:
   - app/terms/page.tsx (Termos de Uso)
   - app/privacy/page.tsx (Política de Privacidade LGPD)
   - app/contact/page.tsx (Formulário de contato)

4. Atualizar rodapé com:
   - Links legais
   - Email: contato@crescitechmd.com
   - WhatsApp Business
   - Redes sociais
```

#### Sprint 4.4: Testes e Otimizações (Dia 5-6)
**Prompt para Claude Code:**
```
Claude, execute testes e otimizações finais.

Checklist de Qualidade:

Performance:
1. Execute Lighthouse audit
2. Otimize imagens (next/image)
3. Lazy loading de componentes pesados
4. Verifique bundle size

Funcional:
1. Teste fluxo completo: cadastro → conversão → pagamento
2. Teste todos os formatos de arquivo
3. Teste mobile (Chrome DevTools)
4. Teste rate limiting
5. Teste validações de erro

Segurança:
1. Verificar HTTPS (Vercel)
2. CSRF tokens (NextAuth)
3. Rate limiting ativo
4. Logs de auditoria funcionando

SEO:
1. Meta tags em todas as páginas
2. Sitemap.xml
3. robots.txt
4. Open Graph tags

LGPD:
1. Cookie consent
2. Termos de aceite
3. Opção de deletar dados
4. Política de privacidade

Gerar relatório de todos os testes.
```

#### Sprint 4.5: Deploy Produção (Dia 7)
**Prompt para Claude Code:**
```
Claude, prepare para deploy em produção.

Tarefas:
1. Verificar .env.local → configurar variáveis na Vercel
2. Configurar banco em produção (Supabase)
3. Executar migrations: npx prisma migrate deploy
4. Executar seed em produção (apenas admin)
5. Configurar domínio customizado (se houver)
6. Ativar Stripe modo production
7. Configurar Google Analytics
8. Ativar Vercel Analytics
9. Backup inicial do banco

Depois do deploy:
1. Smoke tests em produção
2. Verificar webhooks Stripe
3. Teste de conversão real
4. Verificar emails sendo enviados

Referência: crescitechmd-scripts-setup.md seções 4 e 6
```

---

## 4. Prompts Especiais para Situações Comuns

### Debugging
```
Claude, estou tendo um erro: [DESCREVER ERRO]

Contexto:
- Arquivo: [caminho]
- Fluxo relacionado: crescitechmd-fluxogramas.md seção [X]
- Especificação: crescitechmd-prd.md seção [Y]

Analise e corrija o problema.
```

### Refatoração
```
Claude, o código em [arquivo] está confuso.

Refatore seguindo:
- Arquitetura em crescitechmd-arquitetura.md
- Padrões do projeto
- Clean code

Mantenha funcionalidade idêntica.
```

### Nova Feature
```
Claude, preciso adicionar uma nova funcionalidade: [DESCREVER]

Esta feature está especificada em:
- crescitechmd-prd.md seção [X]
- Fluxo em crescitechmd-fluxogramas.md seção [Y]
- Design em crescitechmd-mockups.md seção [Z]

Implemente seguindo as especificações.
```

### Code Review
```
Claude, revise o código que acabei de fazer em [arquivo/funcionalidade].

Verifique:
1. Está seguindo a arquitetura (crescitechmd-arquitetura.md)?
2. Implementa corretamente o fluxo (crescitechmd-fluxogramas.md)?
3. Atende aos requisitos (crescitechmd-prd.md)?
4. Está seguro e otimizado?
5. Tem testes adequados?

Liste melhorias necessárias.
```

---

## 5. Comandos Úteis Durante o Desenvolvimento

### Desenvolvimento Local
```bash
npm run dev              # Inicia servidor local
npm run db:studio        # Prisma Studio (visualizar banco)
npx prisma db push       # Sincronizar schema com banco
npm run lint             # Verificar erros de linting
npm run type-check       # Verificar erros TypeScript
```

### Stripe (Webhooks Locais)
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Banco de Dados
```bash
npx prisma generate      # Gerar cliente Prisma
npx prisma db seed       # Popular banco com dados iniciais
npx prisma migrate dev   # Criar migration
npx prisma studio        # Interface visual do banco
```

### Git
```bash
git status
git add .
git commit -m "feat: [descrição]"
git push origin main
```

---

## 6. Estrutura de Commits Recomendada

```
feat: adiciona autenticação com NextAuth
fix: corrige validação de upload de arquivo
chore: atualiza dependências
docs: adiciona README do projeto
style: formata código com Prettier
refactor: reorganiza estrutura de componentes
test: adiciona testes de integração Stripe
```

---

## 7. Checklist Final Pré-Lançamento

### Funcional
- [ ] Cadastro e login funcionando
- [ ] Conversão de todos os formatos (PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML)
- [ ] Sistema de créditos preciso
- [ ] Stripe processando pagamentos
- [ ] Webhooks atualizando planos
- [ ] Histórico salvando conversões
- [ ] Emails sendo enviados
- [ ] Sistema de referência gerando códigos

### Performance
- [ ] Lighthouse score > 90
- [ ] Conversão < 60s
- [ ] Página carrega < 3s
- [ ] Mobile 100% responsivo

### Segurança
- [ ] HTTPS ativo
- [ ] Senhas criptografadas (bcrypt)
- [ ] CSRF protection (NextAuth)
- [ ] Rate limiting ativo
- [ ] Logs de auditoria

### Legal/LGPD
- [ ] Termos de Uso
- [ ] Política de Privacidade
- [ ] Cookie consent
- [ ] Opção de deletar dados

### Marketing
- [ ] Landing page completa
- [ ] SEO otimizado
- [ ] Google Analytics configurado
- [ ] Redes sociais criadas

---

## 8. Recursos de Suporte

### Documentação
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org
- Stripe: https://stripe.com/docs
- Docling: https://github.com/DS4SD/docling

### Troubleshooting
Se algo não funcionar, sempre:
1. Verifique os logs no console
2. Confira as variáveis de ambiente
3. Revise a documentação de referência
4. Peça ao Claude Code para debugar

---

**Última atualização:** 01/03/2026  
**Status:** Pronto para desenvolvimento 🚀
