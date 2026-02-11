import { authClient } from "./auth-client";
import { headers } from "next/headers";

export const serverAuth = async () => {
  try {
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};
