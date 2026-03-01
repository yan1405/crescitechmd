# CrescitechMD - Fluxogramas de Processos

**Versão:** 1.0  
**Data:** 01/03/2026

---

## 1. Fluxo de Cadastro e Primeiro Acesso

```mermaid
flowchart TD
    Start([Usuário acessa Landing Page]) --> ClickCTA[Clica em 'Começar Grátis']
    ClickCTA --> SignupPage[Página de Cadastro]
    
    SignupPage --> FillForm[Preenche email + senha]
    FillForm --> ValidateFront{Validação<br/>Frontend}
    
    ValidateFront -->|Inválido| ShowError1[Mostra erro:<br/>Email inválido ou senha < 8 chars]
    ShowError1 --> FillForm
    
    ValidateFront -->|Válido| SendToAPI[Envia POST /api/auth/signup]
    SendToAPI --> CheckEmail{Email já<br/>existe?}
    
    CheckEmail -->|Sim| ShowError2[Mostra erro:<br/>'Email já cadastrado']
    ShowError2 --> FillForm
    
    CheckEmail -->|Não| CreateUser[Cria User no banco]
    CreateUser --> HashPassword[Criptografa senha<br/>bcrypt 10 rounds]
    HashPassword --> CreateCredits[Cria Credits<br/>amount: 5]
    CreateCredits --> SendWelcome[Envia email<br/>de boas-vindas]
    SendWelcome --> AutoLogin[Auto-login via NextAuth]
    AutoLogin --> Dashboard[Redireciona para<br/>/dashboard]
    
    Dashboard --> End([Fim])
```

---

## 2. Fluxo de Login

```mermaid
flowchart TD
    Start([Usuário na página /login]) --> FillLogin[Preenche email + senha]
    FillLogin --> SubmitLogin[Clica em 'Entrar']
    
    SubmitLogin --> NextAuth[NextAuth processa]
    NextAuth --> FindUser{Usuário<br/>existe?}
    
    FindUser -->|Não| ShowError1[Erro: 'Usuário não encontrado']
    ShowError1 --> FillLogin
    
    FindUser -->|Sim| ComparePass{Senha<br/>correta?}
    
    ComparePass -->|Não| ShowError2[Erro: 'Senha incorreta']
    ShowError2 --> FillLogin
    
    ComparePass -->|Sim| CreateJWT[Gera JWT<br/>expira em 7 dias]
    CreateJWT --> SetCookie[Define cookie<br/>httpOnly + secure]
    SetCookie --> CreateLog[Cria AuditLog<br/>USER_LOGIN]
    CreateLog --> Redirect[Redireciona para<br/>/dashboard]
    
    Redirect --> End([Fim])
```

---

## 3. Fluxo Completo de Conversão de Arquivo

