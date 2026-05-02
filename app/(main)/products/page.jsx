
import { Suspense } from "react";
import ProductsClient from "@/components/product/ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
