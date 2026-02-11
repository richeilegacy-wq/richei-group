import SignUpPage from "./sign-up";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Richei Group",
  description: "Sign up to your Richei Group account",
};

const page = async () => {
  return <SignUpPage />;
};

export default page;
