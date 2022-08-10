import { mutation } from "./_generated/server";
import { User, Dinner, Guest } from "./types";
import { Id } from "convex/values";
import { getLoggedInUser } from "./getLoggedInUser";

// Send a message to the given chat channel.
export default mutation(
  async ({ db, auth }, dinnerId: Id, guest: Partial<Guest>) => {
    const user: User = await getLoggedInUser(db, auth);
    var guestId = guest._id;
    if (guestId) {
      const oldGuest: Guest = await db.get(guestId);
      if (oldGuest.userId.equals(user._id)) throw "Wrong user.";
    } else {
      const oldGuest = await db
        .table("guests")
        .filter((q) => q.eq(q.field("dinnerId"), dinnerId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();
      guestId = oldGuest._id;
    }

    // TODO: Check... real dinner, person, max >= target >= min capacity
    db.patch(guestId, guest);
  }
);
