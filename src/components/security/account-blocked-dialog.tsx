"use client";

import { Ban, Mail } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface AccountBlockedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function AccountBlockedDialog({
  isOpen,
  onClose,
  userEmail,
}: AccountBlockedDialogProps) {
  const handleContactSupport = () => {
    const subject = encodeURIComponent("Account Blocked - Appeal Request");
    const body = encodeURIComponent(
      `Hello,\n\nMy account (${userEmail || "N/A"}) has been blocked due to security violations. I would like to appeal this decision and request account restoration.\n\nPlease review my case and let me know what steps I need to take to resolve this issue.\n\nThank you for your assistance.\n\nBest regards`,
    );

    // You can replace this with your actual support email
    const supportEmail = "support@psychtechlearning.com";
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Ban className="h-6 w-6 text-red-500" />
            <DialogTitle className="text-red-600">Account Blocked</DialogTitle>
          </div>
          <DialogDescription className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">
                Your account has been blocked due to repeated security
                violations.
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>What happened?</strong>
                <br />
                Our system detected multiple attempts to bypass content
                protection measures, including copying content, taking
                screenshots, or accessing restricted features.
              </p>

              <p>
                <strong>What can you do?</strong>
                <br />
                If you believe this was a mistake or would like to appeal this
                decision, please contact our support team using the button
                below.
              </p>

              <p>
                <strong>Account restoration:</strong>
                <br />
                Our support team will review your case and may restore your
                account if the violations were unintentional or due to technical
                issues.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Future access to the platform requires
                adherence to our content protection policies. Repeated
                violations may result in permanent account suspension.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleContactSupport}
            className="w-full"
            variant="default"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
