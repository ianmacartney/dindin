import { Id } from "convex/values";

export type Dinner = {
  _id: Id;
  hostId: Id;
  address: string;
  startTime: number;
  timezone: string;
  minCapacity: number;
  targetCapacity: number;
  maxCapacity: number;
  calendarInvite: {
    calendarId: Id; // LinkedCalendar
    eventId: string;
  };

  // Which reminders to send
  reminders: string[];
};

export type Account = {
  _id: Id;
  name: string;
  state: "invited" | "active" | "inactive";
  phone: string | null;
  phoneVerified: boolean;
  email: string | null;
  emailVerified: boolean;
  tokenIdentifier: string;
};

export type GuestPrefs = {
  _id: Id;
  accountId: Id;
  days: {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
    saturday?: number;
    sunday?: number;
  };
  startTime: number;
  dietPref: string[];
  dietNeed: string[];
};

export type Guest = {
  _id: Id;
  dinnerId: Id;
  accountId: Id;
  // Other guests
  bringing: { name: string; email?: string }[];
  coming: boolean | null;
  comment: string | null;
};

export type InviteLink = {
  _id: Id;
  dinnerId: Id;
  guestSpecificId: Id | null;
  disabled: boolean;
};

export type LinkedCalendar = {
  _id: Id;
  accountId: Id;
  accessToken: string;
  expiry: number;
};

export type InviteConstraint = {
  _id: Id;
  authorId: Id;
  guestId: Id;
  includeIds: Id[] | null;
  excludeIds: Id[] | null;
};
