import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";

export function FlashcardsToggleButton({
  block,
}: Readonly<{ block: BlockType }>) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const updateFlashcardsStatusMutation = useMutation({
    mutationFn: async ({
      blockId,
      isFlashcardsEnabled,
    }: {
      blockId: string;
      isFlashcardsEnabled: boolean;
    }) => {
      const response = await axios.patch(
        paths.api.blocks.id.flashcardsEnable({ id: blockId }),
        { isFlashcardsEnabled },
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

  const handleToggleFlashcards = () => {
    updateFlashcardsStatusMutation.mutate({
      blockId: block.id,
      isFlashcardsEnabled: !block.isFlashcardsEnabled,
    });
  };

  return (
    <Button
      onClick={handleToggleFlashcards}
      disabled={updateFlashcardsStatusMutation.isPending}
      variant={block.isFlashcardsEnabled ? "outline" : "default"}
      size="sm"
      className={cn(
        block.isFlashcardsEnabled &&
          "border-destructive hover:bg-destructive text-destructive",
      )}
    >
      {block.isFlashcardsEnabled ? <>Disable</> : <>Enable</>}
    </Button>
  );
}
