// Faz a requisição e, em caso de erro, lança um Error com a mensagem enviada
// pelo backend (ex.: "Estoque insuficiente de ...").
export const request = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || `Erro ${response.status}`);
    }

    return response.status === 204 ? null : response.json().catch(() => null);
};
