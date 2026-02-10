import { serverAuth } from "@/lib/server-auth";
import SignInPage from "./sign-in";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | Richei Group",
  description: "Sign in to your Richei Group account",
};

const page = async () => {
  const session = await serverAuth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <SignInPage />;
};

export default page;
