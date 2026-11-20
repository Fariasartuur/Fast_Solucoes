import { ServicoItemError } from './database_servico_item.js';

// Regras do controle de pagamento dos serviços (contas a receber).

const STATUS_VALIDOS = ['Pago', 'Pendente'];

// Data de hoje no fuso do servidor, no formato AAAA-MM-DD.
export function hoje() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
}

const formatarBR = (iso) => iso.split('-').reverse().join('/');

// Valida uma data AAAA-MM-DD que exista de verdade (rejeita 2026-02-30, por exemplo).
export function parseData(valor, campo) {
    const texto = typeof valor === 'string' ? valor.slice(0, 10) : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        throw new ServicoItemError(400, `O campo "${campo}" deve ser uma data no formato AAAA-MM-DD.`);
    }

    const [ano, mes, dia] = texto.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));
    if (data.getUTCFullYear() !== ano || data.getUTCMonth() !== mes - 1 || data.getUTCDate() !== dia) {
        throw new ServicoItemError(400, `O campo "${campo}" não é uma data válida.`);
    }

    return texto;
}

// Aceita "Pago"/"Pendente" sem diferenciar maiúsculas e minúsculas.
function parseStatus(valor) {
    const status = STATUS_VALIDOS.find((s) => s.toLowerCase() === String(valor ?? '').trim().toLowerCase());
    if (!status) {
        throw new ServicoItemError(400, 'Status inválido. Use "Pago" ou "Pendente".');
    }
    return status;
}

/**
 * Lê "status" e "data_pagamento" do corpo da requisição e devolve os valores
 * a gravar, já coerentes com a restrição do banco:
 *  - Pendente -> data_pagamento = null
 *  - Pago     -> data_pagamento informada ou, se ausente, a data de hoje
 * A data de pagamento não pode ser futura nem anterior à data do serviço.
 */
export function parsePagamento(body, dataServico, { statusPadrao } = {}) {
    const valorStatus = body?.status ?? statusPadrao;
    const status = parseStatus(valorStatus);

    if (status === 'Pendente') {
        return { status, data_pagamento: null };
    }

    const data_pagamento = body?.data_pagamento
        ? parseData(body.data_pagamento, 'data_pagamento')
        : hoje();

    if (data_pagamento > hoje()) {
        throw new ServicoItemError(400, 'A data de pagamento não pode ser uma data futura.');
    }
    if (dataServico && data_pagamento < dataServico) {
        throw new ServicoItemError(400,
            `A data de pagamento não pode ser anterior à data do serviço (${formatarBR(dataServico)}).`);
    }

    return { status, data_pagamento };
}
