import { sql } from "./db.js";
import { randomUUID } from 'node:crypto';

export class Database_despesas {
    async list(search) {
        let despesas;

        if (search) {
            despesas = await sql`
                SELECT * FROM tb_despesas_variadas 
                WHERE nome_despesa ILIKE ${'%' + search + '%'}
            `;
        } else {
            despesas = await sql`SELECT * FROM tb_despesas_variadas`;
        }

        return despesas;
    }

    async create(despesa) {
        const id_despesa = randomUUID();
        const { nome_despesa, tipo_despesa, valor, data, status } = despesa;

        await sql`
            INSERT INTO tb_despesas_variadas (id_despesa_variada, nome_despesa, tipo_despesa, valor, data, status) 
            VALUES (${id_despesa}, ${nome_despesa}, ${tipo_despesa}, ${valor}, ${data}, ${status})
        `;
    }

    async update(id, despesa) {
        const { nome_despesa, tipo_despesa, valor, data, status } = despesa;

        await sql`
            UPDATE tb_despesas_variadas 
            SET nome_despesa = ${nome_despesa}, 
                tipo_despesa = ${tipo_despesa}, 
                valor = ${valor}, 
                data = ${data}, 
                status = ${status} 
            WHERE id_despesa_variada = ${id}
        `;
    }

    async delete(id) {
        await sql`DELETE FROM tb_despesas_variadas WHERE id_despesa_variada = ${id}`;
    }   
}