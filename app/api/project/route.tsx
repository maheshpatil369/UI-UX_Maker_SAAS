// app/api/project/route.tsx
import { currentUser } from "@clerk/nextjs/server";
import { projectsTable, ScreenConfigTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { and, eq, desc } from "drizzle-orm";
import { usersTable } from "@/config/schema";

export async function POST(request: Request) {
  try {
    const { userInput, device, projectId } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    console.log("USER EMAIL:", email);

const dbUser = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, email));
  

const userData = dbUser[0];

    const existing = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.projectId, projectId));
      console.log("DB USER DATA:", userData);
console.log("USER API KEY:", userData?.openrouterApiKey ? "HAS KEY" : "NO KEY");

    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

if (!userData?.openrouterApiKey) {

  console.log("Using ADMIN fallback API key");

  const projectCount = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.userId, email));

  console.log("Current Project Count:", projectCount.length);

  if (projectCount.length >= 2) {

    console.log("Project limit reached for free user");

    return NextResponse.json(
      { error: "Free limit reached. Add your OpenRouter API key." },
      { status: 403 }
    );
  }

  console.log("Project allowed for free user");
}

    const result = await db
      .insert(projectsTable)
      .values({
        projectId,
        userId: user.primaryEmailAddress.emailAddress,
        device,
        userInput,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST /project error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { projectId, previewImage } = await request.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .update(projectsTable)
      .set({
        previewImage: previewImage,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(projectsTable.projectId, projectId),
          eq(projectsTable.userId, user.primaryEmailAddress.emailAddress)
        )
      )
      .returning();

    if (result.length === 0) {
        return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PUT /project error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId");
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // IF projectId is missing, return list of all projects for the user (Home Screen)
    if (!projectId) {
      const allProjects = await db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.userId, userEmail))
        .orderBy(desc(projectsTable.createdAt));

      return NextResponse.json({ projects: allProjects });
    }

    // IF projectId is provided, return specific project detail (Project Page)
    const project = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.projectId, projectId),
          eq(projectsTable.userId, userEmail)
        )
      );

    if (!project.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const screenConfig = await db
      .select()
      .from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId));

    return NextResponse.json({
      projectDetail: project[0],
      screenConfig,
    });
  } catch (error) {
    console.error("GET /api/project ERROR:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}