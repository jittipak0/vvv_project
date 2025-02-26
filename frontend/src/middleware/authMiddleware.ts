import { verifyToken } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // ป้องกันทุกหน้าที่อยู่ภายใต้ /dashboard
};
