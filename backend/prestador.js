import { ServicoItemError } from './database_servico_item.js';

// Texto opcional: remove espaços extras; vazio vira null. Valida o tamanho máximo.
function textoOpcional(valor, campo, max) {
    if (valor === undefined || valor === null) return null;
    const texto = String(valor).trim();
    if (texto === '') return null;
    if (texto.length > max) {
        throw new ServicoItemError(400, `O campo "${campo}" pode ter no máximo ${max} caracteres.`);
    }
    return texto;
}

// CPF/CNPJ: aceita com ou sem pontuação e guarda só os dígitos (11 ou 14).
function documentoOpcional(valor) {
    const texto = textoOpcional(valor, 'CPF/CNPJ', 30);
    if (!texto) return null;
    const digitos = texto.replace(/\D/g, '');
    if (digitos.length !== 11 && digitos.length !== 14) {
        throw new ServicoItemError(400, 'O CPF deve ter 11 dígitos e o CNPJ, 14 dígitos.');
    }
    return digitos;
}

function emailOpcional(valor) {
    const email = textoOpcional(valor, 'E-mail', 100);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ServicoItemError(400, 'E-mail inválido.');
    }
    return email;
}

// Dados do prestador exibidos nos recibos e orçamentos. Todos os campos são opcionais.
export async function prestador(app) {
    app.get('/prestador', async () => app.db_prestador.get());

    app.put('/prestador', async (req) => {
        const body = req.body ?? {};

        await app.db_prestador.save({
            nome: textoOpcional(body.nome, 'Nome', 100),
            documento: documentoOpcional(body.documento),
            telefone: textoOpcional(body.telefone, 'Telefone', 20),
            email: emailOpcional(body.email),
            cidade: textoOpcional(body.cidade, 'Cidade', 100),
            chave_pix: textoOpcional(body.chave_pix, 'Chave PIX', 100),
            exibir_nos_documentos: body.exibir_nos_documentos !== false,
        });

        return app.db_prestador.get();
    });
}
