import { mutation } from "./_generated/server";
import { Account, Dinner, Guest } from "../common";
import { Id } from "convex/values";

// Send a message to the given chat channel.
export default mutation(
  async ({ db, auth }, dinnerId: Id, guest: Partial<Guest>) => {
    const user = await auth.getUserIdentity();
    if (!user) throw "Must be logged in to update a guest";
    var guestId = guest._id;
    if (guestId) {
        const guest: Guest = await db.get(guestId);
        const account: Account = await db.get(guest.accountId);
        assert account.tokenIdentifier == user.tokenIdentifier
    } else {
        const query = db.table("guests").filter(q => q.eq(q.field("dinnerId"), dinnerId));

    }

    // TODO: Check... real dinner, person, max >= target >= min capacity
    // TODO: check guest owned by logged in person
    db.patch(guest._id, guest);
  }
);
