import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { isNotificationObjectId, notificationClientScope, notificationEventKey, notificationSourceDate, validateNotificationReadInput } from "@/lib/notificationReads";
import ClientProfile from "@/models/ClientProfile";
import NotificationRead from "@/models/NotificationRead";

export const dynamic = "force-dynamic";

const json = (body, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

function authorize(req) {
  const user = verifyToken(req);
  if (!user) return { response: json({ error: "Unauthorized" }, 401) };
  if (!["supervisor", "rm"].includes(user.role) || !isNotificationObjectId(user.id) || !isNotificationObjectId(user.companyId)) {
    return { response: json({ error: "Forbidden" }, 403) };
  }
  return { user: { id: user.id.toLowerCase(), companyId: user.companyId.toLowerCase(), role: user.role } };
}

function unavailable(error) {
  console.error("Notification read request failed:", error?.message || "Unknown error");
  return json({ error: "Unable to save or load notification read status. Please try again." }, 500);
}

export async function GET(req) {
  const auth = authorize(req);
  if (auth.response) return auth.response;
  try {
    await connectToDatabase();
    const reads = await NotificationRead.find({ companyId: auth.user.companyId, userId: auth.user.id })
      .select("key readAt -_id").sort({ readAt: -1 }).lean();
    return json({ reads });
  } catch (error) {
    return unavailable(error);
  }
}

export async function PATCH(req) {
  const auth = authorize(req);
  if (auth.response) return auth.response;
  const input = validateNotificationReadInput(await req.json().catch(() => null));
  if (!input) return json({ error: "A valid client notification and event date are required." }, 400);
  try {
    await connectToDatabase();
    const profile = await ClientProfile.findOne(notificationClientScope(auth.user, input.profileId))
      .select("_id createdAt onboarding.submittedAt onboarding.approvedAt").lean();
    if (!profile) return json({ error: "This client notification is unavailable." }, 404);
    const currentKey = notificationEventKey(String(profile._id), input.eventType, notificationSourceDate(profile, input.eventType));
    if (currentKey !== input.key) return json({ error: "This notification has changed. Refresh your notifications and try again.", code: "EVENT_CHANGED" }, 409);
    // Build the identity from verified source data and JWT scope, never from a
    // client-supplied receipt, actor, tenant or read timestamp.
    const receiptScope = { companyId: auth.user.companyId, userId: auth.user.id, key: currentKey };
    await NotificationRead.init();
    let read;
    try {
      read = await NotificationRead.findOneAndUpdate(receiptScope, {
        $setOnInsert: {
          ...receiptScope,
          profileId: input.profileId,
          eventType: input.eventType,
          eventDate: new Date(input.eventDate),
          readAt: new Date(),
        },
      }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true })
        .select("key readAt -_id").lean();
    } catch (error) {
      // Two tabs can open the same unread event simultaneously. The unique
      // account/event index wins; both requests return its original receipt.
      if (error?.code !== 11000) throw error;
      read = await NotificationRead.findOne(receiptScope).select("key readAt -_id").lean();
      if (!read) throw error;
    }
    return json({ read });
  } catch (error) {
    return unavailable(error);
  }
}
