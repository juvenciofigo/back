# 🛣️ Mapa de Rotas — LojaJVC Back-end v2

> **Legenda:**
> - ✅ **Ativa** — funcionando na v2
> - 🔶 **Parcial** — existe mas não totalmente aprovada/testada
> - 🗃️ **Legada (v1)** — existe na v1 mas ainda não migrada para v2
> - 💡 **Sugerida** — não existe ainda, recomendada para o projeto
> - 🔒 `Admin` — requer token JWT + papel de administrador
> - 🔑 `Auth` — requer token JWT de usuário autenticado
> - 🌐 `Público` — sem autenticação obrigatória

---

## 👤 Usuários `/user`

| Método   | Endpoint             | Acesso  | Status      | Descrição                                     |
|----------|----------------------|---------|-------------|-----------------------------------------------|
| `POST`   | `/register`          | Público | Ativa       | Criar novo usuário                            |✅
| `POST`   | `/authentication`    | Público | Ativa       | Login — retorna JWT                           |✅
| `GET`    | `/user/:id`          | Auth    | Ativa       | Ver perfil do utilizador                      |
| `PUT`    | `/user/:id`          | Auth    | Parcial     | Atualizar dados do utilizador                 |
| `DELETE` | `/user/:id`          | Auth    | Ativa       | Apagar conta do utilizador                    |✅
| `GET`    | `/users/admin`       | Admin   | Ativa       | Listar todos os utilizadores                  |✅
| `GET`    | `/showRecovery`      | Público | Legada (v1) | Página de recuperação de senha                |
| `POST`   | `/createRecovery`    | Público | Legada (v1) | Iniciar recuperação de senha (envio de email) |
| `GET`    | `/recoverPass`       | Público | Legada (v1) | Confirmar token de recuperação                |
| `POST`   | `/recoverPass`       | Público | Legada (v1) | Definir nova senha                            |
| `GET`    | `/visitaReg`         | Público | Legada (v1) | Registo de visita anónima                     |
| `GET`    | `/user/:id/admin`    | Admin   | Legada (v1) | Ver detalhes de utilizador (admin)            |
| `PUT`    | `/user/:id/admin`    | Admin   | Legada (v1) | Atualizar utilizador (admin)                  |
| `DELETE` | `/user/:id/admin`    | Admin   | Legada (v1) | Apagar utilizador (admin)                     |
| `POST`   | `/user/:id/avatar`   | Auth    | Sugerida    | Upload/atualizar foto de perfil               |
| `GET`    | `/user/:id/orders`   | Auth    | Sugerida    | Histórico de pedidos do utilizador            |
| `GET`    | `/user/:id/wishlist` | Auth    | Sugerida    | Lista de desejos do utilizador                |
| `POST`   | `/auth/google`       | Público | Sugerida    | Login com Google OAuth2                       |
| `POST`   | `/auth/refresh`      | Auth    | Sugerida    | Renovar token JWT (refresh token)             |
| `POST`   | `/auth/logout`       | Auth    | Sugerida    | Logout (invalidar token no Redis)             |

---

## 👥 Clientes `/customer`

| Método  | Endpoint                           | Acesso | Status      | Descrição                         |
|---------|------------------------------------|--------|-------------|-----------------------------------|
| `GET`   | `/customers/admin`                 | Admin  | Legada (v1) | Listar todos os clientes          |
| `GET`   | `/customer/admin/:id`              | Admin  | Legada (v1) | Ver detalhes de um cliente (admin)|
| `GET`   | `/customers/admin/:id/orders`      | Admin  | Legada (v1) | Pedidos de um cliente específico  |
| `GET`   | `/customers/search/:search`        | Admin  | Legada (v1) | Pesquisar clientes                |
| `GET`   | `/customers/search/:search/orders` | Admin  | Legada (v1) | Pesquisar pedidos de clientes     |
| `PUT`   | `/customer/admin/:id`              | Admin  | Legada (v1) | Atualizar cliente (admin)         |
| `DELETE`| `/customer/admin/:id`              | Admin  | Legada (v1) | Apagar cliente (admin)            |
| `GET`   | `/customer/:id`                    | Auth   | Legada (v1) | Ver próprio perfil de cliente     |
| `POST`  | `/customer/:id`                    | Auth   | Legada (v1) | Criar perfil de cliente           |
| `PUT`   | `/customer/:id`                    | Auth   | Legada (v1) | Atualizar perfil de cliente       |
| `DELETE`| `/customer/:id`                    | Auth   | Legada (v1) | Remover própria conta de cliente  |
| `GET`   | `/customer/:id/addresses`          | Auth   | Legada (v1) | Listar endereços do cliente       |
| `POST`  | `/customer/:id/address`            | Auth   | Legada (v1) | Adicionar endereço                |
| `DELETE`| `/customer/:addressId/address`     | Auth   | Legada (v1) | Remover endereço                  |
| `PUT`   | `/customer/:id/address/:addressId` | Auth   | Sugerida    | Atualizar endereço existente      |
| `GET`   | `/customer/:id/address/:addressId` | Auth   | Sugerida    | Ver um endereço específico        |

