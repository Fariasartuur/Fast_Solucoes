import { create } from 'zustand';

export const useEstoqueStore = create((set) => ({
    estoque: [],
    loading: false,

    fetchEstoque: async () => {
        set({ loading: true });
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