import { useState } from "react";
import {
  Download,
  Calendar,
  Ticket,
  FileText,
  User,
  Settings,
  LogOut,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building,
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  getPurchasedPasses,
  getFormattedEventsForPass,
} from "../utils/pass-events";

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
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("passes");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  const mockUser = {
    name: userData?.name || "User",
    email: userData?.email || "user@example.com",
    phone: "+91 98765 43210",
    college: "Premier Institute of Technology",
    year: "3rd Year",
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (onLogout) {
                onLogout();
              } else {
                onNavigate("home");
              }
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <h3>Profile Information</h3>
              <p className="text-sm text-muted-foreground">
                View and edit your personal information
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={mockUser.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      defaultValue={mockUser.email}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      defaultValue={mockUser.phone}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">
                    College/Institution
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="college"
                      className="pl-10"
                      defaultValue={mockUser.college}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <Input
                    id="year"
                    defaultValue={mockUser.year}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button>
                  <User className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h3>Notification Preferences</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage how you receive updates and
                  notifications
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive event updates via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get important alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        smsNotifications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders before scheduled events
                    </p>
                  </div>
                  <Switch
                    checked={settings.eventReminders}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        eventReminders: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about future events
                    </p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        marketingEmails: checked,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h3>Security Settings</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your account security and password
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        twoFactorAuth: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label>Change Password</Label>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Current Password"
                    />
                    <div className="relative">
                      <Input
                        type={
                          showPassword ? "text" : "password"
                        }
                        placeholder="New Password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                    />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-destructive/50">
              <CardHeader>
                <h3>Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Irreversible account actions
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="destructive"
                  className="w-full"
                >
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This action cannot be undone. All your data
                  will be permanently deleted.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}