---

## 📦 Produtos `/product`

| Método   | Endpoint                         | Acesso  | Status      | Descrição                                      |
|----------|----------------------------------|---------|-------------|------------------------------------------------|
| `GET`    | `/products`                      | Público | Ativa       | Listar produtos disponíveis (paginado)         |
| `GET`    | `/product/:productId`            | Público | Ativa       | Ver detalhes de um produto                     |
| `POST`   | `/product`                       | Admin   | Ativa       | Criar produto (com upload de imagens)          |
| `PUT`    | `/product/:id`                   | Admin   | Ativa       | Atualizar produto (com upload de imagens)      |
| `GET`    | `/brands`                        | Público | Ativa       | Listar marcas disponíveis                      |
| `POST`   | `/brands`                        | Admin   | Ativa       | Criar nova marca                               |
| `DELETE` | `/product/:id`                   | Admin   | Legada (v1) | Apagar produto                                 |
| `GET`    | `/products/admin`                | Admin   | Legada (v1) | Listar todos os produtos (incl. indisponíveis) |
| `GET`    | `/product/admin/:id`             | Admin   | Legada (v1) | Detalhes de um produto (admin)                 |
| `PUT`    | `/product/image/:id`             | Admin   | Legada (v1) | Atualizar imagens do produto                   |
| `GET`    | `/products/search`               | Público | Ativa       | Pesquisar produtos por texto                   |
| `GET`    | `/product/:id/ratings`           | Público | Legada (v1) | Avaliações de um produto                       |
| `GET`    | `/product/:id/variations`        | Público | Legada (v1) | Variações de um produto                        |
| `GET`    | `/products/featured`             | Público | Sugerida    | Produtos em destaque/promoção                  |
| `GET`    | `/products/new`                  | Público | Sugerida    | Produtos recentemente adicionados              |
| `GET`    | `/products/category/:categoryId` | Público | Sugerida    | Produtos filtrados por categoria               |
| `GET`    | `/products/brand/:brandId`       | Público | Sugerida    | Produtos filtrados por marca                   |
| `PATCH`  | `/product/:id/stock`             | Admin   | Sugerida    | Ajustar stock de um produto                    |

---

## 🔀 Variações `/variation`

| Método   | Endpoint              | Acesso  | Status      | Descrição                      |
|----------|-----------------------|---------|-------------|--------------------------------|
| `GET`    | `/variations`         | Auth    | Legada (v1) | Listar todas as variações      |
| `GET`    | `/variation/:id`      | Público | Legada (v1) | Ver variação específica        |
| `POST`   | `/variation/:product` | Admin   | Legada (v1) | Criar variação para um produto |
| `PUT`    | `/variation/:id`      | Admin   | Legada (v1) | Atualizar variação             |
| `DELETE` | `/variation/:id`      | Admin   | Legada (v1) | Apagar variação                |

---

## 🗂️ Categorias `/category`

