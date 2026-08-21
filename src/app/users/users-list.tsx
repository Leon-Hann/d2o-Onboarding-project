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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/users?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Failed to load users.");
          return;
        }

        if (!cancelled) {
          setUsers(data.users);
          setHasMore(data.hasMore);
        }
      } catch {
        if (!cancelled) setError("Something went wrong. Please try again.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router, page]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">User list</h1>
          <p className="text_muted">Manage and monitor enterprise user accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/users/form" className="button_secondary">
            New user
          </Link>
          <button onClick={handleLogout} className="button_secondary">
            Sign out
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!users && !error && (
        <p className="text-sm text-neutral-500">Loading users...</p>
      )}

      {users && (
        <div className="overflow-hidden rounded-lg border bg-white shadow-md">
          <div className="hidden bg-neutral-50 md:grid md:grid-cols-3">
            <div className="table_header">Email</div>
            <div className="table_header">Created</div>
            <div className="table_header">Last sign-in</div>
          </div>

          {users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-1 gap-1 border-t p-4 text-sm transition-colors hover:bg-emerald-50 md:grid-cols-3 md:gap-0 md:p-0"
            >
              <div className="font-medium md:px-4 md:py-2 md:font-normal">
                {u.email}
              </div>
              <div className="text_muted md:px-4 md:py-2">
                <span className="md:hidden">Created: </span>
                {new Date(u.createdAt).toLocaleString()}
              </div>
              <div className="text_muted md:px-4 md:py-2">
                <span className="md:hidden">Last sign-in: </span>
                {u.lastSignInAt
                  ? new Date(u.lastSignInAt).toLocaleString()
                  : "Never"}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t p-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="button_secondary disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-500">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
              className="button_secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
