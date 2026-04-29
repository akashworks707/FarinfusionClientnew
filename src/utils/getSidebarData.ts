import { UserRole } from "./auth-utils";
import { adminSidebar, customerSidebar, generalStaffSidebar, managerSidebar, moderatorSidebar, telecallerSidebar } from "./sidebarItems";


export const getSidebarData = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return adminSidebar;
    case "MANAGER":
      return managerSidebar;
    case "MODERATOR":
      return moderatorSidebar;
    case "TELLICELSS":
      return telecallerSidebar;
    case "GENERALSTAFF":
      return generalStaffSidebar;
    case "CUSTOMER":
      return customerSidebar;
    default:
      return [];
  }
};