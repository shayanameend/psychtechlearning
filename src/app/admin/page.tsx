"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { BlocksManagement } from "./_components/blocks-management";
import { UsersManagement } from "./_components/users-management";

export default function AdminPage() {
  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)]",
        )}
      >
        <div className={cn("py-4 lg:py-0 lg:px-8 flex flex-col gap-6 h-full")}>
          <Tabs defaultValue="blocks" className={cn("flex-1 flex flex-col")}>
            <TabsList className={cn("grid w-full max-w-md grid-cols-2")}>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className={cn("flex-1")}>
              <BlocksManagement />
            </TabsContent>

            <TabsContent value="users" className={cn("flex-1")}>
              <UsersManagement />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
