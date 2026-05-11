```
# 🍽️ RestoAdmin - Digital Restaurant Management System

**RestoAdmin** adalah sebuah template open-source *full-stack* yang dirancang untuk mendigitalkan operasional restoran secara mandiri. Proyek ini mencakup ekosistem lengkap, mulai dari sistem pemesanan mandiri oleh pelanggan (via QR Code) hingga manajemen dapur, kasir, dan inventaris menu bagi pemilik restoran.

Proyek ini dibangun menggunakan teknologi modern seperti **Next.js 15**, **Prisma ORM**, dan **PostgreSQL**, dengan fokus pada performa, keamanan, dan kemudahan kustomisasi.

---

## ✨ Fitur Utama

### 🙋‍♂️ Sisi Pelanggan (Customer Side)
- **Self-Ordering via QR:** Scan QR di meja dan langsung pesan tanpa perlu menunggu pelayan.
- **Dynamic Menu:** Tampilan menu yang interaktif, dikelompokkan berdasarkan kategori.
- **Smart Shopping Cart:** Sistem keranjang belanja yang ringan dan responsif.
- **Order Types:** Mendukung pesanan *Dine-in* (Makan di tempat) dan *Takeaway* (Bawa pulang).

### 👨‍🍳 Sisi Admin (Dashboard & Manajemen)
- **Live Kitchen Dashboard:** Pantau pesanan masuk secara *real-time* tanpa perlu refresh halaman.
- **Menu Management (CRUD):** Tambah, ubah, atau hapus menu makanan dan kategori langsung dari UI.
- **Dynamic QR Generator:** Buat dan cetak QR Code untuk setiap meja secara otomatis.
- **Revenue Reports:** Laporan pendapatan harian dan riwayat transaksi yang sudah selesai.
- **Order Status Control:** Kelola alur pesanan dari *Unpaid* -> *Paid* -> *Preparing* -> *Completed*.

### 🔒 Keamanan & Optimasi
- **Admin Authentication:** Proteksi halaman admin dengan sistem login dan *Middleware* (Secure Cookies).
- **Anti-Spam Security:** Fitur *Rate Limiting* untuk mencegah pesanan fiktif dari luar restoran.
- **Auto-Cancel Logic:** Pembersihan otomatis untuk pesanan yang tidak dibayar dalam jangka waktu tertentu.
- **Responsive Design:** Optimal untuk penggunaan di tablet kasir maupun HP pelanggan.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Lokal atau Cloud seperti Supabase/Neon)
- **Icons & QR:** Lucide React & QRCode.react
- **Language:** TypeScript

---

## 🚀 Instalasi & Setup Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di mesin lokal Anda:

### 1. Clone Repositori
```bash
git clone [https://github.com/username-anda/nama-repo.git](https://github.com/username-anda/nama-repo.git)
cd nama-repo

```

### 2. Instal Dependensi

```bash
npm install

```

### 3. Konfigurasi Environment Variables

Buat file bernama `.env` di root folder proyek dan masukkan konfigurasi database Anda:

```env
# Contoh jika menggunakan PostgreSQL lokal
DATABASE_URL=\"postgresql://USER:PASSWORD@localhost:5432/restoadmin?schema=public\"

# Password untuk login admin (bisa diganti sesuai keinginan)
ADMIN_PASSWORD=\"kasir123\"

```

### 4. Sinkronisasi Database (Prisma)

Pastikan PostgreSQL Anda sudah menyala, lalu jalankan perintah berikut untuk membuat tabel secara otomatis:

```bash
npx prisma db push

```

*(Opsional)* Jika ingin memasukkan data contoh (seeding):

```bash
npx prisma db seed

```

### 5. Jalankan Server Development

```bash
npm run dev

```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda.

* **Halaman Menu:** `/menu?table=1&type=dine_in`
* **Halaman Admin:** `/admin/login` (Password: `kasir123`)

---

## 📂 Struktur Folder

```text
.
├── app/
│   ├── admin/         # Semua halaman dashboard & manajemen
│   ├── api/           # Backend API routes
│   ├── menu/          # Frontend untuk pelanggan
│   └── layout.tsx     # Root layout
├── prisma/            # Skema database & migrasi
├── public/            # Aset gambar & statis
├── middleware.ts      # Proteksi route admin
└── package.json

```

---

## 📝 Kontribusi

Proyek ini bersifat open-source. Jika Anda ingin berkontribusi, silakan lakukan *fork* dan buat *pull request*, atau buka *issue* jika menemukan bug.

---

## ⚖️ Lisensi

Distributed under the MIT License. Lihat `LICENSE` untuk informasi lebih lanjut.

```