import { DatabaseReader } from "../_generated/server";
import { Auth } from "convex/server";
import { phone as validatePhone } from "phone";
import { User } from "../types";
import { Document } from "../_generated/dataModel";

function fromDbUser(user: Document<"users"> | null): User | null {
  if (!user) return user;
  if (
    user.state === "active" ||
    user.state === "inactive" ||
    user.state === "invited"
  ) {
    return user as User;
  }
  throw "User state is unknown";
}

export async function getLoggedInUser(db: DatabaseReader, auth: Auth) {
  const identity = await auth.getUserIdentity();
  if (!identity) return null;
  const user = await db
    .table("users")
    .index("by_token")
    .range((q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .filter((q) => q.eq(q.field("state"), "active"))
    .first();
  return fromDbUser(user);
}

export async function findUser(
  db: DatabaseReader,
  email: string | null | undefined,
  phone: string | null | undefined
) {
  var user = null;
  if (email) {
    user = await db
      .table("users")
      .index("by_email")
      .range((q) => q.eq("email", email.toLowerCase()))
      .filter((q) => q.eq(q.field("state"), "active"))
      .first();
  }
  if (phone) {
    user = await db
      .table("users")
      .index("by_phone")
      .range((q) => q.eq("phone", sanitizePhone(phone)))
      .filter((q) => q.eq(q.field("state"), "active"))
      .first();
  }
  return fromDbUser(user);
}

export function sanitizePhone(phone: string) {
  var { isValid, phoneNumber } = validatePhone(phone);
  if (!isValid) {
    var { isValid, phoneNumber } = validatePhone("+" + phone);
  }
  return isValid ? phoneNumber : null;
}
