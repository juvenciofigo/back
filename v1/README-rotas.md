# Documentação de Rotas da API

Este documento detalha todas as rotas (endpoints) disponíveis no projeto back-end da LojaJVC (v1), organizadas por módulo.

---

## 👥 Usuários (`/routes/users.js`)

**Administrador**
- `GET /users/admin` - Obter todos os usuários.
- `GET /user/:id/admin` - Obter detalhes de um usuário específico.
- `PUT /user/:id/admin` - Atualizar informações de um usuário.
- `DELETE /user/:id/ admin` - Deletar um usuário.

**Cliente/Visitante**
- `GET /visitaReg` - Registro de visita.
- `POST /signIn` - Autenticação de usuário (Login).
- `POST /signUp` - Criação de usuário (Registro).
- `GET /user/:id` - Obter detalhes de um usuário específico.
- `PUT /user/:id` - Atualizar informações do próprio usuário.
- `DELETE /user/:id` - Excluir a própria conta.

**Recuperação de Senha**
- `GET /showRecovery` - Exibir formulário de recuperação.
- `POST /createRecovery` - Iniciar o processo de recuperação de senha.
- `GET /recoverPass` - Tela de completar de recuperação.
- `POST /recoverPass` - Concluir recuperação de senha.

---

## 🛒 Carrinho (`/routes/cart.js`)

- `GET /carts/admin` - Listar todos os carrinhos (Admin).
- `POST /carts/:user_id` - Criar um carrinho.
- `POST /cart/:userId/prices` - Obter detalhes de preços do carrinho.
- `POST /cart/:userId/products` - Obter produtos detalhados no carrinho.
- `POST /cart/:userId/addProduct` - Adicionar produto ao carrinho.
- `PUT /cart/:userId/update/:item/:quantity` - Atualizar quantidade de um produto.
- `DELETE /cart/:userId/remove/:item` - Remover produto do carrinho.

---

## 🏷️ Categorias (`/routes/categorys.js`)

**Administrador**
- `POST /category` - Criar categoria.
- `POST /subCategory` - Criar subcategoria.
- `POST /sub_category` - Criar sub-subcategoria.
- `PUT /category/:id` - Atualizar categoria.
- `DELETE /category/:id/` - Remover categoria.
- `GET /categories` - Obter todas as categorias.
- `GET /categories/unavailable` - Obter categorias indisponíveis.
- `PUT /category/:id/products` - Atualizar produtos de uma categoria.

**Cliente/Público**
- `GET /categories/all` - Obter categorias disponíveis.
- `GET /category/:id` - Ver detalhes da categoria.
- `GET /category/:id/protucts` - Ver produtos de uma categoria.

---

## 🧑‍🤝‍🧑 Clientes (`/routes/customers.js`)

**Administrador**
- `GET /customers/admin` - Obter todos os clientes.
- `GET /customer/admin/:id` - Obter cliente específico.
- `PUT /customer/admin/:id` - Atualizar dados do cliente.
- `DELETE /customer/admin/:id` - Deletar um cliente.
- `GET /customers/search/:search` - Pesquisar clientes.
- `GET /customers/search/:search/orders` - Pesquisar dentro dos pedidos dos clientes.
- `GET /customers/admin/:id/orders` - Pedidos de um cliente específico.

**Cliente**
- `GET /customer/:id` - Ver próprio perfil.
- `POST /customer/:id` - Criar perfil de cliente após registro.
- `PUT /customer/:id` - Atualizar próprio perfil.
- `DELETE /customer/:id` - Remover próprio perfil.
- `GET /customer/:id/addresses` - Todos os endereços salvos.
- `POST /customer/:id/address/` - Adicionar novo endereço.
- `DELETE /customer/:addressId/address/` - Remover endereço.

---

## 🚚 Entregas (`/routes/deliveries.js`)

- `GET /delivery/:id` - Visualizar entrega.
- `POST /delivery/:id` - Calcular valor de entrega.
- `PUT /delivery/:id` - Atualizar detalhes da entrega.

---

## 📦 Pedidos (`/routes/orders.js`)

**Administrador**
- `GET /orders/admin` - Todos os pedidos da loja.
- `GET /order/admin/:id` - Ver um pedido detalhado.
- `PATCH /order` - Atualizar status do pedido.
- `DELETE /order/admin/:id` - Cancelar um pedido.
- `GET /orders/admin/:id/cart` - Detalhes do carrinho vinculado ao pedido.

**Cliente**
- `GET /orders/:user` - Todos os meus pedidos.
- `GET /orders/:id` - Um pedido meu.
- `POST /order` - Criar (finalizar) pedido.
- `PATCH /order/:id` - Atualizar pedido (cancelar etc).
- `GET /orders/:id/cart` - Carrinho do meu pedido.

---

## 💳 Pagamentos (`/routes/payments.js`)

- `POST /mpesaPay` - Processar pagamento via M-Pesa.

---

## 🛍️ Produtos (`/routes/products.js`)

**Administrador**
- `POST /product` - Criar produto.
- `PUT /product/:id` - Atualizar detalhes do produto.
- `PUT /product/image/:id` - Atualizar imagens de um produto.
- `DELETE /product/:id` - Remover produto.
- `GET /products/admin` - Todos os produtos.
- `GET /product/admin/:id` - Produto específico.
- `POST /brands/admin/` - Criar nova marca.
- `GET /brands/admin/` - Listar todas as marcas.

**Público/Cliente**
- `GET /products` - Listar produtos disponíveis.
- `GET /product/:id` - Ver detalhes do produto.
- `GET /products/search/` - Buscar produtos.
- `GET /product/:id/ratings` - Avaliações do produto.
- `GET /product/:id/variations` - Ver variações do produto.

---

## ⭐ Avaliações (`/routes/ratings.js`)

- `GET /ratings` - Obter avaliações gerais.
- `GET /rating/:id` - Obter avaliação por ID.
- `POST /rating/:productId` - Criar uma avaliação.
- `PATCH /rating/:RatingId/delete` - Inativar/Deletar avaliação logicamente (Admin).
- `DELETE /rating/:id/permanteDelete` - Remoção permanente (Admin).

---

## 📊 Estatísticas (`/routes/statistics.js`)

- `GET /estatistic` - Visão superficial das estatísticas (Admin).
- `GET /ordersByCustumer/:user` - Pedidos por cliente.
- `GET /DataByMonth/` - Dados agrupados por mês.
- `GET /recentOrders/` - Últimos pedidos recentes.

---

## 🎨 Variações de Produtos (`/routes/variations.js`)

- `GET /variations` - Obter todas as variações.
- `GET /variation/:id` - Ver uma variação específica.
- `POST /variation/:product` - Criar variação de um produto (Admin).
- `PUT /variation/:id` - Atualizar variação (Admin).
- `DELETE /variation/:id` - Deletar variação (Admin).

---
> Nota: Os validadores e modulações de `require` com autenticação estão mapeados em cada endpoint. Rotas identificadas como "Admin" exigem token de permissão elevado.
