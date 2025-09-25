import { connectToDatabase } from "@/lib/mongodb";
import DemoRequest from "@/models/DemoRequest";

// ✅ GET all demo requests (Super Admin only)
export async function GET() {
  try {
    await connectToDatabase();
    const requests = await DemoRequest.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, data: requests }), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error fetching demo requests:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

// ✅ Update request status
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();

    if (!id || !["approved", "rejected"].includes(status)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request" }),
        { status: 400 }
      );
    }

    const updated = await DemoRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return new Response(
        JSON.stringify({ success: false, error: "Request not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error updating demo request:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
