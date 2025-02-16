"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { default as Link } from "next/link";
import { useForm } from "react-hook-form";
import { default as zod } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { paths } from "~/routes/paths";

const ForgotPasswordFormSchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
});

export function ForgotPasswordForm() {
  const form = useForm<zod.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: zod.infer<typeof ForgotPasswordFormSchema>) => {
    console.log(form.getValues());
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
          <Button type="submit" className={cn("w-full")}>
            Forgot Password
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
