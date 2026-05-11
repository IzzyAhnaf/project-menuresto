import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        items: true,
      },
      orderBy: { name: "asc" }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat menu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId } = body;

    const newItem = await prisma.menuItem.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: categoryId,
        isAvailable: true,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah menu" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });

    await prisma.menuItem.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus menu" }, { status: 500 });
  }
}