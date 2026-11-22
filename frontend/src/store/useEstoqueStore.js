import { create } from 'zustand';

export const useEstoqueStore = create((set) => ({
    estoque: [],
    loading: false,

    // "silent" atualiza os dados sem ativar o "Carregando..." das tabelas
    // (usado quando o estoque muda por causa de outra tela, ex.: Serviços).
    fetchEstoque: async ({ silent = false } = {}) => {
        if (!silent) set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/estoque');
            const data = await response.json();
            set({ estoque: data, loading: false });
        } catch (error) {
            console.error("Erro ao buscar estoque:", error);
            set({ loading: false });
        }
    },

    addEstoque: async (novoEstoque) => {
        try {
            const response = await fetch('http://localhost:3333/estoque', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoEstoque)
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            await useEstoqueStore.getState().fetchEstoque();
        } catch (error) {
            console.error("Erro ao adicionar estoque:", error);
        }
    }
}));