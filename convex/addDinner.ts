import { mutation } from "./_generated/server";
import { Dinner } from "./types";
import { getLoggedInUser } from "./lib/getUser";

// Send a message to the given chat channel.
export default mutation(
  async ({ db, auth }, dinner: Omit<Dinner, "_id" | "hostId">) => {
    const user = await getLoggedInUser(db, auth);
    if (!user) throw "User isn't logged in";
    // TODO: Check... in the future, real host, max >= target >= min capacity
    return db.insert("dinners", {
      hostId: user._id,
      ...dinner,
    });
  }
);
