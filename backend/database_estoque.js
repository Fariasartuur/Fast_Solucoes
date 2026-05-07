import { sql } from "./db.js";
import { randomUUID } from 'node:crypto';

export class Database_estoque {

    async list(search) {
        let estoque;

        if (search) {
            estoque = await sql`
                SELECT e.*, i.nome_item 
                FROM tb_estoque e
                JOIN tb_item i ON e.id_item = i.id_item
                WHERE i.nome_item ILIKE ${'%' + search + '%'}
            `;
        } else {
            estoque = await sql`
                SELECT e.*, i.nome_item 
                FROM tb_estoque e
                JOIN tb_item i ON e.id_item = i.id_item
            `;
        }

        return estoque;
    }

    async create(dados) {
        const id_estoque = randomUUID();
        const { id_item, quantidade } = dados;

        await sql`
            INSERT INTO tb_estoque (id_estoque, id_item, quantidade) 
            VALUES (${id_estoque}, ${id_item}, ${quantidade})
        `;
    }

    async update(id_estoque, dados) {
        const { quantidade } = dados;

        await sql`
            UPDATE tb_estoque 
            SET quantidade = ${quantidade}
            WHERE id_estoque = ${id_estoque}
        `;
    }

    async delete(id_estoque) {
        await sql`DELETE FROM tb_estoque WHERE id_estoque = ${id_estoque}`;
    }   
}