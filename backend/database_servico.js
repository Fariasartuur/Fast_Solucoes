import { sql } from "./db.js";
import { withTransaction, adicionarPeca, devolverTodasPecas } from "./database_servico_item.js";

export class Database_servico {
    // Lista os serviços com o custo das peças usadas e o lucro
    // (valor cobrado - custo das peças). O custo usa o custo_unitario
    // congelado em tb_servico_item no momento em que a peça foi usada.
    async list(search) {
        const filtro = search ? 'WHERE s.contratante LIKE ? OR s.tipo LIKE ?' : '';
        const params = search ? [`%${search}%`, `%${search}%`] : [];
        return this.#consultar(filtro, params);
    }

    // Um serviço pelo id (mesmos campos da listagem). Retorna undefined se não existir.
    async getById(id) {
        const [servico] = await this.#consultar('WHERE s.id_registro_servico = ?', [id]);
        return servico;
    }

    async #consultar(filtro, params) {
        const [rows] = await sql.query(`
            SELECT s.*,
                   COALESCE(SUM(si.quantidade * si.custo_unitario), 0)           AS custo_pecas,
                   s.valor - COALESCE(SUM(si.quantidade * si.custo_unitario), 0) AS lucro
              FROM tb_registro_servico s
              LEFT JOIN tb_servico_item si ON si.id_registro_servico = s.id_registro_servico
              ${filtro}
             GROUP BY s.id_registro_servico
        `, params);

        return rows;
    }

    // Cria o serviço e, opcionalmente, registra as peças usadas nele.
    // Tudo acontece em uma transação: se faltar estoque de alguma peça,
    // nem o serviço nem as peças são gravados.
    async create(servico, pecas = []) {
        const { contratante, data, valor, tipo, status = 'Pendente', data_pagamento = null } = servico;

        return withTransaction(async (conn) => {
            const [result] = await conn.query(
                'INSERT INTO tb_registro_servico (contratante, data, valor, tipo, status, data_pagamento) VALUES (?, ?, ?, ?, ?, ?)',
                [contratante, data, valor, tipo, status, data_pagamento]
            );
            const idServico = result.insertId;

            for (const peca of pecas) {
                await adicionarPeca(conn, idServico, peca.id_item, peca.quantidade);
            }

            return idServico;
        });
    }

    async update(id, servico) {
        const { contratante, data, valor, tipo } = servico;

        await sql.query(
            'UPDATE tb_registro_servico SET contratante = ?, data = ?, valor = ?, tipo = ? WHERE id_registro_servico = ?',
            [contratante, data, valor, tipo, id]
        );
    }

    // Data do serviço e situação do pagamento, com datas em texto AAAA-MM-DD
    // (para comparar sem problemas de fuso horário). Retorna undefined se não existir.
    async getPagamento(id) {
        const [[row]] = await sql.query(`
            SELECT DATE_FORMAT(data, '%Y-%m-%d')           AS data,
                   status,
                   DATE_FORMAT(data_pagamento, '%Y-%m-%d') AS data_pagamento
              FROM tb_registro_servico
             WHERE id_registro_servico = ?
        `, [id]);
        return row;
    }

    async registrarPagamento(id, { status, data_pagamento }) {
        await sql.query(
            'UPDATE tb_registro_servico SET status = ?, data_pagamento = ? WHERE id_registro_servico = ?',
            [status, data_pagamento, id]
        );
    }

    // Devolve as peças usadas ao estoque e exclui o serviço. As linhas de
    // tb_servico_item são apagadas pelo ON DELETE CASCADE.
    async delete(id) {
        await withTransaction(async (conn) => {
            await devolverTodasPecas(conn, id);
            await conn.query('DELETE FROM tb_registro_servico WHERE id_registro_servico = ?', [id]);
        });
    }
}
