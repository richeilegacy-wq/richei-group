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
    redirect("/auth/sign-in");
  }

  if (session.data.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return <div>HI admin</div>;
};

export default page;
