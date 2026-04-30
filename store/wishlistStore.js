import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const exists = get().items.find((i) => i._id === product._id);
                if (!exists) {
                    set((state) => ({ items: [...state.items, product] }));
                }
            },

            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i._id !== productId),
                })),

            toggleItem: (product) => {
                const exists = get().items.find((i) => i._id === product._id);
                if (exists) {
                    get().removeItem(product._id);
                } else {
                    get().addItem(product);
                }
            },

            isInWishlist: (productId) =>
                get().items.some((i) => i._id === productId),

            clearWishlist: () => set({ items: [] }),

            getTotalItems: () => get().items.length,
        }),
        {
            name: "wishlist-storage",
            partialize: (state) => ({ items: state.items }),
        }
    )
);

export default useWishlistStore;