import { revalidatePath} from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  // Verify secret token
  if (authHeader !== `Bearer ${REVALIDATE_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type = "all", slug } = await request.json();

    // Revalidate based on type
    if (type === "posts" || type === "all") {
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
      if (slug) {
        revalidatePath(`/blog/${slug}`);
      }
    }

    if (type === "projects" || type === "all") {
      revalidatePath("/projects");
      revalidatePath("/projects/[slug]", "page");
      if (slug) {
        revalidatePath(`/projects/${slug}`);
      }
    }

    if (type === "materials" || type === "all") {
      revalidatePath("/courses");
    }

    return NextResponse.json(
      { message: `Revalidated ${type}${slug ? ` - ${slug}` : ""}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Revalidation failed", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
