import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {

  const user = await currentUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.primaryEmailAddress.emailAddress;

  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  const userData = dbUser[0];

  return NextResponse.json({
    source: userData?.openrouterApiKey ? "user" : "admin",
    apiKey: userData?.openrouterApiKey || null
  });
}