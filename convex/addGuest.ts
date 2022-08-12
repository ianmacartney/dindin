import { DatabaseReader, mutation } from "./_generated/server";
import { User, Dinner, Guest } from "./types";
import { findUser, getLoggedInUser } from "./lib/getUser";
import { calculateAttendance, rsvpSize } from "./lib/attendance";

export default mutation(
  async (
    { db, auth },
    guest: Omit<Guest, "userId" | "_id">,
    newUser: {
      name: string;
      phone: string | null;
      email: string | null;
    }
  ) => {
    const user =
      (await getLoggedInUser(db, auth)) ||
      (await findUser(db, newUser.email, newUser.phone));
    const userId =
      user?._id ||
      db.insert("users", {
        name: newUser.name,
        state: "active",
        phone: newUser.phone,
        phoneVerified: false,
        email: newUser.email,
        emailVerified: false,
        tokenIdentifier: null,
      });

    const dinner = await db.get(guest.dinnerId);
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
