import { sql } from "./db.js";
import { randomUUID } from 'node:crypto';

export class Database_itens {
    async list(search) {
        let itens;

        if (search) {
            itens = await sql`SELECT * FROM tb_item WHERE nome_item ILIKE ${'%' + search + '%'}`;
        } else {
            itens = await sql`SELECT * FROM tb_item`;
        }

        return itens;
    }

    async create(item) {
        const itemid = randomUUID();
        await sql`
            INSERT INTO tb_item (id_item, nome_item, modelo, data_inscricao, categoria) 
            VALUES (${itemid}, ${item.nome_item}, ${item.modelo}, ${item.data_inscricao}, ${item.categoria})
        `;
    }

    async update(id, item) {
        await sql`
            UPDATE tb_item 
            SET nome_item = ${item.nome_item}, 
                modelo = ${item.modelo}, 
                data_inscricao = ${item.data_inscricao}, 
                categoria = ${item.categoria} 
            WHERE id_item = ${id}
        `;
    }

    async delete(id) {
        await sql`DELETE FROM tb_item WHERE id_item = ${id}`;
    }   
}