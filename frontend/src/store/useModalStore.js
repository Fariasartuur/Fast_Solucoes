import { create } from 'zustand';

export const useModalStore = create((set) => ({
    selectedItem: null,

    isActionsOpen: false,

    isItemOpen: false,
    isEstoqueOpen: false,
    isDespesaOpen: false,

    openItem: () => set({ isItemOpen: true }),
    closeItem: () => set({ isItemOpen: false }),

    openEstoque: () => set({ isEstoqueOpen: true }),
    closeEstoque: () => set({ isEstoqueOpen: false }),

    openDespesa: () => set({ isDespesaOpen: true }),
    closeDespesa: () => set({ isDespesaOpen: false }),

    openActions: (item) => set({ selectedItem: item, isActionsOpen: true }),
    closeActions: () => set({ selectedItem: null, isActionsOpen: false }),


}))