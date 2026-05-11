"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount),
    0
  );

  if (isLoading) return <div className="p-10 text-center text-xl font-bold">Memuat Buku Kas...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Riwayat & Laporan Pendapatan</h1>

        {/* Kartu Ringkasan Pendapatan */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-10 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <p className="text-green-100 font-medium mb-1">Total Omzet (Pesanan Selesai)</p>
            <h2 className="text-4xl font-black">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <p className="text-green-100 font-medium mb-1">Total Transaksi</p>
            <h2 className="text-3xl font-bold">{orders.length} Pesanan</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b font-semibold">Waktu Selesai</th>
                  <th className="p-4 border-b font-semibold">Tipe / Meja</th>
                  <th className="p-4 border-b font-semibold">Item Terjual</th>
                  <th className="p-4 border-b font-semibold text-right">Total Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Belum ada pesanan yang selesai.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(order.updatedAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        {order.type === "DINE_IN" ? `Meja ${order.table?.number}` : "Takeaway"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {order.items.map((item: any) => (
                          <div key={item.id}>
                            {item.quantity}x {item.menuItem.name}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-green-600 text-right">
                        Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}