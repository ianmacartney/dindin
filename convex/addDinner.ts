import { mutation } from "./_generated/server";
import { Dinner } from "./types";
import { Id } from "convex/values";
import { WithoutId } from "convex/server";

// Send a message to the given chat channel.
export default mutation(
  async ({ db }, dinner: WithoutId<Dinner>): Promise<Id> => {
    // TODO: Check... in the future, real host, max >= target >= min capacity
    return db.insert("dinners", dinner);
  }
);
