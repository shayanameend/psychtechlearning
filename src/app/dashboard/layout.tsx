import type { PropsWithChildren } from "react";

import { GalleryVerticalEndIcon } from "lucide-react";
import { default as Link } from "next/link";

import { cn } from "~/lib/utils";
import { paths } from "~/routes/paths";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <header className={cn("flex gap-4 p-6 md:p-10")}>
        <Link
          href={paths.root()}
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
      </header>
      <main>
        <section
          className={cn(
            "p-6 md:p-10 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)]",
          )}
        >
          {children}
        </section>
      </main>
    </>
  );
}
