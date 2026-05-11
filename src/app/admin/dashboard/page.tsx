// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal memuat pesanan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Ambil saat pertama kali buka
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval); 
  }, []);

  const updateStatus = async (orderId: string, action: "PAY" | "DONE") => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action }),
    });
    fetchOrders(); 
  };

  if (isLoading) return <div className="p-10 text-center text-xl">Memuat Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Live Dapur & Kasir</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">Belum ada pesanan aktif.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-5 border-l-8 border-orange-500 flex flex-col">
              
              {/* Header Kartu (Info Meja & Tipe) */}
              <div className="flex justify-between items-start mb-4 border-b pb-3">
                <div>
                  <h2 className="text-2xl font-black text-gray-800">
                    {order.type === "DINE_IN" ? `Meja ${order.table?.number}` : "Takeaway"}
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    {order.customerName || "Pelanggan"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {order.paymentStatus === "PAID" ? "LUNAS" : "BELUM BAYAR"}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <ul className="space-y-2 mb-4">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-gray-700 font-medium border-b border-dashed border-gray-200 pb-1">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex gap-2">
                {order.paymentStatus === "UNPAID" ? (
                  <button 
                    onClick={() => updateStatus(order.id, "PAY")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition">
                    Terima Pembayaran
                  </button>
                ) : (
                  <button 
                    onClick={() => updateStatus(order.id, "DONE")}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition">
                    Selesai / Hidangkan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}