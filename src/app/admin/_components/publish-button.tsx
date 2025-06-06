import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType } from "~/types/block";

export function PublishButton({ block }: Readonly<{ block: BlockType }>) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const updatePublishStatusMutation = useMutation({
    mutationFn: async ({
      blockId,
      isPublished,
    }: {
      blockId: string;
      isPublished: boolean;
    }) => {
      const response = await axios.patch(
        paths.api.blocks.id.publish({ id: blockId }),
        { isPublished },
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

  const handleTogglePublish = () => {
    updatePublishStatusMutation.mutate({
      blockId: block.id,
      isPublished: !block.isPublished,
    });
  };

  return (
    <Button
      onClick={handleTogglePublish}
      disabled={updatePublishStatusMutation.isPending}
      variant={block.isPublished ? "outline" : "default"}
      size="sm"
      className={cn(
        "flex items-center gap-2 transition-all",
        block.isPublished
          ? "border-orange-500 text-orange-600 hover:bg-orange-50"
          : "bg-green-600 hover:bg-green-700 text-white",
      )}
    >
      {block.isPublished ? <>Unpublish</> : <>Publish</>}
    </Button>
  );
}
