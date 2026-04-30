import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar user={session.user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
