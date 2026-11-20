# Fast Soluções

Sistema desenvolvido para gestão de manutenção e controle de equipamentos de academia, criado como parte do Projeto Integrador do curso de Engenharia da Computação.

## Objetivo

Esse projeto tem como objetivo facilitar a gestão de manutenção e controle de equipamentos de academia, permitindo o cadastro de itens, estoque, despesas e serviços.

## Contexto Acadêmico

Este projeto foi desenvolvido como parte da disciplina de Projeto Integrador do curso de Engenharia da Computação, com o objetivo de aplicar na prática conceitos de desenvolvimento web, banco de dados, arquitetura cliente-servidor e trabalho em equipe.

## Tecnologias Utilizadas

- React
- Vite
- HTML
- CSS
- JSX
- Fastify
- MySql

## Estrutura do Projeto

```text
Fast_Solucoes/
│
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── usuarios.js
│   ├── servico.js
│   ├── servico_item.js
│   ├── estoque.js
│   ├── item.js
│   ├── despesas.js
│   ├── registro_itens.js
│   ├── prestador.js
│   ├── pagamento.js
│   ├── database_usuarios.js
│   ├── database_servico.js
│   ├── database_servico_item.js
│   ├── database_estoque.js
│   ├── database_itens.js
│   ├── database_despesas.js
│   ├── database_registro.js
│   ├── database_prestador.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── docs/
│   ├── fontes/
│   ├── Documentacao_Banco_de_Dados.pdf
│   ├── Documentacao_Alteracoes_Banco_de_Dados.pdf
│   └── Documentacao_Melhorias.pdf
│
├── .gitignore
└── README.md
```

## Organização do Projeto

### Backend

Responsável pelas regras de negócio, comunicação com o banco de dados e disponibilização da API.

- `server.js` → inicialização do servidor.
- `db.js` → configuração da conexão com o banco de dados.
- `usuarios.js` → gerenciamento de usuários.
- `servico.js` → gerenciamento de serviços.
- `estoque.js` → controle de estoque.
- `despesas.js` → controle financeiro e despesas.
- `item.js` → gerenciamento de itens.
- `registro_itens.js` → registro de movimentações de itens.

### Frontend

Interface do sistema desenvolvida com React e Vite.

- `components/` → componentes reutilizáveis.
- `pages/` → páginas do sistema.
- `layout/` → estrutura visual compartilhada.
- `hooks/` → hooks personalizados.
- `store/` → gerenciamento de estado.
- `constants/` → constantes utilizadas pela aplicação.

## Como Executar o Projeto

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js
- npm
- Banco de dados utilizado pelo projeto

### 1. Clonar Repositorio

```
git clone https://github.com/Leandrofs12/Fast_Solucoes
```

```
cd Fast_solucoes
```

### 2. Configurar o backend:

#### 2.1 Acesse a pasta do backend:

```
cd backend
```

#### 2.2 Instale as Dependencias:

```
npm install
```

#### 2.3 Crie e configure o arquivo .env com as informações do banco de dados:

```
DB_HOST=localhost
DB_DATABASE=sua_database
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=3306 (porta padrão do MySql)
```

#### 2.4 Inicie o servidor:

```
node server.js
```

#### 2.5 O Backend ficara disponivel em:

```
http://localhost:3333
```

### 3. Configurar o Frontend

#### 3.1 Abra outro terminal e acesse a pasta frontend:

```
cd frontend
```

#### 3.2 Instale as dependencias:

```
npm install
```

#### 3.3 Execute a aplicação:

```
npm run dev
```

#### 3.4 O Frontend ficará disponivel em:

```
http://localhost:5173
```

### 4. Utilização

Com o backend e o frontend em execução, acesse a aplicação pelo navegador utilizando o endereço informado pelo Vite.

## Funcionalidades

- Cadastro de usuários
- Cadastro de serviços
- Cadastro de itens
- Controle de estoque
- Controle de despesas
- Registro de movimentações de itens
- Busca de registros utilizando o parâmetro `search`

## Banco de dados

[Documentação do Banco de Dados](docs/Documentacao_Banco_de_Dados.pdf)

## API REST

A API do sistema foi desenvolvida utilizando Fastify e disponibiliza operações CRUD para gerenciamento de usuários, serviços, estoque, itens, despesas e registros.

> URL Local = `http://localhost:3333`

### Usuarios

| Método | Endpoint | Descrição |
|---------|---------|---------|
| POST | `/usuarios` | Cadastra um novo usuário
| GET | `/usuarios` | Lista os usuários cadastrados
| PUT | `/usuarios/:id` | Atualiza um usuário
| DELETE | `/usuarios/:id` | Remove um usuário

### Serviços

| Método | Endpoint | Descrição |
|---------|---------|---------|
| POST | `/servico` | Cadastra um novo serviço
| GET | `/servico` | Lista os serviços cadastrados
| PUT | `/servico/:id` | Atualiza um serviço
| DELETE | `/servico/:id` | Remove um serviço

### Itens

| Método | Endpoint | Descrição |
|---------|---------|---------|
| POST | `/item` | Cadastra um novo item
| GET | `/item` | Lista os itens cadastrados
| PUT | `/item/:id` | Atualiza um item
| DELETE | `/item/:id` | Remove um item

### Estoque

| Método | Endpoint | Descrição |
|---------|---------|---------|
| POST | `/estoque` | Adiciona um item ao estoque
| GET | `/estoque` | Lista os itens em estoque
| PUT | `/estoque/:id` | Atualiza um registro de estoque
| DELETE | `/estoque/:id` | Remove um registro de estoque

### Despesas

| Método | Endpoint | Descrição |
|---------|---------|---------|
| POST | `/despesas` | Cadastra uma despesa
| GET | `/despesas` | Lista as despesa cadastradas
| PUT | `/despesas/:id` | Atualiza uma despesa
| DELETE | `/despesas/:id` | Remove uma despesa

### Registro de Itens

| Método | Endpoint | Descrição |
|---------|---------|---------|
| POST | `/registro-itens` | Cria um registro de movimentação
| GET | `/registro-itens` | Lista os registros cadastrados
| PUT | `/registro-itens/:id` | Atualiza um registro
| DELETE | `/registro-itens/:id` | Remove um registro

> Os endpoints GET suportam o parâmetro opcional `search` para filtragem de resultados.

## Autores

- [Leandro Felix da Silva](https://github.com/Leandrofs12)
- [Artur Farias Salomão](https://github.com/Fariasartuur)
- [Mateus Gustavo de Oliveira](https://github.com/MateusGustavo0514)
- [Octávio França Koch](https://github.com/ofrancakoch)
- [Ryan Gabriel da Silva](https://github.com/RyanS017)

## Licença

Projeto desenvolvido para fins acadêmicos como parte da disciplina de Projeto Integrador do curso de Engenharia da Computação.

Este repositório possui caráter educacional e foi criado para aplicação prática dos conhecimentos adquiridos durante a graduação.
