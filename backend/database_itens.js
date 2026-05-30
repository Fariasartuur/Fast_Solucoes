import { sql } from "./db.js";
import { randomUUID } from 'node:crypto';

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
        const itemid = randomUUID();
        const { nome_item, modelo, data_inscricao, categoria } = item;

        await sql.query(
            'INSERT INTO tb_item (id_item, nome_item, modelo, data_inscricao, categoria) VALUES (?, ?, ?, ?, ?)',
            [itemid, nome_item, modelo, data_inscricao, categoria]
        );
    }

    async update(id, item) {
        const { nome_item, modelo, data_inscricao, categoria } = item;

        await sql.query(
            'UPDATE tb_item SET nome_item = ?, modelo = ?, data_inscricao = ?, categoria = ? WHERE id_item = ?',
            [nome_item, modelo, data_inscricao, categoria, id]
        );
    }

    async delete(id) {
        await sql.query('DELETE FROM tb_item WHERE id_item = ?', [id]);
    }   
}