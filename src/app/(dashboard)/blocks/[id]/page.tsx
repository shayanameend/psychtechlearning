import { BlockSection } from "./_components/block-section";

export default async function BlockPage({
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
      <BlockSection id={id} total={Number(total)} on={Number(on)} />
    </>
  );
}