| Método   | Endpoint                              | Acesso  | Status   | Descrição                                                     |
|----------|---------------------------------------|---------|----------|---------------------------------------------------------------|
| `POST`   | `/category`                           | Admin   | Ativa    | Criar categoria                                               |✅
| `PUT`    | `/category/:categoryId`               | Admin   | Ativa    | Atualizar categoria                                           |✅
| `DELETE` | `/category/:id`                       | Admin   | Legada   | Apagar categoria                                              |✅
| `GET`    | `/categories/admin`                   | Admin   | Legada   | Listar categorias admin                                       |✅
| `GET`    | `/categories`                         | Público | Ativa    | Listar categorias publicas                                    |✅
| `GET`    | `/category/:id/products`              | Público | Legada   | Produtos de uma categoria                                     |✅
| `GET`    | `/category/:categoryId`               | Público | Ativa    | Ver detalhes de uma categoria                                 |✅

| `POST`   | `/subCategory`                        | Admin   | Ativa    | Criar subcategoria                                            |✅
| `PUT`    | `/subcategory/:subCategoryId`         | Admin   | Ativa    | Atualizar subcategoria                                        |✅
| `DELETE` | `/subcategory/:subCategoryId`         | Admin   | Sugerida | Apagar subcategoria                                           |✅
| `GET`    | `/subcategories/admin`                | Admin   | Ativa    | Listar subcategorias (filtra por categoria, nome, status)     |✅
| `GET`    | `/subcategory/:subCategoryId/admin`   | Admin   | Ativa    | Ver subcategoria específica                                   |✅
| `GET`    | `/subcategories`                      | Público | Ativa    | Listar subcategorias ativas (filtra por categoria, nome)      |✅
| `GET`    | `/subcategory/:subCategoryId`         | Público | Ativa    | Ver subcategoria específica                                   |✅

| `POST`   | `/sub_category`                       | Admin   | Ativa    | Criar sub-categoria                                           |✅
| `PUT`    | `/sub_category/:sub_categoryId`       | Admin   | Ativa    | Atualizar sub-categoria                                       |✅
| `DELETE` | `/sub_category/:sub_categoryId`       | Admin   | Sugerida | Apagar sub-categoria                                          |✅
| `GET`    | `/sub_categories/admin`               | Admin   | Ativa    | Listar sub-categorias(filtrar por subcategoria, nome, status) |✅
| `GET`    | `/sub_category/:sub_categoryId/admin` | Admin   | Ativa    | Ver sub-categoria específica                                  |✅
| `GET`    | `/sub_categories`                     | Público | Ativa    | Listar sub-categorias ativas (filtrar por subcategoria, nome) |✅
| `GET`    | `/sub_category/:sub_categoryId`       | Público | Ativa    | Ver sub-categoria específica se ativa                         |✅

---

## 🛒 Carrinho `/cart`

| Método   | Endpoint                           | Acesso   | Status   | Descrição                               |
|----------|------------------------------------|----------|----------|-----------------------------------------|
| `GET`    | `/carts/admin`                     | Admin    | Ativa    | Listar todos os carrinhos (admin)       |🔶
| `POST`   | `/cart`                            | Auth     | Ativa    | Criar carrinho                          |🔶
| `POST`   | `/cart/item`                       | Auth     | Ativa    | Adicionar produto ao carrinho           |✅
| `DELETE` | `/cart/product/:itemId`            | Auth     | Ativa    | Remover item do carrinho                |✅
| `POST`   | `/cart/details`                    | Opcional | Ativa    | Ver itens do carrinho                   |✅
| `GET`    | `/cart/total`                      | Opcional | Ativa    | Ver total do carrinho                   |✅
| `PATCH`  | `/cart/product/:itemId/:quantity`  | Auth     | Ativa    | Atualizar quantidade de item            |✅
| `POST`   | `/cart/checkout`                   | Auth     | Sugerida | Finalizar compra (gerar pedido)         |
| `DELETE` | `/cart`                            | Auth     | Sugerida | Esvaziar o carrinho inteiro             |
| `POST`   | `/cart/coupon`                     | Auth     | Sugerida | Aplicar cupão de desconto ao carrinho   |
| `DELETE` | `/cart/coupon`                     | Auth     | Sugerida | Remover cupão do carrinho               |

---

## 📋 Pedidos `/order`

