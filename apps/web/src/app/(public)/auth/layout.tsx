import PublicNav from "@/components/landing/public-nav";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <PublicNav className="fixed w-full bg-white/50 backdrop-blur-md px-6 py-3"/>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
