import { create } from "zustand";

export const useItemStore = create((set) => ({
    items: [],
    loading: false,

    fetchItems: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/item');
            const data = await response.json();
            set({ items: data, loading: false });
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
            set({ loading: false });
        }
    },

    addItem: async (itemData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3333/item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            await useItemStore.getState().fetchItems();
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
            set({ loading: false });
        }
    },

}))