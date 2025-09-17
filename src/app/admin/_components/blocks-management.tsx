"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";
import { Block } from "./block";
import { NewBlockButton } from "./new-block-button";
import { Loader2Icon } from "lucide-react";

export function BlocksManagement() {
  const { token } = useUserContext();

  const { data: blocksQueryResult, isPending: blocksQueryIsPending } = useQuery(
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

  if (blocksQueryIsPending) {
    return (
      <div className={cn("flex items-center justify-center")}>
        <Loader2Icon className={cn("size-8 text-primary animate-spin")} />
      </div>
    );
  }

  return (
    <main className={cn("flex-1 flex flex-col gap-6")}>
      <header className={cn("flex items-center justify-end")}>
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
  );
}
