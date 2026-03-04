# 📋 Relatório de Análise — LojaJVC Back-end v2

## Visão Geral

**Nome do projeto:** LojaJVC Back-end (versão 2)
**Caminho:** `d:\PROJETOS DEV\LojaJVC\back\v2`
**Tipo:** API REST — Back-end de E-commerce
**Linguagem:** TypeScript
**Runtime:** Node.js 20.x
**Servidor HTTP:** Express 4
**Banco de Dados:** MongoDB (via Mongoose)
**Status geral:** ✅ Em desenvolvimento ativo — arquitetura sendo refatorada (v1 → v2)

---

## Stack Tecnológico

| Categoria                | Tecnologia                               |
|--------------------------|------------------------------------------|
| Linguagem                | TypeScript 5                             |
| Runtime                  | Node.js 20.x                             |
| Framework Web            | Express 4                                |
| Banco de Dados           | MongoDB + Mongoose 8                     |
| Autenticação             | JWT (`jsonwebtoken`, `express-jwt`)      |
| Cache                    | Redis (Upstash via `ioredis`)            |
| Upload de Arquivos       | Multer + Sharp (processamento de imagem) |
| Armazenamento de Imagens | Firebase Storage                         |
| E-mail                   | Nodemailer (SMTP Gmail)                  |
| Pagamentos               | M-Pesa (API moçambicana)                 |
| Logging                  | Winston + Morgan                         |
| Validação                | Joi                                      |
| Rate Limiting            | `express-rate-limit`                     |
| Compressão               | `compression`                            |
| Template Engine          | EJS                                      |
| Build                    | tsup                                     |
| Dev Server               | tsx watch                                |
| Testes                   | Vitest                                   |
| Linting                  | ESLint + Prettier                        |

---

## Arquitetura

O projeto adota uma **arquitetura modular por domínio**, onde cada módulo é auto-contido:

```
src/
├── app.ts              ← Ponto de entrada (Express + middlewares + rotas)
├── modules/
│   ├── user/           ← Módulo de usuários
│   ├── cart/           ← Módulo de carrinho
│   ├── category/       ← Módulo de categorias (3 níveis)
│   └── product/        ← Módulo de produtos
└── shared/             ← Utilitários, erros base, validadores compartilhados
```

Cada módulo segue o padrão:

```
<módulo>/
├── controllers/     ← Camada HTTP (entrada/saída)
├── services/        ← Lógica de negócio
├── repositories/    ← Acesso ao banco de dados
├── model/           ← Schema Mongoose
├── interfaces/      ← Tipagens TypeScript
├── fatories/        ← Factories (injeção de dependência)
├── validatores/     ← Validadores Joi
├── routes.ts        ← Definição das rotas do módulo
└── index.ts         ← Barrel (exportações centralizadas)
```

> A pasta `routes/` na raiz contém as rotas da **versão antiga (v1)**, mantidas mas **comentadas** em `app.ts`. A arquitetura nova usa as rotas dentro de cada módulo em `src/modules/`.

---

## Módulos Ativos (v2)

### 1. 👤 Módulo `user`

| Método   | Endpoint         | Acesso      | Status       |
|----------|------------------|-------------|--------------|
| `GET`    | `/users/admin`   | Admin       | Testado      |
| `GET`    | `/user/:id`      | Autenticado | Testado      |
| `PUT`    | `/user/:id`      | Autenticado | Não aprovado |
| `DELETE` | `/user/:id`      | Autenticado | Testado      |
| `POST`   | `/authetication` | Público     | Testado      |
| `POST`   | `/register`      | Público     | Testado      |

Funcionalidades da v1 ainda não migradas: recuperação de senha, visitante registrado.

---

### 2. 🛒 Módulo `cart`

| Método   | Endpoint                          | Acesso      | Status |
|----------|-----------------------------------|-------------|--------|
| `POST`   | `/cart`                           | Autenticado | ✅    |
| `POST`   | `/cart/product`                   | Autenticado | ✅    |
| `GET`    | `/carts/admin`                    | Admin       | ✅    |
| `DELETE` | `/cart/product/:itemId`           | Autenticado | ✅    |
| `PATCH`  | `/cart/product/:itemId/:quantity` | Autenticado | ✅    |
| `POST`   | `/cart/details`                   | Opcional    | ✅    |

---

### 3. 🗂️ Módulo `category`

Sistema de **3 níveis hierárquicos:** `Category` → `SubCategory` → `Sub_category`

| Nível          | Operações disponíveis                                       |
|----------------|-------------------------------------------------------------|
| `Category`     | GET lista, GET por ID, POST (admin), PUT (admin)            |
| `SubCategory`  | GET por categoria, GET por ID, POST (admin), PUT (admin)    |
| `Sub_category` | GET por subcategoria, GET por ID, POST (admin), PUT (admin) |

---

### 4. 📦 Módulo `product`

