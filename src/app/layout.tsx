import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Toaster } from "~/components/ui/sonner";

import { QueryProvider } from "~/providers/query-provider";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Psychtech Learning",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
