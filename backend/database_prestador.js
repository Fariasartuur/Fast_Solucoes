import { sql } from "./db.js";

// Dados do prestador (o próprio técnico). A tabela tem no máximo uma linha (id 1).
export class Database_prestador {
    // Devolve os dados cadastrados ou, se ainda não houver cadastro, tudo vazio.
    async get() {
        const [[row]] = await sql.query(`
            SELECT nome, documento, telefone, email, cidade, chave_pix,
                   exibir_nos_documentos, atualizado_em
              FROM tb_prestador
             WHERE id_prestador = 1
        `);

        if (!row) {
            return {
                nome: null, documento: null, telefone: null, email: null, cidade: null, chave_pix: null,
                exibir_nos_documentos: true, atualizado_em: null, cadastrado: false,
            };
        }

        return { ...row, exibir_nos_documentos: Boolean(row.exibir_nos_documentos), cadastrado: true };
    }

    // Cria o cadastro na primeira vez ou atualiza o existente.
    async save(dados) {
        const { nome, documento, telefone, email, cidade, chave_pix, exibir_nos_documentos } = dados;

        await sql.query(`
            INSERT INTO tb_prestador
                   (id_prestador, nome, documento, telefone, email, cidade, chave_pix, exibir_nos_documentos)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                   nome = VALUES(nome), documento = VALUES(documento), telefone = VALUES(telefone),
                   email = VALUES(email), cidade = VALUES(cidade), chave_pix = VALUES(chave_pix),
                   exibir_nos_documentos = VALUES(exibir_nos_documentos)
        `, [nome, documento, telefone, email, cidade, chave_pix, exibir_nos_documentos ? 1 : 0]);
    }
}
