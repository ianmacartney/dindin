import { getLoggedInUser } from "./lib/getUser";
import { GuestPrefs } from "./types";
import { mutation } from "./_generated/server";

export default mutation(
  async (
    { db, auth },
    guestPrefs: Omit<GuestPrefs, "_id" | "_creationTime">
  ) => {
    const user = await getLoggedInUser(db, auth);
    if (user !== null && !user._id.equals(guestPrefs.userId))
      throw "Wrong user's prefs";
    const allPrefs = await db
      .table("guest_prefs")
      .index("by_userId")
      .range((q) => q.eq("userId", guestPrefs.userId))
      .collect();
    if (allPrefs.length > 1) throw "Duplicate guest preferences";
    if (allPrefs.length === 1) {
      db.replace(allPrefs[0]._id, guestPrefs);
      return allPrefs[0]._id;
    }
    return db.insert("guest_prefs", guestPrefs);
  }
);
