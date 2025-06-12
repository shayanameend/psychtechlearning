import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";

export function SampleTestToggleButton({
  block,
}: Readonly<{ block: BlockType }>) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const updateSampleTestStatusMutation = useMutation({
    mutationFn: async ({
      blockId,
      isSampleTestEnabled,
    }: {
      blockId: string;
      isSampleTestEnabled: boolean;
    }) => {
      const response = await axios.patch(
        paths.api.blocks.id.sampleTestEnable({ id: blockId }),
        { isSampleTestEnabled },
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

  const handleToggleSampleTest = () => {
    updateSampleTestStatusMutation.mutate({
      blockId: block.id,
      isSampleTestEnabled: !block.isSampleTestEnabled,
    });
  };

  return (
    <Button
      onClick={handleToggleSampleTest}
      disabled={updateSampleTestStatusMutation.isPending}
      variant={block.isSampleTestEnabled ? "outline" : "default"}
      size="sm"
      className={cn(
        block.isSampleTestEnabled &&
          "border-destructive hover:bg-destructive text-destructive",
      )}
    >
      {block.isSampleTestEnabled ? <>Disable</> : <>Enable</>}
    </Button>
  );
}
