import { PrismaClient } from "@prisma/client";
import MenuClient from "./MenuClient";

const prisma = new PrismaClient();

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; type?: string }>;
}) {
  const params = await searchParams;
  const tableNumber = params.table;
  const orderType = params.type === "takeaway" ? "Takeaway" : "Dine-in";

  // Ambil data mentah dari database
  const rawCategories = await prisma.category.findMany({
    include: {
      items: {
        where: { isAvailable: true },
      },
    },
  });

  const serializedCategories = rawCategories.map((category) => ({
    id: category.id,
    name: category.name,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
    })),
  }));

  return (
    <main>
      <MenuClient 
        categories={serializedCategories} 
        tableNumber={tableNumber} 
        orderType={orderType} 
      />
    </main>
  );
}