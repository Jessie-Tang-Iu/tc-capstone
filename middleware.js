import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"], // allow guests here
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // protect all other routes by default
};
