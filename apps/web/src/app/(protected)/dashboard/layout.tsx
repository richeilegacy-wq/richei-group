import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import Header from "@/components/dashboard/header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <Header />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}