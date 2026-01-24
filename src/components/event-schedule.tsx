import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Filter, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
// import { toast } from "sonner";
import { motion } from "motion/react";
import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { PulseDot } from "./accentricity/pulse-dot";
import { FloatingCard } from "./accentricity/floating-card";
import { RippleBackground } from "./accentricity/ripple-background";

const EventSchedule = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");

  // Define event type for consistency
  type Event = {
    id: string;
    time: string;
    title: string;
    category: string;
    venue: string;
    speaker: string | null;
    description: string;
    duration: string;
    eligibility?: string;
    prerequisite?: string;
    prize?: string;
  };

  const categories = [
    { id: "all", label: "All Events", color: "default" },
    { id: "pitching", label: "Pitching Events", color: "accent" },
    { id: "competitions", label: "Competitions", color: "primary" },
    { id: "workshops", label: "Workshops", color: "secondary" },
    { id: "networking", label: "Networking", color: "outline" },
  ];

  const events: { preEvent: Event[]; day1: Event[]; day2: Event[] } = {
    preEvent: [],
    day1: [
      {
        id: "d1-registration",
        time: "08:30 - 09:30",
        title: "Registration Starts",
        category: "networking",
        venue: "Main Entrance",
        speaker: null,
        description: "Check-in and receive your welcome kit",
        duration: "1 hour",
      },
      {
        id: "d1-assembling",
        time: "09:30 - 10:00",
        title: "Assembling in Auditorium",
        category: "networking",
        venue: "Convocation Hall",
        speaker: null,
        description: "Participants assemble in the auditorium for the inaugural ceremony",
        duration: "30 min",
      },
      {
        id: "d1-inaugural",
        time: "10:00 - 11:30",
        title: "Inauguration",
        category: "networking",
        venue: "Convocation Hall",
        speaker: "Chief Guest",
        description: "Official opening of E-Summit 2026",
        duration: "1.5 hours",
      },
      {
        id: "d1-ten-minute-deal",
        time: "11:30 - 13:30",
        title: "The Ten Minute Deal",
        category: "pitching",
        venue: "Convocation Hall",
        speaker: "Venture Panel",
        description: "Rapid pitch sessions where founders present to investors in ten minutes each.",
        duration: "2 hours",
        eligibility: "Startups",
      },

      {
        id: "d1-pitch-arena",
        time: "11:30 - 13:30",
        title: "Pitch Arena - Idea to Reality",
        category: "pitching",
        venue: "Lab 314, 315, 316",
        speaker: "Industry Mentors",
        description: "Platform for first-time founders to pitch their ideas and receive feedback.",
        duration: "2 hours",
      },
      {
        id: "d1-incubator-summit",
        time: "11:30 - 13:30",
        title: "The Incubator's Summit",
        category: "pitching",
        venue: "SSC TIMSR",
        speaker: "Incubation Centres",
        description: "Pitch to incubation centres for mentorship and incubation support.",
        duration: "2 hours",
      },
      {
        id: "d1-ai-buildathon",
        time: "11:30 - 13:30",
        title: "Competition - AI Build-A-Thon",
        category: "competitions",
        venue: "SH-3",
        speaker: "Tech Mentors",
        description: "Competition to build AI solutions.",
        duration: "2 hours",
      },
      {
        id: "d1-ipl-auction",
        time: "11:30 - 13:30",
        title: "Competition - IPL Auction",
        category: "competitions",
        venue: "Classroom 601 TIMSR",
        speaker: null,
        description: "Strategy and bidding competition.",
        duration: "2 hours",
      },
      {
        id: "d1-biz-arena",
        time: "11:30 - 13:30",
        title: "Competition - Biz Arena Startup League",
        category: "competitions",
        venue: "Classroom 301 TIMSR",
        speaker: null,
        description: "Business simulation competition.",
        duration: "2 hours",
      },

      {
        id: "d1-design-thinking",
        time: "11:30 - 13:30",
        title: "Workshop - Design Thinking & Innovation Strategy",
        category: "workshops",
        venue: "Lab 528 & 529",
        speaker: "Design Expert",
        description: "Hands-on workshop on design thinking and innovation strategy.",
        duration: "2 hours",
      },
      {
        id: "d1-finance-marketing",
        time: "11:30 - 13:30",
        title: "Workshop - Finance & Marketing",
        category: "workshops",
        venue: "Lab 524 & 525",
        speaker: "Finance & Marketing Expert",
        description: "Workshop on finance and marketing essentials for startups.",
        duration: "2 hours",
      },
      {
        id: "d1-data-analytics",
        time: "11:30 - 13:30",
        title: "Workshop - Data Analytics & BDM",
        category: "workshops",
        venue: "Lab 526 & 527",
        speaker: "Data Analytics Expert",
        description: "Workshop on data analytics and business development.",
        duration: "2 hours",
      },
      {
        id: "d1-startup-expo",
        time: "11:30 - 13:30",
        title: "StartUp Expo",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Showcase your startup and connect with visitors.",
        duration: "2 hours",
      },
      {
        id: "d1-internships-jobfair",
        time: "11:30 - 13:30",
        title: "Internships & Job fair",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Connect with companies and startups for internships and jobs.",
        duration: "2 hours",
      },
      {
        id: "d1-hightea",
        time: "17:00 - 17:30",
        title: "High Tea",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Refreshments and networking",
        duration: "30 min",
      },
      {
        id: "d1-informals",
        time: "11:30 - 13:30",
        title: "Informals",
        category: "networking",
        venue: "Multipurpose Hall 2nd floor & Ground floor",
        speaker: null,
        description: "Informal networking sessions",
        duration: "2 hours",
      },
      {
        id: "d1-dispersal",
        time: "17:30",
        title: "Dispersal",
        category: "networking",
        venue: "Campus",
        speaker: null,
        description: "End of Day 1",
        duration: "",
      },

    ],
    day2: [
      {
        id: "d2-registration",
        time: "08:30 - 09:30",
        title: "Registration",
        category: "networking",
        venue: "Main Entrance",
        speaker: null,
        description: "Check-in for Day 2 events",
        duration: "1 hour",
      },
      {
        id: "d2-ten-minute-deal",
        time: "09:30 - 13:30",
        title: "The Ten Minute Deal",
        category: "pitching",
        venue: "Convocation Hall",
        speaker: "Venture Panel",
        description: "Rapid pitch sessions where founders present to investors in ten minutes each.",
        duration: "4 hours",
      },
      {
        id: "d2-incubator-summit",
        time: "09:30 - 13:30",
        title: "The Incubator's Summit",
        category: "pitching",
        venue: "SSC TIMSR",
        speaker: "Incubation Centres",
        description: "Pitch to incubation centres for mentorship and incubation support.",
        duration: "4 hours",
      },
      {
        id: "d2-ai-buildathon",
        time: "09:30 - 13:30",
        title: "Competition - AI Build-A-Thon",
        category: "competitions",
        venue: "SH-3",
        speaker: null,
        description: "Competition to build AI solutions.",
        duration: "4 hours",
      },
      {
        id: "d2-ipl-auction",
        time: "09:30 - 13:30",
        title: "Competition - IPL Auction",
        category: "competitions",
        venue: "Classroom 601 TIMSR",
        speaker: null,
        description: "Strategy and bidding competition.",
        duration: "4 hours",
      },
      {
        id: "d2-internships-jobfair",
        time: "09:30 - 13:30",
        title: "Internships & Job fair",
        category: "networking",
        venue: "Lobby Area",
        speaker: null,
        description: "Connect with companies and startups for internships and jobs.",
        duration: "4 hours",
      },
      {
        id: "d2-design-thinking",
        time: "09:30 - 13:30",
        title: "Workshop - Design Thinking & Innovation Strategy",
        category: "workshops",
        venue: "Lab 528 & 529",
        speaker: null,
        description: "Hands-on workshop on design thinking and innovation strategy.",
        duration: "4 hours",
      },
      {
        id: "d2-finance-marketing",
        time: "09:30 - 13:30",
        title: "Workshop - Finance & Marketing",
        category: "workshops",
        venue: "Lab 524 & 525",
        speaker: null,
        description: "Workshop on finance and marketing essentials for startups.",
        duration: "4 hours",
      },
      {
        id: "d2-data-analytics",
        time: "09:30 - 13:30",
        title: "Workshop - Data Analytics & BDM",
        category: "workshops",
        venue: "Lab 526 & 527",
        speaker: null,
        description: "Workshop on data analytics and business development.",
        duration: "4 hours",
      },

      {
        id: "d2-ai-for-atmanirbhar",
        time: "11:30 - 13:30",
        title: "AI for Atmanirbhar Bharat: HEI Pre-Summit Engagements towards IndiaAI Impact Summit 2026",
        category: "networking",
        venue: "SH-I",
        speaker: null,
        description: "Pre-summit engagement focused on AI for Atmanirbhar Bharat.",
        duration: "2 hours",
      },
      {
        id: "d2-lunch",
        time: "13:30 - 14:30",
        title: "Lunch",
        category: "networking",
        venue: "Dining Area",
        speaker: null,
        description: "Lunch break",
        duration: "1 hour",
      },
      {
        id: "d2-panel-discussion",
        time: "14:30 - 15:30",
        title: "Panel Discussion",
        category: "networking",
        venue: "SSC TIMSR",
        speaker: null,
        description: "Panel discussion with industry experts.",
        duration: "1 hour",
      },
      {
        id: "d2-valedictory",
        time: "15:30 - 16:30",
        title: "Valedictory",
        category: "networking",
        venue: "SSC TIMSR",
        speaker: null,
        description: "Closing remarks and dispersal",
        duration: "1 hour",
      },
      {
        id: "d2-dispersal",
        time: "16:30",
        title: "Dispersal",
        category: "networking",
        venue: "Campus",
        speaker: null,
        description: "End of Day 2",
        duration: "",
      },
    ],
  };



  const filterEvents = (eventsList: Event[]) => {
    return eventsList.filter((event) => {
      const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
      const venueMatch = selectedVenue === "all" || event.venue === selectedVenue;
      return categoryMatch && venueMatch;
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || "default";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-12">
        <RippleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <h1 className="mb-4 text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Event Schedule
          </h1>
          <p className="text-muted-foreground">
            Plan your E-Summit experience with our comprehensive schedule
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filter by:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:flex md:gap-4 md:flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Venues</SelectItem>
                <SelectItem value="TBA">TBA</SelectItem>
                <SelectItem value="Main Entrance">Main Entrance</SelectItem>
                <SelectItem value="Main Auditorium">Main Auditorium</SelectItem>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
                <SelectItem value="SH-1">SH-1</SelectItem>
                <SelectItem value="314, 315, 316">314, 315, 316</SelectItem>
                <SelectItem value="SSC TIMSR">SSC TIMSR</SelectItem>
                <SelectItem value="SH-3">SH-3</SelectItem>
                <SelectItem value="Classroom 601 TIMSR">Classroom 601 TIMSR</SelectItem>
                <SelectItem value="Classroom 301 TIMSR">Classroom 301 TIMSR</SelectItem>
                <SelectItem value="Lab 522 & 523">Lab 522 & 523</SelectItem>
                <SelectItem value="Lab 524 & 525">Lab 524 & 525</SelectItem>
                <SelectItem value="Lab 526 / 527 / 528 / 529">Lab 526 / 527 / 528 / 529</SelectItem>
                <SelectItem value="Lobby Area">Lobby Area</SelectItem>
                <SelectItem value="Convocation Hall">Convocation Hall</SelectItem>
                <SelectItem value="Multipurpose Hall 2nd Floor and Multipurpose Hall Ground Floor">Multipurpose Hall 2nd Floor and Ground Floor</SelectItem>
                <SelectItem value="General Reading Room (4th floor) / Seminar hall, 2nd floor, TSAP">General Reading Room / Seminar hall TSAP</SelectItem>
                <SelectItem value="Seminar Hall, 2nd floor, TSAP / Internal General Reading Room">Seminar Hall TSAP / Internal Reading Room</SelectItem>
                <SelectItem value="Auditorium (D-1)">Auditorium (D-1)</SelectItem>
                <SelectItem value="Auditorium (D-2)">Auditorium (D-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 text-xs sm:text-sm">
          <TabsTrigger value="day1" className="px-2 sm:px-4">Day 1 - Feb 2</TabsTrigger>
          <TabsTrigger value="day2" className="px-2 sm:px-4">Day 2 - Feb 3</TabsTrigger>
        </TabsList>

        <TabsContent value="day1" className="mt-6">
          <div className="space-y-4">
            {filterEvents(events.day1).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any} className="text-xs">
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                      </div>

                      <h3 className="mb-2 text-lg sm:text-xl font-semibold">{event.title}</h3>

                      <div className="mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{event.speaker}</span>
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm leading-relaxed">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[120px]">
                      {/* Register button removed - registration handled in individual event pages */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day2" className="mt-6">
          <div className="space-y-4">
            {filterEvents(events.day2).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant={getCategoryColor(event.category) as any} className="text-xs">
                          {categories.find((c) => c.id === event.category)?.label}
                        </Badge>
                      </div>

                      <h3 className="mb-2 text-lg sm:text-xl font-semibold">{event.title}</h3>

                      <div className="mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{event.speaker}</span>
                          </div>
                        )}
                      </div>

                      <p className="mb-2 text-sm leading-relaxed">{event.description}</p>

                      {(event.eligibility || event.prerequisite) && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {event.eligibility && <span>• {event.eligibility}</span>}
                          {event.prerequisite && <span>• {event.prerequisite}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[120px]">
                      {/* Register button removed - registration handled in individual event pages */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventSchedule;
