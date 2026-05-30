import { sql } from "./db.js";

export class Database_registro {
    async list(search) {
        let rows;

        if (search) {
            [rows] = await sql.query(`
                SELECT r.*, i.nome_item 
                FROM tb_registro_item r
                JOIN tb_item i ON r.id_item = i.id_item
                WHERE i.nome_item LIKE ?
            `, [`%${search}%`]);
        } else {
            [rows] = await sql.query(`
                SELECT r.*, i.nome_item 
                FROM tb_registro_item r
                JOIN tb_item i ON r.id_item = i.id_item
            `);
        }

        return rows;
    }

    async create(registro) {
        const { id_item, tipo, data, valor } = registro;

        await sql.query(
            'INSERT INTO tb_registro_item (id_item, tipo, data, valor) VALUES (?, ?, ?, ?)',
            [id_item, tipo, data, valor]
        );
    }

    async update(id, registro) {
        const { id_item, tipo, data, valor } = registro;

        await sql.query(
            'UPDATE tb_registro_item SET id_item = ?, tipo = ?, data = ?, valor = ? WHERE id_registro_item = ?',
            [id_item, tipo, data, valor, id]
        );
    }

    async delete(id) {
        await sql.query('DELETE FROM tb_registro_item WHERE id_registro_item = ?', [id]);
    }   
}