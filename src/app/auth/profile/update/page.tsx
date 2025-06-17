"use client";

import { UpdateProfileForm } from "~/components/forms/update-profile-form";
import { useUserContext } from "~/providers/user-provider";

export default function UpdateProfilePage() {
  const { user } = useUserContext();

  if (!user?.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          No profile found. Please create a profile first.
        </p>
      </div>
    );
  }

  return (
    <>
      <UpdateProfileForm
        profile={{
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          isStudent: user.profile.isStudent,
          notify: user.profile.notify,
        }}
      />
    </>
  );
}
