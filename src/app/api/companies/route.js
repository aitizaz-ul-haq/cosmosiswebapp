import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import Company from "@/models/Company";   // ✅ fixed path

// 📌 Create new company (superadmin only)
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

// 📌 List companies
export async function GET(req) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    if (user.role === "superadmin") {
      // ✅ superadmin sees all companies
      const companies = await Company.find().select("name _id");
      return NextResponse.json({ success: true, companies });
    } else if (user.companyId) {
      // ✅ supervisor/rm/client sees only their own company
      const company = await Company.findById(user.companyId).select("name _id");
      return NextResponse.json({ success: true, companies: [company] });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch (err) {
    console.error("Fetch companies error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
