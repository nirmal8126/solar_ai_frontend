import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/api/auth",
    "/api/register",
    "/api/health",
    "/about-us",
    "/home-1",
    "/home-2",
    "/home-3",
    "/home-4",
    "/api/webhooks",
    "/api/uploads",
    "/api/users/reset-password",
    "/api/gtm-strategies",
    "/api/documents",
    "/pricing",   
    "/contact",
    "/forbidden",
    "/coming-soon",
    "/maintenance",
    "/profile",
    "/pages",
    "/blog",
    "/open-jobs",
    "/documents",
    "/brand_kit_preview",
    "/features",
    "/privacy-policy",
    "/terms-of-service",
    '/health'
  ];

  // Check if the path is for accepting an invitation
  const isInvitationPath = pathname.includes("/invitations/accept");
  const isPagePath = pathname.includes("/pages");
  const isBlogPath = pathname.includes("/blog");
  const isEmbedPath = pathname.includes("/embed");
  const isWatchPath = pathname.includes("/watch");
  const ifFormPath = pathname.includes("/forms/");
  const isSharePath = pathname.includes("/share/");
  const isJobDetailPath = pathname.includes("/job-detail/");
  const isDocumentsPath = pathname.includes("/documents");
  const isSwotAnalysisPath = pathname.startsWith("/swot-analysis");
  const isStartupPath = pathname.startsWith("/startup/");
  const isInvestorPath = pathname.startsWith("/investor/");
  const isMentorPath = pathname.startsWith("/mentor/");

  const isPublicPath = publicPaths.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  ) || isInvitationPath || isPagePath || isBlogPath || isEmbedPath || isWatchPath || ifFormPath || isSharePath || isJobDetailPath || isDocumentsPath || isSwotAnalysisPath || isStartupPath || isInvestorPath || isMentorPath;


  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }), 
        { 
          status: 401,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    }
    return NextResponse.next();
  }

  // Check for backoffice routes
  if (pathname.startsWith("/backoffice")) {
    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If user is banned, redirect to login with error
  // The session will be cleared when they try to access any page
  if (token?.isBanned) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("error", "banned");
    return NextResponse.redirect(url);
  }

  // // If user hasn't completed onboarding and isn't on the onboarding page,
  // // redirect to onboarding
  // if (user && !user.onboarded && pathname !== "/auth/onboarding") {
  //   return NextResponse.redirect(new URL("/auth/onboarding", request.url));
  // }

  // // If user has completed onboarding and tries to access onboarding page,
  // // redirect to dashboard
  // if (user?.onboarded && pathname === "/auth/onboarding") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // if(token && pathname !== "/dashboard") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|logo.png|new-logo.png|images|favicon.ico|favicon.png|home-dashbaord.png).*)"],
};