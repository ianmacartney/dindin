import { Guest } from "./types";

export function rsvpSize(guest: Pick<Guest, "coming" | "bringing">) {
  return guest.coming ? 1 + (guest.bringing?.length || 0) : 0;
}
export function calculateAttendance(guests: Guest[]) {
  var coming = 0,
    awaiting = 0,
    declined = 0;
  guests.forEach((guest) => {
    if (guest.coming) {
      coming += rsvpSize(guest);
    } else if (guest.coming === false) {
      declined++;
    } else {
      awaiting++;
    }
  });
  return { coming, awaiting, declined };
}
