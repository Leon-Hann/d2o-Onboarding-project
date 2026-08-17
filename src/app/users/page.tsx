import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersList from "./users-list";

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
      <UsersList currentUserEmail={user.email ?? ""} />
    </main>
  );
}
