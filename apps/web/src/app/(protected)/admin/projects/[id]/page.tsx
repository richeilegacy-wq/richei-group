import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { toast } from "sonner";
import ProjectPage from "./project-page";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
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

  const pageParams = await params;
  return (
    <Suspense fallback={null}>
      <ProjectPage id={pageParams.id} />
    </Suspense>
  );
};

export default page;