| Método | Endpoint              | Acesso  | Status |
|--------|-----------------------|---------|--------|
| `POST` | `/product`            | Admin   | ✅     |
| `PUT`  | `/product/:id`        | Admin   | ✅     |
| `GET`  | `/products`           | Público | ✅     |
| `GET`  | `/product/:productId` | Público | ✅     |
| `GET`  | `/brands`             | Público | ✅     |
| `POST` | `/brands`             | Admin   | ✅     |

---

## Modelos MongoDB (pasta `models/`)

| Modelo                  | Descrição                     |
|-------------------------|-------------------------------|
| `Users.ts`              | Usuários e clientes           |
| `Products/`             | Produtos (múltiplos arquivos) |
| `Carts.ts`              | Carrinhos de compras          |
| `Orders.ts`             | Pedidos                       |
| `Categories.ts`         | Categorias                    |
| `Deliveries.ts`         | Entregas                      |
| `Payments.ts`           | Pagamentos                    |
| `Ratings.ts`            | Avaliações                    |
| `Variations.ts`         | Variações de produto          |
| `Addresses.ts`          | Endereços                     |
| `Customers.ts`          | Dados de clientes             |
| `Coupon.ts`             | Cupons de desconto            |
| `Notifications.ts`      | Notificações                  |
| `Stores.ts`             | Lojas                         |
| `Wishlist.ts`           | Lista de desejos              |
| `OrderRegistrations.ts` | Histórico de pedidos          |
| `Visita.ts`             | Controle de visitas           |

---

## Integrações Externas

| Serviço               | Finalidade                                  |
|-----------------------|---------------------------------------------|
| **M-Pesa**            | Pagamento móvel (mercado moçambicano)       |
| **Firebase**          | Armazenamento de imagens (Firebase Storage) |
| **Redis (Upstash)**   | Cache em nuvem                              |
| **Google/Gmail SMTP** | Envio de e-mails transacionais              |
| **Google APIs**       | OAuth2 / Google Drive                       |

> ⚠️ **ATENÇÃO:** O arquivo `.env` contém **chaves privadas sensíveis** (Firebase private key, M-Pesa API key, JWT secret). Risco de segurança sério se o repositório for público.

---

## Segurança e Middlewares

- **Rate Limiting:** 50 req/min por IP, com identificação via `x-forwarded-for`
- **CORS:** Habilitado globalmente (`cors()`)
- **Compressão:** `compression` (gzip)
- **Autenticação:** JWT via `express-jwt`
- **Roles:** Dois níveis — usuário autenticado e admin
- **Tratamento de erros:** Handler global para `BaseError`, `MongoServerError`, `MulterError` e JWT
- **Logging:** Winston em produção, Morgan dev em desenvolvimento
- **Headers:** `x-powered-by` desabilitado

---

## Estado da Migração v1 → v2

| Área                | Status                                                  |
|---------------------|---------------------------------------------------------|
| Módulo `user`       | 🔶 Parcialmente migrado (recuperação de senha pendente) |
| Módulo `cart`       | ✅ Migrado                                              |
| Módulo `category`   | ✅ Migrado                                              |
| Módulo `product`    | 🔶 Parcialmente migrado (delete, busca pendentes)       |
| Módulo `orders`     | ❌ Não migrado                                          |
| Módulo `payments`   | ❌ Não migrado                                          |
| Módulo `deliveries` | ❌ Não migrado                                          |
| Módulo `ratings`    | ❌ Não migrado                                          |
| Módulo `statistics` | ❌ Não migrado                                          |

---

## Pontos Positivos ✅

- Arquitetura modular clara — fácil de escalar e manter
- TypeScript rigoroso com `tsup` e `tsx`
- Validação robusta com Joi em todos os módulos
- Rate limiting e compressão configurados
- Logging estruturado com Winston
- Testes configurados com Vitest (estrutura pronta)
- Suporte a pagamentos locais (M-Pesa) — adaptado ao mercado moçambicano
- Sistema de categorias em 3 níveis bem estruturado

---

## Pontos de Melhoria ⚠️

| Prioridade | Problema                                                | Sugestão                                                             |
|------------|---------------------------------------------------------|----------------------------------------------------------------------|
| 🔴 Alta    | `.env` com chaves privadas expostas                     | Usar secret manager, adicionar ao `.gitignore` e regenerar as chaves |
| 🔴 Alta    | CORS global sem restrições                              | Configurar origens permitidas explicitamente                         |
| 🟡 Média   | Módulos `orders`/`payments`/`deliveries` não migrados   | Criar módulos v2 seguindo o padrão atual                             |
| 🟡 Média   | Pasta `category copy` no código                         | Limpar código órfão                                                  |
| 🟡 Média   | Typos nos nomes de pastas: `fatories`, `validatores`    | Renomear para `factories`, `validators`                              |
| 🟡 Média   | Endpoint `/authetication` (typo)                        | Corrigir para `/authentication`                                      |
| 🟡 Média   | Rotas duplicadas em `/routes` (v1) e `src/modules` (v2) | Remover pasta `routes/` após a migração                              |
| 🟢 Baixa   | Vitest configurado mas sem testes escritos              | Implementar testes unitários e de integração                         |
| 🟢 Baixa   | `README.md` praticamente vazio                          | Documentar a API e instruções de setup                               |
| 🟢 Baixa   | `recibo.html` na raiz do projeto                        | Mover para `views/`                                                  |

