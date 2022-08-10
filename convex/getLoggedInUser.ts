import { DatabaseReader } from "./_generated/server";
import { User, Dinner, Guest } from "./types";
import { Auth } from "convex/server";
import { Document } from "./_generated/dataModel";

export async function getLoggedInUser(
  db: DatabaseReader,
  auth: Auth
): Promise<User> {
  const identity = await auth.getUserIdentity();
  if (!identity) throw "No user logged in";
  const user: Document<"users"> = await db
    .table("users")
    .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    .unique();
  if (user.state !== "active") {
    throw "User is not active";
  }
  return user as User;
}
