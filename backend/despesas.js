export async function despesas(app) {
  app.post('/despesas', async (req, reply) => {
    const { nome_despesa, tipo_despesa, valor, data, status } = req.body;

    await app.db_despesas.create({
      nome_despesa,
      tipo_despesa,
      valor,
      data,
      status
    });

    return reply.status(201).send();
  });

  app.get('/despesas', async (req, reply) => {
    const search = req.query.search;
    
    const despesas = await app.db_despesas.list(search);

    return despesas;
  });

   app.put('/despesas/:id', async (req, reply) => {
    const despesaid = req.params.id;

    await app.db_despesas.update(despesaid, {
        nome_despesa: req.body.nome_despesa,
        tipo_despesa: req.body.tipo_despesa,
        valor: req.body.valor,
        data: req.body.data,
        status: req.body.status
    });

  });

  app.delete('/despesas/:id', async (req, reply) => {
    const despesaid = req.params.id;

    await app.db_despesas.delete(despesaid);

    return reply.status(204).send();
  });
}