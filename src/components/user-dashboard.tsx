import React, { useState, useEffect, type MouseEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Download,
  Calendar,
  Ticket,
  FileText,
  Loader2,
  UserPlus,
  CheckCircle2,
  X,
  Upload,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFormattedEventsForPass } from "../utils/pass-events";
import { ProfileCompletionModal } from "./profile-completion-modal";
import { API_BASE_URL } from "../lib/api";
import { AuroraText } from "./magicui/aurora-text";
import { KonfHubWidget } from "./konfhub-widget";
import { toast } from "sonner";

interface Pass {
  id: string; // UUID
  passId: string;
  passType: string;
  bookingId?: string;
  konfhubTicketId?: string;
  konfhubOrderId?: string;
  price?: number;
  purchaseDate?: string;
  ticketDetails?: {
    inclusions?: string[];
    features?: string[];
    [key: string]: any;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  speaker?: string | null;
}

interface EventRegistration {
  eventId: string;
  userId: string;
  registeredAt: string;
  status: string;
}

interface PendingPassClaim {
  id: string;
  clerkUserId: string;
  email: string;
  fullName?: string;
  passType: string;
  bookingId?: string;
  konfhubOrderId?: string;
  ticketNumber?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [myPasses, setMyPasses] = useState<Pass[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState(true);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [showKonfHubWidget, setShowKonfHubWidget] = useState(false);
  
  // Pass claim states
  const [showPassClaimModal, setShowPassClaimModal] = useState(false);
  const [pendingClaims, setPendingClaims] = useState<PendingPassClaim[]>([]);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [claimFormData, setClaimFormData] = useState({
    bookingId: '',
    passType: 'Pixel Pass',
  });

  // Check if user is a Thakur student (TCET, TGBS, TIMSR, Thakur Education) based on email domain
  const userName = user?.fullName || userData?.name || "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || userData?.email || "user@example.com";
  const isTCETStudent = userEmail.toLowerCase().endsWith("@tcetmumbai.in") || 
                        userEmail.toLowerCase().endsWith("@tgbs.in") || 
                        userEmail.toLowerCase().endsWith("@timsr.edu.in") ||
                        userEmail.toLowerCase().endsWith("@thakureducation.org");

  // Set initial tab to My Passes for all users
  const [activeTab, setActiveTab] = useState("mypasses");

  // Handle Thakur Student pass booking
  const handleTcetPassBooking = async () => {
    if (!user?.id) {
      toast.error("🔒 Please sign in to book your pass and unlock exclusive event access!");
      return;
    }

    try {
      // Open KonfHub widget
      setShowKonfHubWidget(true);
    } catch (error) {
      toast.error("⚠️ Something went wrong. Please refresh the page and try again.");
    }
  };

  // Fetch user passes from database
  useEffect(() => {
    const fetchPasses = async () => {
      if (!user?.id) {
        setIsLoadingPasses(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/passes/user/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.passes) {
          // Show all Active passes
          const confirmedPasses = data.data.passes.filter((pass: Pass) => {
            return pass.status === 'Active';
          });
          setMyPasses(confirmedPasses);
        }
      } catch (error) {
        console.error("Error fetching passes:", error);
      } finally {
        setIsLoadingPasses(false);
      }
    };

    fetchPasses();
  }, [user?.id]);

  // Fetch pending pass claims
  useEffect(() => {
    const fetchPendingClaims = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/pass-claims/user/${user.id}`
        );
        const data = await response.json();

        if (data.success && data.data.claims) {
          // Filter out expired claims and only show pending ones
          const activeClaims = data.data.claims.filter(
            (claim: PendingPassClaim) => claim.status === 'pending'
          );
          setPendingClaims(activeClaims);
        }
      } catch (error) {
        console.error("Error fetching pending claims:", error);
      }
    };

    fetchPendingClaims();
    
    // Poll every 30 seconds to check for verification updates
    const interval = setInterval(fetchPendingClaims, 30000);
    return () => clearInterval(interval);
  }, [user?.id, myPasses.length]);

  // Handle pass claim submission
  const handleSubmitPassClaim = async () => {
    if (!user?.id || !userEmail) {
      toast.error("🔒 Please sign in to claim your pass. Already have a booking? We'll help you get your pass!");
      return;
    }

    if (!claimFormData.bookingId) {
      toast.error("📋 Please provide your Booking ID from your booking confirmation.");
      return;
    }

    setIsSubmittingClaim(true);

    try {
      // Create pass directly with immediate approval
      const response = await fetch(`${API_BASE_URL}/passes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: user.id,
          email: userEmail,
          fullName: userName,
          passType: claimFormData.passType,
          bookingId: claimFormData.bookingId,
          status: 'Active', // Immediately approve
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("🎉 Pass approved!", {
          description: "Your pass has been added to your account immediately.",
        });
        // Refresh passes to show the new pass
        window.location.reload();
        setShowPassClaimModal(false);
        setClaimFormData({
          bookingId: '',
          passType: 'Pixel Pass',
        });
        setUploadedFile(null);
      } else {
        toast.error(data.error || "Failed to create pass");
      }
    } catch (error) {
      console.error("Error creating pass:", error);
      toast.error("⚠️ Couldn't create your pass. Please check your information and try again. Contact support if the issue persists.");
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Cancel a pending claim
  const handleCancelClaim = async (claimId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pass-claims/${claimId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Claim cancelled");
        setPendingClaims(prev => prev.filter(c => c.id !== claimId));
      } else {
        toast.error(data.error || "Failed to cancel claim");
      }
    } catch (error) {
      toast.error("Failed to cancel claim");
    }
  };

  // Calculate hours remaining for a claim
  const getHoursRemaining = (expiresAt: string): number => {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.round((expiry - now) / (60 * 60 * 1000)));
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
          `${API_BASE_URL}/users/check-profile/${user.id}`
        );
        const data = await response.json();

