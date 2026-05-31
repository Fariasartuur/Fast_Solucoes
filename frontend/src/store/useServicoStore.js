import { create } from "zustand";

export const useServicoStore = create((set) => ({
    servicos: [],
    loading: false,

    fetchServicos: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/servico');
            const data = await response.json();
            set({ servicos: data, loading: false });
        } catch (error) {
            console.error("Erro ao buscar servicos:", error);
            set({ loading: false });
        }
    },

    addServico: async (servicoData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/servico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoData),
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            await useServicoStore.getState().fetchServicos();
        } catch (error) {
            console.error("Erro ao adicionar servico:", error);
            set({ loading: false });
        }
    },

}))