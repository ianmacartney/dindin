import { Id } from "convex/values";

export type Dinner = {
  _id: Id;
  host: Id;
  address: string;
  startTime: number;
  timezone: string;
  min_capacity: number;
  targetCapacity: number;
  maxCapacity: number;
  calendarInvite: {
    calendar: Id; // LinkedCalendar
    eventId: string;
  }

  // Which reminders to send
  reminders: string[];
};

export type Person = {
  _id: Id;
  name: string;
  state: "invited" | "active" | "inactive";
  phone: string | null;
  phoneVerified: boolean;
  email: string | null;
  emailVerified: boolean;
};

export type GuestPrefs = {
  _id: Id;
  person: Id;
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
}

export type Guest = {
  _id: Id;
  dinner: Id;
  person: Id;
  // Other guests
  bringing: Id[];
  coming: boolean | null;
  comment: string | null;
}

export type InviteLink = {
  _id: Id;
  dinner: Id;
  guestSpecific: Id | null;
  disabled: boolean;
};

export type LinkedCalendar = {
  _id: Id;
  person: Id;
  accessToken: string;
  expiry: number;
};

export type InviteConstraint = {
  _id: Id;
  author: Id;
  guest: Id;
  include: Id[] | null;
  exclude: Id[] | null;
};
