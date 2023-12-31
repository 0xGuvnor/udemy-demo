import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params: { courseId } }: { params: { courseId: string } },
) => {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorised", { status: 401 });

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) return new NextResponse("Not Found", { status: 404 });

    const unpublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.error("[UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
