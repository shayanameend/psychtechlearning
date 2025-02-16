import type { NextRequest } from "next/server";

import { default as NextAuth } from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "~/auth/config";
import { paths } from "~/routes/paths";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === paths.root()) {
    return NextResponse.redirect(new URL(paths.auth.signIn(), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/"],
};
