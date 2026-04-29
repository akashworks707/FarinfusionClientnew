// export type UserRole = "ADMIN" | "EDITOR";
export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "MODERATOR"
  | "TELLICELSS"
  | "GENERALSTAFF"
  | "CUSTOMER";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};


export const customerRoutes: RouteConfig = {
  exact: ["/customer/dashboard"],
  patterns: [/^\/customer\/dashboard/],
};

export const staffRoutes: RouteConfig = {
  exact: ["/staff/dashboard"],
  patterns: [/^\/staff\/dashboard/],
};

export const adminRoutes: RouteConfig = {
  exact: ["/staff/dashboard/admin"],
  patterns: [/^\/staff\/dashboard\/admin/],
};

export const userRoutes: RouteConfig = {
  exact: ["/customer/dashboard"],
  patterns: [/^\/customer\/dashboard/],
};

export const ownerRoutes: RouteConfig = {
  exact: ["/staff/dashboard/owner"],
  patterns: [/^\/staff\/dashboard\/owner/],
};


export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string
): UserRole | "STAFF" | null => {

  if (isRouteMatches(pathname, ownerRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, staffRoutes)) {
    return "STAFF"; 
  }

  if (isRouteMatches(pathname, userRoutes)) {
    return "CUSTOMER";
  }

  return null;
};

export const isValidRouteForRole = (
  pathname: string,
  role: UserRole
): boolean => {
  // Public
  if (!pathname.startsWith("/staff") && !pathname.startsWith("/customer")) {
    return true;
  }

  // Customer
  if (pathname.startsWith("/customer")) {
    return role === "CUSTOMER";
  }

  // Admin only
  if (pathname.startsWith("/staff/dashboard/admin")) {
    return role === "ADMIN";
  }

  // Staff access
  if (pathname.startsWith("/staff/dashboard")) {
    return ["ADMIN", "MANAGER", "MODERATOR", "TELLICELSS", "GENERALSTAFF"].includes(role);
  }

  return false;
};


export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "CUSTOMER":
      return "/customer/dashboard/my-orders";
    case "TELLICELSS":
      return "/staff/dashboard/my-orders";
    case "MODERATOR":
      return "/staff/dashboard";
    case "GENERALSTAFF":
      return "/staff/dashboard";
    case "MANAGER":
      return "/staff/dashboard";
    case "ADMIN":
      return "/staff/dashboard";
    default:
      return "/";
  }
};
