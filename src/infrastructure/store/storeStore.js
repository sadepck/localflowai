import { create } from 'zustand'

export const useStoreStore = create((set) => ({
  currentStore: null,
  stores: [],
  setCurrentStore: (store) => set({ currentStore: store }),
  setStores: (stores) => set({ stores }),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
}))
