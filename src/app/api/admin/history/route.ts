import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const completedOrders = await prisma.order.findMany({
      where: {
        kitchenStatus: "COMPLETED",
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(completedOrders);
  } catch (error) {
    console.error("Riwayat Error:", error);
    return NextResponse.json({ error: "Gagal mengambil riwayat pesanan" }, { status: 500 });
  }
}