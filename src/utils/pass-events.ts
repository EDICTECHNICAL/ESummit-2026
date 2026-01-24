/**
 * Utility for managing pass data and event access
 */

export interface Event {
  id: string;
  time: string;
  title: string;
  category: string;
  venue: string;
  speaker: string | null;
  description: string;
  duration: string;
  prize?: string;
  eligibility?: string;
  prerequisite?: string;
}

export interface PassData {
  id: string;
  type: string;
  passId: string;
  price: number;
  purchaseDate: string;
  status: string;
}

// Event data - centralized source of truth
export const eventSchedule = {
  day1: [
    { id: "d1-registration", time: "08:30 - 09:30", title: "Registration Starts", category: "networking", venue: "Main Entrance", speaker: null, description: "Check-in and receive your welcome kit", duration: "1 hour" },
    { id: "d1-assembling", time: "09:30 - 10:00", title: "Assembling in Auditorium", category: "networking", venue: "Convocation Hall", speaker: null, description: "Assemble in auditorium", duration: "30 min" },
    { id: "d1-inaugural", time: "10:00 - 11:30", title: "Inauguration", category: "networking", venue: "Convocation Hall", speaker: null, description: "Official inauguration", duration: "1.5 hours" },

    // Mid-morning sessions (11:30 - 13:30)
    { id: "d1-ten-minute-deal", time: "11:30 - 13:30", title: "The Ten Minute Deal", category: "pitching", venue: "Convocation Hall", speaker: null, description: "Rapid pitch sessions", duration: "2 hours" },
    { id: "d1-pitch-arena", time: "11:30 - 13:30", title: "Pitch Arena - Idea to Reality", category: "pitching", venue: "Lab 314, 315, 316", speaker: null, description: "Idea-stage pitches and mentorship", duration: "2 hours" },
    { id: "d1-incubator-summit", time: "11:30 - 13:30", title: "The Incubator's Summit", category: "pitching", venue: "SSC TIMSR", speaker: null, description: "Incubator engagement and pitches", duration: "2 hours" },
    { id: "d1-internships-jobfair", time: "11:30 - 13:30", title: "Internships & Job fair", category: "networking", venue: "Lobby Area", speaker: null, description: "Connect with companies for internships and jobs", duration: "2 hours" },
    { id: "d1-informals", time: "11:30 - 13:30", title: "Informals", category: "networking", venue: "Multipurpose Hall 2nd floor & Ground floor", speaker: null, description: "Informal networking", duration: "2 hours" },
    { id: "d1-startup-expo", time: "11:30 - 13:30", title: "StartUp Expo", category: "networking", venue: "Lobby Area", speaker: null, description: "Startup exhibition", duration: "2 hours" },
    { id: "d1-ipl-auction", time: "11:30 - 13:30", title: "Competition - IPL Auction", category: "competitions", venue: "Classroom 601 TIMSR", speaker: null, description: "IPL Auction competition", duration: "2 hours" },
    { id: "d1-biz-arena", time: "11:30 - 13:30", title: "Competition - Biz Arena Startup League", category: "competitions", venue: "Classroom 301 TIMSR", speaker: null, description: "Biz Arena competition", duration: "2 hours" },
    { id: "d1-ai-buildathon", time: "11:30 - 13:30", title: "Competition - AI Build-A-Thon", category: "competitions", venue: "SH-3", speaker: null, description: "AI buildathon sessions", duration: "2 hours" },
    { id: "d1-workshop-design", time: "11:30 - 13:30", title: "Workshop - Design Thinking & Innovation Strategy", category: "workshops", venue: "Lab 528 & 529", speaker: null, description: "Design thinking workshop", duration: "2 hours" },
    { id: "d1-workshop-finance", time: "11:30 - 13:30", title: "Workshop - Finance & Marketing", category: "workshops", venue: "Lab 524 & 525", speaker: null, description: "Finance & marketing workshop", duration: "2 hours" },
    { id: "d1-workshop-data", time: "11:30 - 13:30", title: "Workshop - Data Analytics & BDM", category: "workshops", venue: "Lab 526 & 527", speaker: null, description: "Data analytics workshop", duration: "2 hours" },

    { id: "d1-lunch", time: "13:30 - 14:30", title: "Lunch", category: "networking", venue: "Dining Area", speaker: null, description: "Lunch break", duration: "1 hour" },

    // Afternoon sessions (14:30 - 17:00)
    { id: "d1-ten-minute-deal-afternoon", time: "14:30 - 17:00", title: "The Ten Minute Deal", category: "pitching", venue: "Convocation Hall", speaker: null, description: "Afternoon pitching sessions", duration: "2.5 hours" },
    { id: "d1-incubator-summit-afternoon", time: "14:30 - 17:00", title: "The Incubator's Summit", category: "pitching", venue: "SSC TIMSR", speaker: null, description: "Afternoon incubator engagements", duration: "2.5 hours" },
    { id: "d1-internships-jobfair-afternoon", time: "14:30 - 17:00", title: "Internships & Job fair", category: "networking", venue: "Lobby Area", speaker: null, description: "Afternoon job fair", duration: "2.5 hours" },
    { id: "d1-startup-expo-afternoon", time: "14:30 - 17:00", title: "StartUp Expo", category: "networking", venue: "Lobby Area", speaker: null, description: "Expo continues in afternoon", duration: "2.5 hours" },
    { id: "d1-ai-buildathon-afternoon", time: "14:30 - 17:00", title: "Competition - AI Build-A-Thon", category: "competitions", venue: "SH-3", speaker: null, description: "AI buildathon continues", duration: "2.5 hours" },
    { id: "d1-ipl-auction-afternoon", time: "14:30 - 17:00", title: "Competition - IPL Auction", category: "competitions", venue: "Classroom 601 TIMSR", speaker: null, description: "IPL Auction continues", duration: "2.5 hours" },
    { id: "d1-pitch-arena-afternoon", time: "14:30 - 17:00", title: "Pitch Arena - Idea to Reality", category: "pitching", venue: "Lab 314, 315, 316", speaker: null, description: "Afternoon pitch arena sessions", duration: "2.5 hours" },

    { id: "d1-hightea", time: "17:00 - 17:30", title: "High Tea", category: "networking", venue: "Lobby Area", speaker: null, description: "High tea and refreshments", duration: "30 min" },
    { id: "d1-dispersal", time: "17:30", title: "Dispersal", category: "networking", venue: "Campus", speaker: null, description: "End of Day 1", duration: "" },
  ],
  day2: [
    { id: "d2-registration", time: "08:30 - 09:30", title: "Registration", category: "networking", venue: "Main Entrance", speaker: null, description: "Day 2 check-in", duration: "1 hour" },
    { id: "d2-ten-minute-deal", time: "09:30 - 13:30", title: "The Ten Minute Deal", category: "pitching", venue: "Convocation Hall", speaker: null, description: "Morning pitch sessions", duration: "4 hours" },
    { id: "d2-incubator-summit", time: "09:30 - 13:30", title: "The Incubator's Summit", category: "pitching", venue: "SSC TIMSR", speaker: null, description: "Incubator engagements", duration: "4 hours" },
    { id: "d2-internships-jobfair", time: "09:30 - 13:30", title: "Internships & Job fair", category: "networking", venue: "Lobby Area", speaker: null, description: "Job fair and internships", duration: "4 hours" },
    { id: "d2-startup-expo", time: "09:30 - 13:30", title: "StartUp Expo", category: "networking", venue: "Lobby Area", speaker: null, description: "Expo continues", duration: "4 hours" },
    { id: "d2-ai-buildathon", time: "09:30 - 13:30", title: "Competition - AI Build-A-Thon", category: "competitions", venue: "SH-3", speaker: null, description: "AI buildathon sessions", duration: "4 hours" },
    { id: "d2-ipl-auction", time: "09:30 - 13:30", title: "Competition - IPL Auction", category: "competitions", venue: "Classroom 601 TIMSR", speaker: null, description: "IPL Auction session", duration: "4 hours" },
    { id: "d2-ai-for-atmanirbhar", time: "11:30 - 13:30", title: "AI for Atmanirbhar Bharat: HEI Pre-Summit Engagements towards IndiaAI Impact Summit 2026", category: "networking", venue: "SH-I", speaker: null, description: "AI for Atmanirbhar Bharat session", duration: "2 hours" },
    { id: "d2-lunch", time: "13:30 - 14:30", title: "Lunch", category: "networking", venue: "Dining Area", speaker: null, description: "Lunch break", duration: "1 hour" },
    { id: "d2-panel-discussion", time: "14:30 - 15:30", title: "Panel Discussion", category: "networking", venue: "SSC TIMSR", speaker: null, description: "Panel discussion", duration: "1 hour" },
    { id: "d2-valedictory", time: "15:30 - 16:30", title: "Valedictory", category: "networking", venue: "SSC TIMSR", speaker: null, description: "Valedictory and closing remarks", duration: "1 hour" },
    { id: "d2-dispersal", time: "16:30", title: "Dispersal", category: "networking", venue: "Campus", speaker: null, description: "End of Day 2", duration: "" },
  ],
};

