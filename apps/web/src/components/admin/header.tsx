"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Bell, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const Header = () => {
  const { data: session, isPending, error } = authClient.useSession();
  return (
    <div className="max-md:bg-sidebar max-md:shadow-sm">
      <div className="w-full flex justify-between items-center px-4 py-2 md:mt-5 container mx-auto gap-3 lg:gap-5">
        <div className="flex gap-2 w-full">
          <SidebarTrigger className={"rounded-full"} />
          <InputGroup className="w-full max-w-4xl rounded-lg hidden md:block">
            <InputGroupInput placeholder="Search..." />
            {/* <InputGroupAddon>
              <Search />
            </InputGroupAddon> */}
          </InputGroup>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon-sm">
            <Bell />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Link href={"/admin/projects/new"}>
              <Plus />
              <span className="sr-only">Create Project</span>
            </Link>
          </Button>
          <div className="flex gap-2 items-center">
            <Button className="rounded-full" size="icon-sm">
              <User />
            </Button>
            {isPending ? (
              <Skeleton className="w-20 h-5" />
            ) : error ? (
              <p className="text-nowrap">Error</p>
            ) : (
              session?.user?.name && (
                <p className="text-nowrap hidden lg:block">
                  {session.user.name.length > 15
                    ? session.user.name.slice(0, 15) + "..."
                    : session.user.name}
                </p>
              )
            )}
          </div>
        </div>
      </div>
      <div className="md:hidden px-4 py-2">
        <InputGroup className="w-full max-w-4xl rounded-lg">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default Header;
