import { create } from 'zustand';

export const useDespesaStore = create((set) => ({
    despesas: [],
    loading: false,

    fetchDespesas: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/despesas');
            const data = await response.json();
            set({ despesas: data, loading: false });
        } catch (error) {
            console.error("Erro ao buscar despesas:", error);
            set({ loading: false });
        }
    },

    addDespesa: async (novaDespesa) => {
        try {
            const response = await fetch('http://localhost:3333/despesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaDespesa)
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            await useDespesaStore.getState().fetchDespesas();
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error);
        }
    }
}));