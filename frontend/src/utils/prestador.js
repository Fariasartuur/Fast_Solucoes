export const CAMPOS_PRESTADOR = ['nome', 'documento', 'telefone', 'email', 'cidade', 'chave_pix'];

export const preenchido = (valor) =>
    valor !== null && valor !== undefined && String(valor).trim() !== '';

// Indica se há algum dado do prestador para mostrar.
export const temDadosPrestador = (dados) =>
    CAMPOS_PRESTADOR.some((campo) => preenchido(dados?.[campo]));
