export function formatPrice(price, currency = "EGP") {
    return new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency,
    }).format(price);
}