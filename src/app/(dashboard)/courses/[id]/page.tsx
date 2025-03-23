import { CourseSection } from "./_components/course-section";

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ total: string; on: string }>;
}) {
  const { id } = await params;
  const { total, on } = await searchParams;

  return (
    <>
      <CourseSection id={id} total={Number(total)} on={Number(on)} />
    </>
  );
}
