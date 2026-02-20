"use client";

import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const NewProject = () => {
  const createMutation = useMutation(
    orpc.project.create.mutationOptions({
      onSuccess: () => {
        toast.success("Project created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return <div>NewProject</div>;
};

export default NewProject;
