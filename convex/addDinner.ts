import { mutation } from "./_generated/server";
import { Dinner } from "../common";

// Send a message to the given chat channel.
export default mutation(({ db }, dinner: Omit<Dinner, "_id">) => {
  db.insert("dinners", dinner);
});
