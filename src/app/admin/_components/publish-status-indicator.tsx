import { CheckCircle, Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import type { BlockType } from "~/types/block";

export function PublishStatusIndicator({
  block,
}: Readonly<{ block: BlockType }>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        block.isPublished
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-yellow-100 text-yellow-800 border border-yellow-200",
      )}
    >
      {block.isPublished ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Published
        </>
      ) : (
        <>
          <Clock className="h-3 w-3" />
          Draft
        </>
      )}
    </div>
  );
}
