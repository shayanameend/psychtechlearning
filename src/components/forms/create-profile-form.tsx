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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { createProfileSchema } from "~/validators/profile";

const CreateProfileFormSchema = createProfileSchema;

export function CreateProfileForm() {
  const router = useRouter();

  const { token } = useUserContext();

  const form = useForm<zod.infer<typeof CreateProfileFormSchema>>({
    resolver: zodResolver(CreateProfileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      isStudent: true,
      notify: true,
    },
  });

  async function createProfile({
    firstName,
    lastName,
    isStudent,
    notify,
  }: zod.infer<typeof CreateProfileFormSchema>) {
    const response = await axios.post(
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

  const createProfileMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      router.push(paths.app.courses.root());
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

  const onSubmit = (data: zod.infer<typeof CreateProfileFormSchema>) => {
    createProfileMutation.mutate(data);
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
          <FormField
            control={form.control}
            name="isStudent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you a student?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(true)}>Yes</SelectItem>
                      <SelectItem value={String(false)}>No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notify"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notify me about new features</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(true)}>Yes</SelectItem>
                      <SelectItem value={String(false)}>No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("w-full")}>
            {createProfileMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Create Profile</span>
          </Button>
        </main>
      </form>
    </Form>
  );
}
