import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Company from "@/models/Company";
import DemoRequest from "@/models/DemoRequest";

// GET all users with subscriptionStatus 'demo' (for Super Admin dashboard)
export async function GET() {
  try {
    await connectToDatabase();
    // Get all demo users
    const users = await User.find({ subscriptionStatus: "demo" }).sort({ createdAt: -1 }).lean();

    // Get company names
    const companyIds = users.map(u => u.companyId).filter(Boolean);
    const companies = await Company.find({ _id: { $in: companyIds } }, "_id name").lean();
    const companyMap = Object.fromEntries(companies.map(c => [c._id.toString(), c.name]));

    // Get demo request info for each user by username/email
    const emails = users.map(u => u.username);
    const demoRequests = await DemoRequest.find({ email: { $in: emails } }).lean();
    const demoMap = Object.fromEntries(demoRequests.map(d => [d.email, d]));

    const usersWithDetails = users.map(u => {
      const demo = demoMap[u.username] || {};
      return {
        username: u.username,
        passwordHash: u.passwordHash,
        company: u.companyId ? companyMap[u.companyId.toString()] || u.companyId : null,
        firstname: demo.firstname || "",
        lastname: demo.lastname || "",
        subscriptionStatus: u.subscriptionStatus || "",
      };
    });

    return new Response(JSON.stringify({ success: true, data: usersWithDetails }), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error fetching demo users:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
