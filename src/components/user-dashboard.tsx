import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Download,
  Calendar,
  Ticket,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  getPurchasedPasses,
  getFormattedEventsForPass,
} from "../utils/pass-events";
import { ProfileCompletionModal } from "./profile-completion-modal";

interface UserDashboardProps {
  onNavigate: (page: string) => void;
  userData?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export function UserDashboard({
  onNavigate,
  userData,
  onLogout,
}: UserDashboardProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("passes");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  const mockUser = {
    name: user?.fullName || userData?.name || "User",
    email: user?.primaryEmailAddress?.emailAddress || userData?.email || "user@example.com",
  };

  // Check if user profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/check-profile/${user.id}`
        );
        const data = await response.json();

        if (data.success && !data.data.isComplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user?.id]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

  // Get purchased passes from localStorage
  const myPasses = getPurchasedPasses();

  // Get all eligible events from all purchased passes
  const mySchedule = myPasses.length > 0
    ? myPasses.flatMap((pass) => getFormattedEventsForPass(pass.id))
    : [];

  // Remove duplicate events (in case user has multiple passes)
  const uniqueSchedule = mySchedule.filter(
    (event, index, self) => 
      index === self.findIndex((e) => e.id === event.id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="mb-1">
              Welcome back, {mockUser.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {mockUser.email}
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="passes">My Passes</TabsTrigger>
          <TabsTrigger value="schedule">
            My Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="passes">
          <div className="grid gap-6 md:grid-cols-2">
            {myPasses.length > 0 ? (
              myPasses.map((pass) => (
                <Card key={pass.passId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3>{pass.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          Purchased on {pass.purchaseDate}
                        </p>
                      </div>
                      <Badge variant="default">
                        {pass.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border-2 border-dashed p-6 text-center">
                      <div className="mb-4 text-4xl">🎟️</div>
                      <div className="mx-auto mb-4 h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                        <div className="text-xs text-muted-foreground">
                          QR Code
                        </div>
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {pass.passId}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Pass
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : null}

            <Card className="flex items-center justify-center border-dashed">
              <CardContent className="p-6 text-center">
                <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2">
                  {myPasses.length > 0 ? "Need another pass?" : "No passes yet"}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {myPasses.length > 0
                    ? "Book additional passes for workshops"
                    : "Book your first pass to access E-Summit events"}
                </p>
                <Button onClick={() => onNavigate("booking")}>
                  Book Pass
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="space-y-4">
            {myPasses.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="mb-1">Your Pass Access</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        You have access to the following events based on your pass{myPasses.length > 1 ? 'es' : ''}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {myPasses.map((pass) => (
                          <Badge key={pass.passId} variant="default">
                            {pass.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {uniqueSchedule.length > 0 ? (
              <>
                {uniqueSchedule.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge variant="outline" className="mt-1">
                              {event.category}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="mb-2">{event.title}</h3>
                              {event.speaker && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  Speaker: {event.speaker}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Ticket className="h-4 w-4" />
                              {event.venue}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">No events in your schedule</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {myPasses.length > 0
                      ? "You'll see events here based on your purchased pass"
                      : "Purchase a pass to access E-Summit events"}
                  </p>
                  <Button onClick={() => onNavigate(myPasses.length > 0 ? "schedule" : "booking")}>
                    {myPasses.length > 0 ? "View All Events" : "Book Pass"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {uniqueSchedule.length > 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">View complete schedule</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    See the full E-Summit schedule and plan your day
                  </p>
                  <Button onClick={() => onNavigate("schedule")}>
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onComplete={handleProfileComplete}
      />
    </div>
  );
}