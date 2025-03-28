import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { paths } from "~/routes/paths";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === paths.root()) {
    return NextResponse.redirect(new URL(paths.app.auth.signIn(), req.url));
  }

  return NextResponse.next();
}
