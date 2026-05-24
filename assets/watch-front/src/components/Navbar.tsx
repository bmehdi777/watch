import { Link, Outlet, useLocation, useParams } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MOCK_ARTICLES } from "@/mocks/articles";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Binoculars, Newspaper, Rss, Search, Settings, Heart, Clock } from "lucide-react";
import Command from "@/components/Command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useState } from "react";

const sidebarBodyItems = [
  { label: "Sources", path: "/sources", icon: <Rss /> },
  { label: "Articles", path: "/articles", icon: <Newspaper /> },
  { label: "Liked", path: "/liked", icon: <Heart /> },
  { label: "Read later", path: "/read-later", icon: <Clock /> },
];

const sidebarFooterItems = [
  { label: "Settings", path: "/settings", icon: <Settings /> },
];

const ArticleBreadcrumb = () => {
  const { id } = useParams<{ id: string }>();
  const article = MOCK_ARTICLES.find((a) => a.id === id);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/articles" />} className="flex items-center gap-1">
            Articles
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 max-w-64">
            {article?.title ?? "Article"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const Navbar = () => {
  const { pathname } = useLocation();

  const allItems = [...sidebarBodyItems, ...sidebarFooterItems];
  const currentItem = allItems.find((item) => item.path === pathname);
  const isArticleDetail = /^\/articles\/.+/.test(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
                <Binoculars className="size-5!" />
                <span className="text-base font-semibold">Watch RSS</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {sidebarBodyItems.map((item) => (
                <SidebarMenuItem key={item.label} className="my-1">
                  <SidebarMenuButton
                    render={<Link to={item.path} />}
                    isActive={pathname === item.path}
                  >
                    {item.icon} {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => setSearchOpen(true)}
              >
                <Search />
                <span>Search</span>
                <KbdGroup className="ml-auto">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {sidebarFooterItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  render={<Link to={item.path} />}
                  isActive={pathname === item.path}
                >
                  {item.icon} {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Command setSearchOpen={setSearchOpen} searchOpen={searchOpen} />

      <SidebarInset>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3">
            <SidebarTrigger />
            {isArticleDetail ? (
              <ArticleBreadcrumb />
            ) : (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {currentItem?.label ?? "News"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
};

export default Navbar;
