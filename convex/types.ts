import { Document } from "./_generated/dataModel";

export type Dinner = Document<"dinners">;
export type Account = Omit<Document<"accounts">, "state"> & {
  state: "invited" | "active" | "inactive";
};
export type Guest = Document<"guests">;
export type GuestPrefs = Document<"guest_prefs">;
export type InviteLinks = Document<"invite_links">;
export type LinkedCalendar = Document<"linked_calendars">;
export type InviteConstraint = Document<"invite_constraints">;
