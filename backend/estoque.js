export async function estoque(app) {
  app.post('/estoque', async (req, reply) => {
    const { id_item, quantidade } = req.body;

    await app.db_estoque.create({
      id_item,
      quantidade
    });

    return reply.status(201).send();
  });

  app.get('/estoque', async (req, reply) => {
    const search = req.query.search;
    const items = await app.db_estoque.list(search);

    return items
  });

  app.put('/estoque/:id', async (req, reply) => {
    const itemid = req.params.id;

    await app.db_estoque.update(itemid, {
        id_item: req.body.id_item,
        quantidade: req.body.quantidade 
    });

    return reply.status(204).send();
  });

  app.delete('/estoque/:id', async (req, reply) => {
    const itemid = req.params.id;

    await app.db_estoque.delete(itemid);

    return reply.status(204).send();
  });
}