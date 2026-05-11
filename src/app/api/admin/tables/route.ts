import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: "asc" },
    });
    
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data meja" }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const lastTable = await prisma.table.findFirst({
      orderBy: { number: "desc" },
    });

    const nextNumber = lastTable ? lastTable.number + 1 : 1;

    const newTable = await prisma.table.create({
      data: {
        number: nextNumber,
      },
    });

    return NextResponse.json(newTable);
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat meja baru" }, { status: 500 });
  }
}