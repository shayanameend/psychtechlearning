import { ViolationType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

interface SecurityViolationData {
  type: ViolationType;
  description: string;
}

interface ViolationResponse {
  data: {
    violation: any;
    violationCount: number;
    shouldBlock: boolean;
    threshold: number;
  };
  info: {
    message: string;
  };
}

async function logSecurityViolation(data: SecurityViolationData) {
  const token = localStorage.getItem("token");

  const response = await axios.post(paths.api.securityViolations.root(), data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function useContentProtection() {
  const router = useRouter();
  const { user, setToken, setUser } = useUserContext();
  const [violationCount, setViolationCount] = useState(0);
  const [isProtectionActive, setIsProtectionActive] = useState(true);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);
  const [currentViolationType, setCurrentViolationType] =
    useState<ViolationType | null>(null);

  const violationMutation = useMutation({
    mutationFn: logSecurityViolation,
    onSuccess: (data: ViolationResponse) => {
      setViolationCount(data.data.violationCount);

      if (data.data.shouldBlock) {
        // User has been blocked, show blocked dialog and sign them out
        setShowBlockedDialog(true);

        setTimeout(() => {
          setToken?.(null);
          setUser?.(null);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          router.push(paths.app.auth.signIn());
        }, 3000); // Give user time to see the dialog
      } else {
        // Show warning dialog instead of toast
        setShowWarningDialog(true);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // If user is already blocked, sign them out
        if (error.response?.status === 403) {
          setToken?.(null);
          setUser?.(null);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          router.push(paths.app.auth.signIn());
        }
        toast.error(
          error.response?.data?.info?.message ||
            "Failed to log security violation",
        );
      }
    },
  });

  const logViolation = useCallback(
    (type: ViolationType, description: string) => {
      if (!isProtectionActive || !user) return;

      setCurrentViolationType(type);
      violationMutation.mutate({ type, description });
    },
    [violationMutation, isProtectionActive, user],
  );

  // Disable protection for admin users
  useEffect(() => {
    setIsProtectionActive(user?.role !== "ADMIN");
  }, [user?.role]);

  const handleCopyPasteViolation = useCallback(
    (event: KeyboardEvent | Event, action: "copy" | "paste") => {
      event.preventDefault();
      event.stopPropagation();

      logViolation(
        ViolationType.COPY_PASTE,
        `Attempted to ${action} content using ${
          event instanceof KeyboardEvent ? "keyboard shortcut" : "context menu"
        }`,
      );
    },
    [logViolation],
  );

  const handleScreenshotViolation = useCallback(
    (method: string) => {
      logViolation(
        ViolationType.SCREENSHOT,
        `Attempted to take screenshot using ${method}`,
      );
    },
    [logViolation],
  );

  const handleContextMenuViolation = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      logViolation(
        ViolationType.CONTEXT_MENU,
        "Attempted to access context menu (right-click)",
      );
    },
    [logViolation],
  );

  const handleDevToolsViolation = useCallback(() => {
    logViolation(
      ViolationType.DEVELOPER_TOOLS,
      "Attempted to open developer tools",
    );
  }, [logViolation]);

  return {
    isProtectionActive,
    violationCount,
    showWarningDialog,
    showBlockedDialog,
    currentViolationType,
    setShowWarningDialog,
    setShowBlockedDialog,
    logViolation,
    handleCopyPasteViolation,
    handleScreenshotViolation,
    handleContextMenuViolation,
    handleDevToolsViolation,
  };
}
