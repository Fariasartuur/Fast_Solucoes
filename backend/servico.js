import { ServicoItemError } from './database_servico_item.js';
import { parseInteiroPositivo } from './servico_item.js';
import { parseData, parsePagamento } from './pagamento.js';

export async function servico(app) {
  // Cria um serviço. Aceita opcionalmente:
  //  - "pecas": [{ id_item, quantidade }], registradas e baixadas do estoque junto com o serviço;
  //  - "status": "Pago" | "Pendente" (padrão "Pendente") e "data_pagamento" (padrão: hoje, se Pago).
  app.post('/servico', async (req, reply) => {
    const { contratante, valor, tipo } = req.body;
    const data = parseData(req.body.data, 'data');
    const pagamento = parsePagamento(req.body, data, { statusPadrao: 'Pendente' });

    const pecasRecebidas = req.body.pecas ?? [];
    if (!Array.isArray(pecasRecebidas)) {
      throw new ServicoItemError(400, 'O campo "pecas" deve ser uma lista.');
    }
    const pecas = pecasRecebidas.map((peca) => ({
      id_item: parseInteiroPositivo(peca?.id_item, 'id_item'),
      quantidade: parseInteiroPositivo(peca?.quantidade, 'quantidade')
    }));

    const id_registro_servico = await app.db_servico.create({
      contratante,
      data,
      valor,
      tipo,
      ...pagamento
    }, pecas);

    return reply.status(201).send({ id_registro_servico });
  });

  app.get('/servico', async (req, reply) => {
    const search = req.query.search;

    const servicos = await app.db_servico.list(search);

    return reply.status(200).send(servicos);
  });

  // Um serviço específico (usado no recibo/orçamento).
  app.get('/servico/:id', async (req) => {
    const servicoid = parseInteiroPositivo(req.params.id, 'id');
    const servico = await app.db_servico.getById(servicoid);
    if (!servico) throw new ServicoItemError(404, 'Serviço não encontrado.');
    return servico;
  });

  // Edita os dados do serviço. Não altera o status de pagamento (para isso
  // existe a rota /servico/:id/pagamento), evitando apagar um pagamento sem querer.
  app.put('/servico/:id', async (req, reply) => {
    const servicoid = parseInteiroPositivo(req.params.id, 'id');
    const { contratante, valor, tipo } = req.body;
    const data = parseData(req.body.data, 'data');

    const atual = await app.db_servico.getPagamento(servicoid);
    if (!atual) throw new ServicoItemError(404, 'Serviço não encontrado.');
    if (atual.status === 'Pago' && data > atual.data_pagamento) {
      throw new ServicoItemError(400,
        'A data do serviço não pode ser posterior à data em que ele foi pago. Desfaça o pagamento ou ajuste a data.');
    }

    await app.db_servico.update(servicoid, {
        contratante,
        data,
        valor,
        tipo
    });

    return reply.status(204).send();
  });

  // Marca o serviço como pago ou desfaz o pagamento.
  // Corpo: { "status": "Pago", "data_pagamento": "AAAA-MM-DD" (opcional, padrão hoje) }
  //    ou: { "status": "Pendente" }
  // Resposta: { id_registro_servico, status, data_pagamento }
  app.put('/servico/:id/pagamento', async (req) => {
    const servicoid = parseInteiroPositivo(req.params.id, 'id');

    const atual = await app.db_servico.getPagamento(servicoid);
    if (!atual) throw new ServicoItemError(404, 'Serviço não encontrado.');

    const pagamento = parsePagamento(req.body, atual.data);
    await app.db_servico.registrarPagamento(servicoid, pagamento);

    return { id_registro_servico: servicoid, ...pagamento };
  });

  app.delete('/servico/:id', async (req, reply) => {
    const servicoid = req.params.id;

    await app.db_servico.delete(servicoid);

    return reply.status(204).send();
  });
}
