// app/admin/menu/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const fetchMenu = () => {
    fetch("/api/admin/menu")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        // Set default category di dropdown
        if (data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Menu berhasil ditambahkan!");
        setFormData({ ...formData, name: "", description: "", price: "" }); // Reset text input saja
        fetchMenu(); // Refresh daftar menu
      } else {
        alert("Gagal menambah menu.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenu = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus menu "${name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMenu(); // Refresh daftar menu
      } else {
        alert("Gagal menghapus menu.");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold">Memuat Data Menu...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manajemen Menu Makanan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Form Tambah Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tambah Menu Baru</h2>
              
              <form onSubmit={handleAddMenu} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Makanan/Minuman</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    // Tambahan class text-gray-900, bg-white, dan placeholder-gray-400 di bawah ini
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-400"
                    placeholder="Contoh: Nasi Goreng Spesial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                  <textarea 
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-400"
                    placeholder="Contoh: Nasi goreng dengan telur ceplok dan sosis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-400"
                    placeholder="Contoh: 25000"
                  />
                </div>

                {/* Bagian Select Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-3 rounded-lg transition ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isSubmitting ? "Menyimpan..." : "+ Simpan Menu"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{category.name}</h2>
                
                {category.items.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">Belum ada menu di kategori ini.</p>
                ) : (
                  <div className="space-y-3">
                    {category.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 border border-gray-100 rounded-lg group transition">
                        <div>
                          <h3 className="font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-green-600 font-semibold">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteMenu(item.id, item.name)}
                          className="bg-red-100 text-red-600 px-3 py-1.5 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition hover:bg-red-200">
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}