// app/admin/qr/page.tsx
"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeGenerator() {
  const [tables, setTables] = useState<any[]>([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Fungsi memuat data meja
// Cari blok kode ini dan ubah:
  const fetchTables = () => {
    fetch("/api/admin/tables")
      .then((res) => res.json())
      .then((data) => {
        // Cek apakah data yang diterima benar-benar Array
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          console.error("API tidak mengembalikan Array:", data);
          setTables([]); // Set jadi kosong agar tidak crash
        }
      })
      .catch((err) => {
        console.error("Gagal fetch:", err);
        setTables([]);
      });
  };

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchTables();
  }, []);

  // Fungsi menambah meja baru
  const handleAddTable = async () => {
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/tables", { method: "POST" });
      if (res.ok) {
        fetchTables(); // Refresh daftar meja setelah berhasil tambah
      } else {
        alert("Gagal menambah meja baru.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Akan disembunyikan saat di-print */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800">Generator QR Code Meja</h1>
          
          <div className="flex gap-3">
            {/* Tombol Tambah Meja */}
            <button 
              onClick={handleAddTable}
              disabled={isAdding}
              className={`${isAdding ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-6 rounded-lg shadow-md transition flex items-center`}>
              {isAdding ? "Menambahkan..." : "+ Tambah Meja Baru"}
            </button>

            {/* Tombol Cetak */}
            <button 
              onClick={() => window.print()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition">
              Cetak (Print) PDF
            </button>
          </div>
        </div>

        {/* Grid QR Code */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => {
            const qrUrl = `${baseUrl}/menu?table=${table.number}&type=dine_in`;

            return (
              <div 
                key={table.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center break-inside-avoid">
                <h2 className="text-2xl font-black text-gray-800 mb-4">
                  MEJA {table.number}
                </h2>
                <div className="bg-white p-2 border-4 border-gray-900 rounded-xl mb-4">
                  <QRCodeSVG value={qrUrl} size={160} />
                </div>
                <p className="text-xs text-gray-500 font-medium break-all mt-auto">
                  Scan untuk memesan
                </p>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}