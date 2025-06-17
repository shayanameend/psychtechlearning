"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import type { User } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { UserCard } from "./user-card";

export function UsersManagement() {
  const { token } = useUserContext();

  const { data: usersQueryResult, isSuccess: usersQueryIsSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get(paths.api.users.root(), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data as { data: { users: User[] } };
    },
  });

  if (!usersQueryIsSuccess) {
    return null;
  }

  const users = usersQueryResult?.data.users || [];

  return (
    <main className={cn("flex-1 flex flex-col gap-6")}>
      <header className={cn("flex items-center justify-end")}>
        <div className={cn("text-sm text-gray-600")}>
          Total Users: {users.length}
        </div>
      </header>
      <div
        className={cn(
          "flex-1 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <section
            className={cn(
              "flex items-center justify-center col-span-full h-40 text-gray-500",
            )}
          >
            <p className={cn("text-lg")}>No users found.</p>
          </section>
        )}
      </div>
    </main>
  );
}
