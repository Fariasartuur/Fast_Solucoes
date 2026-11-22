import { dataISO, diasDesde } from "./formatters.js";

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const somaValores = (lista) => lista.reduce((total, s) => total + Number(s.valor || 0), 0);

/**
 * Resumo de contas a receber a partir da lista de serviços.
 *  - aReceber / qtdPendentes: serviços com status "Pendente";
 *  - recebidoMes / qtdRecebidosMes: serviços pagos com data_pagamento no mês atual;
 *  - devedores: pendentes agrupados por academia (contratante), com total, quantidade
 *    e há quantos dias está o serviço pendente mais antigo. Ordenados do mais
 *    antigo para o mais recente (desempate pelo maior valor).
 */
export const resumoRecebimentos = (servicos, hoje = new Date()) => {
    const pendentes = servicos.filter((s) => s.status === 'Pendente');

    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    const recebidosMes = servicos.filter(
        (s) => s.status === 'Pago' && dataISO(s.data_pagamento).startsWith(mesAtual)
    );

    // Agrupa ignorando maiúsculas/minúsculas e espaços extras no nome da academia.
    const grupos = new Map();
    for (const s of pendentes) {
        const nome = (s.contratante || 'Sem nome').trim();
        const chave = nome.toLowerCase();
        const grupo = grupos.get(chave) ?? { contratante: nome, total: 0, quantidade: 0, diasMaisAntigo: 0 };
        grupo.total += Number(s.valor || 0);
        grupo.quantidade += 1;
        grupo.diasMaisAntigo = Math.max(grupo.diasMaisAntigo, diasDesde(s.data));
        grupos.set(chave, grupo);
    }

    const devedores = [...grupos.values()].sort(
        (a, b) => b.diasMaisAntigo - a.diasMaisAntigo || b.total - a.total
    );

    return {
        aReceber: somaValores(pendentes),
        qtdPendentes: pendentes.length,
        recebidoMes: somaValores(recebidosMes),
        qtdRecebidosMes: recebidosMes.length,
        nomeMes: `${MESES[hoje.getMonth()]}/${hoje.getFullYear()}`,
        devedores,
    };
};
