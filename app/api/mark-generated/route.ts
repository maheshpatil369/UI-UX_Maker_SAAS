import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { projectsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { projectId } = await req.json();

  await db
    .update(projectsTable)
    .set({
      isGenerated: 1,
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.projectId, projectId));

  return NextResponse.json({ success: true });
}