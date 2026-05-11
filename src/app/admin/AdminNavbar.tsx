// app/admin/AdminNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Links (Kiri) */}
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black text-orange-500 tracking-wider">
              RESTO<span className="text-white">ADMIN</span>
            </h1>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/admin/dashboard" 
                className={`px-3 py-2 rounded-md font-medium transition ${pathname === "/admin/dashboard" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                Dapur & Kasir
              </Link>
              <Link 
                href="/admin/history" 
                className={`px-3 py-2 rounded-md font-medium transition ${pathname === "/admin/history" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                Buku Kas
              </Link>
              <Link 
                href="/admin/menu" 
                className={`px-3 py-2 rounded-md font-medium transition ${pathname === "/admin/menu" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                Kelola Menu
              </Link>
              <Link 
                href="/admin/qr" 
                className={`px-3 py-2 rounded-md font-medium transition ${pathname === "/admin/qr" ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                QR Meja
              </Link>
            </div>
          </div>

          <div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition">
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}