| Método   | Endpoint                 | Acesso | Status      | Descrição                          |
|----------|--------------------------|--------|-------------|------------------------------------|
| `POST`   | `/order`                 | Auth   | Legada (v1) | Criar pedido                       |✅
| `GET`    | `/orders/:user`          | Auth   | Legada (v1) | Listar meus pedidos                |
| `GET`    | `/orders/:id`            | Auth   | Legada (v1) | Ver um pedido específico           |
| `PATCH`  | `/order/:id`             | Auth   | Legada (v1) | Cancelar pedido (cliente)          |
| `GET`    | `/orders/:id/cart`       | Auth   | Legada (v1) | Ver carrinho de um pedido          |
| `GET`    | `/orders/admin`          | Admin  | Legada (v1) | Listar todos os pedidos            |
| `GET`    | `/order/admin/:id`       | Admin  | Legada (v1) | Ver pedido específico (admin)      |
| `PATCH`  | `/order`                 | Admin  | Legada (v1) | Atualizar status do pedido (admin) |
| `DELETE` | `/order/admin/:id`       | Admin  | Legada (v1) | Cancelar/apagar pedido (admin)     |
| `GET`    | `/orders/admin/:id/cart` | Admin  | Legada (v1) | Ver carrinho de um pedido (admin)  |
| `GET`    | `/orders/status/:status` | Admin  | Sugerida    | Filtrar pedidos por status         |
| `GET`    | `/orders/date-range`     | Admin  | Sugerida    | Pedidos num intervalo de datas     |
| `PATCH`  | `/order/:id/status`      | Admin  | Sugerida    | Atualizar status de um pedido      |

---

## 💳 Pagamentos `/payment`

| Método | Endpoint                   | Acesso  | Status      | Descrição                                |
|--------|----------------------------|---------|-------------|------------------------------------------|
| `POST` | `/mpesaPay`                | Auth    | Legada (v1) | Pagar pedido via M-Pesa                  |
| `GET`  | `/payment/:orderId`        | Auth    | Sugerida    | Ver comprovativo de pagamento            |
| `GET`  | `/payments/admin`          | Admin   | Sugerida    | Listar todos os pagamentos               |
| `POST` | `/payment/callback`        | Público | Sugerida    | Webhook M-Pesa (callback de confirmação) |
| `GET`  | `/payment/status/:orderId` | Auth    | Sugerida    | Verificar estado do pagamento            |

---

## 🚚 Entregas `/delivery`

| Método | Endpoint                | Acesso  | Status      | Descrição                         |
|--------|-------------------------|---------|-------------|-----------------------------------|
| `POST` | `/delivery/:id`         | Auth    | Legada (v1) | Calcular custo de entrega         |
| `GET`  | `/delivery/:id`         | Auth    | Legada (v1) | Ver detalhes de uma entrega       |
| `PUT`  | `/delivery/:id`         | Admin   | Legada (v1) | Atualizar dados/status de entrega |
| `GET`  | `/deliveries/admin`     | Admin   | Sugerida    | Listar todas as entregas          |
| `PATCH`| `/delivery/:id/status`  | Admin   | Sugerida    | Atualizar status da entrega       |
| `GET`  | `/delivery/track/:code` | Público | Sugerida    | Rastrear entrega por código       |

---

## ⭐ Avaliações `/rating`

| Método   | Endpoint                     | Acesso  | Status      | Descrição                          |
|----------|------------------------------|---------|-------------|------------------------------------|
| `GET`    | `/ratings`                   | Público | Legada (v1) | Listar todas as avaliações         |
| `GET`    | `/rating/:id`                | Público | Legada (v1) | Ver avaliação específica           |
| `POST`   | `/rating/:productId`         | Auth    | Legada (v1) | Criar avaliação de produto         |
| `PATCH`  | `/rating/:id/delete`         | Admin   | Legada (v1) | Desativar avaliação (soft delete)  |
| `DELETE` | `/rating/:id/permanteDelete` | Admin   | Legada (v1) | Apagar avaliação permanentemente   |
| `PUT`    | `/rating/:id`                | Auth    | Sugerida    | Editar própria avaliação           |
| `GET`    | `/ratings/product/:productId`| Público | Sugerida    | Avaliações de um produto específico|

