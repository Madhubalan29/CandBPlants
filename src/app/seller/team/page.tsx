import { InviteForm } from "@/components/seller/invite-form";
import { removeStaff } from "../actions";
import { requireStaff } from "@/lib/auth";

export default async function TeamPage() {
  const { db, profile } = await requireStaff({ admin: true });
  const [{ data: invites }, { data: accounts }] = await Promise.all([
    db.from("staff_invites").select("email, role").order("created_at"),
    db.from("profiles").select("email, full_name").neq("role", "customer"),
  ]);
  const signedIn = new Map((accounts ?? []).map((a) => [a.email as string, a.full_name as string | null]));

  return (
    <>
      <h1 className="mb-2 font-serif text-3xl font-bold text-earth-900">Team</h1>
      <p className="mb-6 text-gray-600">
        People listed here can add products after signing in with Google using this exact email. Sellers edit their own products; admins can edit everything and manage the team.
      </p>

      <InviteForm />

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4" /></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(invites ?? []).map((invite) => (
              <tr key={invite.email}>
                <td className="p-4 font-medium">{invite.email}</td>
                <td className="p-4 capitalize">{invite.role}</td>
                <td className="p-4 text-gray-600">{signedIn.has(invite.email) ? `Active${signedIn.get(invite.email) ? ` · ${signedIn.get(invite.email)}` : ""}` : "Hasn't signed in yet"}</td>
                <td className="p-4 text-right">
                  {invite.email !== profile.email && (
                    <form action={removeStaff}>
                      <input type="hidden" name="email" value={invite.email} />
                      <button className="text-sm font-semibold text-red-700 hover:underline">Remove</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
