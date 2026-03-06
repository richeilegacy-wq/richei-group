import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export default async function DashboardPage() {

    const session = await authClient.getSession({
        fetchOptions: {
          headers: await headers(),
        },
      });

    if (!session || !session.data) {
      console.log("DASHBOARD: not signed in");
      redirect("/auth/sign-in");
    }
  
    console.log("DASHBOARD: signed in");
    
  return (
    <Dashboard />
  );
}
