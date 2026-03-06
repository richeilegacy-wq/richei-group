import AcademyPage from "./academy";
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
        console.log("DASHBOARD/ACADEMY: not signed in");
        redirect("/auth/sign-in");
      }
    
      console.log("DASHBOARD/ACADEMY: signed in");


  return <AcademyPage />;
};

export default page;