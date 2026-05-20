// middleware.ts

import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isProtectedRoute =
  createRouteMatcher([
    "/admin(.*)",
  ]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next
     * - static files
     * - favicon
     */

    "/((?!_next|.*\\..*).*)",
  ],
};