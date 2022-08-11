import { mutation } from "./_generated/server";
import { User, Dinner, Guest } from "./types";
import { Id } from "convex/values";
import { WithoutId } from "convex/server";
import { getLoggedInUser } from "./getLoggedInUser";
import { calculateAttendance, rsvpSize } from "./helpers";

// Send a message to the given chat channel.
export default mutation(
  async (
    { db, auth },
    guest: Omit<WithoutId<Guest>, "userId">,
    newUser: {
      name: string;
      phone: string | null;
      email: string | null;
    }
  ): Promise<Id> => {
    const user = await getLoggedInUser(db, auth);
    // TODO: look up by email / phone?
    const userId =
      user?._id ||
      db.insert("users", {
        name: newUser.name,
        state: "active",
        phone: newUser.phone,
        phoneVerified: false,
        email: newUser.email,
        emailVerified: false,
      });

    const dinner: Dinner = await db.get(guest.dinnerId as Id);
    if (dinner === null) throw "No dinner found";
    const guests = await db
      .table("guests")
      .filter((q) => q.eq(q.field("dinnerId"), dinner._id))
      .collect();
    const { coming } = calculateAttendance(guests);
    if (coming + rsvpSize(guest as Guest) > dinner.maxCapacity) {
      throw "Too many people";
    }
    return db.insert("guests", {
      ...guest,
      userId,
    });
  }
);
