"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ApiUser = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
};

export default function UsersList() {
  const router = useRouter();
  const [users, setUsers] = useState<ApiUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Failed to load users.");
          return;
        }

        if (!cancelled) setUsers(data.users);
      } catch {
        if (!cancelled) setError("Something went wrong. Please try again.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/users/form"
            className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-neutral-50"
          >
            New user
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!users && !error && (
        <p className="text-sm text-neutral-500">Loading users...</p>
      )}

      {users && (
        <div className="hidden md:block overflow-hidden border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-900">
              <tr>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Last sign-in</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 text-neutral-500">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-neutral-500">
                    {u.lastSignInAt
                      ? new Date(u.lastSignInAt).toLocaleString()
                      : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {users && (
        <div className="flex flex-col gap-2 md:hidden">
          {users.map((u) => (
            <div key={u.id} className="border rounded-md p-4">
              <p className="font-medium">{u.email}</p>
              <p className="text-sm text-neutral-500">
                Created: {new Date(u.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-neutral-500">
                Last sign-in: {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString() : "Never"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
