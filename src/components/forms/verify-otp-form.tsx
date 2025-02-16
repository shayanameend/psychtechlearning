"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const VerifyOTPFormSchema = zod.object({
  otp: zod
    .string({
      message: "Invalid OTP",
    })
    .min(6, {
      message: "OTP must be at least 6 characters",
    }),
});

export function VerifyOTPForm() {
  const form = useForm<zod.infer<typeof VerifyOTPFormSchema>>({
    resolver: zodResolver(VerifyOTPFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: zod.infer<typeof VerifyOTPFormSchema>) => {
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
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="********" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full")}>
            Verify OTP
          </Button>
        </main>
        <footer>
          <p className={cn("text-sm text-center text-muted-foreground")}>
            Didn&apos;t get an OTP?{" "}
            <Button
              type="button"
              variant="link"
              className={cn("p-0 text-inherit underline underline-offset-4")}
            >
              Resend
            </Button>
          </p>
        </footer>
      </form>
    </Form>
  );
}
