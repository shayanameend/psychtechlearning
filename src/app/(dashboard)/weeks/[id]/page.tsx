import { WeekSection } from "./_components/week-section";

export default async function WeekPage({
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
      <WeekSection id={id} total={Number(total)} on={Number(on)} />
    </>
  );
}
