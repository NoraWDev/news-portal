"use client";

import { toast } from "sonner";
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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Controlled delete-confirmation dialog. Drive `open`/`onOpenChange` from the
 * caller (e.g. a dropdown menu item sets open=true). `onConfirm` runs the
 * actual removal; a success toast is shown automatically.
 */
export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  name = "العنصر",
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  name?: string;
  description?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف {name}؟</AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              `سيؤدي هذا الإجراء إلى حذف ${name} نهائياً. لا يمكن التراجع عن هذا الإجراء.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={() => {
              onConfirm?.();
              toast.success(`تم حذف ${name} بنجاح`, {
                description: "تمت إزالة السجل من قاعدة البيانات.",
              });
            }}
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
