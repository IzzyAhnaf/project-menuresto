// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Hanya lindungi rute yang masuk ke area /admin
  // Tapi jangan lindungi halaman login itu sendiri (nanti muter-muter)
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    
    // Cek apakah ada cookie bernama 'admin_token'
    const token = request.cookies.get('admin_token')?.value;
    
    // Jika tidak ada token rahasia kita, lempar kembali ke halaman Login
    if (token !== 'lulus-sensor') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Jika aman, silakan lewat
  return NextResponse.next();
}

// Beritahu Next.js untuk menjalankan satpam ini hanya di URL /admin/...
export const config = {
  matcher: ['/admin/:path*'],
}