"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { Loader2Icon } from "lucide-react";
import { default as Link } from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { default as zod } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { paths } from "~/routes/paths";

const SignInFormSchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

async function signIn({ email, password }: zod.infer<typeof SignInFormSchema>) {
  const response = await axios.post(paths.api.auth.signIn(), {
    email,
    password,
  });

  return response.data;
}

export function SignInForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "shayan.ameen.developer@gmail.com",
      password: "12345678",
    },
  });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: ({ data, info }) => {
      switch (info.message) {
        case "OTP Sent Successfully!":
          toast.success(info.message);

          sessionStorage.setItem("token", data.token);

          router.push(paths.app.auth.verifyOTP());
          break;
        case "Sign In Successful!":
          toast.success(info.message);

          localStorage.setItem("token", data.token);

          router.push(paths.app.dashboard.root());
          break;
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = (data: zod.infer<typeof SignInFormSchema>) => {
    signInMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        <main className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="me@example.com" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="********" type="password" />
                </FormControl>
                <FormMessage />
                <FormDescription className={cn("text-right")}>
                  <Link
                    href={paths.app.auth.forgotPassword()}
                    className={cn("underline underline-offset-4")}
                  >
                    Forgot password?
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid || signInMutation.isPending}
            type="submit"
            className={cn("w-full")}
          >
            {signInMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Sign In</span>
          </Button>
        </main>
        <footer>
          <p className={cn("text-sm text-center text-muted-foreground")}>
            Don&apos;t have an account?{" "}
            <Link
              href={paths.app.auth.signUp()}
              className={cn("underline underline-offset-4")}
            >
              Sign Up
            </Link>
          </p>
        </footer>
      </form>
    </Form>
  );
}
