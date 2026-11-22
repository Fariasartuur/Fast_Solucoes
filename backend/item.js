// Converte o preço de custo recebido do frontend:
// - campo ausente  -> undefined (não altera no UPDATE)
// - vazio / null   -> null (peça sem preço cadastrado)
// - número/string  -> número com 2 casas
// Retorna NaN quando o valor é inválido ou negativo.
function parsePrecoCusto(valor) {
  if (valor === undefined) return undefined;
  if (valor === null || valor === '') return null;

  const numero = Number(String(valor).replace(',', '.'));
  if (!Number.isFinite(numero) || numero < 0) return NaN;

  return Math.round(numero * 100) / 100;
}

export async function item(app) {
  app.post('/item', async (req, reply) => {
    const { nome_item, modelo, data_inscricao, categoria } = req.body;
    const preco_custo = parsePrecoCusto(req.body.preco_custo);

    if (Number.isNaN(preco_custo)) {
      return reply.status(400).send({ message: 'Preço de custo inválido.' });
    }

    await app.db_itens.create({
      nome_item,
      modelo,
      data_inscricao,
      categoria,
      preco_custo: preco_custo ?? null
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
    const preco_custo = parsePrecoCusto(req.body.preco_custo);

    if (Number.isNaN(preco_custo)) {
      return reply.status(400).send({ message: 'Preço de custo inválido.' });
    }

    await app.db_itens.update(itemid, {
        nome_item: req.body.nome_item,
        modelo: req.body.modelo,
        data_inscricao: req.body.data_inscricao,
        categoria: req.body.categoria,
        preco_custo
    });

    return reply.status(204).send();
  });

  app.delete('/item/:id', async (req, reply) => {
    const itemid = req.params.id;

    try {
      await app.db_itens.delete(itemid);
    } catch (error) {
      // Peça já usada em algum serviço (tb_servico_item com ON DELETE RESTRICT)
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return reply.status(409).send({
          message: 'Esta peça já foi usada em um ou mais serviços e não pode ser excluída.'
        });
      }
      throw error;
    }

    return reply.status(204).send();
  });
}