        // If user doesn't exist in database, create them
        if (data.success && !data.data.exists) {
          const syncResponse = await fetch(`${API_BASE_URL}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              fullName: user.fullName || '',
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              imageUrl: user.imageUrl || '',
            }),
          });
          
          await syncResponse.json();

          // Show profile modal for new users
          setShowProfileModal(true);
        } else if (data.success && data.data.exists && !data.data.isComplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        // Silent fail - profile check is not critical
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user?.id]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

  // Map pass type names to pass identifiers for event eligibility
  const getPassTypeId = (passTypeName: string): string => {
    // Normalize the pass type name (trim and lowercase for comparison)
    const normalizedName = passTypeName.trim().toLowerCase();
    
    const passTypeMap: Record<string, string> = {
      // New pass types
      "pixel pass": "pixel",
      "silicon pass": "silicon",
      "quantum pass": "quantum",
      "exhibitors pass": "exhibitors",
      "tcet student pass": "tcet_student",
      "tcet pass": "tcet_student",
      "thakur student pass": "tcet_student",
      // Legacy pass types (for backward compatibility)
      "gold pass": "day1",
      "silver pass": "day2",
      "platinum pass": "full",
      "group pass (5+)": "group",
      "group pass": "group",
    };
    
    const passTypeId = passTypeMap[normalizedName] || "pixel";
    return passTypeId;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle event registration
  const handleEventRegistration = async (eventId: string) => {
    if (!user?.id) {
      toast.error('🔒 Please sign in to register for events. Your pass grants you access to exclusive opportunities!');
      return;
    }

    // Check if already registered
    if (registeredEvents.has(eventId)) {
      toast.error('⚠️ You are already registered for this event!', {
        description: 'Check "Your Registered Events" section above.',
      });
      return;
    }

    try {
      setRegisteringEventId(eventId);
      
      // TODO: This will be replaced with actual API call
      // const response = await fetch(`${API_BASE_URL}/events/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user.id, eventId })
      // });
      
