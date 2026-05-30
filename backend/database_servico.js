import { sql } from "./db.js";

export class Database_servico {
    async list(search) {
        let rows;

        if (search) {
            const searchTerm = `%${search}%`;
            [rows] = await sql.query(`
                SELECT * FROM tb_registro_servico 
                WHERE contratante LIKE ? 
                OR tipo LIKE ?
            `, [searchTerm, searchTerm]);
        } else {
            [rows] = await sql.query('SELECT * FROM tb_registro_servico');
        }

        return rows;
    }

    async create(servico) {
        const { contratante, data, valor, tipo } = servico;

        await sql.query(
            'INSERT INTO tb_registro_servico (contratante, data, valor, tipo) VALUES (?, ?, ?, ?)',
            [contratante, data, valor, tipo]
        );
    }

    async update(id, servico) {
        const { contratante, data, valor, tipo } = servico;

        await sql.query(
            'UPDATE tb_registro_servico SET contratante = ?, data = ?, valor = ?, tipo = ? WHERE id_registro_servico = ?',
            [contratante, data, valor, tipo, id]
        );
    }

    async delete(id) {
        await sql.query('DELETE FROM tb_registro_servico WHERE id_registro_servico = ?', [id]);
    }   
}