"use client";

import { EyeIcon, LogOutIcon } from "lucide-react";
import { default as Link } from "next/link";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

export function HeaderButtons() {
  const { user, setToken, setUser, setIsLoading } = useUserContext();

  return (
    <div className={cn("flex gap-4 items-center")}>
      {user && user.role === "ADMIN" && (
        <Button variant="outline" size="icon" className={cn("size-6")}>
          <Link href={paths.app.courses.root()}>
            <EyeIcon className={cn("size-4")} />
          </Link>
        </Button>
      )}
      <Button
        onClick={() => {
          localStorage.removeItem("token");

          setToken?.(null);
          setUser?.(null);
          setIsLoading?.(false);
        }}
        variant="outline"
        size="icon"
        className="size-6 [&_svg]:size-3"
      >
        <LogOutIcon />
      </Button>
    </div>
  );
}
