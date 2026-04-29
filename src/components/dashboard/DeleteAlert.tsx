"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type actionType = "delete" | "restore";

interface DeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description?: string;
  onConfirm: () => void;
  actionType: actionType;
}

export default function DeleteAlert({
                                      open,
                                      onOpenChange,
                                      description = "This action cannot be undone. Are you sure?",
                                      onConfirm,
                                      actionType,
                                    }: DeleteAlertProps) {
  const isDelete = actionType === "delete";

  return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDelete ? "Delete Confirmation" : "Restore Confirmation"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
                className={
                  isDelete
                      ? "bg-red-700 hover:bg-red-800 text-white cursor-pointer"
                      : "!bg-green-600 hover:!bg-green-700 text-white cursor-pointer"
                }
                onClick={onConfirm}
            >
              {isDelete ? "Delete" : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}