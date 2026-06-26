export type PageAccess =
  | "dashboard"
  | "my-orders"
  | "user-management"
  | "purchase-products"
  | "staff-management"
  | "product-management"
  | "returns"
  | "product-verifications"
  | "category-management"
  | "reviews-management"
  | "brand-management"
  | "coupons"
  | "customer-management"
  | "my-customers"
  | "orders-management"
  | "leads"
  | "pos"
  | "courier-settings";

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "MODERATOR"
  | "CUSTOMER"
  | "TELLICELSS";

export interface UserPermissions {
  role: UserRole;
  pageAccess: PageAccess[];
  createdAt: Date;
  updatedAt: Date;
}

// Default page access for each role
export const defaultRolePermissions: Record<UserRole, PageAccess[]> = {
  ADMIN: [
    "dashboard",
    "product-management",
    "purchase-products",
    "returns",
    "category-management",
    "product-verifications",
    "brand-management",
    "reviews-management",
    "coupons",
    "staff-management",
    "customer-management",
    "my-customers",
    "orders-management",
    "leads",
    "my-orders",
    "pos",
    "courier-settings",
  ],
  MANAGER: [
    "dashboard",
    "product-management",
    "category-management",
    "reviews-management",
    "coupons",
    "orders-management",
    "leads",
    "my-orders",
    "pos",
  ],
  TELLICELSS: [
    "dashboard",
    "product-management",
    "category-management",
    "coupons",
    "orders-management",
    "leads",
    "my-orders",
    "pos",
  ],
  MODERATOR: ["dashboard", "product-management", "my-orders", "leads"],
  CUSTOMER: ["dashboard", "my-orders"],
};

// All available pages that can be assigned
export const availablePages: { id: PageAccess; label: string; icon: string }[] =
  [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "product-management", label: "Products", icon: "🛍️" },
    { id: "category-management", label: "Categories", icon: "📁" },
    { id: "brand-management", label: "Brands", icon: "🏷️" },
    { id: "reviews-management", label: "Reviews", icon: "💼" },
    { id: "product-verifications", label: "Product Verifications", icon: "📦" },
    { id: "coupons", label: "Coupons", icon: "🎁" },
    { id: "purchase-products", label: "Purchase Products", icon: "🛒" },
    { id: "returns", label: "Returns", icon: "📦" },
    { id: "staff-management", label: "Staffs", icon: "👥" },
    { id: "customer-management", label: "Customers", icon: "👤" },
    { id: "my-customers", label: "My Customers", icon: "💼" },
    { id: "orders-management", label: "Orders", icon: "📦" },
    { id: "leads", label: "Leads", icon: "🎯" },
    { id: "my-orders", label: "My Orders", icon: "📋" },
    { id: "pos", label: "POS", icon: "🛒" },
    
    { id: "user-management", label: "User Management", icon: "🔐" },
    { id: "courier-settings", label: "Courier Settings", icon: "🧰" },
  ];

export const hasPageAccess = (
  userPermissions: PageAccess[],
  page: PageAccess,
): boolean => {
  return userPermissions.includes(page);
};

export const canAccessPage = (
  userRole: UserRole,
  page: PageAccess,
  customPermissions?: PageAccess[],
): boolean => {
  const permissions = customPermissions || defaultRolePermissions[userRole];
  return permissions.includes(page);
};
