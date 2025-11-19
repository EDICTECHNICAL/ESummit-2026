import { useState } from "react";
import { Trophy, Users, Code, Lightbulb, Briefcase, Gamepad2, Music, Coffee, ArrowRight, Calendar, MapPin, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface EventsListingProps {
  onNavigate: (page: string) => void;
}

export function EventsListing({ onNavigate }: EventsListingProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (event: any) => {
    // Store event data in sessionStorage
    sessionStorage.setItem('selectedEvent', JSON.stringify(event));
    // Navigate to event page on same page
    onNavigate(`event-${event.id}`);
  };

  const eventCategories = [
    { id: "all", label: "All Events", icon: Trophy },
    { id: "pitching", label: "Pitching Events", icon: Lightbulb },
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "workshops", label: "Workshops", icon: Users },
    { id: "networking", label: "Networking Events", icon: Coffee },
  ];

  const allEvents = [
    // PITCHING EVENTS
    {
      id: 1,
      title: "The Ten Minute Million",
      category: "pitching",
      description: "Pitch your startup to Venture Capitalists and compete for seed funding opportunities.",
      date: "January 23-24, 2026",
      time: "10:00 - 13:00",
      venue: "SH-4",
      prize: "Seed Funding",
      eligibility: "TRL 4+",
      objective: "Fundraising",
      outcome: "Receive Seed Funding",
      rules: ["10-minute pitch presentation", "Live Q&A with VCs", "Pitch deck required"],
      judges: ["5 Venture Capitalists"],
      prerequisites: "Technology Readiness Level 4 or above",
      registrationDeadline: "January 10, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 2,
      title: "The Angel Investors Roundtable",
      category: "pitching",
      description: "Present your early-stage startup to angel investors and secure pre-seed funding.",
      date: "January 23-24, 2026",
      time: "14:00 - 17:00",
      venue: "530, 531",
      prize: "Pre-Seed Funding",
      eligibility: "Early stage Startups",
      objective: "Receive Investment",
      outcome: "Receive Pre-Seed Funding",
      rules: ["Pitch to panel of angel investors", "15-minute presentation + Q&A", "MVP demonstration required"],
      judges: ["5 Angel Investors"],
      prerequisites: "Early-stage startup with MVP",
      registrationDeadline: "January 10, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 3,
      title: "Pitch Arena - Idea to Reality",
      category: "pitching",
      description: "Platform for first-time founders to pitch their ideas and get shortlisted for the next round.",
      date: "January 23, 2026",
      time: "10:00 - 13:00",
      venue: "SH-3, 532, 533, 504",
      prize: "Shortlisting for Round 2",
      eligibility: "Early stage Startups",
      objective: "Encourage First Time Founders",
      outcome: "Shortlisting Best Ideas for Round 2",
      rules: ["5-minute pitch", "Open to first-time founders", "Idea stage acceptable"],
      judges: ["3 Industry Mentors"],
      prerequisites: "First-time founders welcome",
      registrationDeadline: "January 12, 2026",
      icon: Lightbulb,
      color: "primary",
    },
    {
      id: 4,
      title: "Incubator Summit",
      category: "pitching",
      description: "Pitch to leading incubation centers and secure incubation support for your startup.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "Multipurpose Hall 1st Floor",
      prize: "Incubation Support",
      eligibility: "Early Stage Startups",
      objective: "To Provide Incubation",
      outcome: "Receiving Incubation",
      rules: ["Pitch to incubation centers", "Present growth roadmap", "Team introduction required"],
      judges: ["5 Incubation Centre Evaluators"],
      prerequisites: "Early-stage startup team",
      registrationDeadline: "January 12, 2026",
      icon: Lightbulb,
      color: "primary",
    },

    // COMPETITIONS
    {
      id: 5,
      title: "IPL Auction",
      category: "competitions",
      description: "Learn about capital allocation and customer acquisition through an interactive auction simulation.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "505, 506",
      prize: "TBD",
      eligibility: "All pass holders",
      objective: "To educate on use of capital and customer acquisition",
      outcome: "Gain Insights about CAC and strategy",
      rules: ["Auction-style competition", "Strategic bidding required", "Budget management"],
      judges: ["Business Strategy Mentors"],
      prerequisites: "None",
      registrationDeadline: "January 10, 2026",
      icon: Trophy,
      color: "primary",
    },
    {
      id: 6,
      title: "AI Build-A-Thon",
      category: "competitions",
      description: "Build innovative AI solutions for early-stage startups in this intensive competition.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "216, 217",
      prize: "₹1,50,000",
      eligibility: "All pass holders",
      objective: "Use of AI in early stage startups",
      outcome: "Enhance our knowledge about AI Revolution",
      rules: ["Build AI-powered solution", "Use any AI/ML framework", "Final demo required"],
      judges: ["Tech Mentors", "Tech Judges"],
      prerequisites: "Laptop with development environment",
      registrationDeadline: "January 8, 2026",
      icon: Code,
      color: "secondary",
    },
    {
      id: 7,
      title: "Biz Arena Startup League",
      category: "competitions",
      description: "Navigate startup challenges through strategic gameplay covering team, market, and capital management.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "Lab 520 & 521",
      prize: "₹1,00,000",
      eligibility: "All pass holders",
      objective: "Strategic handling on startup domains (Team, Market, Capital etc)",
      outcome: "Gain insights about each domain using a Game",
      rules: ["Multi-round gameplay", "Strategy-based decisions", "Team collaboration required"],
      judges: ["Business Mentors"],
      prerequisites: "None",
      registrationDeadline: "January 10, 2026",
      icon: Gamepad2,
      color: "accent",
    },

    // WORKSHOPS
    {
      id: 8,
      title: "Design Thinking & Innovation Strategy",
      category: "workshops",
      description: "Hands-on workshop on design thinking and innovation for building successful ventures.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "Lab 522 & 523",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Hands-on Design Thinking & Innovation",
      outcome: "Gain insights for building innovation & ventures",
      prerequisites: "Notepad recommended",
      speaker: "Design Expert",
      icon: Users,
      color: "muted",
    },
    {
      id: 9,
      title: "Finance & Marketing",
      category: "workshops",
      description: "Hands-on workshop covering finance and marketing essentials for startups.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "Lab 524 & 525",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Hands-on Finance & Marketing for startups",
      outcome: "Gain knowledge on the domain specific terms for startups",
      prerequisites: "None",
      speaker: "Industry Expert",
      icon: Briefcase,
      color: "muted",
    },
    {
      id: 10,
      title: "Data Analytics & BDM",
      category: "workshops",
      description: "Learn hands-on data analysis tools and techniques to drive startup growth.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "Lab 526 & 527",
      eligibility: "Silicon & Quantum Pass holders",
      objective: "Hands-on Data Analysis Tools",
      outcome: "Get insights about how data analysis help in startup growth",
      prerequisites: "Basic Excel knowledge",
      speaker: "Data Scientist",
      icon: Users,
      color: "muted",
    },


    // NETWORKING EVENTS
    {
      id: 11,
      title: "Startup Expo",
      category: "networking",
      description: "Showcase your startup and connect with investors, mentors, and fellow entrepreneurs.",
      date: "January 23-24, 2026",
      time: "09:30 - 16:30",
      venue: "Lobby Area",
      eligibility: "All pass holders",
      objective: "Connect startups with ecosystem stakeholders",
      outcome: "Build valuable connections and partnerships",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 12,
      title: "Panel Discussion & Valedictory",
      category: "networking",
      description: "Engage with industry leaders in panel discussions on entrepreneurship and innovation.",
      date: "January 23, 2026",
      time: "Post Lunch",
      venue: "Auditorium",
      eligibility: "All pass holders",
      objective: "Learn from industry leaders",
      outcome: "Gain insights from experienced entrepreneurs",
      speaker: "Industry Leaders",
      icon: Users,
      color: "outline",
    },
    {
      id: 13,
      title: "Networking Arena",
      category: "networking",
      description: "Dedicated networking space to connect with investors, mentors, and startup enthusiasts.",
      date: "January 23-24, 2026",
      time: "Lunch Hours",
      venue: "Multipurpose Hall 2nd Floor & Architecture Ground Floor",
      eligibility: "All pass holders",
      objective: "Facilitate meaningful connections",
      outcome: "Expand your professional network",
      icon: Coffee,
      color: "outline",
    },
    {
      id: 14,
      title: "Internship & Job Fair",
      category: "networking",
      description: "Connect with startups and companies looking for talented interns and fresh graduates.",
      date: "January 23-24, 2026",
      time: "10:00 - 17:00",
      venue: "Convocation Hall",
      eligibility: "All pass holders",
      objective: "Connect students with startup opportunities",
      outcome: "Secure internship and job opportunities",
      icon: Briefcase,
      color: "outline",
    },
    {
      id: 15,
      title: "Startup Youth Conclave",
      category: "networking",
      description: "Exclusive conclave bringing together young entrepreneurs, students, and startup enthusiasts.",
      date: "January 23, 2026",
      time: "10:00 - 13:00",
      venue: "SH-1",
      eligibility: "All pass holders",
      objective: "Inspire and empower youth entrepreneurship",
      outcome: "Build youth startup community",
      speaker: "E-Cell Representatives",
      icon: Users,
      color: "outline",
    },
  ];

  const filteredEvents = (category: string) => {
    const events = category === "all" ? allEvents : allEvents.filter((e) => e.category === category);
    if (searchQuery) {
      return events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return events;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4">Events</h1>
        <p className="text-muted-foreground">
          Explore 15+ events including pitching competitions, workshops, and networking sessions
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          {eventCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="gap-2 flex-shrink-0">
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {eventCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredEvents(category.id).length} events found
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents(category.id).map((event) => (
                <Card key={event.id} className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <event.icon className="h-8 w-8 text-primary" />
                      {event.prize && (
                        <Badge variant="default" className="bg-primary">
                          {event.prize}
                        </Badge>
                      )}
                    </div>
                    <h3>{event.title}</h3>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>
                    
                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {event.venue}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="mt-auto w-full"
                      onClick={() => handleViewDetails(event)}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}