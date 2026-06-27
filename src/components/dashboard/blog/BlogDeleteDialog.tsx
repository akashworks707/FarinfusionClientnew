"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  blogTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BlogDeleteDialog({ isOpen, blogTitle, isDeleting, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Dialog */}
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Delete blog post?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 wrap-break-words">
                &ldquo;{blogTitle}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}