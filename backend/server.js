import {fastify} from 'fastify';

import { Database_itens } from './database_itens.js';

import { Database_estoque } from './database_estoque.js';

import { Database_despesas } from './database_despesas.js';

import { estoque } from "./estoque.js";

import { item } from './item.js';

import { despesas} from './despesas.js';

const server = fastify();   

const database_itens = new Database_itens();

const database_estoque = new Database_estoque();

const database_despesas = new Database_despesas();

server.decorate('db_despesas', database_despesas);

server.decorate('db_itens', database_itens); 

server.decorate('db_estoque', database_estoque);

server.register(estoque);

server.register(item);

server.register(despesas);

server.listen({ port: 3333 }).then(() => {
  console.log("Servidor rodando!");
});

