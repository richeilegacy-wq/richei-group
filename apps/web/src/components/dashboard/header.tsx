"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Bell, Mail, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

const Header = () => {
  const { data: session, isPending, error } = authClient.useSession();
  return (
    <div className="w-full flex justify-between items-center px-4 md:px-10 lg:px-16 py-6 container mx-auto gap-3 lg:gap-5">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1a2e28]">
            ASSET DASHBOARD
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
            Welcome back, your portfolio is up <span className="text-gray-900 font-semibold">4.2% today.</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <InputGroup className="w-full max-w-md rounded-full bg-gray-100/50 border-none hidden md:flex">
          <InputGroupAddon className="pl-4">
            <Search className="w-4 h-4 text-gray-400" />
          </InputGroupAddon>
          <InputGroupInput 
            placeholder="Search assets..." 
            className="bg-transparent border-none focus-visible:ring-0 placeholder:text-gray-400"
          />
        </InputGroup>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-100/50 hover:bg-gray-200/50">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-100/50 hover:bg-gray-200/50">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="sr-only">Messages</span>
          </Button>
          <div className="flex gap-2 items-center">
            <Button className="rounded-full w-10 h-10 bg-gray-100/50 hover:bg-gray-200/50 border-none" variant="ghost" size="icon">
              <User className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
