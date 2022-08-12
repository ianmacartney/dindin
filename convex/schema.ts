import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
  dinners: defineTable({
    hostId: s.id("users"),
    address: s.string(),
    startTime: s.number(),
    timezone: s.string(),
    minCapacity: s.number(),
    targetCapacity: s.number(),
    maxCapacity: s.number(),
    calendarInvite: s.object({
      calendarId: s.id("linked_calendars"),
      eventId: s.string(),
    }),
    // Which reminders to send
    reminders: s.array(s.string()),
  }).index("by_host_time", ["hostId", "startTime"]),

  users: defineTable({
    name: s.string(),
    state: s.string(),
    phone: s.union(s.string(), s.null()),
    phoneVerified: s.boolean(),
    email: s.union(s.string(), s.null()),
    emailVerified: s.boolean(),
    tokenIdentifier: s.union(s.string(), s.null()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  guest_prefs: defineTable({
    userId: s.id("users"),
    weekdays: s.object({
      monday: s.number(),
      tuesday: s.number(),
      wednesday: s.number(),
      thursday: s.number(),
      friday: s.number(),
      saturday: s.number(),
      sunday: s.number(),
    }),
    startTime: s.number(),
    dietPref: s.array(s.string()),
    dietNeed: s.array(s.string()),
  }).index("by_userId", ["userId"]),

  guests: defineTable({
    dinnerId: s.id("dinners"),
    userId: s.id("users"),

    // Other guests.object(s)
    bringing: s.array(
      s.object({
        name: s.string(),
        email: s.union(s.string(), s.null()),
      })
    ),
    coming: s.union(s.boolean(), s.null()),
    comment: s.union(s.string(), s.null()),
  }).index("by_dinner", ["dinnerId"]),

  invite_links: defineTable({
    dinnerId: s.id("dinners"),
    guestSpecificId: s.union(s.id("users"), s.null()),
    disabled: s.boolean(),
  }),

  linked_calendars: defineTable({
    userId: s.id("users"),
    accessToken: s.string(),
  }),

  invite_constraints: defineTable({
    authorId: s.id("users"),
    guestId: s.id("users"),
    includeIds: s.array(s.id("users")),
    excludeIds: s.array(s.id("users")),
  }),
});
