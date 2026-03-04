import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable, apiKeysTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { OpenRouter } from "@openrouter/sdk";

export async function POST(req: Request) {

  const { apiKey } = await req.json();

  const user = await currentUser();

  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "User email not found" }, { status: 400 });
  }

  const client = new OpenRouter({ apiKey });

  try {
    await client.models.list();
  } catch {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  await db.insert(apiKeysTable).values({
    userEmail: email,
    apiKey,
    isActive: false
  });

  return NextResponse.json({ success: true });
}

export async function GET() {

  const user = await currentUser();

  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "User email not found" }, { status: 400 });
  }

  const keys = await db
    .select()
    .from(apiKeysTable)
    .where(eq(apiKeysTable.userEmail, email));

  return NextResponse.json(keys);
}
/* REMOVE API KEY */

export async function DELETE(req: Request) {

  const { id } = await req.json();

  await db.delete(apiKeysTable)
    .where(eq(apiKeysTable.id, id));

  return NextResponse.json({ success:true });
}

export async function PUT(req: Request) {

  const { id } = await req.json();

  await db.update(apiKeysTable)
    .set({ isActive:false });

  await db.update(apiKeysTable)
    .set({ isActive:true })
    .where(eq(apiKeysTable.id,id));

  return NextResponse.json({ success:true });
}