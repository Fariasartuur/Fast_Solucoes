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

    // Cria o serviço (opcionalmente com "pecas") e devolve o id criado.
    // Em caso de erro, repassa a mensagem do servidor para quem chamou.
    addServico: async (servicoData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/servico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoData),
            });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(body.message || `Erro ${response.status}`);
            }

            await useServicoStore.getState().fetchServicos();
            return body.id_registro_servico;
        } catch (error) {
            console.error("Erro ao adicionar servico:", error);
            set({ loading: false });
            throw error;
        }
    },

}))
