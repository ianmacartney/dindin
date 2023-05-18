import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
  // dinners: defineTable({
  //   hostId: v.id("users"),
  //   address: v.string(),
  //   startTime: v.number(),
  //   timezone: v.string(),
  //   minCapacity: v.number(),
  //   targetCapacity: v.number(),
  //   maxCapacity: v.number(),
  //   calendarInvite: v.union(
  //     v.null(),
  //     v.object({
  //       calendarId: v.id("linked_calendars"),
  //       eventId: v.string(),
  //     })
  //   ),
  //   // Which reminders to send
  //   reminders: v.array(v.string()),
  // }).index("by_host_time", ["hostId", "startTime"]),

  users: defineTable({
    name: v.string(),
    state: v.union(
      v.literal("invited"),
      v.literal("active"),
      v.literal("inactive")
    ),
    phone: v.union(v.string(), v.null()),
    phoneVerified: v.boolean(),
    email: v.union(v.string(), v.null()),
    emailVerified: v.boolean(),
    tokenIdentifier: v.union(v.string(), v.null()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  guest_prefs: defineTable({
    userId: v.id("users"),
    weekdays: v.object({
      monday: v.number(),
      tuesday: v.number(),
      wednesday: v.number(),
      thursday: v.number(),
      friday: v.number(),
      saturday: v.number(),
      sunday: v.number(),
    }),
    startTime: v.number(),
    dietPref: v.array(v.string()),
    dietNeed: v.array(v.string()),
  }).index("by_userId", ["userId"]),

  guests: defineTable({
    dinnerId: v.id("dinners"),
    userId: v.id("users"),

    // Other guests.object(s)
    bringing: v.array(
      v.object({
        name: v.string(),
        email: v.union(v.string(), v.null()),
      })
    ),
    coming: v.union(v.boolean(), v.null()),
    comment: v.union(v.string(), v.null()),
  }).index("by_dinner", ["dinnerId"]),

  invite_links: defineTable({
    dinnerId: v.id("dinners"),
    guestSpecificId: v.union(v.id("users"), v.null()),
    disabled: v.boolean(),
  }),

  linked_calendars: defineTable({
    userId: v.id("users"),
    accessToken: v.string(),
  }),

  invite_constraints: defineTable({
    authorId: v.id("users"),
    guestId: v.id("users"),
    includeIds: v.array(v.id("users")),
    excludeIds: v.array(v.id("users")),
  }),
  dinners: defineTable({
    date: v.optional(v.string()),
    host: v.optional(v.array(v.id("peeps"))),
    attendees: v.optional(v.array(v.id("peeps"))),
    weekday: v.optional(v.array(v.id("weekdays"))),
    blurry_selfie: v.optional(v.any()),
    misc: v.optional(v.string()),
  }),
  weekdays: defineTable({
    Name: v.optional(v.string()),
    bestDay: v.optional(v.array(v.id("peeps"))),
    dinners: v.optional(v.array(v.id("dinners"))),
    possibleDay: v.optional(v.array(v.id("peeps"))),
  }),
  peeps: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    foodPrefs: v.optional(
      v.array(
        v.union(
          v.literal("gluten"),
          v.literal("no milk"),
          v.literal("vegetarian"),
          v.literal("vegan"),
          v.literal("no garlic"),
          v.literal("no onion"),
          v.literal("no nuts"),
          v.literal("pescatarian"),
          v.literal("no shellfish"),
          v.literal("no eggs"),
          v.literal("no soy"),
          v.literal("no pork"),
          v.literal("no cheese"),
          v.literal("no butter"),
          v.literal("")
        )
      )
    ),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    bestDay: v.optional(v.array(v.id("weekdays"))),
    possibleDays: v.optional(v.array(v.id("weekdays"))),
    canHost: v.optional(v.boolean()),
    headChef: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    dinnerGuest: v.optional(v.array(v.id("dinners"))),
    dinnerHost: v.optional(v.array(v.id("dinners"))),
  }),
});
