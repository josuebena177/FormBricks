"use client";

import Modal from "@/components/shared/Modal";
import { Button } from "@formbricks/ui";

interface DeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  deleteWhat: string;
  onDelete: () => void;
  text?: string;
  isDeleting?: boolean;
  useSaveInsteadOfCancel?: boolean;
  onSave?: () => void;
}

export default function DeleteDialog({
  open,
  setOpen,
  deleteWhat,
  onDelete,
  text,
  isDeleting,
  useSaveInsteadOfCancel = false,
  onSave,
}: DeleteDialogProps) {
  return (
    <Modal open={open} setOpen={setOpen} title={`Delete ${deleteWhat}`}>
      <p>{text || "Are you sure? This action cannot be undone."}</p>
      <div className="my-4 space-x-2 text-right">
        <Button
          variant="secondary"
          onClick={() => {
            if (useSaveInsteadOfCancel && onSave) {
              onSave();
            }
            setOpen(false);
          }}>
          {useSaveInsteadOfCancel ? "Save" : "Cancel"}
        </Button>
        <Button variant="warn" onClick={onDelete} loading={isDeleting}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
