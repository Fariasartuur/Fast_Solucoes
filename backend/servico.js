export async function servico(app) {
  app.post('/servico', async (req, reply) => {
    const { contratante, data, valor, tipo } = req.body;

    await app.db_servico.create({
      contratante,
      data,
      valor,
      tipo
    });

    return reply.status(201).send();
  });

  app.get('/servico', async (req, reply) => {
    const search = req.query.search;
    
    const servicos = await app.db_servico.list(search);

    return reply.status(200).send(servicos);
  });

  app.put('/servico/:id', async (req, reply) => {
    const servicoid = req.params.id;
    const { contratante, data, valor, tipo } = req.body;

    await app.db_servico.update(servicoid, {
        contratante,
        data,
        valor,
        tipo
    });

    return reply.status(204).send();
  });

  app.delete('/servico/:id', async (req, reply) => {
    const servicoid = req.params.id;

    await app.db_servico.delete(servicoid);

    return reply.status(204).send();
  });
}