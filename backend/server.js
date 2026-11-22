import {fastify} from 'fastify';
import cors from '@fastify/cors';

import { Database_itens } from './database_itens.js';

import { Database_estoque } from './database_estoque.js';

import { Database_despesas } from './database_despesas.js';

import { Database_usuarios } from './database_usuarios.js';

import { Database_registro } from './database_registro.js';

import { Database_servico } from './database_servico.js';

import { estoque } from "./estoque.js";

import { item } from './item.js';

import { despesas } from './despesas.js';

import { usuarios } from './usuarios.js';

import { registro } from './registro_itens.js';

import { servico } from './servico.js';

import { Database_servico_item } from './database_servico_item.js';

import { servicoItem } from './servico_item.js';

import { Database_prestador } from './database_prestador.js';

import { prestador } from './prestador.js';

const server = fastify();

const database_servico_item = new Database_servico_item();

const database_itens = new Database_itens();

const database_estoque = new Database_estoque();

const database_despesas = new Database_despesas();

const database_usuarios = new Database_usuarios();

const database_registro = new Database_registro();

const database_servico = new Database_servico();

server.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.decorate('db_despesas', database_despesas);

server.decorate('db_itens', database_itens); 

server.decorate('db_estoque', database_estoque);

server.decorate('db_usuarios', database_usuarios);

server.decorate('db_registro', database_registro);

server.decorate('db_servico', database_servico);

server.decorate('db_servico_item', database_servico_item);

server.decorate('db_prestador', new Database_prestador());

server.register(estoque);

server.register(item);

server.register(despesas);

server.register(usuarios);

server.register(registro);

server.register(servico);

server.register(servicoItem);
server.register(prestador);

const PORT = Number(process.env.PORT) || 3333;

server.listen({
  port: PORT,
  host: '0.0.0.0'
}).then(() => {
  console.log(`Servidor rodando na porta ${PORT}`);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
