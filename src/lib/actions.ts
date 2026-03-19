"use server";

import { signIn } from "@/auth";
import { auth } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // We attempt sign-in; the authorized() callback in auth.config.ts
    // will handle the redirect to /admin or /dashboard based on role.
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/dashboard", // Will be overridden by auth.config.ts for super_admin
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials. Please check your email and password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    throw error;
  }
}
