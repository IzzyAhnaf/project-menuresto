import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart, tableNumber, orderType, customerName } = body;

    if (tableNumber) {
      const existingUnpaidOrder = await prisma.order.findFirst({
        where: {
          table: { number: parseInt(tableNumber) },
          paymentStatus: "UNPAID",
          createdAt: {
            gte: new Date(Date.now() - 15 * 60 * 1000),
          },
        },
      });

      if (existingUnpaidOrder) {
        return NextResponse.json(
          { error: "Anda masih memiliki pesanan yang belum dibayar. Harap selesaikan dulu di kasir." },
          { status: 429 }
        );
      }
    }

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    const totalAmount = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    let tableId = null;
    if (tableNumber) {
      const table = await prisma.table.findFirst({
        where: { number: parseInt(tableNumber) },
      });
      if (table) tableId = table.id;
    }

    const order = await prisma.order.create({
      data: {
        type: orderType === "Takeaway" ? "TAKEAWAY" : "DINE_IN",
        paymentStatus: "UNPAID",
        kitchenStatus: "WAITING",
        totalAmount: totalAmount,
        customerName: customerName || null,
        tableId: tableId,
        items: {
          create: cart.map((item: any) => ({
            quantity: item.quantity,
            menuItemId: item.id,
            notes: null, 
          })),
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      message: "Pesanan berhasil dibuat!" 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pesanan." },
      { status: 500 }
    );
  }
}