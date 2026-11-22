const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Formata um valor em reais. Valores vazios viram o texto de "fallback".
export const formatBRL = (valor, fallback = '—') => {
    if (valor === null || valor === undefined || valor === '') return fallback;

    const numero = Number(valor);
    return Number.isFinite(numero) ? brl.format(numero) : fallback;
};

// Data de hoje no formato AAAA-MM-DD (usado em campos <input type="date">).
export const hojeISO = () => {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
};

// O banco devolve datas como "2026-11-20T03:00:00.000Z"; aqui fica só "2026-11-20".
export const dataISO = (valor) => (valor ? String(valor).split('T')[0] : '');

// "2026-11-20..." -> "20/11/2026"
export const formatDataBR = (valor, fallback = '—') => {
    const iso = dataISO(valor);
    return iso ? iso.split('-').reverse().join('/') : fallback;
};

// Quantos dias se passaram desde a data informada até hoje.
export const diasDesde = (valor) => {
    const iso = dataISO(valor);
    if (!iso) return 0;
    const [ano, mes, dia] = iso.split('-').map(Number);
    const inicio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((hoje - inicio) / 86400000));
};

// CPF (11 dígitos) -> 000.000.000-00 | CNPJ (14 dígitos) -> 00.000.000/0000-00.
// Qualquer outro valor é devolvido como veio.
export const formatDocumento = (valor) => {
    const digitos = String(valor ?? '').replace(/\D/g, '');
    if (digitos.length === 11) return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (digitos.length === 14) return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return valor ?? '';
};

// Telefone só com dígitos -> (11) 98765-4321 ou (11) 3456-7890.
// Se foi digitado em outro formato, é exibido como está.
export const formatTelefone = (valor) => {
    const texto = String(valor ?? '');
    const digitos = texto.replace(/\D/g, '');
    if (texto !== digitos) return texto;
    if (digitos.length === 11) return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digitos.length === 10) return digitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return texto;
};

// "hoje", "1 dia", "12 dias"
export const textoDias = (dias) => {
    if (dias === 0) return 'hoje';
    return dias === 1 ? '1 dia' : `${dias} dias`;
};
