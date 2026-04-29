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
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LogOut, User, User2 } from "lucide-react"
import { useGetMeQuery } from "@/redux/features/user/user.api"
import { ProfileAvatar } from "./ProfileAvatar"
import React from "react";
import { IUser } from "@/types";
import UserDetailsModal from "@/components/dashboard/user/UserDetailsModal";
import { useUser } from "@/context/UserContext"

export function ProfileDropdown() {
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const { logout } = useUser();

  const { data } = useGetMeQuery(undefined)

  const router = useRouter()

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful")
    router.push("/")

  }

  // console.log("user data in dropdown ", data)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="p-0 rounded-full h-10 w-10 flex items-center justify-center"
        >
          <ProfileAvatar />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {/*<DropdownMenuItem asChild>*/}
          {/*  <Link href={`${((data?.data?.role === "ADMIN") || ( data?.data?.role === "MANAGER") || ( data?.data?.role === "MODERATOR")) ? "/staff/dashboard/profile" : "/customer/dashboard/my-orders"}`}>*/}
          {/*  /!* <Link href={`/staff/dashboard/profile`}> *!/*/}
          {/*    <User2 />*/}
          {/*    Profile*/}
          {/*    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
          {/*  </Link>*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuItem
            onClick={() => {
              const role = data?.data?.role;

              if (role === "ADMIN" || role === "MANAGER" || role === "MODERATOR") {
                setSelectedUser(data?.data || null);
                setOpenViewModal(true);
              } else {
                setSelectedUser(data?.data || null);
                setOpenViewModal(true);
              }
            }}
          >
            <User2 />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <User />
          {data?.data?.role}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {selectedUser && (
        <UserDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          user={selectedUser}
        />
      )}
    </DropdownMenu>
  )
}