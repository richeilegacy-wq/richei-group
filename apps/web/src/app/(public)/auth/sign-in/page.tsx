import SignInPage from "./sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Richei Group",
  description: "Sign in to your Richei Group account",
};

const page = async () => {
  return <SignInPage />;
};

export default page;
