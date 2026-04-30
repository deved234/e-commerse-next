import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            // فتح/غلق الـ cart drawer
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            closeCart: () => set({ isOpen: false }),

            // إضافة منتج
            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existing = items.find((i) => i._id === product._id);

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i._id === product._id
                                ? { ...i, quantity: i.quantity + quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity }] });
                }
            },

            // إزالة منتج
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i._id !== productId),
                })),

            // تعديل الكمية
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return get().removeItem(productId);
                set((state) => ({
                    items: state.items.map((i) =>
                        i._id === productId ? { ...i, quantity } : i
                    ),
                }));
            },

            // مسح الـ cart
            clearCart: () => set({ items: [] }),

            // Computed values
            getTotalItems: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),

            getSubtotal: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: "cart-storage",
            // بنحفظ الـ items بس في localStorage
            partialize: (state) => ({ items: state.items }),
        }
    )
);

export default useCartStore;