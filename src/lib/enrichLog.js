// src/lib/enrichLog.js
import User from "@/models/User";

/**
 * Resolves the identity (name, username, company) for a log entry.
 *
 * Priority:
 *   1. Authenticated user (from the JWT) -> looked up in the DB for company info.
 *   2. Fallback to a username provided in the action metadata (e.g. failed logins
 *      that happen before a token cookie exists).
 *
 * @param {object|null} tokenUser  Decoded JWT payload ({ id, username, role, companyId }) or null.
 * @param {object} metadata        Arbitrary metadata attached to the log action.
 * @returns {Promise<{name, username, companyId, companyName, role}>}
 */
export async function resolveLogIdentity(tokenUser, metadata = {}) {
  let name = null;
  let username = metadata?.username || null;
  let companyId = null;
  let companyName = null;
  let role = tokenUser?.role || "guest";

  if (tokenUser?.id) {
    try {
      const dbUser = await User.findById(tokenUser.id)
        .select("fullName username companyId companyName role")
        .lean();

      if (dbUser) {
        name = dbUser.fullName || dbUser.username || null;
        username = dbUser.username || username;
        companyId = dbUser.companyId || null;
        companyName = dbUser.companyName || null;
        role = dbUser.role || role;
      }
    } catch {
      // ignore lookup failures, fall back to token/metadata values
    }
  }

  if (!name) name = username;

  return { name, username, companyId, companyName, role };
}
