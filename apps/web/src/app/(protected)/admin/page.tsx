import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session || !session.data) {
    console.log("ADMIN: not signed in");
    redirect("/auth/sign-in");
  }

  if (session.data.user.role !== "ADMIN") {
    console.log("ADMIN: not admin");
    console.log(session.data.user.role);
    redirect("/dashboard");
  }

  console.log("ADMIN: signed in");

  return <div>HI admin</div>;
};

export default page;
