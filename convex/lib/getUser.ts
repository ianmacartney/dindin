import { DatabaseReader } from "../_generated/server";
import { Auth } from "convex/server";
import { phone as validatePhone } from "phone";

export async function getLoggedInUser(db: DatabaseReader, auth: Auth) {
  const identity = await auth.getUserIdentity();
  if (!identity) return null;
  const user = await db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .filter((q) => q.eq(q.field("state"), "active"))
    .first();
  return user;
}

export async function findUser(
  db: DatabaseReader,
  email: string | null | undefined,
  phone: string | null | undefined
) {
  if (email) {
    return await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .filter((q) => q.eq(q.field("state"), "active"))
      .first();
  }
  if (phone) {
    return await db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", sanitizePhone(phone)))
      .filter((q) => q.eq(q.field("state"), "active"))
      .first();
  }
  return null;
}

export function sanitizePhone(phone: string) {
  var { isValid, phoneNumber } = validatePhone(phone);
  if (!isValid) {
    var { isValid, phoneNumber } = validatePhone("+" + phone);
  }
  return isValid ? phoneNumber : null;
}
