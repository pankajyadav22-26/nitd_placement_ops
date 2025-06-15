import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/coordinator")) {
        if (!token || token.role !== "coordinator") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    if (pathname.startsWith("/api/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    if (pathname.startsWith("/api/statistics")) {
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/api/coordinator/:path*",
        "/api/admin/:path*",
        "/api/statistics/:path*"
    ],
};