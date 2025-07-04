import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TransactionModel from "@/lib/models/transaction";

// GET /api/transactions
export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await TransactionModel.find({});
    return NextResponse.json({ data: transactions }, { status: 200 });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("POST body received:", body);

    const { amount, date, description, category } = body;

    if (!amount || !date || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await TransactionModel.create({
      amount,
      date,
      description,
      category,
    });

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("POST /api/transactions error:", error.message);
      return NextResponse.json(
        { error: error.message || "Failed to create transaction" },
        { status: 500 }
      );
    }
    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