```mermaid
flowchart TD
    Start([Usuário em /convert]) --> SelectFile[Seleciona arquivo]
    SelectFile --> DragDrop[Drag & Drop ou<br/>clica em 'Escolher']
    
    DragDrop --> ValidateMIME{Tipo MIME<br/>válido?}
    ValidateMIME -->|Não| Error1[Erro: 'Formato não suportado'<br/>Aceitos: PDF, DOCX, PPTX, etc.]
    Error1 --> SelectFile
    
    ValidateMIME -->|Sim| ValidateSize{Tamanho<br/>OK?}
    
    ValidateSize -->|> limite| Error2[Erro: 'Arquivo muito grande'<br/>Limite do seu plano: X MB]
    Error2 --> SelectFile
    
    ValidateSize -->|OK| ChooseOptions[Usuário escolhe opções:<br/>- Preservar imagens?<br/>- Preservar tabelas?<br/>- Preservar headers?]
    ChooseOptions --> ClickConvert[Clica em 'Converter']
    
    ClickConvert --> ShowLoading[Mostra loading<br/>'Convertendo...']
    ShowLoading --> SendAPI[POST /api/convert<br/>FormData + opções]
    
    SendAPI --> CheckAuth{Usuário<br/>autenticado?}
    CheckAuth -->|Não| Error3[Erro 401:<br/>'Não autorizado']
    Error3 --> End1([Redireciona para /login])
    
    CheckAuth -->|Sim| CheckCredits{Tem<br/>créditos?}
    CheckCredits -->|Não| Error4[Erro: 'Créditos esgotados'<br/>Upgrade seu plano]
    Error4 --> End2([Mostra modal upgrade])
    
    CheckCredits -->|Sim| SaveTemp[Salva arquivo em /tmp]
    SaveTemp --> ExecDocling[Executa Docling<br/>Python subprocess]
    
    ExecDocling --> SetTimeout{Timeout<br/>60s?}
    SetTimeout -->|Sim| Error5[Erro: 'Timeout'<br/>Arquivo muito complexo]
    Error5 --> DeleteTemp1[Deleta arquivo de /tmp]
    DeleteTemp1 --> End3([Fim com erro])
    
    SetTimeout -->|Não| CheckSuccess{Conversão<br/>sucesso?}
    
    CheckSuccess -->|Erro| Error6[Erro: 'Arquivo corrompido'<br/>Tente exportar novamente]
    Error6 --> DeleteTemp2[Deleta arquivo de /tmp]
    DeleteTemp2 --> End4([Fim com erro])
    
    CheckSuccess -->|Sucesso| GenerateMD[Gera arquivo .md]
    GenerateMD --> UploadBlob[Upload para<br/>Vercel Blob Storage]
    UploadBlob --> DeleteTemp3[Deleta arquivo<br/>original de /tmp]
    DeleteTemp3 --> DecrementCredit[Decrementa 1 crédito<br/>UPDATE credits]
    DecrementCredit --> CreateRecord[Cria registro<br/>em Conversion]
    CreateRecord --> CreateLog[Cria AuditLog<br/>CONVERSION_SUCCESS]
    CreateLog --> SendEmail{Enviar<br/>email?}
    
    SendEmail -->|Arquivo grande| SendNotif[Envia email:<br/>'Conversão concluída']
    SendEmail -->|Arquivo pequeno| SkipEmail[Não envia]
    
    SendNotif --> ReturnResponse
    SkipEmail --> ReturnResponse[Retorna JSON:<br/>- conversionId<br/>- previewUrl<br/>- downloadUrl<br/>- creditsRemaining]
    
    ReturnResponse --> ShowPreview[Mostra preview<br/>do Markdown]
    ShowPreview --> ShowDownload[Botão 'Baixar .md']
    ShowDownload --> UpdateUI[Atualiza contador<br/>de créditos]
    UpdateUI --> AddHistory[Adiciona ao<br/>histórico]
    
    AddHistory --> End5([Fim com sucesso])
```

---

## 4. Fluxo de Assinatura Stripe

