// src/app/api/transactions/route.ts
import connectDB from "@/lib/mongodb";
import Transaction from "@/lib/models/transaction";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();

    const newTransaction = await Transaction.create(body);

    return NextResponse.json({ success: true, data: newTransaction }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add transaction" },
      { status: 500 }
    );
  }
}
