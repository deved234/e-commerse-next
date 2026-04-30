import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SellerSidebar from "@/components/seller/SellerSidebar";

export default async function SellerLayout({ children }) {
  const session = await auth();
  if (!session || !["seller", "admin"].includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <SellerSidebar user={session.user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
