import useCartStore from "@/store/cartStore";
import { toast } from "sonner";

export function useCart() {
    const {
        items,
        isOpen,
        toggleCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
    } = useCartStore();

    const handleAddItem = (product, quantity = 1) => {
        addItem(product, quantity);
        toast.success(`${product.name} added to cart`);
    };

    const handleRemoveItem = (productId, productName) => {
        removeItem(productId);
        toast.success(`${productName} removed from cart`);
    };

    return {
        items,
        isOpen,
        toggleCart,
        closeCart,
        addItem: handleAddItem,
        removeItem: handleRemoveItem,
        updateQuantity,
        clearCart,
        totalItems: getTotalItems(),
        subtotal: getSubtotal(),
    };
}