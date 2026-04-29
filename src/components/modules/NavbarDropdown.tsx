/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User, User2 } from "lucide-react"

export function NavbarDropdown({ user, onLogout }: any) {
  const router = useRouter();

  const handleLogout = async () => {
    await onLogout();
    router.push("/");
  };

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              variant="outline"
              className="p-0 rounded-full cursor-pointer border-2 border-[#c9a84c] h-7 w-7 flex items-center justify-center"
          >
            <User />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              {/* <Link href="/dashboard/profile"> */}
              <Link href={user.role === "CUSTOMER" ? "/customer/dashboard/my-orders" : "/staff/dashboard"}>

                <User2 />
                Dashboard
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
