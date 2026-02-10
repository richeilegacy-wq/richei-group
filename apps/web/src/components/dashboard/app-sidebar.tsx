"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    title: "Portfolio",
    href: "/dashboard",
    icon: "/icons/dashboard/portfolio.svg",
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: "/icons/dashboard/wallet.svg",
  },
  {
    title: "Academy",
    href: "/dashboard/academy",
    icon: "/icons/dashboard/academy.svg",
  },
  {
    title: "Marketplace",
    href: "/dashboard/marketplace",
    icon: "/icons/dashboard/marketplace.svg",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader className="items-center pt-10 pb-6">
        <Image
          src="/images/logo.png"
          alt="RichHei Group"
          width={90}
          height={50}
          className="object-contain"
          priority
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-5">
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.href as never}>
                    <SidebarMenuButton
                      isActive={isActive}
                      size="lg"
                      className={
                        isActive
                          ? "bg-primary text-primary-foreground rounded-lg hover:bg-primary hover:text-primary-foreground"
                          : "text-sidebar-foreground rounded-lg hover:bg-transparent hover:text-sidebar-foreground"
                      }
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={20}
                        height={20}
                        className={isActive ? "invert" : "invert-[0.7]"}
                      />
                      <span className="text-sm font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <Button onClick={async () => {
          await authClient.signOut();
          router.push("/");
        }} size="lg" className="w-full rounded">
          <LogOutIcon className="w-4 h-4" /> Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
