// Seeds sample users into Supabase Auth using the Admin API.
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// Run with: npm run seed

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set them in .env.local, then run: npm run seed",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_USERS = [
  { email: "alice@example.com", password: "Password123!" },
  { email: "bob@example.com", password: "Password123!" },
  { email: "carol@example.com", password: "Password123!" },
  { email: "dave@example.com", password: "Password123!" },
  { email: "erin@example.com", password: "Password123!" },
];

for (const { email, password } of SEED_USERS) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.code === "email_exists" || /already registered/i.test(error.message)) {
      console.log(`- skip  ${email} (already exists)`);
      continue;
    }
    console.error(`- error ${email}: ${error.message}`);
    continue;
  }

  console.log(`- ok    ${email} (id: ${data.user.id})`);
}

console.log("\nDone. Sample login credentials: <email> / Password123!");
