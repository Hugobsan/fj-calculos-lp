# Configurar o Worker de cache do boot Elfsight

Esse Worker faz proxy da requisição de boot do widget Elfsight e guarda a resposta em cache por 24h. Assim, mesmo com muitas visitas, só 1 request por dia vai de fato para a Elfsight (e só 1 “visita” conta no painel).

---

## 1. Criar o Worker no Cloudflare

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e faça login.
2. Selecione a **zona (domain)** do site (ex.: `fjcalculos.com.br`).
3. No menu lateral: **Workers & Pages**.
4. Clique em **Create** → **Create Worker**.
5. Dê um nome, ex.: `elfsight-boot-proxy`.
6. Clique em **Deploy** (pode deixar o código de exemplo por enquanto).

---

## 2. Colar o código do Worker

1. Depois do deploy, clique em **Edit code**.
2. Apague todo o conteúdo do editor.
3. Copie **todo** o conteúdo do arquivo `cloudflare-worker/src/index.js` deste repositório e cole no editor.
4. Clique em **Save and Deploy**.

---

## 3. Descobrir a URL do Worker

Depois do deploy você tem duas opções:

### Opção A – Usar o subdomínio .workers.dev (mais simples)

1. Em **Workers & Pages**, clique no Worker que você criou.
2. Aba **Settings** → **Domains & Routes**.
3. Aparece algo como: `elfsight-boot-proxy.<seu-subdominio>.workers.dev`.
4. A URL base do proxy é: **`https://elfsight-boot-proxy.<seu-subdominio>.workers.dev`**  
   (troque `<seu-subdominio>` pelo que aparecer aí).

### Opção B – Usar um subdomínio do seu domínio (ex.: elfsight-boot.fjcalculos.com.br)

1. No Worker, **Settings** → **Domains & Routes** → **Add**.
2. Escolha **Custom domain** e adicione, por exemplo: `elfsight-boot.fjcalculos.com.br`.
3. O Cloudflare cria o registro DNS automaticamente (se o domínio já estiver no Cloudflare).
4. A URL base do proxy fica: **`https://elfsight-boot.fjcalculos.com.br`**.

---

## 4. Configurar a rota (se usar domínio próprio)

Se você usou a **Opção B** (subdomínio no seu domínio), a rota já foi configurada ao adicionar o custom domain. Não precisa fazer mais nada aqui.

Se usar só **.workers.dev** (Opção A), não há rota extra para configurar; a URL do Worker já é a que você viu no passo 3.

---

## 5. Me passar a URL base do proxy

A URL deve ser **só a origem**, sem `/p/boot/` no final, por exemplo:

- `https://elfsight-boot-proxy.xxx.workers.dev`  
  ou  
- `https://elfsight-boot.fjcalculos.com.br`

Com essa URL eu coloco no site o `eappsCustomPlatformUrl` para o boot do widget usar o cache.

---

## 6. Testar o Worker

No navegador ou com `curl` (troque pela sua URL e pelo seu domínio):

```bash
curl -i "https://SUA_URL_AQUI/p/boot/?w=50d6f75c-a179-449a-b2a1-c1386c5c40fa&page=https%3A%2F%2Ffjcalculos.com.br%2F"
```

- Primeira vez: deve retornar **200** e JSON do boot; no header pode aparecer `X-Elfsight-Boot: miss`.
- Segunda vez (em até 24h): de novo **200** e o mesmo JSON; pode aparecer `X-Elfsight-Boot: cache`.

Se der 404, confira se a URL está exatamente como no passo 3 (com `/p/boot/` só no path da requisição, não na “URL base” que você me passa).

---

## Resumo do que você precisa fazer

1. Criar o Worker no Cloudflare (Workers & Pages → Create Worker).
2. Colar o código de `cloudflare-worker/src/index.js`, salvar e fazer deploy.
3. Anotar a **URL base** do Worker (com ou sem custom domain).
4. Me enviar essa URL para eu configurar no site (ou você mesmo preencher em `js/elfsight-reviews.js` na constante `ELFSIGHT_BOOT_PROXY_URL`).

Não precisa criar conta paga; o plano gratuito do Workers cobre esse uso.
