import { sql } from "./db.js";

// Erro de regra de negócio. O Fastify usa "statusCode" para definir o status
// HTTP da resposta, e o frontend exibe o campo "message".
export class ServicoItemError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Executa "fn" dentro de uma transação: ou tudo é gravado, ou nada é.
export async function withTransaction(fn) {
    const conn = await sql.getConnection();
    try {
        await conn.beginTransaction();
        const result = await fn(conn);
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

async function lockServico(conn, idServico) {
    const [[servico]] = await conn.query(
        'SELECT id_registro_servico FROM tb_registro_servico WHERE id_registro_servico = ? FOR UPDATE',
        [idServico]
    );
    if (!servico) throw new ServicoItemError(404, 'Serviço não encontrado.');
}

async function lockItem(conn, idItem) {
    const [[item]] = await conn.query(
        'SELECT id_item, nome_item, preco_custo FROM tb_item WHERE id_item = ? FOR UPDATE',
        [idItem]
    );
    if (!item) throw new ServicoItemError(404, 'Peça não encontrada.');
    return item;
}

async function lockUso(conn, idServico, idItem) {
    const [[uso]] = await conn.query(
        'SELECT id_servico_item, quantidade FROM tb_servico_item WHERE id_registro_servico = ? AND id_item = ? FOR UPDATE',
        [idServico, idItem]
    );
    return uso;
}

// Retira "quantidade" unidades da peça do estoque. Se a peça tiver mais de um
// registro em tb_estoque, o saldo disponível é a soma deles e a retirada é
// feita do registro mais antigo para o mais novo.
async function retirarEstoque(conn, item, quantidade) {
    const [registros] = await conn.query(
        'SELECT id_estoque, quantidade FROM tb_estoque WHERE id_item = ? ORDER BY id_estoque FOR UPDATE',
        [item.id_item]
    );

    const disponivel = registros.reduce((total, r) => total + r.quantidade, 0);
    if (disponivel < quantidade) {
        throw new ServicoItemError(409,
            `Estoque insuficiente de "${item.nome_item}": disponível ${disponivel}, necessário ${quantidade}.`);
    }

    let falta = quantidade;
    for (const registro of registros) {
        if (falta === 0) break;
        const retirar = Math.min(registro.quantidade, falta);
        if (retirar > 0) {
            await conn.query(
                'UPDATE tb_estoque SET quantidade = quantidade - ? WHERE id_estoque = ?',
                [retirar, registro.id_estoque]
            );
            falta -= retirar;
        }
    }
}

// Devolve "quantidade" unidades da peça ao estoque. Se a peça não tiver mais
// registro de estoque (foi apagado), um novo registro é criado.
async function devolverEstoque(conn, idItem, quantidade) {
    const [[registro]] = await conn.query(
        'SELECT id_estoque FROM tb_estoque WHERE id_item = ? ORDER BY id_estoque LIMIT 1 FOR UPDATE',
        [idItem]
    );

    if (registro) {
        await conn.query(
            'UPDATE tb_estoque SET quantidade = quantidade + ? WHERE id_estoque = ?',
            [quantidade, registro.id_estoque]
        );
    } else {
        await conn.query(
            'INSERT INTO tb_estoque (id_item, quantidade) VALUES (?, ?)',
            [idItem, quantidade]
        );
    }
}

// Adiciona uma peça ao serviço (ou soma à quantidade, se já estiver nele) e
// baixa o estoque. O custo unitário é copiado do preço de custo atual da peça
// apenas no primeiro registro, ficando congelado para aquele serviço.
export async function adicionarPeca(conn, idServico, idItem, quantidade) {
    const item = await lockItem(conn, idItem);
    const uso = await lockUso(conn, idServico, idItem);

    await retirarEstoque(conn, item, quantidade);

    if (uso) {
        await conn.query(
            'UPDATE tb_servico_item SET quantidade = quantidade + ? WHERE id_servico_item = ?',
            [quantidade, uso.id_servico_item]
        );
    } else {
        await conn.query(
            'INSERT INTO tb_servico_item (id_registro_servico, id_item, quantidade, custo_unitario) VALUES (?, ?, ?, ?)',
            [idServico, idItem, quantidade, item.preco_custo ?? 0]
        );
    }
}

// Devolve ao estoque todas as peças de um serviço (usado antes de excluí-lo).
export async function devolverTodasPecas(conn, idServico) {
    const [usos] = await conn.query(
        'SELECT id_item, quantidade FROM tb_servico_item WHERE id_registro_servico = ? FOR UPDATE',
        [idServico]
    );
    for (const uso of usos) {
        await devolverEstoque(conn, uso.id_item, uso.quantidade);
    }
}

export class Database_servico_item {
    async list(idServico) {
        const [[servico]] = await sql.query(
            'SELECT id_registro_servico FROM tb_registro_servico WHERE id_registro_servico = ?',
            [idServico]
        );
        if (!servico) throw new ServicoItemError(404, 'Serviço não encontrado.');

        const [rows] = await sql.query(`
            SELECT si.id_servico_item, si.id_item, i.nome_item, i.modelo,
                   si.quantidade, si.custo_unitario,
                   si.quantidade * si.custo_unitario AS subtotal
              FROM tb_servico_item si
              JOIN tb_item i ON i.id_item = si.id_item
             WHERE si.id_registro_servico = ?
             ORDER BY i.nome_item
        `, [idServico]);

        return rows;
    }

    async add(idServico, idItem, quantidade) {
        await withTransaction(async (conn) => {
            await lockServico(conn, idServico);
            await adicionarPeca(conn, idServico, idItem, quantidade);
        });
    }

    // Define a nova quantidade da peça no serviço, ajustando o estoque pela diferença.
    async setQuantidade(idServico, idItem, quantidade) {
        await withTransaction(async (conn) => {
            await lockServico(conn, idServico);
            const item = await lockItem(conn, idItem);
            const uso = await lockUso(conn, idServico, idItem);
            if (!uso) throw new ServicoItemError(404, 'Esta peça não está registrada neste serviço.');

            const diferenca = quantidade - uso.quantidade;
            if (diferenca > 0) await retirarEstoque(conn, item, diferenca);
            if (diferenca < 0) await devolverEstoque(conn, idItem, -diferenca);

            await conn.query(
                'UPDATE tb_servico_item SET quantidade = ? WHERE id_servico_item = ?',
                [quantidade, uso.id_servico_item]
            );
        });
    }

    async remove(idServico, idItem) {
        await withTransaction(async (conn) => {
            await lockServico(conn, idServico);
            const uso = await lockUso(conn, idServico, idItem);
            if (!uso) throw new ServicoItemError(404, 'Esta peça não está registrada neste serviço.');

            await devolverEstoque(conn, idItem, uso.quantidade);
            await conn.query('DELETE FROM tb_servico_item WHERE id_servico_item = ?', [uso.id_servico_item]);
        });
    }
}
