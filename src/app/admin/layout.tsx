import type { PropsWithChildren } from "react";

import { EyeIcon, GalleryVerticalEndIcon, LogOutIcon } from "lucide-react";
import { default as Link } from "next/link";

import { HeaderButtons } from "~/app/admin/_components/header-buttons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { paths } from "~/routes/paths";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <header
        className={cn("p-6 md:p-10 flex gap-4 items-center justify-between")}
      >
        <div>
          <Link
            href={paths.app.admin.root()}
            className={cn("flex justify-center md:justify-start")}
          >
            <h1 className={cn("flex items-center gap-2 font-medium")}>
              <span
                className={cn(
                  "flex items-center justify-center rounded-md size-6 bg-primary text-primary-foreground",
                )}
              >
                <GalleryVerticalEndIcon className={cn("size-4")} />
              </span>
              <span>Psychtech Learning</span>
            </h1>
          </Link>
        </div>
        <HeaderButtons />
      </header>
      <main>{children}</main>
    </>
  );
}
