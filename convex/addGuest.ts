import { mutation } from "./_generated/server";
import { User, Dinner, Guest } from "./types";
import { Id } from "convex/values";
import { WithoutId } from "convex/server";

// Send a message to the given chat channel.
export default mutation(
  async (
    { db },
    guest: Omit<WithoutId<Guest>, "userId"> & {
      userId?: Guest["userId"];
    },
    newUser: {
      name: string;
      phone: string | null;
      email: string | null;
    }
  ): Promise<Id> => {
    // TODO: ensure this is the logged in user
    // TODO: look up by email / phone?
    const userId =
      guest.userId ||
      db.insert("users", {
        name: newUser.name,
        state: "active",
        phone: newUser.phone,
        phoneVerified: false,
        email: newUser.email,
        emailVerified: false,
      });
    // TODO: Check... real dinner, user, max >= target >= min capacity
    return db.insert("guests", {
      ...guest,
      userId,
    });
  }
);
