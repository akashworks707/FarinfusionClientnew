/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { usePathname } from "next/navigation";

export const usePermission = () => {
  const { data } = useUserInfoQuery(undefined);
  const pathname = usePathname();

  const permissions = data?.data?.permissions || [];

  const hasAccess = permissions.some((p: any) =>
    pathname.startsWith(p.url)
  );

  return hasAccess;
};