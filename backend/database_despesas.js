import { sql } from "./db.js";

export class Database_despesas {
    async list(search) {
        let rows;

        if (search) {
            [rows] = await sql.query(
                'SELECT * FROM tb_despesas_variadas WHERE nome_despesa LIKE ?',
                [`%${search}%`]
            );
        } else {
            [rows] = await sql.query('SELECT * FROM tb_despesas_variadas');
        }

        return rows;
    }

    async create(despesa) {
        const { nome_despesa, tipo_despesa, valor, data, status } = despesa;

        await sql.query(
            'INSERT INTO tb_despesas_variadas (nome_despesa, tipo_despesa, valor, data, status) VALUES (?, ?, ?, ?, ?)',
            [nome_despesa, tipo_despesa, valor, data, status]
        );
    }

    async update(id, despesa) {
        const { nome_despesa, tipo_despesa, valor, data, status } = despesa;

        await sql.query(
            'UPDATE tb_despesas_variadas SET nome_despesa = ?, tipo_despesa = ?, valor = ?, data = ?, status = ? WHERE id_despesa_variada = ?',
            [nome_despesa, tipo_despesa, valor, data, status, id]
        );
    }

    async delete(id) {
        await sql.query('DELETE FROM tb_despesas_variadas WHERE id_despesa_variada = ?', [id]);
    }   
}