import { authClient } from "./auth-client";
import { headers } from "next/headers";

export const serverAuth = async () => {
  try {
    const reqHeaders = await headers();

    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers: reqHeaders,
      },
    });

    if (error) {
      console.error("[serverAuth] getSession returned error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("[serverAuth] Exception during getSession:", err);
    return null;
  }
};
