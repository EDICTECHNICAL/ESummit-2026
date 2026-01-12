import { EventPageTemplate } from "./event-template";

export function NetworkingArenaPage() {
  const event = {
    title: "Networking Arena",
    description:
      "Open networking session during lunch - connect with entrepreneurs, investors, judges, and fellow participants. An ideal opportunity to build relationships and explore collaborations.",
    date: "February 2-3, 2026",
    time: "Lunch Hours",
    venue: "Multipurpose Hall 2nd Floor and Multipurpose Hall Ground Floor",
    eligibility: "All pass holders",
  };
  const primaryContacts = [
    { name: "Yash Khatri", role: "Core Member", phone: "9324065445" },
    { name: "Pratiksha Upadhyay", role: "Junior Core Member", phone: "9324065445" },
    { name: "Diya Kandari", role: "OC Member", phone: "9324065445" },
    { name: "Shivanshi Pandit", role: "OC Member", phone: "9324065445" },
    { name: "Prashant Yadav", role: "OC Member", phone: "9324065445" },
    { name: "Arukesh Sahu", role: "OC Member", phone: "9324065445" },
  ];

  return <EventPageTemplate event={event} eventId="d1-networking-arena" panelTitle="Guests" primaryContacts={primaryContacts} />;
}
