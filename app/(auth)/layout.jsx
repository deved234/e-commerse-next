import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-slate-900" />
          </div>
          <span className="text-white font-bold text-xl">
            Shop<span className="text-amber-400">Zone</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
