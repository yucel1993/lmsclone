import { IconBadge } from "@/components/share/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";

type Props = {
  params: {
    courseId: string;
  };
};

const CourseIdPage = async ({ params }: Props) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  console.log(categories);

  const { userId } = auth();
  if (!userId) {
    return redirect("/login");
  }
  const course = await db.course.findUnique({
    where: { id: params.courseId },
  });
  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-500">
            Complete all Fields {completionText}
          </span>
        </div>
      </div>
      {/*Under there are others grid stuff   */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize Your Course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            courseId={course.id}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <div>TODO:Chapters</div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell Your Course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
