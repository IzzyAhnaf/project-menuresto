"use client";

import { useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};

type CartItem = MenuItem & { quantity: number };

export default function MenuClient({
  categories,
  tableNumber,
  orderType,
}: {
  categories: Category[];
  tableNumber?: string;
  orderType: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan ini

  const handleCheckout = async () => {
    setIsSubmitting(true);

    const payload = {
      cart: cart,
      tableNumber: tableNumber,
      orderType: orderType,
      customerName: orderType === "Takeaway" ? "Pelanggan Takeaway" : null,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("👍" + data.message + "\nMohon menuju kasir untuk pembayaran.");
        setCart([]);
      } else {
        alert("Gagal: " + data.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Jika sudah ada, tambah jumlahnya (quantity)
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem?.quantity === 1) {
        return prevCart.filter((cartItem) => cartItem.id !== itemId); // Hapus jika sisa 1
      }
      return prevCart.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      );
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          Restoran Enak
        </h1>
        <div className="flex justify-center mt-2">
          {tableNumber ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Dine-in (Meja {tableNumber})
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {orderType}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {categories.map((category) => (
          <div key={category.id}>
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-1">
              {category.name}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => {
                // Cari apakah item ini ada di keranjang
                const cartItem = cart.find((c) => c.id === item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-sm font-bold text-orange-600 mt-2">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {cartItem ? (
                        <>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full font-bold hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="font-bold w-4 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600"
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{totalItems} Item</p>
              <p className="text-lg font-bold text-gray-900">
                Rp {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-3 rounded-lg font-bold shadow-md transition`}>
              {isSubmitting ? "Memproses..." : "Lanjut Bayar ➔"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
