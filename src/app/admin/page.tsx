"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";
import { Block } from "./_components/block";
import { NewBlockButton } from "./_components/new-block-button";

export default function AdminPage() {
  const { token } = useUserContext();

  const { data: blocksQueryResult, isSuccess: blocksQueryIsSuccess } = useQuery(
    {
      queryKey: ["blocks"],
      queryFn: async () => {
        const response = await axios.get(paths.api.blocks.root(), {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        return response.data as { data: { blocks: BlockType[] } };
      },
    },
  );

  const [content, setContent] = useState<BlockType[]>(
    blocksQueryResult?.data.blocks || [],
  );

  useEffect(() => {
    setContent(blocksQueryResult?.data.blocks || []);
  }, [blocksQueryResult?.data.blocks]);

  if (!blocksQueryIsSuccess) {
    return null;
  }

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)]",
        )}
      >
        <main
          className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-12 ")}
        >
          <header
            className={cn(
              "flex items-center justify-between py-4 border-b border-gray-200",
            )}
          >
            <h2 className={cn("text-xl font-semibold text-gray-800")}>
              Blocks
            </h2>
            <NewBlockButton />
          </header>
          <div className={cn("flex-1 grid gap-6 grid-cols-1 lg:grid-cols-2")}>
            {content.length > 0 ? (
              content.map((block) => <Block key={block.id} block={block} />)
            ) : (
              <section
                className={cn(
                  "flex items-center justify-center col-span-full h-40 text-gray-500",
                )}
              >
                <p className={cn("text-lg")}>No blocks found.</p>
              </section>
            )}
          </div>
        </main>
      </section>
    </>
  );
}
