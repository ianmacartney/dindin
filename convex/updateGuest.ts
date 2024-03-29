import { mutation } from "./_generated/server";
import { Guest } from "./types";
import { Id } from "./_generated/dataModel";
import { getLoggedInUser } from "./lib/getUser";
import { calculateAttendance, rsvpSize } from "./lib/attendance";

export default mutation(
  async (
    { db, auth },
    { dinnerId, guest }: { dinnerId: Id<"dinners">; guest: Partial<Guest> }
  ) => {
    const user = await getLoggedInUser(db, auth);
    if (user === null) throw "Not logged in";
    const dinner = await db.get(dinnerId);
    if (dinner === null) throw "Unknown dinner";
    if (guest.userId && !guest.userId.equals(user._id))
      throw "Trying to change guest to a different user";
    const guests = await db
      .query("guests")
      .filter((q) => q.eq(q.field("dinnerId"), dinnerId))
      .collect();
    const oldGuest = guests.reduce((old: Guest | null, g) => {
      if (g.userId.equals(user._id)) {
        if (guest._id && !g._id.equals(guest._id))
          throw "Trying to update another user's guest.";
        if (old !== null) throw "Duplicate guest for this user";
        old = g;
      }
      return old;
    }, null);
    if (oldGuest === null) {
      throw "Can't find a guest for this user.";
    }
    const updated = Object.assign({ ...oldGuest }, guest);
    const { coming } = calculateAttendance(guests);
    const delta = rsvpSize(updated) - rsvpSize(oldGuest);
    // TODO: if (delta > 0 && coming + delta > dinner.maxCapacity) {
    //   throw "Too many people";
    // }
    db.patch(oldGuest._id, guest);
    return oldGuest;
  }
);
