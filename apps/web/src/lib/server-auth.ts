import { authClient } from "./auth-client";
import { headers } from "next/headers";

export const serverAuth = async () => {
  const data = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });
  return data;
};
