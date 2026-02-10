import { redirect } from "next/navigation";

import { serverAuth } from "@/lib/server-auth";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await serverAuth();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <Dashboard session={session} />
    </div>
  );
}
