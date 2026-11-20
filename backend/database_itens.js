import { sql } from "./db.js";

export class Database_itens {
    async list(search) {
        let rows;

        if (search) {
            [rows] = await sql.query(
                'SELECT * FROM tb_item WHERE nome_item LIKE ?',
                [`%${search}%`]
            );
        } else {
            [rows] = await sql.query('SELECT * FROM tb_item');
        }

        return rows;
    }

    async create(item) {
        const { nome_item, modelo, data_inscricao, categoria, preco_custo } = item;

        await sql.query(
            'INSERT INTO tb_item (nome_item, modelo, data_inscricao, categoria, preco_custo) VALUES (?, ?, ?, ?, ?)',
            [nome_item, modelo, data_inscricao, categoria, preco_custo]
        );
    }

    async update(id, item) {
        const { nome_item, modelo, data_inscricao, categoria, preco_custo } = item;

        // preco_custo só é alterado quando enviado; assim telas que não conhecem
        // o campo não apagam o preço já cadastrado.
        if (preco_custo === undefined) {
            await sql.query(
                'UPDATE tb_item SET nome_item = ?, modelo = ?, data_inscricao = ?, categoria = ? WHERE id_item = ?',
                [nome_item, modelo, data_inscricao, categoria, id]
            );
        } else {
            await sql.query(
                'UPDATE tb_item SET nome_item = ?, modelo = ?, data_inscricao = ?, categoria = ?, preco_custo = ? WHERE id_item = ?',
                [nome_item, modelo, data_inscricao, categoria, preco_custo, id]
            );
        }
    }

    async delete(id) {
        await sql.query('DELETE FROM tb_item WHERE id_item = ?', [id]);
    }
}
