"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "../../form-field";
import BrandHeader from "../../brand-header";

export default function NewUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create user.");
        return;
      }

      router.push("/users");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
      <section>
        <div className="flex items-center justify-end gap-2 mb-6 md:justify-between">
          <h1 className="hidden text-xl font-bold text-emerald-600 md:block">
            Veridian
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/users" className="button_secondary">
              Back to users
            </Link>
            <button onClick={handleLogout} className="button_secondary">
              Sign out
            </button>
          </div>
        </div>

        <BrandHeader className="mb-8 text-center md:hidden" />

        <div className="mx-auto max-w-sm rounded-lg border bg-white p-8 shadow-md">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-xl font-semibold">Add new user</h2>
            <p className="mt-1 text_muted">
              Provision a new account within the Veridian ecosystem.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <FormField
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p role="alert" className="error_text">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="button_primary"
            >
              {loading ? "Creating..." : "Create user"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
