"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "./form-field";
import BrandHeader from "./brand-header";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      
      localStorage.setItem("access_token", data.access_token);
      
      router.push("/users");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col md:items-center md:justify-center md:p-6">
      <BrandHeader className="pt-8 mb-8 text-center md:pt-0 md:w-full md:max-w-sm" />
      <div className="flex-1 bg-white rounded-t-2xl shadow-md p-8 md:flex-none md:w-full md:max-w-sm md:rounded-md">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Welcome back!</h2>
          <p className="mt-1 text_muted">Please sign in to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
      </div>
    </main>
  );
}
