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

const VerifyOTPFormSchema = zod.object({
  otp: zod
    .string({
      message: "Invalid OTP",
    })
    .min(6, {
      message: "OTP must be at least 6 characters",
    }),
});

async function verifyOTP({ otp }: zod.infer<typeof VerifyOTPFormSchema>) {
  const token = sessionStorage.getItem("token");

  const response = await axios.post(
    paths.api.auth.verifyOTP(),
    { otp },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

async function resendOTP() {
  const token = sessionStorage.getItem("token");

  const response = await axios.post(
    paths.api.auth.resendOTP(),
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export function VerifyOTPForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof VerifyOTPFormSchema>>({
    resolver: zodResolver(VerifyOTPFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      localStorage.setItem("token", data.token);

      router.push(paths.app.profile.create());
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

  const resendOTPMutation = useMutation({
    mutationFn: resendOTP,
    onSuccess: ({ info }) => {
      toast.success(info.message);
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

  const onSubmit = (data: zod.infer<typeof VerifyOTPFormSchema>) => {
    verifyOTPMutation.mutate(data);
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
              onClick={() => resendOTPMutation.mutate()}
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
