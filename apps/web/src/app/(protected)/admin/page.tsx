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
    console.log("not signed in");
    redirect("/auth/sign-in");
  }

  if (session.data.user.role !== "ADMIN") {
    console.log("not admin");
    console.log(session.data.user.role);
    redirect("/dashboard");
  }

  console.log("admin");

  return <div>HI admin</div>;
};

export default page;
