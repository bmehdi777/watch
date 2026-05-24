import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";

const Layout = () => {
  return (
    <SidebarProvider>
      <Navbar />
    </SidebarProvider>
  );
};

export default Layout;
