import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that strictly require authentication
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
// Define routes that are 100% public
const isPublicRoute = createRouteMatcher(["/", "/blog(.*)", "/projects(.*)", "/contact"]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a public route, we don't even need to touch Clerk's auth object
  if (isPublicRoute(req)) return; 

  if (isAdminRoute(req)) {
    await auth.protect();
  }
});