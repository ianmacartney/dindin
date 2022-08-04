import { Id } from "convex/values";

export type Dinner = {
  _id: Id;
  host: Id;
  guests: Id[];
  address: string;
  datetime: string;
  timezone: string;
};

export type Person = {
  _id: Id;
  name: string;
  phone: string | null;
  phoneVerified: boolean;
  email: string | null;
  emailVerified: boolean;
};
