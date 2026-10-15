import crypto from "crypto";

// Scheduled onboardings must keep the password until the email goes out, so it is stored encrypted.
const getKey = () => {
  const secret = process.env.CREDENTIALS_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error("CREDENTIALS_SECRET or JWT_SECRET must be set");
  return crypto.createHash("sha256").update(secret).digest();
};

export function encryptSecret(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const data = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

export function decryptSecret(payload) {
  const [iv, tag, data] = String(payload || "")
    .split(".")
    .map((p) => Buffer.from(p, "base64"));
  if (!iv || !tag || !data) throw new Error("Malformed encrypted value");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
