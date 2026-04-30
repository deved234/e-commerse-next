import { useState, useEffect, useCallback } from "react";

export function useProducts(initialFilters = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        sort: "createdAt",
        order: "desc",
        page: 1,
        ...initialFilters,
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, val]) => {
                if (val !== "") params.append(key, val);
            });

            const res = await fetch(`/api/products?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch products");

            const data = await res.json();
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const updateFilters = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    const changePage = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    return {
        products,
        loading,
        error,
        pagination,
        filters,
        updateFilters,
        changePage,
        refetch: fetchProducts,
    };
}