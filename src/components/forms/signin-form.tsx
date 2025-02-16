"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { default as Link } from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

export function SignInForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: zod.infer<typeof SignInFormSchema>) => {
    console.log(form.getValues());

    router.push(paths.app.dashboard());
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
                    href={paths.auth.forgotPassword()}
                    className={cn("underline underline-offset-4")}
                  >
                    Forgot password?
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full")}>
            Sign In
          </Button>
        </main>
        <footer>
          <p className={cn("text-sm text-center text-muted-foreground")}>
            Don&apos;t have an account?{" "}
            <Link
              href={paths.auth.signUp()}
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
