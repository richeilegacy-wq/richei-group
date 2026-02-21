import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import ProjectsPage from "./projects-page";

const page = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session || !session.data) {
    toast.error("Unauthorised!");
    redirect("/auth/sign-in");
  }

  if (session.data.user.role !== "ADMIN") {
    toast.error("Unauthorised!");
    redirect("/dashboard");
  }
  return <ProjectsPage />;
};

export default page;
