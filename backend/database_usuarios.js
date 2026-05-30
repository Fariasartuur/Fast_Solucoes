import { sql } from "./db.js";

export class Database_usuarios {
    async list(search) {
        let rows;

        if (search) {
            [rows] = await sql.query(
                'SELECT * FROM tb_usuario WHERE nome LIKE ?',
                [`%${search}%`]
            );
        } else {
            [rows] = await sql.query('SELECT * FROM tb_usuario');
        }

        return rows;
    }

    async create(usuario) {
        const { cnpj, nome, data_registro, email, senha } = usuario;

        await sql.query(
            'INSERT INTO tb_usuario (cnpj, nome, data_registro, email, senha) VALUES (?, ?, ?, ?, ?)',
            [cnpj, nome, data_registro, email, senha]
        );
    }

    async update(id, usuario) {
        const { cnpj, nome, data_registro, email, senha } = usuario;

        await sql.query(
            'UPDATE tb_usuario SET cnpj = ?, nome = ?, data_registro = ?, email = ?, senha = ? WHERE id_usuario = ?',
            [cnpj, nome, data_registro, email, senha, id]
        );
    }

    async delete(id) {
        await sql.query('DELETE FROM tb_usuario WHERE id_usuario = ?', [id]);
    }   
}