```mermaid
flowchart TD
    Start([Usuário em /pricing<br/>ou /dashboard]) --> ClickPlan[Clica em<br/>'Assinar PRO']
    
    ClickPlan --> CallAPI[POST /api/stripe/create-checkout<br/>planId: 'pro']
    CallAPI --> CreateSession[Backend cria<br/>Checkout Session]
    
    CreateSession --> GetURL[Stripe retorna URL]
    GetURL --> Redirect[Redireciona para<br/>checkout.stripe.com]
    
    Redirect --> UserFills[Usuário preenche:<br/>- Número cartão<br/>- Validade<br/>- CVV<br/>- CPF]
    UserFills --> StripeProcess[Stripe processa<br/>pagamento]
    
    StripeProcess --> PaymentOK{Pagamento<br/>aprovado?}
    
    PaymentOK -->|Não| FailedPage[Redireciona para<br/>/pricing?error=payment_failed]
    FailedPage --> WebhookFail[Webhook:<br/>invoice.payment_failed]
    WebhookFail --> SendEmailFail[Envia email:<br/>'Pagamento recusado']
    SendEmailFail --> End1([Fim sem assinatura])
    
    PaymentOK -->|Sim| SuccessPage[Redireciona para<br/>/dashboard?success=true]
    SuccessPage --> WebhookSuccess[Webhook:<br/>checkout.session.completed]
    
    WebhookSuccess --> VerifySignature{Assinatura<br/>válida?}
    VerifySignature -->|Não| LogError[Registra erro:<br/>Webhook inválido]
    LogError --> End2([Fim com erro])
    
    VerifySignature -->|Sim| ExtractData[Extrai dados:<br/>- customerId<br/>- subscriptionId<br/>- userId metadata]
    
    ExtractData --> UpdateUser[UPDATE User<br/>SET plan = 'PRO']
    UpdateUser --> UpdateCredits[UPDATE Credits<br/>SET amount = 200]
    UpdateCredits --> CreateSub[CREATE Subscription:<br/>- stripeCustomerId<br/>- stripeSubscriptionId<br/>- status: ACTIVE]
    CreateSub --> CreateLog[CREATE AuditLog<br/>PLAN_UPGRADED]
    CreateLog --> SendEmailSuccess[Envia email:<br/>'Assinatura confirmada']
    
    SendEmailSuccess --> End3([Fim com sucesso])
```

---

## 5. Fluxo de Reset Mensal de Créditos (Cron Job)

```mermaid
flowchart TD
    Start([Cron executa<br/>todo dia 1º do mês<br/>às 00:00 UTC]) --> GetUsers[SELECT Users WHERE<br/>credits.lastReset < início do mês]
    
    GetUsers --> HasUsers{Encontrou<br/>usuários?}
    HasUsers -->|Não| End1([Fim - nada a fazer])
    
    HasUsers -->|Sim| LoopStart[Para cada usuário:]
    LoopStart --> GetPlan[Identifica plano:<br/>FREE, BASIC, PRO, BUSINESS]
    
    GetPlan --> MapCredits[Define novos créditos:<br/>FREE: 5<br/>BASIC: 50<br/>PRO: 200<br/>BUSINESS: 1000]
    
    MapCredits --> UpdateCredits[UPDATE Credits SET<br/>amount = novosCreditos<br/>lastReset = NOW]
    
    UpdateCredits --> CreateLog[CREATE AuditLog<br/>CREDITS_RESET<br/>details: amount, plan]
    
    CreateLog --> NextUser{Próximo<br/>usuário?}
    NextUser -->|Sim| LoopStart
    NextUser -->|Não| SendSummary[Envia relatório admin:<br/>X usuários resetados]
    
    SendSummary --> End2([Fim])
```

---

## 6. Fluxo de Sistema de Referência

```mermaid
flowchart TD
    Start([Usuário acessa<br/>/referral]) --> ShowCode[Mostra código único:<br/>ex: 'A3K9M2X7']
    
    ShowCode --> CopyLink[Usuário copia link:<br/>crescitechmd.com/signup?ref=A3K9M2X7]
    CopyLink --> ShareLink[Compartilha com amigo]
    
    ShareLink --> FriendClick[Amigo clica no link]
    FriendClick --> SignupPage[Página /signup<br/>com ref no URL]
    
    SignupPage --> FriendSignup[Amigo se cadastra]
    FriendSignup --> CreateUser[Cria User normal]
    CreateUser --> CreateReferral[CREATE Referral:<br/>- referrerId<br/>- referredId<br/>- referralCode<br/>- status: PENDING]
    
    CreateReferral --> GiveBonus1[Adiciona +5 créditos<br/>ao amigo (bônus cadastro)]
    GiveBonus1 --> End1([Amigo recebe bônus])
    
    End1 --> WaitPayment[Aguarda amigo<br/>fazer primeiro pagamento]
    WaitPayment --> FriendPays[Amigo assina<br/>plano pago]
    
    FriendPays --> WebhookPay[Webhook Stripe<br/>checkout.session.completed]
    WebhookPay --> CheckReferral{Tem<br/>referência<br/>PENDING?}
    
    CheckReferral -->|Não| End2([Fim normal])
    
    CheckReferral -->|Sim| UpdateStatus[UPDATE Referral SET<br/>status: CONVERTED<br/>creditsAwarded: 10]
    
    UpdateStatus --> AddCreditsRef[Adiciona +10 créditos<br/>ao referenciador]
    AddCreditsRef --> CreateLog[CREATE AuditLog<br/>REFERRAL_CONVERTED]
    CreateLog --> SendEmailRef[Envia email ao referenciador:<br/>'Você ganhou 10 créditos!']
    
    SendEmailRef --> End3([Fim com recompensa])
```

