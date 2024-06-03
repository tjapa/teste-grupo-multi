# Teste Backend Grupo Multi

Teste de backend do Grupo Multi feito em NodeJS.

## Requisitos

- NodeJS v20
- Docker
- PostgreSQL
- Redis

## Executando a API

### Via Terminal

```sh
npm install
npm run build
# caso queira rodar o PostgreSQL e Redis via Docker
docker compose -f docker-compose-test.yml up
npm run db:generate-migrations
npm run db:migrate
npm run start
```

### Via Docker

```sh
docker compose -f docker-compose.yml up
npm install
npm run db:generate-migrations
npm run db:migrate
```

## Executando os Testes

### Todos os testes

```sh
docker compose -f docker-compose-test.yml up
npm install
npm run db:generate-migrations
npm run db:migrate
npm run test
```

### Apenas testes unitários no modo watch

```sh
docker compose -f docker-compose-test.yml up
npm install
npm run db:generate-migrations
npm run db:migrate
npm run test:unit
```

### Apenas testes de integração no modo watch

```sh
docker compose -f docker-compose-test.yml up
npm install
npm run db:generate-migrations
npm run db:migrate
npm run test:integration
```

## Detalhes de Implementação

Os endpoints foram criados como se fossem ser utilizados diretamente pelos clientes.
Para realizar o acesso aos itens do banco de dados sempre é utilizado também o customerId para evitar o acesso não autorizado.
O customerId utilizado é o parâmetro da URL, pois não temos autenticação. Numa aplicação com autenticação, o valor do customerId seria obtido de um token no request.

### Criação de uma troca expressa

A criação de uma troca expressa é feita passando os dados: invoiceId, productId, customerId e customerAddressId.
A troca expressa criada irá ter os valores de endereço (não o id) do Customer Address passado.
A troca expressa será criada com o status "processing".

### Edição de uma troca expressa

Os únicos dados de uma troca expressa que podem ser editadas são o produto e o endereço, e para tal, é necessário que a troca ainda esteja com status "processing".

### Remoção de uma troca expressa

A remoção de uma troca expressa é feita passando os dados: expressExchangeId e customerId.
Uma troca expressa só pode ser removida se estiver com o status "processing".

## Observações

- O cadastro de alguns dados pode ser feito com o comando `npm run db:seed`. Ao rodar os testes, as tabelas são zeradas.
- Ficou faltando um endpoint para obter todas as trocas expressas de um cliente.

## Endpoints

A documentação no Swagger pode ser acessada em: http://localhost:3000/swagger

### Exemplos

#### GET /api/customers/{customerId}/express-exchanges/{expressExchangeId}

Resposta:

```json
{
  "id": "2494fed5-20d7-47f7-bd56-85be830afbc2",
  "customerId": "3700b2e3-35a1-4bc5-99ea-21454f235e56",
  "invoiceId": "ddbb4978-aab9-4f3e-b1ef-8d31ad97c45f",
  "productId": "f534ac80-6132-48c7-b73d-2e900c7aaf03",
  "status": "processing",
  "streetAddress": "Rua A",
  "streetAddressLine2": "Apto 1",
  "houseNumber": "10",
  "district": "Bairro A",
  "city": "Cidade A",
  "state": "Estado A",
  "createdAt": "2024-06-03T21:25:51.500Z",
  "updatedAt": "2024-06-03T21:25:51.500Z"
}
```

#### POST /api/customers/{customerId}/express-exchanges

Body:

```json
{
  "invoiceId": "some_id",
  "productId": "some_id",
  "customerAddressId": "some_id"
}
```

Resposta:

```json
{
  "id": "2494fed5-20d7-47f7-bd56-85be830afbc2",
  "customerId": "3700b2e3-35a1-4bc5-99ea-21454f235e56",
  "invoiceId": "ddbb4978-aab9-4f3e-b1ef-8d31ad97c45f",
  "productId": "f534ac80-6132-48c7-b73d-2e900c7aaf03",
  "status": "processing",
  "streetAddress": "Rua A",
  "streetAddressLine2": "Apto 1",
  "houseNumber": "10",
  "district": "Bairro A",
  "city": "Cidade A",
  "state": "Estado A",
  "createdAt": "2024-06-03T21:25:51.500Z",
  "updatedAt": "2024-06-03T21:25:51.500Z"
}
```

#### DELETE /api/customers/{customerId}/express-exchanges/{expressExchangeId}

Resposta:

```json
{
  "id": "2494fed5-20d7-47f7-bd56-85be830afbc2",
  "customerId": "3700b2e3-35a1-4bc5-99ea-21454f235e56",
  "invoiceId": "ddbb4978-aab9-4f3e-b1ef-8d31ad97c45f",
  "productId": "f534ac80-6132-48c7-b73d-2e900c7aaf03",
  "status": "processing",
  "streetAddress": "Rua A",
  "streetAddressLine2": "Apto 1",
  "houseNumber": "10",
  "district": "Bairro A",
  "city": "Cidade A",
  "state": "Estado A",
  "createdAt": "2024-06-03T21:25:51.500Z",
  "updatedAt": "2024-06-03T21:25:51.500Z"
}
```

#### PATCH /api/customers/{customerId}/express-exchanges/{expressExchangeId}

Body:

```json
{
  "productId": "some_id",
  "customerAddressId": "some_id"
}
```

Resposta:

```json
{
  "id": "2494fed5-20d7-47f7-bd56-85be830afbc2",
  "customerId": "3700b2e3-35a1-4bc5-99ea-21454f235e56",
  "invoiceId": "ddbb4978-aab9-4f3e-b1ef-8d31ad97c45f",
  "productId": "f534ac80-6132-48c7-b73d-2e900c7aaf03",
  "status": "processing",
  "streetAddress": "Rua A",
  "streetAddressLine2": "Apto 1",
  "houseNumber": "10",
  "district": "Bairro A",
  "city": "Cidade A",
  "state": "Estado A",
  "createdAt": "2024-06-03T21:25:51.500Z",
  "updatedAt": "2024-06-03T21:28:51.500Z"
}
```
