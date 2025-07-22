import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "components/ui/sidebar";
import { ROUTES } from "config/routes.config";
import { Heart, List, Trash } from "lucide-react";
import { Link } from "react-router";

const AppSidebar = () => {
  const { open } = useSidebar();

  const items = [
    {
      label: "All Snippets",
      icon: List,
      path: ROUTES.ALL,
      count: 5,
    },
    {
      label: "Favorite",
      icon: Heart,
      path: ROUTES.FAVORITE,
      count: 5,
    },
    {
      label: "Trash",
      icon: Trash,
      path: ROUTES.TRASH,
      count: 5,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="items-center mt-4 mb-4 text-2xl">
        {open && <Link to={ROUTES.HOME}>Snipster</Link>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((each) => {
              return (
                <Link
                  key={each.label}
                  to={each.path}
                  // className="flex flex-row justify-center items-center gap-2"
                >
                  <SidebarMenuButton
                    tooltip={each.label}
                    className="flex justify-between items-center hover:bg-accent h-11 transition-colors duration-700 hover:text-accent-foreground cursor-pointer"
                  >
                    <div className="flex flex-row justify-center items-center gap-2">
                      <each.icon />
                      {each.label}
                    </div>
                    <div>{each.count}</div>
                  </SidebarMenuButton>
                </Link>
              );
            })}
            {/* {items.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild className="border h-10">
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && (
                        <item.icon size={32} width={32} height={32} />
                      )}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))} */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
