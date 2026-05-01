import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage() {
  await connectDB();
  const users = await User.find()
    .select("-password -emailVerificationToken -resetPasswordToken")
    .sort({ createdAt: -1 })
    .lean()
    .then((docs) => JSON.parse(JSON.stringify(docs)));

  return (
    <div className="text-white space-y-6">
      <div>
        <h1 className="text-3xl font-black">Users</h1>
        <p className="text-slate-400 mt-1">
          {users.length} registered accounts
        </p>
      </div>
      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
