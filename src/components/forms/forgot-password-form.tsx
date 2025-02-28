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

async function resetPassword({
  email,
}: zod.infer<typeof ForgotPasswordFormSchema>) {
  const response = await axios.post(paths.api.auth.resetPassword(), { email });

  return response.data;
}

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      sessionStorage.setItem("token", data.token);

      router.push(paths.app.auth.verifyOTP());
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

  const onSubmit = (data: zod.infer<typeof ForgotPasswordFormSchema>) => {
    resetPasswordMutation.mutate(data);
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
            {resetPasswordMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Forgot Password</span>
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
