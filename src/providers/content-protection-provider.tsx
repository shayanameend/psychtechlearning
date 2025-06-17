"use client";

import type { PropsWithChildren } from "react";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

import { AccountBlockedDialog } from "~/components/security/account-blocked-dialog";
import { SecurityWarningDialog } from "~/components/security/security-warning-dialog";
import { useContentProtection } from "~/hooks/use-content-protection";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

interface ContentProtectionContextType {
  isProtectionActive: boolean;
  violationCount: number;
}

const ContentProtectionContext = createContext<ContentProtectionContextType>({
  isProtectionActive: false,
  violationCount: 0,
});

export const useContentProtectionContext = () => {
  return useContext(ContentProtectionContext);
};

export function ContentProtectionProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const pathname = usePathname();
  const { user } = useUserContext();
  const {
    isProtectionActive,
    violationCount,
    showWarningDialog,
    showBlockedDialog,
    currentViolationType,
    setShowWarningDialog,
    setShowBlockedDialog,
    handleCopyPasteViolation,
    handleScreenshotViolation,
    handleContextMenuViolation,
    handleDevToolsViolation,
  } = useContentProtection();

  // Check if current page should be protected (exclude admin pages and auth pages)
  const shouldProtectPage =
    !pathname.includes(paths.app.admin.root()) &&
    !pathname.includes(paths.app.auth.root());

  useEffect(() => {
    if (!isProtectionActive || !shouldProtectPage) return;

    // Disable copy/paste keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCopy = (event.ctrlKey || event.metaKey) && event.key === "c";
      const isPaste = (event.ctrlKey || event.metaKey) && event.key === "v";
      const isCut = (event.ctrlKey || event.metaKey) && event.key === "x";

      if (isCopy) {
        handleCopyPasteViolation(event, "copy");
      } else if (isPaste) {
        handleCopyPasteViolation(event, "paste");
      } else if (isCut) {
        handleCopyPasteViolation(event, "copy");
      }
    };

    // Disable context menu (right-click)
    const handleContextMenu = (event: MouseEvent) => {
      handleContextMenuViolation(event);
    };

    // Disable text selection
    const handleSelectStart = (event: Event) => {
      event.preventDefault();
    };

    // Disable drag and drop
    const handleDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    // Screenshot detection (limited browser support)
    const handleScreenshotKeys = (event: KeyboardEvent) => {
      // Print Screen key
      if (event.key === "PrintScreen") {
        handleScreenshotViolation("Print Screen key");
      }

      // Mac screenshot shortcuts
      if (event.metaKey && event.shiftKey) {
        if (event.key === "3" || event.key === "4" || event.key === "5") {
          handleScreenshotViolation(`Cmd+Shift+${event.key}`);
        }
      }

      // Windows Snipping Tool
      if (event.metaKey && event.shiftKey && event.key === "S") {
        handleScreenshotViolation("Windows Snipping Tool");
      }
    };

    // Developer tools detection
    const handleDevTools = (event: KeyboardEvent) => {
      // F12
      if (event.key === "F12") {
        event.preventDefault();
        handleDevToolsViolation();
      }

      // Ctrl+Shift+I or Cmd+Option+I
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "I"
      ) {
        event.preventDefault();
        handleDevToolsViolation();
      }

      // Ctrl+Shift+J or Cmd+Option+J
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "J"
      ) {
        event.preventDefault();
        handleDevToolsViolation();
      }

      // Ctrl+U or Cmd+Option+U (view source)
      if ((event.ctrlKey || event.metaKey) && event.key === "u") {
        event.preventDefault();
        handleDevToolsViolation();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleScreenshotKeys);
    document.addEventListener("keydown", handleDevTools);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);

    // Disable print
    const handleBeforePrint = () => {
      handleScreenshotViolation("Print function");
    };
    window.addEventListener("beforeprint", handleBeforePrint);

    // CSS to disable text selection and other interactions
    const style = document.createElement("style");
    style.textContent = `
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      /* Allow selection in input fields and textareas */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleScreenshotKeys);
      document.removeEventListener("keydown", handleDevTools);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("beforeprint", handleBeforePrint);
      document.head.removeChild(style);
    };
  }, [
    isProtectionActive,
    shouldProtectPage,
    handleCopyPasteViolation,
    handleScreenshotViolation,
    handleContextMenuViolation,
    handleDevToolsViolation,
  ]);

  return (
    <ContentProtectionContext.Provider
      value={{
        isProtectionActive: isProtectionActive && shouldProtectPage,
        violationCount,
      }}
    >
      {children}

      {/* Security Warning Dialog */}
      <SecurityWarningDialog
        isOpen={showWarningDialog}
        onClose={() => setShowWarningDialog?.(false)}
        violationType={currentViolationType || ""}
        violationCount={violationCount}
        maxViolations={3}
        isLastWarning={violationCount >= 2}
      />

      {/* Account Blocked Dialog */}
      <AccountBlockedDialog
        isOpen={showBlockedDialog}
        onClose={() => setShowBlockedDialog?.(false)}
        userEmail={user?.email}
      />
    </ContentProtectionContext.Provider>
  );
}
