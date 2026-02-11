import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import Company from "@/models/Company";

// 📌 Create new company (superadmin only)
export async function POST(req) {
  try {
    const user = verifyToken(req);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const {
      name,
      legalName,
      tenantKey,
      status,
      primaryContact,
      address,
      registrationNumber,
      taxId,
      website,
      logoUrl,
      notes,
    } = await req.json();

    if (!name?.trim() || !tenantKey?.trim()) {
      return NextResponse.json({ error: "Missing company name or tenant key" }, { status: 400 });
    }

    // Normalize tenantKey
    const normalizedTenantKey = tenantKey.trim().toLowerCase();

    // Validate tenantKey format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedTenantKey)) {
      return NextResponse.json(
        { error: "Tenant key must contain lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Optional: friendly uniqueness checks (otherwise Mongo E11000)
    const [nameExists, keyExists] = await Promise.all([
      Company.exists({ name: name.trim() }),
      Company.exists({ tenantKey: normalizedTenantKey }),
    ]);

    if (nameExists) return NextResponse.json({ error: "Company name already exists" }, { status: 409 });
    if (keyExists) return NextResponse.json({ error: "Tenant key already exists" }, { status: 409 });

    const company = await Company.create({
      name: name.trim(),
      legalName,
      tenantKey: normalizedTenantKey,
      status,
      primaryContact,
      address,
      registrationNumber,
      taxId,
      website,
      logoUrl,
      notes,
      createdBy: user.id,
    });

    return NextResponse.json({ success: true, company }, { status: 201 });
  } catch (err) {
    console.error("Company creation error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
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
      const companies = await Company.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, companies });
    }

    if (user.companyId) {
      const company = await Company.findById(user.companyId);
      return NextResponse.json({ success: true, companies: company ? [company] : [] });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (err) {
    console.error("Fetch companies error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// 📌 Delete company by id
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await connectToDatabase();
  const deleted = await Company.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// 📌 Update company by id (superadmin only)
export async function PATCH(request) {
  try {
    const user = verifyToken(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await request.json();

    if (!body?.name?.trim() || !body?.tenantKey?.trim()) {
      return NextResponse.json({ error: "Missing company name or tenant key" }, { status: 400 });
    }

    const normalizedTenantKey = body.tenantKey.trim().toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedTenantKey)) {
      return NextResponse.json(
        { error: "Tenant key must contain lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    const update = {
      name: body.name.trim(),
      legalName: body.legalName,
      tenantKey: normalizedTenantKey,
      status: body.status,
      primaryContact: body.primaryContact,
      address: body.address,
      registrationNumber: body.registrationNumber,
      taxId: body.taxId,
      website: body.website,
      logoUrl: body.logoUrl,
      notes: body.notes,
    };

    await connectToDatabase();

    const company = await Company.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, company });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Company name or tenant key already exists" }, { status: 409 });
    }
    console.error("Company update error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
