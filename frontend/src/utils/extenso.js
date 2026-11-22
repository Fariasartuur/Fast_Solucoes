// Valores por extenso em português, para recibos (até 999.999.999,99).

const UNIDADES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
    'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos',
    'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
    'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// 0 a 999
function ate999(n) {
    if (n === 0) return '';
    if (n === 100) return 'cem';

    const partes = [];
    const centena = Math.floor(n / 100);
    const resto = n % 100;
    if (centena) partes.push(CENTENAS[centena]);
    if (resto) {
        if (resto < 20) {
            partes.push(UNIDADES[resto]);
        } else {
            const unidade = resto % 10;
            const dezena = DEZENAS[Math.floor(resto / 10)];
            partes.push(unidade ? `${dezena} e ${UNIDADES[unidade]}` : dezena);
        }
    }
    return partes.join(' e ');
}

// Número inteiro por extenso. Usa "e" antes do último grupo quando ele é
// menor que 100 ou uma centena redonda: "mil e duzentos", "mil duzentos e trinta".
function inteiroPorExtenso(n) {
    if (n === 0) return 'zero';

    const milhoes = Math.floor(n / 1_000_000);
    const milhares = Math.floor((n % 1_000_000) / 1000);
    const resto = n % 1000;

    const grupos = [];
    if (milhoes) grupos.push({ valor: milhoes, texto: milhoes === 1 ? 'um milhão' : `${ate999(milhoes)} milhões` });
    if (milhares) grupos.push({ valor: milhares, texto: milhares === 1 ? 'mil' : `${ate999(milhares)} mil` });
    if (resto) grupos.push({ valor: resto, texto: ate999(resto) });

    if (grupos.length === 1) return grupos[0].texto;

    const ultimo = grupos.pop();
    const usaE = ultimo.valor < 100 || ultimo.valor % 100 === 0;
    return `${grupos.map((g) => g.texto).join(' ')}${usaE ? ' e ' : ' '}${ultimo.texto}`;
}

// 150.5 -> "cento e cinquenta reais e cinquenta centavos"
export function valorPorExtenso(valor) {
    const totalCentavos = Math.round(Math.abs(Number(valor) || 0) * 100);
    const reais = Math.floor(totalCentavos / 100);
    const centavos = totalCentavos % 100;

    if (reais === 0 && centavos === 0) return 'zero reais';

    const partes = [];
    if (reais > 0) {
        const unidade = reais === 1 ? 'real' : (reais % 1_000_000 === 0 ? 'de reais' : 'reais');
        partes.push(`${inteiroPorExtenso(reais)} ${unidade}`);
    }
    if (centavos > 0) {
        partes.push(`${ate999(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`);
    }
    return partes.join(' e ');
}

// "2026-11-20..." -> "20 de novembro de 2026"
export function dataPorExtenso(valor) {
    const iso = valor ? String(valor).split('T')[0] : '';
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-').map(Number);
    return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}
