import { mutation } from "./_generated/server";
import { Account, Dinner, Guest } from "./types";
import { Id } from "convex/values";
import { WithoutId } from "convex/server";

// Send a message to the given chat channel.
export default mutation(
  async (
    { db },
    guest: Omit<WithoutId<Guest>, "accountId"> & {
      accountId?: Guest["accountId"];
    },
    newAccount: {
      name: string;
      phone: string | null;
      email: string | null;
    }
  ): Promise<Id> => {
    // TODO: ensure this is the logged in account
    // TODO: look up by email / phone?
    const accountId =
      guest.accountId ||
      db.insert("accounts", {
        name: newAccount.name,
        state: "active",
        phone: newAccount.phone,
        phoneVerified: false,
        email: newAccount.email,
        emailVerified: false,
      });
    // TODO: Check... real dinner, account, max >= target >= min capacity
    return db.insert("guests", {
      ...guest,
      accountId,
    });
  }
);
