import IconBadge from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
import Banner from "@/components/banner";
import ChapterActions from "./_components/chapter-actions";

interface Props {
  params: { courseId: string; chapterId: string };
}

const ChapterIdPage = async ({ params: { courseId, chapterId } }: Props) => {
  const { userId } = auth();

  if (!userId) redirect("/");

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId, courseId },
    include: { muxData: true },
  });

  if (!chapter) redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner label="This chapter is unpublished. It will not be visible in the course." />
      )}

      <main className="space-y-16 p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Button asChild variant={"link"} className="px-0">
              <Link
                href={`/teacher/courses/${courseId}`}
                className="flex items-center gap-x-1 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to course setup
              </Link>
            </Button>

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter creation</h1>
                <span className="text-sm text-muted-foreground">
                  Complete all fields {completionText}
                </span>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 gap-6", "md:grid-cols-2")}>
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customise your chapter</h2>
              </div>

              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access settings</h2>
              </div>

              <ChapterAccessForm
                initialData={chapter}
                chapterId={chapterId}
                courseId={courseId}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            <ChapterVideoForm
              initialData={chapter}
              chapterId={chapterId}
              courseId={courseId}
            />
          </div>
        </div>
      </main>
    </>
  );
};
export default ChapterIdPage;
