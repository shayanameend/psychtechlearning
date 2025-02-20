"use client";

import { type PropsWithChildren, useEffect } from "react";

import { GalleryVerticalEndIcon, Loader2Icon } from "lucide-react";
import { default as Link } from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const router = useRouter();

  const { isLoading, token, user } = useUserContext();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push(paths.app.auth.signIn());
    }

    if (!isLoading && token && !user) {
      router.push(paths.app.auth.signIn());
    }

    if (!isLoading && token && !user?.profile) {
      router.push(paths.app.profile.create());
    }
  }, [isLoading, token, user, router.push]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center min-h-svh")}>
        <Loader2Icon className={cn("size-8 text-primary animate-spin")} />
      </div>
    );
  }

  return (
    <>
      <header className={cn("flex gap-4 p-6 md:p-10")}>
        <Link
          href={!isLoading && token ? paths.app.dashboard.root() : paths.root()}
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
      <main>{children}</main>
    </>
  );
}