---

## 7. Fluxo de Cancelamento de Assinatura

```mermaid
flowchart TD
    Start([Usuário em /settings]) --> ClickCancel[Clica em<br/>'Cancelar assinatura']
    
    ClickCancel --> ConfirmModal[Modal de confirmação:<br/>'Tem certeza?']
    ConfirmModal --> UserConfirm{Confirma?}
    
    UserConfirm -->|Não| End1([Fecha modal])
    
    UserConfirm -->|Sim| CallAPI[POST /api/stripe/cancel-subscription]
    CallAPI --> StripeCancel[Stripe cancela<br/>subscription]
    
    StripeCancel --> WebhookCancel[Webhook:<br/>customer.subscription.deleted]
    WebhookCancel --> UpdateUser[UPDATE User SET<br/>plan = 'FREE']
    UpdateUser --> UpdateCredits[UPDATE Credits SET<br/>amount = 5<br/>na próxima renovação]
    UpdateCredits --> UpdateSub[UPDATE Subscription SET<br/>status: CANCELED<br/>canceledAt: NOW]
    UpdateSub --> CreateLog[CREATE AuditLog<br/>PLAN_CANCELED]
    CreateLog --> SendEmail[Envia email:<br/>'Assinatura cancelada']
    
    SendEmail --> KeepAccess[Usuário mantém acesso<br/>até fim do ciclo pago]
    KeepAccess --> ShowMessage[Mostra mensagem:<br/>'Você tem acesso até DD/MM/AAAA']
    
    ShowMessage --> End2([Fim])
```

---

## 8. Fluxo de Tratamento de Erros de Conversão

```mermaid
flowchart TD
    Start([Erro durante conversão]) --> IdentifyError{Tipo de<br/>erro?}
    
    IdentifyError -->|Timeout| TimeoutMsg[Mensagem:<br/>'Timeout após 60s.<br/>Arquivo muito grande ou complexo.<br/>Sugestão: Divida em partes menores']
    
    IdentifyError -->|Arquivo corrompido| CorruptMsg[Mensagem:<br/>'Arquivo corrompido ou inválido.<br/>Sugestão: Exporte novamente do app original']
    
    IdentifyError -->|Formato inválido| FormatMsg[Mensagem:<br/>'Formato não suportado.<br/>Aceitos: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML']
    
    IdentifyError -->|Docling crash| DoclingMsg[Mensagem:<br/>'Erro ao processar arquivo.<br/>Tente novamente ou contate suporte']
    
    TimeoutMsg --> LogError[Cria AuditLog<br/>CONVERSION_FAILED<br/>details: timeout]
    CorruptMsg --> LogError
    FormatMsg --> LogError
    DoclingMsg --> LogError
    
    LogError --> DeleteTemp[Deleta arquivo<br/>temporário de /tmp]
    DeleteTemp --> DontCharge[NÃO decrementa<br/>crédito do usuário]
    DontCharge --> UpdateRecord[UPDATE Conversion SET<br/>status: FAILED<br/>errorMessage: '...']
    
    UpdateRecord --> ShowUI[Mostra erro na UI<br/>com sugestão de solução]
    ShowUI --> OfferSupport[Botão: 'Contatar suporte']
    
    OfferSupport --> End([Fim com erro tratado])
```

