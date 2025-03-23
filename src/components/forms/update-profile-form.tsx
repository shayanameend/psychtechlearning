"use client";

import type { default as zod } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { updateProfileSchema } from "~/validators/profile";

const UpdateProfileFormSchema = updateProfileSchema;

export function UpdateProfileForm({
  profile,
}: {
  profile: zod.infer<typeof UpdateProfileFormSchema>;
}) {
  const router = useRouter();

  const { token } = useUserContext();

  const form = useForm<zod.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: profile,
  });

  async function updateProfile({
    firstName,
    lastName,
    isStudent,
    notify,
  }: zod.infer<typeof UpdateProfileFormSchema>) {
    const response = await axios.put(
      paths.api.auth.profile(),
      {
        firstName,
        lastName,
        isStudent,
        notify,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  }

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      router.push(paths.app.blocks.root());
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

  const onSubmit = (data: zod.infer<typeof UpdateProfileFormSchema>) => {
    updateProfileMutation.mutate(data);
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Doe" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full")}>
            {updateProfileMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Update Profile</span>
          </Button>
        </main>
      </form>
    </Form>
  );
}
