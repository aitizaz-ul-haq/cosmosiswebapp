import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Company from "@/models/Company";
import mongoose from "mongoose";

// 📌 GET all users for a company
export async function GET(req, { params }) {
  const tokenUser = verifyToken(req);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params; // companyId from URL

  try {
    await connectToDatabase();

    // ✅ superadmin can see any company
    // ✅ supervisor/RM/client can only see their own company
    if (tokenUser.role !== "superadmin" && tokenUser.companyId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await User.find({ companyId: new mongoose.Types.ObjectId(id) })
      .select("username role companyId");

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("Fetch company users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 📌 DELETE company + all related users (superadmin only)
export async function DELETE(req, { params }) {
  const tokenUser = verifyToken(req);
  if (!tokenUser || tokenUser.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  try {
    await connectToDatabase();

    // Remove the company
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Remove all users linked to the company
    await User.deleteMany({ companyId: new mongoose.Types.ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: `Company ${company.name} and all related users deleted`
    });
  } catch (err) {
    console.error("Delete company error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
