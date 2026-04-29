import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { User } from "lucide-react";

export function ProfileAvatar() {
  const {data} = useUserInfoQuery();
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar>
        <AvatarImage className="object-cover" src={data?.data.email? data?.data.picture :`https://github.com/shadcn.png`} alt="@shadcn" />
        <AvatarFallback><User/></AvatarFallback>
      </Avatar>
    </div>
  )
}
