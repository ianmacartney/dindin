import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { User } from "./types";
import { findUser, getLoggedInUser, sanitizePhone } from "./lib/getUser";

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
export default mutation(async ({ db, auth }) => {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error("Called storeUser without authentication present");
  }

  var patch: Partial<User> = {};

  // Check if we've already stored this identity before.
  const user: User | null =
    (await getLoggedInUser(db, auth)) ||
    (await findUser(db, identity.email, identity.phoneNumber));

  if (user === null) {
    console.log("Adding a new user from identity provider " + identity.issuer);

    // Create new user

    return db.insert("users", {
      name: identity.name!,
      state: "active",
      tokenIdentifier: identity.tokenIdentifier,
      phone: identity.phoneNumber ? sanitizePhone(identity.phoneNumber) : null,
      phoneVerified: identity.phoneNumberVerified || false,
      email: identity.email?.toLowerCase() || null,
      emailVerified: identity.emailVerified || false,
    });
  }

  // Update existing user

  if (!user.tokenIdentifier) {
    // We are claiming this user with this login identifier
    patch.tokenIdentifier = identity.tokenIdentifier;
  }
  if (identity.name && user.name !== identity.name) {
    patch.name = identity.name;
  }
  // For email & phone, only update if we didn't have it or it's now verified.
  if (
    identity.email &&
    (!user.email || (identity.emailVerified && !user.emailVerified))
  ) {
    patch.email = identity.email.toLowerCase();
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
    patch.phone = sanitizePhone(identity.phoneNumber);
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
  if (Object.keys(patch).length !== 0) {
    console.log(
      "Patching " +
        Object.keys(patch).toString() +
        " fields from " +
        identity.issuer
    );
    db.patch(user._id, patch);
  }
  return user._id;
});