      // For now, just simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRegisteredEvents(prev => new Set([...prev, eventId]));
      toast.success(`✅ You're registered! Check your email for event details and next steps.`, { duration: 5000 });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('⚠️ Registration failed. Please check your pass eligibility and try again. Need help? Contact support.');
    } finally {
      setRegisteringEventId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto sm:mx-0">
            <AvatarImage src={user?.imageUrl} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="mb-1 text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Welcome back, {userName.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {userEmail}
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
          <TabsTrigger value="mypasses">My Passes</TabsTrigger>
        </TabsList>

        {/* My Passes Tab - For all users */}
        <TabsContent value="mypasses">
          {isLoadingPasses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {myPasses.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">🎫 My Passes</h3>
                    <Badge variant="secondary">{myPasses.length} Pass{myPasses.length > 1 ? 'es' : ''}</Badge>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {myPasses.map((pass) => (
                      <Card key={pass.passId} className="border-2 border-primary/20 max-w-full overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-base sm:text-lg font-bold truncate">{pass.passType}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">Pass ID: {pass.passId}</p>
                              {pass.bookingId && (
                                <p className="text-xs text-muted-foreground truncate">Booking ID: {pass.bookingId}</p>
                              )}
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700 self-start shrink-0">
                              {pass.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs sm:text-sm">{pass.purchaseDate ? 'Purchase Date' : 'Registered'}</p>
                              <p className="font-medium text-sm sm:text-base">{formatDate(pass.purchaseDate || pass.createdAt)}</p>
                            </div>
                            {pass.price && (
                              <div>
                                <p className="text-muted-foreground text-xs sm:text-sm">Amount Paid</p>
                                <p className="font-medium text-sm sm:text-base">₹{pass.price.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Includes:</p>
                            <div className="grid grid-cols-1 gap-2 text-xs">
                              {(() => {
                                const passTypeId = getPassTypeId(pass.passType);
                                const eligibleEvents = getFormattedEventsForPass(passTypeId);
                                return eligibleEvents.length > 0 ? (
                                  eligibleEvents.map((event, idx) => (
                                    <div key={idx} className="flex items-center gap-1 min-w-0">
                                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="break-words">{event.title}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="flex items-center gap-1 min-w-0">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="break-words">Event Access</span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {pass.status === 'Active' ? (
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.open('https://konfhub.com', '_blank')}
                              >
                                <Ticket className="mr-2 h-4 w-4" />
                                View on KonfHub
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="flex-1"
                                disabled
                              >
                                <Ticket className="mr-2 h-4 w-4" />
                                Pass Processing
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pending Claims Section */}
                  {pendingClaims.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Pending Verification
                      </h4>
                      {pendingClaims.map((claim) => (
                        <Card key={claim.id} className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Verifying
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {getHoursRemaining(claim.expiresAt)}h remaining
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{claim.passType}</p>
                                <p className="text-xs text-muted-foreground">
                                  {claim.bookingId && `Booking: ${claim.bookingId}`}
                                  {claim.konfhubOrderId && ` | Order: ${claim.konfhubOrderId}`}
                                  {claim.ticketNumber && ` | Ticket: ${claim.ticketNumber}`}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCancelClaim(claim.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Alert className="mt-3 bg-amber-100/50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-xs text-amber-800">
                                We're verifying your pass details. If not verified within 32 hours, this claim will expire.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Enter Pass Details Button */}
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowPassClaimModal(true)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Already purchased? Enter your pass details
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Pending Claims when no verified passes */}
                  {pendingClaims.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Pending Verification
                      </h4>
                      {pendingClaims.map((claim) => (
                        <Card key={claim.id} className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Verifying
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {getHoursRemaining(claim.expiresAt)}h remaining
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{claim.passType}</p>
                                <p className="text-xs text-muted-foreground">
                                  {claim.bookingId && `Booking: ${claim.bookingId}`}
                                  {claim.konfhubOrderId && ` | Order: ${claim.konfhubOrderId}`}
                                  {claim.ticketNumber && ` | Ticket: ${claim.ticketNumber}`}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCancelClaim(claim.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Alert className="mt-3 bg-amber-100/50 border-amber-200">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-xs text-amber-800">
                                We're verifying your pass details. Check back later for updates!
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2">No passes yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Book your E-Summit 2026 pass to get started
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => onNavigate("booking")}>
                          Book Pass Now
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowPassClaimModal(true)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Enter Pass Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onComplete={handleProfileComplete}
      />

      {/* KonfHub Widget Modal for TCET Pass Booking */}
      {showKonfHubWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 p-3 sm:p-6 border-b-2 border-primary/20">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    🎓 <span className="truncate">Book Thakur Student Pass</span>
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKonfHubWidget(false)}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            
            {/* KonfHub Widget Container */}
            <div className="overflow-y-auto bg-gray-50 dark:bg-gray-950" style={{ height: 'calc(95vh - 160px)' }}>
              <KonfHubWidget
                eventId="final-tcet-esummit26"
                mode="iframe"
                onSuccess={(data) => {
                  // Pass booking completed successfully
                  toast.success("🎉 Booking Successful!", {
                    description: "Your Thakur Student pass has been booked. Check your email for confirmation."
                  });
                  setShowKonfHubWidget(false);
                }}
                onClose={() => setShowKonfHubWidget(false)}
                className="w-full h-full min-h-[500px] sm:min-h-[600px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pass Claim Modal */}
      {showPassClaimModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-xl overflow-hidden shadow-2xl border max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-blue-500/10 p-4 sm:p-5 border-b shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <span>Claim Your Pass</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    Already purchased? Enter your booking details to link your pass.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassClaimModal(false)}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive h-8 w-8 sm:h-9 sm:w-9 shrink-0 -mt-1 -mr-1"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            
            {/* Form - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 sm:p-5 space-y-4">
                {/* Pass Type */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Pass Type <span className="text-destructive">*</span>
                  </label>
                  <select 
                    className="w-full h-11 sm:h-10 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                    value={claimFormData.passType}
                    onChange={(e) => setClaimFormData(prev => ({ ...prev, passType: e.target.value }))}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                  >
                    <option value="Pixel Pass">Pixel Pass</option>
                    <option value="Silicon Pass">Silicon Pass</option>
                    <option value="Quantum Pass">Quantum Pass</option>
                    <option value="Thakur Student Pass">Thakur Student Pass (Free - TCET/TGBS/TIMSR/Thakur Education Only)</option>
                  </select>
                </div>

                {/* Booking ID */}
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Booking ID / Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., KONF-12345 or ES26-XXXXX"
                    className="w-full h-11 sm:h-10 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                    value={claimFormData.bookingId}
                    onChange={(e) => setClaimFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Found in your confirmation email from KonfHub</p>
                </div>

                {/* Info Alert */}
                <Alert className="bg-blue-50/80 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <AlertDescription className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    <strong>Important:</strong> Your pass will be approved immediately. Any data mismatch will result in no entry to events and cancellation of your existing pass. Valid ID is required for entry. College ID is mandatory for Thakur student pass holders.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-4 sm:p-5 border-t bg-muted/30 shrink-0 safe-area-inset-bottom">
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 sm:h-10 text-sm"
                  onClick={() => setShowPassClaimModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 sm:h-10 text-sm font-medium"
                  onClick={handleSubmitPassClaim}
                  disabled={isSubmittingClaim || !claimFormData.bookingId}
                >
                  {isSubmittingClaim ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit & Verify
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2 sm:hidden">
                Swipe down to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
