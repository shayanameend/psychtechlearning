import type { PropsWithChildren } from "react";

import { GalleryVerticalEndIcon, LogOutIcon } from "lucide-react";
import { default as Link } from "next/link";

import { cn } from "~/lib/utils";
import { paths } from "~/routes/paths";
import { SignOutButton } from "./_components/sign-out-button";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <header
        className={cn("p-6 md:p-10 flex gap-4 items-center justify-between")}
      >
        <Link
          href={paths.app.dashboard.root()}
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
        <SignOutButton />
      </header>
      <main>{children}</main>
    </>
  );
}
