import { serverAuth } from "@/lib/server-auth";
import SignUpPage from "./sign-up";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up | Richei Group",
  description: "Sign up to your Richei Group account",
};

const page = async () => {
  const session = await serverAuth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <SignUpPage />;
};

export default page;
