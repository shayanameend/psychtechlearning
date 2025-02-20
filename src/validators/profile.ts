import { default as zod } from "zod";

const createProfileSchema = zod.object({
  firstName: zod
    .string({
      message: "Invalid First Name",
    })
    .min(2, {
      message: "First Name must be at least 2 characters long",
    })
    .max(32, {
      message: "First Name must be at most 32 characters long",
    }),
  lastName: zod
    .string({
      message: "Invalid Last Name",
    })
    .min(2, {
      message: "Last Name must be at least 2 characters long",
    })
    .max(32, {
      message: "Last Name must be at most 32 characters long",
    }),
  isStudent: zod.boolean({
    message: "Invalid Student Status",
  }),
  notify: zod.boolean({
    message: "Invalid Notification Status",
  }),
});

const updateProfileSchema = zod.object({
  firstName: zod
    .string({
      message: "Invalid First Name",
    })
    .min(2, {
      message: "First Name must be at least 2 characters long",
    })
    .max(32, {
      message: "First Name must be at most 32 characters long",
    })
    .optional(),
  lastName: zod
    .string({
      message: "Invalid Last Name",
    })
    .min(2, {
      message: "Last Name must be at least 2 characters long",
    })
    .max(32, {
      message: "Last Name must be at most 32 characters long",
    })
    .optional(),
  isStudent: zod
    .boolean({
      message: "Invalid Student Status",
    })
    .optional(),
  notify: zod
    .boolean({
      message: "Invalid Notification Status",
    })
    .optional(),
});

export { createProfileSchema, updateProfileSchema };
