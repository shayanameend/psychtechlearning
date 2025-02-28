"use client";

import { UpdateProfileForm } from "~/components/forms/update-profile-form";
import { useUserContext } from "~/providers/user-provider";

export default function UpdateProfilePage() {
  const { user } = useUserContext();

  return (
    <>
      <UpdateProfileForm
        profile={{
          firstName: user?.profile.firstName,
          lastName: user?.profile.lastName,
          isStudent: user?.profile.isStudent,
          notify: user?.profile.notify,
        }}
      />
    </>
  );
}
