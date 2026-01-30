import { EventPageTemplate } from "./event-template";

export function BizArenaPage() {
  const event = {
    title: "BizArena Game: Build Your Empire",
    description:
      "Step into the founder's seat. Run a virtual startup in this fast-paced simulation. Make critical decisions on product, marketing, and funding to outmaneuver competitors and dominate the market.",
    date: "February 2-3, 2026",
    time: "10:00 AM to 1:00 PM",
    venue: "301 TIMSR",
    prize: { first: "₹5,000", second: "₹3,000", third: "₹2,000", total: "₹10,000" },
    eligibility: "All pass holders (Pixel, Silicon, Quantum, Thakur Student Pass, Exhibitors Pass)",
  };
  const primaryContacts = [
    { name: "Aman Pandey", role: "Core Member", phone: "8108390154" },
    { name: "Raj Mane", role: "Core Member", phone: "7715869977" },
    { name: "Kaushal Shetty", role: "OC Member", phone: "9136127041" },
    { name: "Bhavika Vasule", role: "OC Member", phone: "7276652506" },
    { name: "Anugrah Yadav", role: "OC Member", phone: "9807310372" },
    { name: "Shiva Saraswati", role: "OC Member", phone: "9561914349" },
  ];

  return <EventPageTemplate event={event} eventId="d1-biz-arena" registrationUrl="https://docs.google.com/forms/d/e/1FAIpQLSceiNCR4J1Mh_tr6c2lwK-CkuPDcJt5VWPXO-C4sL2aGz-CAw/viewform" panelTitle="Mentors & Judges" primaryContacts={primaryContacts} />;
}
