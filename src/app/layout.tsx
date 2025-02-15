import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Next App",
  description: "Next App",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
