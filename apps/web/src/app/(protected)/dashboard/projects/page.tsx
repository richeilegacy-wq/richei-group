import React from "react";
import ProjectsPage from "./projects-page";
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
    console.log("DASHBOARD/PROJECTS: not signed in");
    redirect("/auth/sign-in");
  }

  console.log("DASHBOARD/PROJECTS: signed in");

  return <ProjectsPage />;
};

export default page;
