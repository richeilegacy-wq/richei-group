import { serverAuth } from "@/lib/server-auth";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await serverAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {session?.user && <p>Welcome {session.user.name}</p>}
      <Dashboard session={session} />
    </div>
  );
}
