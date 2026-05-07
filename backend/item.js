export async function item(app) {
  app.post('/item', async (req, reply) => {
    const { nome_item, modelo, data_inscricao, categoria } = req.body;

    await app.db_itens.create({
      nome_item,
      modelo,
      data_inscricao,
      categoria
    });

    return reply.status(201).send();
  });

  app.get('/item', async (req, reply) => {
    const search = req.query.search;
    
    const items = await app.db_itens.list(search);

    return items;
  });

   app.put('/item/:id', async (req, reply) => {
    const itemid = req.params.id;

    await app.db_itens.update(itemid, {
        nome_item: req.body.nome_item,
        modelo: req.body.modelo,
        data_inscricao: req.body.data_inscricao,
        categoria: req.body.categoria
    });

  });

  app.delete('/item/:id', async (req, reply) => {
    const itemid = req.params.id;

    await app.db_itens.delete(itemid);

    return reply.status(204).send();
  });
}