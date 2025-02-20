"use client";

import { type PropsWithChildren, useEffect } from "react";

import { GalleryVerticalEndIcon, Loader2Icon } from "lucide-react";
import { default as Image } from "next/image";
import { default as Link } from "next/link";
import { useRouter } from "next/navigation";

import { assets } from "~/assets";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  const router = useRouter();

  const { isLoading, token, user } = useUserContext();

  useEffect(() => {
    if (!isLoading && token) {
      if (user?.profile) {
        router.push(paths.app.dashboard.root());
      } else {
        router.push(paths.app.auth.profile.create());
      }
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
      <main>
        <section className={cn("grid min-h-svh lg:grid-cols-2")}>
          <div
            className={cn("flex flex-col gap-12 justify-center p-6 md:p-10")}
          >
            <div className={cn("flex justify-center gap-2 md:justify-start")}>
              <Link
                href={
                  !isLoading && token
                    ? paths.app.dashboard.root()
                    : paths.root()
                }
                className={cn("flex items-center gap-2 font-medium")}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-md size-6 bg-primary text-primary-foreground",
                  )}
                >
                  <GalleryVerticalEndIcon className={cn("size-4")} />
                </span>
                <span>Psychtech Learning</span>
              </Link>
            </div>
            <div className={cn("md:flex-1 flex items-center justify-center")}>
              <div className={cn("w-full max-w-xs")}>{children}</div>
            </div>
          </div>
          <div className={cn("relative hidden bg-muted lg:block")}>
            <Image
              src={assets.images.authBanner.src}
              alt={assets.images.authBanner.alt}
              className={cn(
                "absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale",
              )}
            />
          </div>
        </section>
      </main>
    </>
  );
}
