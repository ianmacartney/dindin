import { mutation } from "./_generated/server";
import { Dinner } from "../common";
import { Id } from "convex/values";

// Send a message to the given chat channel.
export default mutation(
  async ({ db }, dinner: Omit<Dinner, "_id">): Promise<Id> => {
    // TODO: Check... in the future, real host, max >= target >= min capacity
    return db.insert("dinners", dinner);
  }
);
