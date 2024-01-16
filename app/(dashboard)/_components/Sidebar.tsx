import Logo from "./Logo";
import { SidebarRoutes } from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm ">
      <div className="p-6 flex gap-4 items-center">
        <Logo /> Sademy
      </div>
      <SidebarRoutes />
    </div>
  );
};

export default Sidebar;
