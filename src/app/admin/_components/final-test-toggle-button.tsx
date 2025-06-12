import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";

export function FinalTestToggleButton({
  block,
}: Readonly<{ block: BlockType }>) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const updateFinalTestStatusMutation = useMutation({
    mutationFn: async ({
      blockId,
      isFinalTestEnabled,
    }: {
      blockId: string;
      isFinalTestEnabled: boolean;
    }) => {
      const response = await axios.patch(
        paths.api.blocks.id.finalTestEnable({ id: blockId }),
        { isFinalTestEnabled },
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

  const handleToggleFinalTest = () => {
    updateFinalTestStatusMutation.mutate({
      blockId: block.id,
      isFinalTestEnabled: !block.isFinalTestEnabled,
    });
  };

  return (
    <Button
      onClick={handleToggleFinalTest}
      disabled={updateFinalTestStatusMutation.isPending}
      variant={block.isFinalTestEnabled ? "outline" : "default"}
      size="sm"
      className={cn(
        block.isFinalTestEnabled &&
          "border-destructive hover:bg-destructive text-destructive",
      )}
    >
      {block.isFinalTestEnabled ? <>Disable</> : <>Enable</>}
    </Button>
  );
}
