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
            if (response.ok) {
                const newItem = await response.json();
                set((state) => ({ items: [...state.items, newItem], loading: false }));
            } else {
                console.error("Erro ao adicionar item:", response.statusText);
                set({ loading: false });
            }
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
            set({ loading: false });
        }
    },

}))