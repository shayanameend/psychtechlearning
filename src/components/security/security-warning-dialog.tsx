"use client";

import { AlertTriangle, Shield, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";

interface SecurityWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  violationType: string;
  violationCount: number;
  maxViolations: number;
  isLastWarning?: boolean;
}

export function SecurityWarningDialog({
  isOpen,
  onClose,
  violationType,
  violationCount,
  maxViolations,
  isLastWarning = false,
}: SecurityWarningDialogProps) {
  const remainingViolations = maxViolations - violationCount;
  const progressPercentage = (violationCount / maxViolations) * 100;

  const getViolationTypeMessage = (type: string) => {
    switch (type.toLowerCase()) {
      case "copy_paste":
        return "copying or pasting content";
      case "screenshot":
        return "taking screenshots";
      case "context_menu":
        return "accessing the context menu";
      case "developer_tools":
        return "opening developer tools";
      default:
        return "unauthorized activity";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isLastWarning ? (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            ) : (
              <Shield className="h-6 w-6 text-yellow-500" />
            )}
            <DialogTitle
              className={isLastWarning ? "text-red-600" : "text-yellow-600"}
            >
              {isLastWarning ? "Final Security Warning" : "Security Warning"}
            </DialogTitle>
          </div>
          <DialogDescription className="space-y-4">
            <p>
              We detected an attempt at {getViolationTypeMessage(violationType)}
              . This content is protected for security reasons.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Violations:</span>
                <span
                  className={
                    violationCount >= maxViolations - 1
                      ? "text-red-600 font-semibold"
                      : ""
                  }
                >
                  {violationCount} / {maxViolations}
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2"
                // @ts-ignore - Progress component styling
                indicatorClassName={
                  progressPercentage >= 80
                    ? "bg-red-500"
                    : progressPercentage >= 60
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }
              />
            </div>

            {isLastWarning ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 font-semibold text-sm">
                  ⚠️ This is your final warning! One more violation will result
                  in your account being blocked.
                </p>
              </div>
            ) : remainingViolations === 1 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 font-semibold text-sm">
                  ⚠️ You have {remainingViolations} violation remaining before
                  your account is blocked.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  You have {remainingViolations} violations remaining before
                  your account is blocked.
                </p>
              </div>
            )}

            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Protected actions include:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Copying or pasting content</li>
                <li>Taking screenshots</li>
                <li>Right-clicking (context menu)</li>
                <li>Opening developer tools</li>
                <li>Printing pages</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
