import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AxiosError, default as axios } from "axios";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";
import { EditBlockButton } from "./edit-block-button";
import { FlashcardsDialog } from "./flashcards-dialog";
import { TestQuestionsDialog } from "./test-questions-dialog";
import { truncateText } from "./utils";
import { WeeksDialog } from "./weeks-dialog";

export function Block({ block }: Readonly<{ block: BlockType }>) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const deleteBlockMutation = useMutation({
    mutationFn: async (blockId: string) => {
      const response = await axios.delete(
        paths.api.blocks.id.root({ id: blockId }),
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  return (
    <section
      key={block.id}
      className={cn(
        "flex flex-col gap-4 border border-gray-200 p-4 rounded-lg shadow-sm",
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between border-b border-gray-200 pb-2",
        )}
      >
        <h3 className={cn("text-lg font-semibold text-gray-800")}>
          {block.blockOrder}. {block.blockTitle}
        </h3>
        <div className={cn("flex gap-2")}>
          <EditBlockButton block={block} />
          <Button
            onClick={() => {
              deleteBlockMutation.mutate(block.id);
            }}
            variant="outline"
            size="icon"
            className={cn(
              "size-9 flex items-center gap-2 border-destructive hover:bg-destructive text-destructive",
            )}
          >
            <Trash2Icon />
          </Button>
        </div>
      </header>
      <article className={cn("flex flex-col gap-4")}>
        <div className={cn("flex flex-col gap-2")}>
          <Label className={cn("font-bold")}>Description</Label>
          <p className={cn("text-sm text-gray-600")}>
            {block.blockDescription}
          </p>
        </div>
        <div className={cn("flex gap-4 justify-between items-end")}>
          <div className={cn("flex flex-col gap-2 flex-1")}>
            <Label className={cn("font-bold")}>Weeks</Label>
            <p className={cn("text-sm text-gray-600")}>
              {truncateText(block.weeksDescription, 150)}
            </p>
          </div>
          <div>
            <WeeksDialog block={block} />
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between items-end")}>
          <div className={cn("flex flex-col gap-2 flex-1")}>
            <Label className={cn("font-bold")}>Flashcards</Label>
            <p className={cn("text-sm text-gray-600")}>
              {truncateText(block.flashcardsDescription, 150)}
            </p>
          </div>
          <div>
            <FlashcardsDialog block={block} />
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between items-end")}>
          <div className={cn("flex flex-col gap-2 flex-1")}>
            <Label className={cn("font-bold")}>Sample Test</Label>
            <p className={cn("text-sm text-gray-600")}>
              {truncateText(block.sampleTestDescription, 150)}
            </p>
          </div>
          <div>
            <TestQuestionsDialog
              block={block}
              type="sample"
              title="Sample Questions"
              description="This is a set of sample questions to help you practice and reinforce your knowledge on this topic. The questions consist of multiple choice questions."
            />
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between items-end")}>
          <div className={cn("flex flex-col gap-2 flex-1")}>
            <Label className={cn("font-bold")}>Final Test</Label>
            <p className={cn("text-sm text-gray-600")}>
              {truncateText(block.finalTestDescription, 150)}
            </p>
          </div>
          <div>
            <TestQuestionsDialog
              block={block}
              type="final"
              title="Final Questions"
              description="This is a set of final questions to help you assess your knowledge on this topic. The questions consist of multiple choice questions."
            />
          </div>
        </div>
      </article>
    </section>
  );
}
