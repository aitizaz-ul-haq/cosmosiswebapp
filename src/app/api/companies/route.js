import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import Company from "@/models/Company";   // ✅ fixed path

export async function POST(req) {
  try {
    const user = verifyToken(req);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Missing company name" }, { status: 400 });
    }

    await connectToDatabase();

    const company = new Company({ name, createdBy: user.id });
    await company.save();

    return NextResponse.json({ success: true, company });
  } catch (err) {
    console.error("Company creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
