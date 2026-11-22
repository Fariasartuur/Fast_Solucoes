import { ServicoItemError } from './database_servico_item.js';

// Valida um número inteiro positivo vindo da URL ou do corpo da requisição.
export function parseInteiroPositivo(valor, campo) {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) {
        throw new ServicoItemError(400, `O campo "${campo}" deve ser um número inteiro maior que zero.`);
    }
    return numero;
}

// Rotas das peças usadas em um serviço.
export async function servicoItem(app) {
    // Lista as peças usadas no serviço, com custo e subtotal.
    app.get('/servico/:id/pecas', async (req) => {
        const idServico = parseInteiroPositivo(req.params.id, 'id');
        return app.db_servico_item.list(idServico);
    });

    // Adiciona uma peça ao serviço (ou soma à quantidade já registrada) e baixa o estoque.
    app.post('/servico/:id/pecas', async (req, reply) => {
        const idServico = parseInteiroPositivo(req.params.id, 'id');
        const idItem = parseInteiroPositivo(req.body?.id_item, 'id_item');
        const quantidade = parseInteiroPositivo(req.body?.quantidade, 'quantidade');

        await app.db_servico_item.add(idServico, idItem, quantidade);

        return reply.status(201).send();
    });

    // Altera a quantidade de uma peça no serviço, ajustando o estoque pela diferença.
    app.put('/servico/:id/pecas/:idItem', async (req, reply) => {
        const idServico = parseInteiroPositivo(req.params.id, 'id');
        const idItem = parseInteiroPositivo(req.params.idItem, 'idItem');
        const quantidade = parseInteiroPositivo(req.body?.quantidade, 'quantidade');

        await app.db_servico_item.setQuantidade(idServico, idItem, quantidade);

        return reply.status(204).send();
    });

    // Remove a peça do serviço e devolve a quantidade ao estoque.
    app.delete('/servico/:id/pecas/:idItem', async (req, reply) => {
        const idServico = parseInteiroPositivo(req.params.id, 'id');
        const idItem = parseInteiroPositivo(req.params.idItem, 'idItem');

        await app.db_servico_item.remove(idServico, idItem);

        return reply.status(204).send();
    });
}
