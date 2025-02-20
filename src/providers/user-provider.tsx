"use client";

import type { Role } from "@prisma/client";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

import { useMutation } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { Loader2Icon } from "lucide-react";
import { cn } from "~/lib/utils";
import { paths } from "~/routes/paths";

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    isStudent: boolean;
    notify: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const UserContext = createContext<{
  isLoading: boolean;
  token: string | null;
  user: User | null;
  setIsLoading: Dispatch<SetStateAction<boolean>> | null;
  setToken: Dispatch<SetStateAction<string | null>> | null;
  setUser: Dispatch<SetStateAction<User | null>> | null;
}>({
  isLoading: false,
  token: null,
  user: null,
  setIsLoading: null,
  setToken: null,
  setUser: null,
});

export const useUserContext = () => {
  return useContext(UserContext);
};

async function refresh() {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    paths.api.auth.refresh(),
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export function UserProvider({ children }: Readonly<PropsWithChildren>) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const refreshMutation = useMutation({
    mutationFn: refresh,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }

      setToken(null);
      setUser(null);

      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      refreshMutation.mutate();
    } else {
      setIsLoading(false);
    }
  }, [refreshMutation.mutate]);

  useEffect(() => {
    const localToken = localStorage.getItem("token");

    if (!localToken && !pathname.includes(paths.app.auth.root())) {
      return router.push(paths.app.auth.signIn());
    }

    if (
      !isLoading &&
      !token &&
      !user &&
      !pathname.includes(paths.app.auth.root())
    ) {
      return router.push(paths.app.auth.signIn());
    }

    if (
      !isLoading &&
      token &&
      !user?.profile &&
      pathname.includes(paths.app.auth.root())
    ) {
      return router.push(paths.app.auth.profile.create());
    }

    if (
      !isLoading &&
      token &&
      user?.profile &&
      pathname.includes(paths.app.auth.root())
    ) {
      if (user.role === "ADMIN") {
        return router.push(paths.app.admin.root());
      }

      return router.push(paths.app.dashboard.root());
    }

    if (
      !isLoading &&
      token &&
      user?.profile &&
      pathname.includes(paths.app.admin.root())
    ) {
      if (user.role !== "ADMIN") {
        return router.push(paths.app.dashboard.root());
      }
    }
  }, [isLoading, token, user, router.push, pathname]);

  if (!isLoading) {
    return (
      <UserContext.Provider
        value={{
          isLoading,
          token,
          user,
          setIsLoading,
          setToken,
          setUser,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  return (
    <div className={cn("flex items-center justify-center min-h-svh")}>
      <Loader2Icon className={cn("size-8 text-primary animate-spin")} />
    </div>
  );
}
