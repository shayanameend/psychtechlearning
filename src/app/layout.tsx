import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "~/components/ui/sonner";

import { ContentProtectionProvider } from "~/providers/content-protection-provider";
import { QueryProvider } from "~/providers/query-provider";
import { UserProvider } from "~/providers/user-provider";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Psychtech Learning",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <UserProvider>
            <ContentProtectionProvider>{children}</ContentProtectionProvider>
          </UserProvider>
          <Toaster />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
