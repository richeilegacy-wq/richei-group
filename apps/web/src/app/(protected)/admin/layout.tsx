import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import Header from "@/components/admin/header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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