---

## 9. Fluxo de Dashboard Administrativo

```mermaid
flowchart TD
    Start([Admin acessa /admin]) --> CheckRole{role =<br/>ADMIN?}
    
    CheckRole -->|Não| Error403[Erro 403:<br/>Acesso negado]
    Error403 --> End1([Redireciona para /dashboard])
    
    CheckRole -->|Sim| LoadMetrics[Carrega métricas:]
    LoadMetrics --> QueryDB[Consultas ao banco:<br/>- COUNT users<br/>- SUM subscriptions ativo<br/>- COUNT conversions hoje<br/>- GROUP BY plan]
    
    QueryDB --> QueryGA[Consulta Google Analytics:<br/>- Visitantes hoje<br/>- Taxa conversão<br/>- Páginas mais acessadas]
    
    QueryGA --> RenderDash[Renderiza dashboard:<br/>- Cards com métricas<br/>- Gráficos Recharts<br/>- Tabela de usuários]
    
    RenderDash --> UserActions{Admin<br/>ação?}
    
    UserActions -->|Ver usuário| ShowDetails[Mostra detalhes:<br/>- Histórico conversões<br/>- Faturas<br/>- Logs de auditoria]
    
    UserActions -->|Adicionar créditos| AddCredits[Modal input quantidade<br/>Confirma<br/>UPDATE credits<br/>CREATE audit_log]
    
    UserActions -->|Alterar plano| ChangePlan[Modal select plano<br/>Confirma<br/>UPDATE user<br/>UPDATE credits<br/>CREATE audit_log]
    
    UserActions -->|Suspender conta| SuspendUser[Modal confirmação<br/>Confirma<br/>UPDATE user active=false<br/>CREATE audit_log]
    
    ShowDetails --> End2([Fim])
    AddCredits --> End2
    ChangePlan --> End2
    SuspendUser --> End2
```

---

## 10. Fluxo de Validação e Segurança

```mermaid
flowchart TD
    Start([Request chega na API]) --> CheckHTTPS{HTTPS?}
    CheckHTTPS -->|Não| Block1[Bloqueia:<br/>Apenas HTTPS permitido]
    Block1 --> End1([Retorna 403])
    
    CheckHTTPS -->|Sim| CheckCSRF{Token<br/>CSRF<br/>válido?}
    CheckCSRF -->|Não| Block2[Bloqueia:<br/>CSRF inválido]
    Block2 --> End2([Retorna 403])
    
    CheckCSRF -->|Sim| CheckAuth{JWT<br/>válido?}
    CheckAuth -->|Não| Block3[Bloqueia:<br/>Não autenticado]
    Block3 --> End3([Retorna 401])
    
    CheckAuth -->|Sim| CheckRate{Rate<br/>limit OK?}
    CheckRate -->|Não| Block4[Bloqueia:<br/>Muitas requisições<br/>100/15min]
    Block4 --> End4([Retorna 429])
    
    CheckRate -->|Sim| ValidateInput{Input<br/>válido<br/>Zod?}
    ValidateInput -->|Não| Block5[Bloqueia:<br/>Dados inválidos]
    Block5 --> End5([Retorna 400])
    
    ValidateInput -->|Sim| SanitizeInput[Sanitiza inputs:<br/>- Remove HTML<br/>- Escapa SQL]
    SanitizeInput --> CheckRole{Role<br/>suficiente?}
    
    CheckRole -->|Não| Block6[Bloqueia:<br/>Permissão negada]
    Block6 --> End6([Retorna 403])
    
    CheckRole -->|Sim| ProcessRequest[Processa<br/>requisição normal]
    ProcessRequest --> LogAudit[Registra em<br/>AuditLog]
    LogAudit --> Success([Retorna 200/201])
```

---

**Última atualização:** 01/03/2026
