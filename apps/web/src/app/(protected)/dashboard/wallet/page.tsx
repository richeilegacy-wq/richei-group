import { headers } from "next/headers";
import Wallet from "./wallet";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session || !session.data) {
    console.log("DASHBOARD/WALLET: not signed in");
    redirect("/auth/sign-in");
  }

  console.log("DASHBOARD/WALLET: signed in");

  return <Wallet />;
};

export default page;
