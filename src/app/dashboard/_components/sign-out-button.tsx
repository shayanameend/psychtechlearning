"use client";

import { LogOutIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useUserContext } from "~/providers/user-provider";

export function SignOutButton() {
  const { setToken, setUser, setIsLoading } = useUserContext();

  return (
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
  );
}
