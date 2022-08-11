import { mutation } from "./_generated/server";
import { Id } from "convex/values";
import { User } from "./types";
import { phone as validatePhone } from "phone";

// Insert or update the user in a Convex table then return the document's Id.
//
// The `UserIdentity` returned from `auth.getUserIdentity` is just an ephemeral
// object representing the identity of the authenticated user; most applications
// will want to store this in a `users` table to reference it in their other
// tables.
//
// The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
// to look up identities, but inserting the value into a table also gives us an
// `_id` field.
//
// Keep in mind that `UserIdentity` has a number of optional fields, the
// presence of which depends on the identity provider chosen. It's up to the
// application developer to determine which ones are available and to decide
// which of those need to be persisted.
export default mutation(async ({ db, auth }): Promise<Id> => {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error("Called storeUser without authentication present");
  }

  // Check if we've already stored this identity before.
  const user: User | null = await db
    .table("users")
    .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    .first();
  if (user !== null) {
    var patch: Partial<User> | null = null;
    // If we've seen this identity before but the name has changed, patch the value.
    if (identity.name && user.name != identity.name) {
      patch = { name: identity.name };
    }
    if (
      identity.email &&
      (!user.email || (identity.emailVerified && !user.emailVerified))
    ) {
      patch = {
        email: identity.email.toLowerCase(),
        ...patch,
      };
      if (identity.emailVerified) {
        patch.emailVerified = true;
        if (
          user.email &&
          user.email.toLowerCase() !== identity.email.toLowerCase()
        ) {
          console.log("Overwriting user email of " + user.email);
        }
      }
    }
    if (
      identity.phoneNumber &&
      (!user.phone || (identity.phoneNumberVerified && !user.phoneVerified))
    ) {
      patch = {
        phone: sanitizePhone(identity.phoneNumber),
        ...patch,
      };
      if (identity.phoneNumberVerified) {
        patch.phoneVerified = true;
        if (
          user.phone &&
          sanitizePhone(user.phone) !== sanitizePhone(identity.phoneNumber)
        ) {
          console.log("Overwriting user phone of " + user.phone);
        }
      }
    }
    if (patch !== null) {
      console.log(
        "Patching " +
          Object.keys(patch).toString() +
          " fields from " +
          identity.issuer
      );
      db.patch(user._id, patch);
    }
    return user._id;
  }
  console.log("Adding a new user from identity provider " + identity.issuer);
  return db.insert("users", {
    name: identity.name!,
    state: "active",
    tokenIdentifier: identity.tokenIdentifier,
    phone: identity.phoneNumber ? sanitizePhone(identity.phoneNumber) : null,
    phoneVerified: identity.phoneNumberVerified || null,
    email: identity.email?.toLowerCase() || null,
    emailVerified: identity.emailVerified || null,
  });
});

function sanitizePhone(phone: string) {
  var { isValid, phoneNumber } = validatePhone(phone);
  if (!isValid) {
    var { isValid, phoneNumber } = validatePhone("+" + phone);
  }
  return isValid ? phoneNumber : null;
}