---

## 📊 Estatísticas `/statistics`

| Método | Endpoint                      | Acesso  | Status      | Descrição                                            |
|--------|-------------------------------|---------|-------------|------------------------------------------------------|
| `GET`  | `/estatistic`                 | Admin   | Legada (v1) | Resumo geral (vendas, pedidos, clientes)             |
| `GET`  | `/ordersByCustumer/:user`     | Público | Legada (v1) | Pedidos por cliente                                  |
| `GET`  | `/DataByMonth`                | Público | Legada (v1) | Dados agrupados por mês                              |
| `GET`  | `/recentOrders`               | Público | Legada (v1) | Pedidos recentes                                     |
| `GET`  | `/statistics/sales`           | Admin   | Sugerida    | Relatório de vendas (com filtros de data)            |
| `GET`  | `/statistics/products/top`    | Admin   | Sugerida    | Produtos mais vendidos                               |
| `GET`  | `/statistics/revenue`         | Admin   | Sugerida    | Receita total e por período                          |
| `GET`  | `/statistics/customers/new`   | Admin   | Sugerida    | Novos clientes por período                           |
| `GET`  | `/statistics/revenue-by-month`| Admin   | Sugerida    | Faturação total agregada por mês (Soma de Subtotais).|

---

## 🎁 Wishlist `/wishlist`

| Método  | Endpoint                       | Acesso | Status      | Descrição                    |
|---------|--------------------------------|--------|-------------|------------------------------|
| `GET`   | `/wishlist/:userId`            | Auth   | 💡 Sugerida | Ver lista de desejos         |
| `POST`  | `/wishlist/product/:productId` | Auth   | 💡 Sugerida | Adicionar produto à wishlist |
| `DELETE`| `/wishlist/product/:productId` | Auth   | 💡 Sugerida | Remover produto da wishlist  |

---

## 🎫 Cupões `/coupon`

| Método   | Endpoint            | Acesso | Status   | Descrição                        |
|----------|---------------------|--------|----------|----------------------------------|
| `GET`    | `/coupons/admin`    | Admin  | Sugerida | Listar todos os cupões           |
| `POST`   | `/coupon`           | Admin  | Sugerida | Criar cupão de desconto          |
| `PUT`    | `/coupon/:id`       | Admin  | Sugerida | Atualizar cupão                  |
| `DELETE` | `/coupon/:id`       | Admin  | Sugerida | Apagar cupão                     |
| `POST`   | `/coupon/validate`  | Auth   | Sugerida | Validar código de cupão          |

---

## 🔔 Notificações `/notification`

| Método   | Endpoint                  | Acesso | Status   | Descrição                         |
|----------|---------------------------|--------|----------|-----------------------------------|
| `GET`    | `/notifications/:userId`  | Auth   | Sugerida | Listar notificações do utilizador |
| `PATCH`  | `/notification/:id/read`  | Auth   | Sugerida | Marcar notificação como lida      |
| `DELETE` | `/notification/:id`       | Auth   | Sugerida | Apagar notificação                |
| `PATCH`  | `/notifications/read-all` | Auth   | Sugerida | Marcar todas como lidas           |

---

## 📈 Resumo

| Módulo       | Ativas (v2) | Legadas (v1) | Sugeridas |
|--------------|-------------|--------------|-----------|
| Utilizadores | 6           | 8            | 5         |
| Clientes     | 0           | 14           | 2         |
| Produtos     | 6           | 6            | 5         |
| Variações    | 0           | 5            | 0         |
| Categorias   | 12          | 3            | 2         |
| Carrinho     | 6           | 0            | 5         |
| Pedidos      | 0           | 10           | 3         |
| Pagamentos   | 0           | 1            | 4         |
| Entregas     | 0           | 3            | 3         |
| Avaliações   | 0           | 5            | 2         |
| Estatísticas | 0           | 4            | 4         |
| Wishlist     | 0           | 0            | 3         |
| Cupões       | 0           | 0            | 5         |
| Notificações | 0           | 0            | 4         |
| **TOTAL**    | **30**      | **59**       | **47**    |
