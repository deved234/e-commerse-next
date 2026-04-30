import useWishlistStore from "@/store/wishlistStore";
import { toast } from "sonner";

export function useWishlist() {
    const { items, toggleItem, isInWishlist, clearWishlist, getTotalItems } =
        useWishlistStore();

    const handleToggle = (product) => {
        const wasInWishlist = isInWishlist(product._id);
        toggleItem(product);
        toast.success(
            wasInWishlist ? "Removed from wishlist" : "Added to wishlist"
        );
    };

    return {
        items,
        toggleItem: handleToggle,
        isInWishlist,
        clearWishlist,
        totalItems: getTotalItems(),
    };
}