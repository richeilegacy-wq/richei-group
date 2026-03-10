import PublicNav from "@/components/landing/public-nav";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <PublicNav />
      <main className="pt-20">{children}</main>
    </div>
  );
};

export default AuthLayout;
