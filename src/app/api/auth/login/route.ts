// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Password rahasia kita untuk masuk (Silakan diganti nanti)
    if (password === "kasir123") {
      
      // Berikan tiket masuk berupa HTTP-Only Cookie (Sangat Aman)
      const cookieStore = await cookies();
      cookieStore.set("admin_token", "lulus-sensor", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12, // Tiket berlaku 12 jam (setengah hari kerja)
        path: "/",
      });

      return NextResponse.json({ success: true });
    }
    
    // Jika password salah
    return NextResponse.json({ error: "Password salah!" }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}