/**
 * Get events that a user is eligible for based on their pass type
 */
export function getEligibleEvents(passType: string): Event[] {
  const allEvents = [...eventSchedule.day1, ...eventSchedule.day2];
  
  // Exclude administrative/automatic events that users don't register for
  const excludedEvents = [
    "d1-registration",
    "d1-assembling",
    "d1-lunch",
    "d1-hightea",
    "d1-dispersal",
    "d2-registration",
    "d2-lunch",
    "d2-dispersal",
  ];

  // Pixel Pass events (free/audience-accessible)
  const pixelEvents = [
    "d1-startup-expo",
    "d1-ipl-auction",
    "d1-ai-buildathon",
    "d1-pitch-arena",
    "d1-ten-minute-deal",
    "d2-startup-expo",
    "d2-ipl-auction",
    "d2-ai-buildathon",
    "d2-pitch-arena",
    "d2-ten-minute-deal",
  ];

  // Silicon Pass events (Pixel + workshops + extras)
  const siliconEvents = [
    ...pixelEvents,
    "d1-workshop-design",
    "d1-workshop-finance",
    "d1-workshop-data",
    "d2-design-thinking",
    "d2-finance-marketing",
    "d2-data-analytics",
  ];

  // Quantum Pass events (Silicon + premium pitching slots)
  const quantumEvents = [
    ...siliconEvents,
    "d1-ten-minute-deal",
    "d1-ten-minute-deal-afternoon",
    "d2-ten-minute-deal",
    "d2-incubator-summit",
    "d1-incubator-summit",
  ];

  // Exhibitors Pass events (focus on expo and networking)
  const exhibitorsEvents = [
    "d1-startup-expo",
    "d1-startup-expo-afternoon",
    "d2-startup-expo",
  ];
  
  switch (passType) {
    case "pixel": // Pixel Pass - Free entry events
      return allEvents.filter(e => pixelEvents.includes(e.id) && !excludedEvents.includes(e.id));
    
    case "tcet_student": // Thakur Student Pass - Same as Quantum (free)
    case "tcet student": 
      return allEvents.filter(e => quantumEvents.includes(e.id) && !excludedEvents.includes(e.id));
    
    case "silicon": // Silicon Pass - Pixel + workshops + pitch arena
      return allEvents.filter(e => siliconEvents.includes(e.id) && !excludedEvents.includes(e.id));
    
    case "quantum": // Quantum Pass - All events
      return allEvents.filter(e => quantumEvents.includes(e.id) && !excludedEvents.includes(e.id));
    
    case "exhibitors": // Exhibitors Pass - Expo and networking focused
    case "exhibitors pass":
      return allEvents.filter(e => exhibitorsEvents.includes(e.id) && !excludedEvents.includes(e.id));
    
    // Legacy pass types (for backward compatibility)
    case "day1": // Gold Pass - Day 1 only
      return eventSchedule.day1.filter(e => !excludedEvents.includes(e.id));
    
    case "day2": // Silver Pass - Day 2 only
      return eventSchedule.day2.filter(e => !excludedEvents.includes(e.id));
    
    case "full": // Platinum Pass - Both days
    case "group": // Group Pass - Both days
      return allEvents.filter(e => !excludedEvents.includes(e.id));
    
    default:
      return [];
  }
}

