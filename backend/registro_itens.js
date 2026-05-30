export async function registro(app) {
  app.post('/registro-itens', async (req, reply) => {
    const { tipo, data, valor } = req.body;

    await app.db_registro_item.create({
      tipo,
      data,
      valor
    });

    return reply.status(201).send();
  });

  app.get('/registro-itens', async (req, reply) => {
    const search = req.query.search;
    const listaRegistros = await app.db_registro_item.list(search);

    return listaRegistros;
  });

  app.put('/registro-itens/:id', async (req, reply) => {
    const registroid = req.params.id;
    const { tipo, data, valor } = req.body;

    await app.db_registro_item.update(registroid, {
      tipo,
      data,
      valor
    });

    return reply.status(204).send();
  });

  app.delete('/registro-itens/:id', async (req, reply) => {
    const registroid = req.params.id;

    await app.db_registro_item.delete(registroid);

    return reply.status(204).send();
  });
}