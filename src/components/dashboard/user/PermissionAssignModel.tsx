/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateUserPermissionsMutation } from "@/redux/features/user/user.api";

export default function PermissionAssignModal({
  user,
  allPermissions,
}: any) {
  const [selected, setSelected] = useState<string[]>(
    user.permissions?.map((p: any) => p._id) || []
  );

  const [updatePermissions] = useUpdateUserPermissionsMutation();

  const togglePermission = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await updatePermissions({
        id: user._id,
        permissions: selected,
      }).unwrap();

      toast.success("Permissions updated");
    } catch (err: any) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-4">
      {allPermissions.map((perm: any) => (
        <div key={perm._id} className="flex items-center gap-3">
          <Checkbox
            checked={selected.includes(perm._id)}
            onCheckedChange={() => togglePermission(perm._id)}
          />
          <span>{perm.title}</span>
        </div>
      ))}

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}