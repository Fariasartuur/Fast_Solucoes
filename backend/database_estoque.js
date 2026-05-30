import { sql } from "./db.js";

export class Database_estoque {

    async list(search) {
        let rows;

        if (search) {
            [rows] = await sql.query(`
                SELECT e.*, i.nome_item 
                FROM tb_estoque e
                JOIN tb_item i ON e.id_item = i.id_item
                WHERE i.nome_item LIKE ?
            `, [`%${search}%`]);
        } else {
            [rows] = await sql.query(`
                SELECT e.*, i.nome_item 
                FROM tb_estoque e
                JOIN tb_item i ON e.id_item = i.id_item
            `);
        }

        return rows;
    }

    async create(dados) {
        const { id_item, quantidade } = dados;

        await sql.query(
            'INSERT INTO tb_estoque (id_item, quantidade) VALUES (?, ?)',
            [id_item, quantidade]
        );
    }

    async update(id_estoque, dados) {
        const { quantidade } = dados;

        await sql.query(
            'UPDATE tb_estoque SET quantidade = ? WHERE id_estoque = ?',
            [quantidade, id_estoque]
        );
    }

    async delete(id_estoque) {
        await sql.query('DELETE FROM tb_estoque WHERE id_estoque = ?', [id_estoque]);
    }   
}