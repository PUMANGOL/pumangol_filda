import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * One-time seed endpoint. Protect with a secret header in production.
 * POST /api/users/seed with { "secret": "SEED_SECRET" } in body.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const secret = process.env.SEED_SECRET ?? "pumangol-filda-2026";

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const defaultUsers = [
    { username: "admin", password: "Pumangol2024!", fullName: "Administrador", role: "admin" },
    { username: "comercial1", password: "Pumangol2024!", fullName: "Equipa Comercial 1", role: "staff" },
    { username: "comercial2", password: "Pumangol2024!", fullName: "Equipa Comercial 2", role: "staff" },
    { username: "comercial3", password: "Pumangol2024!", fullName: "Equipa Comercial 3", role: "staff" },
    { username: "comercial4", password: "Pumangol2024!", fullName: "Equipa Comercial 4", role: "staff" },
  ];

  const results = [];

  for (const u of defaultUsers) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, u.username))
      .limit(1);

    if (!existing.length) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      const [created] = await db
        .insert(users)
        .values({ username: u.username, passwordHash, fullName: u.fullName, role: u.role })
        .returning({ id: users.id, username: users.username });
      results.push({ ...created, created: true });
    } else {
      results.push({ id: existing[0].id, username: u.username, created: false });
    }
  }

  return NextResponse.json({ users: results });
}
