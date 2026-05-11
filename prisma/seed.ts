// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menanam benih ke database lho yak😹');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();

  console.log('benih lama bersih dikeluarkan😹');

  const tablesData = [];
  for (let i = 1; i <= 10; i++) {
    tablesData.push({
      number: i,
    });
  }

  await prisma.table.createMany({
    data: tablesData,
  });

  const makananUtama = await prisma.category.create({
    data: { name: 'Makanan Utama' },
  });

  const minuman = await prisma.category.create({
    data: { name: 'Minuman' },
  });

  const cemilan = await prisma.category.create({
    data: { name: 'Cemilan' },
  });
  
  console.log(`harusnya berhasil sih`);

  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur, ayam suwir, dan kerupuk.',
        price: 25000,
        categoryId: makananUtama.id,
      },
      {
        name: 'Mie Goreng Seafood',
        description: 'Mie goreng dengan udang, cumi, dan sayuran segar.',
        price: 30000,
        categoryId: makananUtama.id,
      },
      {
        name: 'Es Teh Manis',
        description: 'Teh manis dingin dengan es batu.',
        price: 5000,
        categoryId: minuman.id,
      },
      {
        name: 'Kopi Susu Gula Aren',
        description: 'Kopi robusta dengan susu segar dan gula aren asli.',
        price: 18000,
        categoryId: minuman.id,
      },
      {
        name: 'Kentang Goreng',
        description: 'Kentang goreng renyah dengan taburan garam.',
        price: 15000,
        categoryId: cemilan.id,
      },
      {
        name: 'Pisang Bakar Coklat Keju',
        description: 'Pisang bakar manis dengan topping meses dan keju parut.',
        price: 12000,
        categoryId: cemilan.id,
      },
    ],
  });
  console.log(`gacor king.`);

  console.log('AMBATUKAAAMMMM!!!!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });