import {fastify} from 'fastify';

import {DatabaseMemory} from './database-memory.js';

const server = fastify();   

const database = new DatabaseMemory();

server.get('/', () => {
    return 'Just sai hi bitch!';
});

server.get('/home', () => {
    return 'Hello, World!';
});

server.post('/stock', (req, reply) => {

    const { Name, Model, Date, Category } = req.body;

    database.create({
        Name,
        Model,
        Date,
        Category
    });

    return reply.status(201).send();

});

server.get('/stock', () => {
    const item = database.list();

    return item;
});

server.put('/stock/:id', (req, reply) => {
    const itemid = req.params.id;

    const updatedItem = database.update(itemid, {
        Name: req.body.Name,
        Model: req.body.Model,
        Date: req.body.Date,
        Category: req.body.Category
    });

    return reply.status(204).send();
});

server.delete('/stock/:id', (req, reply) => {
    const itemid = req.params.id;

    database.delete(itemid);

    return reply.status(204).send();
});

server.get('/financeiro', () => {
    return 'Hello Bussiness world!';
});

server.listen({port: 3333,})