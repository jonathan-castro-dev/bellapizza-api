<h1 align="center">BellaPizza API</h1>

<p align="center">
  <a href="#tech">Tecnologias</a> • 
  <a href="#installation">Instalação</a> • 
  <a href="#routes">Rotas da API</a>
</p>

<p align="center">
  <strong>O BellaPizza API foi criado para fornecer as rotas necessárias para o funcionamento das aplicações BellaPizzaClient e BellaPizzaAdmin.</strong>
</p>

<h2 id="tech">💻 Tecnologias</h2>

Este projeto foi desenvolvido com as seguintes tecnologias:

- [nodejs](https://nodejs.org/pt-br)
- [typescript](https://www.typescriptlang.org/)
- [fastify](https://fastify.dev/)
- [zod](https://zod.dev/)
- [date-fns](https://date-fns.org/)
- [prisma](https://www.prisma.io/)
- postgres

<h2 id="installation">👷 Instalação</h2>

<h3>Pré-requisitos</h3>

Para executar o projeto, é necessário ter as seguintes ferramentas instaladas no seu computador:

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/pt/installation#usando-npm)

<h3>Clonando o repositório</h3>

Execute o comando abaixo em um terminal para clonar o projeto.

```bash
git clone https://github.com/jonathan-castro-dev/bellapizza-api.git
```

<h3>Instalando as dependências do projeto</h3>

Ainda no terminal, execute o comando abaixo para instalar as dependências necessárias para o funcionamento do projeto.

```bash
pnpm install
```

<h3>Configurando as variáveis de ambiente</h3>

Crie o arquivo de configuração ```.env``` na raiz do projeto e adicione as variáveis abaixo com as suas credenciais.

```yaml
FRONTEND_LOCAL_URL={URL_SEU_APP_LOCAL}
FRONTEND_CLIENT_PROD_URL={URL_SEU_APP_EM_PRODUCAO}
FRONTEND_ADMIN_PROD_URL={URL_SEU_APP_EM_PRODUCAO}
DATABASE_URL={URL_CONEXAO_BANCO_POSTGRES}
```

<h3>Começando</h2>

Em seguida insira o comando abaixo no terminal para iniciar a aplicação:

```bash
pnpm run dev
```

<h2 id="routes">📍 Rotas da API</h2>

Abaixo estão as rotas da API com suas definições, seguido de exemplos do que é esperado no request body e recebido no response.

| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>GET /products</kbd>     | Obter todos os produtos cadastrados
| <kbd>GET /orders</kbd>     | Obter todos os pedidos criados
| <kbd>GET /orders/today</kbd>     | Obter a quantidade de pedidos realizados no dia
| <kbd>GET /orders/revenue</kbd>     | Obter a receita dos pedidos realizados no mês
| <kbd>POST /orders</kbd>     | Criar um novo pedido
| <kbd>PATCH /orders/:id/status</kbd>     | Alterar status de um pedido para 'pronto'

<h3>GET /products</h3>

**RESPONSE**
```json
{
  "id": "04def657-b435-44fd-83d0-12bce0a17926",
  "name": "Brownie com Sorvete",
  "description": "Brownie quente de chocolate meio amargo com bola de sorvete…",
  "category": "sobremesas",
  "price": 19.9
}
```

<h3>GET /orders</h3>

**RESPONSE**
```json
{
  "id": "1a36a7d8-69ac-4d7d-b9b7-04eb0a6244de",
  "clientName": "Jonathan Castro",
  "address": "Rua Santos Dummont, 822",
  "items": [
    {
      "quantity": 2,
      "productId": "4fa57f13-0e78-46a9-9889-21a3618d3e49",
      "productName": "Pizza Quatro Queijos"
    }
  ]
}
```

<h3>GET /orders/today</h3>

**RESPONSE**
```json
{
  "ordersToday": 12
}
```

<h3>GET /orders/revenue</h3>

**RESPONSE**
```json
{
  "total": 4700.00
}
```

<h3>POST /orders</h3>

**REQUEST**
```json
{
  "clientName": "Jonathan Castro",
  "telephone": "081998765432",
  "orderType": "delivery",
  "deliveryAddress": {
    "zipCode": "52637001",
    "street": "Rua Armando Queiroz",
    "number": "316",
    "complement": "Casa"
  },
  "paymentMethod": "credit_card",
  "cart": {
    "items": [
      {
        "productId": "17237bee-34c7-496f-8638-0226c333be1d",
        "quantity": 3,
        "unitPrice": 7.9
      }
    ],
    "totalPrice": 385.20
  },
}
```

<h2>📝 Licença</h2>

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/jonathan-castro-dev/bellapizza-api/blob/main/LICENSE) para mais detalhes.

---

:wave: [Entre em contato!](https://www.linkedin.com/in/jonathan-castro-dev/)

