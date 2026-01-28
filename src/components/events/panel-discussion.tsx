import { EventPageTemplate } from "./event-template";

export function PanelDiscussionPage() {
  const event = {
    title: "The Panel Discussion",
    description:
      "Get the Final Insights. Hear from our expert judges and speakers in a final panel discussion, followed by the closing ceremony to celebrate the day's winners and achievements.",
    date: "February 3, 2026",
    time: "2:00 PM to 5:00 PM (Post Lunch)",
    venue: "Auditorium (D-2)",
    eligibility: "All pass holders",
    prize: undefined, // No prize for panel discussion
  };
  const primaryContacts = [
    { name: "Nidhi Shukla", role: "Core Member", phone: "9324065445" },
    { name: "Mehwish Siddiqui", role: "Junior Core Member", phone: "9324065445" },
    { name: "Om Paranjape", role: "OC Member", phone: "9324065445" },
    // Removed Prakash Mandal
    { name: "Sachin Kumawat", role: "OC Member", phone: "9324065445" },
    { name: "Siddharth Sangwan", role: "OC Member", phone: "9324065445" },
  ];

  const judges = [
    {
      name: "Devang Raja",
      role: "Founder, Venture Wolf",
      image: "/assets/panel/devang_raja.png",
      linkedin: "https://www.linkedin.com/in/devangraja2001/"
    }
  ];

  return <EventPageTemplate event={event} eventId="d2-panel-discussion" registrationUrl="https://forms.gle/ASfrNGrCAV7CF9mo6" panelTitle="Speakers & Judges" judges={judges} primaryContacts={primaryContacts} />;
}
