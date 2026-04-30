import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth({ required = false, role = null } = {}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const loading = status === "loading";
    const authenticated = status === "authenticated";

    useEffect(() => {
        if (loading) return;

        // لو مطلوب login وملوش session
        if (required && !authenticated) {
            router.push("/login");
            return;
        }

        // لو مطلوب role معين
        if (role && session?.user?.role !== role) {
            router.push("/");
        }
    }, [loading, authenticated, required, role, session, router]);

    return {
        user: session?.user,
        session,
        loading,
        authenticated,
        isAdmin: session?.user?.role === "admin",
        isSeller: session?.user?.role === "seller",
        isCustomer: session?.user?.role === "customer",
    };
}