/**
 * Get pass name from pass ID
 */
export function getPassName(passId: string): string {
  const passNames: Record<string, string> = {
    pixel: "Pixel Pass",
    silicon: "Silicon Pass",
    quantum: "Quantum Pass",
    exhibitors: "Exhibitors Pass",
    "exhibitors pass": "Exhibitors Pass",
    tcet_student: "Thakur Student Pass",
    "tcet student": "Thakur Student Pass",
    // Legacy pass names for backward compatibility
    day1: "Gold Pass",
    day2: "Silver Pass",
    full: "Platinum Pass",
    group: "Group Pass (5+)",
  };
  return passNames[passId] || "Unknown Pass";
}

/**
 * Save purchased pass to localStorage
 */
export function savePurchasedPass(passData: PassData): void {
  const existingPasses = getPurchasedPasses();
  existingPasses.push(passData);
  localStorage.setItem("purchasedPasses", JSON.stringify(existingPasses));
}

/**
 * Get all purchased passes from localStorage
 */
export function getPurchasedPasses(): PassData[] {
  const passes = localStorage.getItem("purchasedPasses");
  return passes ? JSON.parse(passes) : [];
}

/**
 * Format event for display with date
 */
export function formatEventWithDate(event: Event, day: number): {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  speaker: string | null;
  description: string;
} {
  // E-Summit dates: February 2-3, 2026
  const eventDate = day === 1 ? "February 2, 2026" : "February 3, 2026";
  const dayLabel = day === 1 ? "Day 1" : "Day 2";
  
  return {
    id: event.id,
    title: event.title,
    date: eventDate,
    time: event.time,
    venue: event.venue,
    category: event.category,
    speaker: event.speaker,
    description: event.description,
  };
}

/**
 * Get all events for a pass with formatted dates
 */
export function getFormattedEventsForPass(passType: string) {
  const eligibleEvents = getEligibleEvents(passType);
  
  return eligibleEvents.map((event) => {
    const day = event.id.startsWith("d1") ? 1 : 2;
    return formatEventWithDate(event, day);
  });
}
