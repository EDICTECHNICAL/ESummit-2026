import { EventPageTemplate } from "./event-template";

export function AngelInvestorsRoundtablePage() {
  const event = {
    title: "The Angel Investor's Roundtable",
    description:
      "An exclusive gathering where capital meets innovation. This roundtable brings together angel investors to vet and co-invest in the most promising early-stage companies, featuring founders selected from our Pitch Arena.",
    date: "February 2, 2026",
    time: "9:30 AM – 1:30 PM",
    venue: "General Reading Room (4th floor) / Seminar hall, 2nd floor, TSAP",
    eligibility: "Quantum Pass required",
  };

  const primaryContacts = [
    { name: "Hredey Chaand", role: "Core Member", phone: "9004724466" },
    { name: "Mishti Dhiman", role: "Core Member", phone: "9805411677" },
    { name: "Diya Tailor", role: "Junior Core Member", phone: "8007857018" },
    { name: "Shruti Nale", role: "OC Member", phone: "9324065445" },
    { name: "Aryan Singh", role: "OC Member", phone: "7977915755" },
    { name: "Rutuja Bunke", role: "OC Member", phone: "9967598257" },
    { name: "Dhanush Shetty", role: "OC Member", phone: "8850180464" },
  ];

  return <EventPageTemplate event={event} eventId="d2-angel-roundtable" panelTitle="Angel Investors Panel" primaryContacts={primaryContacts} />;
}
