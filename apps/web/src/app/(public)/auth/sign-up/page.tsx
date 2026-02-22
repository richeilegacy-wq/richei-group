import SignUpPage, { ComingSoonPage } from "./sign-up";
import type { Metadata } from "next";
import { env } from "@richei-group/env/web";

const isProduction = env.NEXT_PUBLIC_NODE_ENV === "production";

export const metadata: Metadata = {
  title: "Sign Up | Richei Group",
  description: "Sign up to your Richei Group account",
};

const page = async () => {
  return isProduction ? <ComingSoonPage /> : <SignUpPage />;
};

export default page;
