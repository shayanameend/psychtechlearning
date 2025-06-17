"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import type { User } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const { token, user: currentUser } = useUserContext();
  const queryClient = useQueryClient();

  const toggleBlockMutation = useMutation({
    mutationFn: async ({ isBlocked }: { isBlocked: boolean }) => {
      const response = await axios.patch(
        paths.api.users.id.block({ id: user.id }),
        { isBlocked },
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.info.message || "Failed to update user",
        );
      }
    },
  });

  const handleToggleBlock = () => {
    toggleBlockMutation.mutate({ isBlocked: !user.isBlocked });
  };

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <Card className={cn("relative")}>
      <CardHeader className={cn("pb-3")}>
        <div className={cn("flex items-center justify-between")}>
          <CardTitle className={cn("text-lg font-medium")}>
            {user.profile?.firstName && user.profile?.lastName
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : "No Profile"}
          </CardTitle>
          <div className={cn("flex gap-2")}>
            {user.isBlocked ? (
              <span
                className={cn(
                  "px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full",
                )}
              >
                Blocked
              </span>
            ) : (
              <span
                className={cn(
                  "px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full",
                )}
              >
                Active
              </span>
            )}
            {user.isVerified ? (
              <span
                className={cn(
                  "px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full",
                )}
              >
                Verified
              </span>
            ) : (
              <span
                className={cn(
                  "px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full",
                )}
              >
                Unverified
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4")}>
        <div className={cn("space-y-2 text-sm")}>
          <div className={cn("flex justify-between")}>
            <span className={cn("font-medium text-gray-600")}>Email:</span>
            <span className={cn("text-gray-900")}>{user.email}</span>
          </div>
          <div className={cn("flex justify-between")}>
            <span className={cn("font-medium text-gray-600")}>Role:</span>
            <span className={cn("text-gray-900 capitalize")}>
              {user.role.toLowerCase()}
            </span>
          </div>
          <div className={cn("flex justify-between")}>
            <span className={cn("font-medium text-gray-600")}>Joined:</span>
            <span className={cn("text-gray-900")}>
              {format(new Date(user.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        {!isCurrentUser && (
          <div className={cn("pt-2 border-t")}>
            <Button
              onClick={handleToggleBlock}
              disabled={toggleBlockMutation.isPending}
              variant={user.isBlocked ? "default" : "destructive"}
              size="sm"
              className={cn("w-full")}
            >
              {toggleBlockMutation.isPending
                ? "Processing..."
                : user.isBlocked
                  ? "Unblock"
                  : "Block"}
            </Button>
          </div>
        )}

        {isCurrentUser && (
          <div className={cn("pt-2 border-t")}>
            <p className={cn("text-xs text-gray-500 text-center")}>
              This is your account
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
