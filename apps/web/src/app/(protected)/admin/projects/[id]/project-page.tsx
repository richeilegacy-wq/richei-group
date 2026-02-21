"use client"

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

const ProjectPage = ({ id }: { id: string }) => {
  const { data, isLoading, error, refetch } = useQuery(
    orpc.project.admin.getProject.queryOptions({
      input: {
        id,
      },
    }),
  );
  return (
    <div className="px-4 py-6 container mx-auto">{JSON.stringify(data, null, 2)}</div>
  );
};

export default ProjectPage;
