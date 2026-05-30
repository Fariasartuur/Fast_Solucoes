export async function usuarios(app) {
  app.post('/usuarios', async (req, reply) => {
    const { cnpj, nome, data_registro, email, senha } = req.body;

    await app.db_usuarios.create({
      cnpj,
      nome,
      data_registro,
      email,
      senha
    });

    return reply.status(201).send();
  });

  app.get('/usuarios', async (req, reply) => {
    const search = req.query.search;
    const listaUsuarios = await app.db_usuarios.list(search);

    return listaUsuarios;
  });

  app.put('/usuarios/:id', async (req, reply) => {
    const usuarioid = req.params.id;
    const { cnpj, nome, data_registro, email, senha } = req.body;

    await app.db_usuarios.update(usuarioid, {
      cnpj,
      nome,
      data_registro,
      email,
      senha
    });

    return reply.status(204).send();
  });

  app.delete('/usuarios/:id', async (req, reply) => {
    const usuarioid = req.params.id;

    await app.db_usuarios.delete(usuarioid);

    return reply.status(204).send();
  });
}