---

## Resumo Executivo

O projeto **LojaJVC Back-end v2** é um e-commerce robusto voltado ao mercado moçambicano, com integração M-Pesa para pagamentos locais. A arquitetura v2 está sendo construída com boas práticas (módulos independentes, TypeScript, validação, logging), mas ainda está **em transição** — aproximadamente metade dos módulos ainda não foi migrada. O maior risco imediato é a **exposição de chaves sensíveis** no arquivo `.env`.

---

## 🗺️ Roadmap — Próximos Passos

### 🔴 Fase 1 — Segurança & Limpeza (Imediato)

> Antes de qualquer nova feature, garantir que a base está segura e limpa.

- [ ] **Proteger o `.env`** — adicionar ao `.gitignore`, revogar e regenerar todas as chaves expostas (Firebase, M-Pesa, JWT Secret)
- [ ] **Configurar CORS** com lista de origens permitidas (ex: domínio do front-end)
- [ ] **Remover pasta `category copy`** — código órfão/duplicado
- [ ] **Corrigir typos** nas pastas: `fatories` → `factories`, `validatores` → `validators`
- [ ] **Corrigir o endpoint** `/authetication` → `/authentication`
- [ ] **Finalizar migração do módulo `user`** — recuperação de senha (`/showRecovery`, `/createRecovery`, `/recoverPass`)

---

### 🟡 Fase 2 — Migração dos Módulos Restantes (Curto prazo)

> Trazer os módulos da v1 para a arquitetura modular da v2.

- [ ] **Módulo `order`** — criar em `src/modules/order/` com:
  - CRUD de pedidos (admin e cliente)
  - Listagem paginada
  - Cancelamento de pedido
- [ ] **Módulo `payment`** — criar em `src/modules/payment/` com:
  - Integração M-Pesa
  - Registro e consulta de pagamentos
- [ ] **Módulo `delivery`** — criar em `src/modules/delivery/` com:
  - Gestão de entregas e status
- [ ] **Módulo `rating`** — criar em `src/modules/rating/` com:
  - Avaliações de produtos por clientes
- [ ] **Módulo `statistics`** — criar em `src/modules/statistics/` com:
  - Dashboard de métricas para admin (vendas, pedidos, visitas)
- [ ] **Remover pasta `/routes` (v1)** após todos os módulos serem migrados

---

### 🟡 Fase 3 — Funcionalidades Pendentes (Médio prazo)

> Features que já existiam na v1 mas ainda não foram portadas ou aprovadas.

- [ ] **Módulo `product`** — completar:
  - `DELETE /product/:id` (rota comentada na v1)
  - `GET /products/search/` — busca por texto
  - `GET /product/:id/ratings` — avaliações do produto
  - `GET /product/:id/variations` — variações do produto
- [ ] **Módulo `cart`** — criar carrinho automaticamente no registro do usuário (📌 item no README original)
- [ ] **Criação de pedido** ao finalizar o carrinho (checkout flow completo)
- [ ] **Notificações** — usar o modelo `Notifications.ts` para alertas de pedido, pagamento, etc.
- [ ] **Cupons de desconto** — usar o modelo `Coupon.ts` para aplicar descontos no carrinho
- [ ] **Wishlist** — implementar endpoints para lista de desejos

---

### 🟢 Fase 4 — Qualidade & Produção (Longo prazo)

> Preparar o projeto para escala e manutenção profissional.

- [ ] **Testes** — escrever testes com Vitest:
  - Testes unitários para services
  - Testes de integração para rotas principais
  - Meta: cobertura mínima de 70%
- [ ] **Documentação da API** — usar Swagger/OpenAPI ou escrever no `README.md`:
  - Todos os endpoints com exemplos de request/response
  - Guia de setup e variáveis de ambiente
- [ ] **Paginação padronizada** — garantir que todas as listagens usam `mongoose-paginate-v2`
- [ ] **Cache com Redis** — aplicar cache nas rotas de leitura pesada (produtos, categorias)
- [ ] **CI/CD** — configurar pipeline de deploy automático (ex: GitHub Actions → Render)
- [ ] **Variáveis de ambiente seguras** — migrar para um secret manager (ex: Doppler, AWS Secrets Manager ou variáveis de ambiente do Render)
- [ ] **Monitoramento** — configurar alertas de erro em produção (ex: Sentry)

---

### 📊 Visão Geral do Roadmap

```
AGORA          1-2 semanas       1 mês           2-3 meses
  │                │                │                │
  ▼                ▼                ▼                ▼
Segurança     Migrar módulos    Features         Qualidade
& Limpeza     (orders,          pendentes        & Produção
              payments,         (search,         (testes,
              delivery,         checkout,        docs, CI/CD,
              ratings,          cupons,          cache,
              statistics)       wishlist)        monitoring)
```

