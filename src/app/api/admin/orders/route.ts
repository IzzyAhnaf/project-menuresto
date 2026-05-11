import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const expirationTime = new Date(Date.now() - 20 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: {
        kitchenStatus: { not: "COMPLETED" },
        OR: [
          { paymentStatus: "PAID" },
          {
            AND: [
              { paymentStatus: "UNPAID" },
              { createdAt: { gte: expirationTime } },
            ],
          },
        ],
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
        createdAt: "asc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, action } = await request.json();

    if (action === "PAY") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          kitchenStatus: "PREPARING",
        },
      });
    } else if (action === "DONE") {
      await prisma.order.update({
        where: { id: orderId },
        data: { kitchenStatus: "COMPLETED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}
