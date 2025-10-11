import { useState } from "react";
import { 
  Users, 
  Ticket, 
  Calendar, 
  TrendingUp, 
  Search, 
  Download, 
  Filter,
  QrCode,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Lock
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { motion } from "motion/react";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  adminRole: string;
  adminEmail: string;
  onLogout: () => void;
}

// Role permissions
const ROLE_PERMISSIONS = {
  "Super Admin": {
    participants: true,
    scanner: true,
    analytics: true,
    export: true,
    edit: true,
  },
  "Event Manager": {
    participants: true,
    scanner: true,
    analytics: true,
    export: true,
    edit: false,
  },
  "Scanner Operator": {
    participants: false,
    scanner: true,
    analytics: false,
    export: false,
    edit: false,
  },
  "Analytics Viewer": {
    participants: true,
    scanner: false,
    analytics: true,
    export: true,
    edit: false,
  },
};

export function AdminPanel({ onNavigate, adminRole, adminEmail, onLogout }: AdminPanelProps) {
  const permissions = ROLE_PERMISSIONS[adminRole as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS["Scanner Operator"];
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPassType, setFilterPassType] = useState("all");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState("");

  // Mock data for participants
  const participants = [
    {
      id: "ESUMMIT-2025-ABC123",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      college: "IIT Mumbai",
      passType: "Full Summit Pass",
      price: 799,
      purchaseDate: "Jan 20, 2025",
      status: "Active",
      checkInStatus: "Not Checked In",
    },
    {
      id: "ESUMMIT-2025-DEF456",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 98765 43211",
      college: "TCET Mumbai",
      passType: "Day 1 Pass",
      price: 299,
      purchaseDate: "Jan 21, 2025",
      status: "Active",
      checkInStatus: "Checked In",
    },
    {
      id: "ESUMMIT-2025-GHI789",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+91 98765 43212",
      college: "VJTI Mumbai",
      passType: "VIP Pass",
      price: 1499,
      purchaseDate: "Jan 18, 2025",
      status: "Active",
      checkInStatus: "Not Checked In",
    },
    {
      id: "ESUMMIT-2025-JKL012",
      name: "Sneha Desai",
      email: "sneha.desai@example.com",
      phone: "+91 98765 43213",
      college: "DJ Sanghvi",
      passType: "Full Summit Pass",
      price: 799,
      purchaseDate: "Jan 22, 2025",
      status: "Active",
      checkInStatus: "Checked In",
    },
    {
      id: "ESUMMIT-2025-MNO345",
      name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      phone: "+91 98765 43214",
      college: "SPIT Mumbai",
      passType: "Day 2 Pass",
      price: 399,
      purchaseDate: "Jan 19, 2025",
      status: "Active",
      checkInStatus: "Not Checked In",
    },
  ];

  // Statistics
  const stats = [
    {
      label: "Total Registrations",
      value: "2,547",
      icon: Users,
      change: "+12%",
      changeType: "positive",
    },
    {
      label: "Revenue Generated",
      value: "₹18.5L",
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive",
    },
    {
      label: "Active Passes",
      value: "2,401",
      icon: Ticket,
      change: "+15%",
      changeType: "positive",
    },
    {
      label: "Check-ins Today",
      value: "1,234",
      icon: CheckCircle,
      change: "Real-time",
      changeType: "neutral",
    },
  ];

  // Pass type distribution
  const passDistribution = [
    { type: "Full Summit Pass", count: 1205, percentage: 47 },
    { type: "Day 1 Pass", count: 658, percentage: 26 },
    { type: "Day 2 Pass", count: 438, percentage: 17 },
    { type: "VIP Pass", count: 246, percentage: 10 },
  ];

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPassType === "all" || p.passType === filterPassType;
    return matchesSearch && matchesFilter;
  });

  // Handle QR code scan
  const handleScan = (code: string) => {
    setScannedCode(code);
    const participant = participants.find(p => p.id === code);
    if (participant) {
      // In a real app, this would update the database
      toast.success("Check-in Successful!", {
        description: `${participant.name} - ${participant.passType}`,
      });
      console.log("Checked in:", participant.name);
    } else {
      toast.error("Invalid QR Code", {
        description: "Pass ID not found in the system",
      });
    }
  };

  const handleLogout = () => {
    toast.info("Logged out successfully", {
      description: "Admin session ended",
    });
    onLogout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1>Admin Dashboard</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Shield className="mr-1 h-3 w-3" />
              {adminRole}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            E-Summit 2025 Management Panel • {adminEmail}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Role Permissions Info */}
      {(adminRole === "Scanner Operator" || adminRole === "Analytics Viewer") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Your Access Level:</strong> {adminRole === "Scanner Operator" 
                ? "You have access to the QR Scanner for venue check-ins only."
                : "You can view all data and analytics but cannot perform check-ins."}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <Badge 
                    variant={stat.changeType === "positive" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={permissions.scanner ? "scanner" : permissions.participants ? "participants" : "analytics"} className="w-full">
        <TabsList className="mb-6">
          {permissions.participants && <TabsTrigger value="participants">Participants</TabsTrigger>}
          {permissions.scanner && <TabsTrigger value="scanner">QR Scanner</TabsTrigger>}
          {permissions.analytics && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        {/* Participants Tab */}
        {permissions.participants ? (
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3>All Participants</h3>
                  <div className="flex gap-2">
                    {permissions.export && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or pass ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterPassType} onValueChange={setFilterPassType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Pass Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pass Types</SelectItem>
                    <SelectItem value="Full Summit Pass">Full Summit Pass</SelectItem>
                    <SelectItem value="Day 1 Pass">Day 1 Pass</SelectItem>
                    <SelectItem value="Day 2 Pass">Day 2 Pass</SelectItem>
                    <SelectItem value="VIP Pass">VIP Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Participants Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Pass Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {participant.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">{participant.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {participant.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <Mail className="h-3 w-3" />
                              {participant.email}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {participant.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Building className="h-3 w-3" />
                            {participant.college}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {participant.passType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs">
                            {participant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.checkInStatus === "Checked In" ? (
                            <Badge variant="default" className="text-xs bg-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <XCircle className="mr-1 h-3 w-3" />
                              Not Checked In
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Participant Details</DialogTitle>
                                <DialogDescription>
                                  View complete information about this participant
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label>Full Name</Label>
                                    <p className="text-sm text-muted-foreground">{participant.name}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="text-sm text-muted-foreground">{participant.email}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm text-muted-foreground">{participant.phone}</p>
                                  </div>
                                  <div>
                                    <Label>College</Label>
                                    <p className="text-sm text-muted-foreground">{participant.college}</p>
                                  </div>
                                  <div>
                                    <Label>Pass Type</Label>
                                    <p className="text-sm text-muted-foreground">{participant.passType}</p>
                                  </div>
                                  <div>
                                    <Label>Price Paid</Label>
                                    <p className="text-sm text-muted-foreground">₹{participant.price}</p>
                                  </div>
                                  <div>
                                    <Label>Purchase Date</Label>
                                    <p className="text-sm text-muted-foreground">{participant.purchaseDate}</p>
                                  </div>
                                  <div>
                                    <Label>Pass ID</Label>
                                    <p className="text-sm text-muted-foreground font-mono">{participant.id}</p>
                                  </div>
                                </div>
                                <div className="rounded-lg border p-4 text-center">
                                  <div className="mb-2 text-sm text-muted-foreground">QR Code</div>
                                  <div className="mx-auto h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                                    <QrCode className="h-16 w-16 text-muted-foreground" />
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredParticipants.length} of {participants.length} participants
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        ) : null}

        {/* QR Scanner Tab */}
        {permissions.scanner ? (
          <TabsContent value="scanner">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <h3>QR Code Scanner</h3>
                </div>
                <p className="text-sm text-muted-foreground">Scan participant passes at venue entrance</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!scannerActive ? (
                    <div className="rounded-lg border-2 border-dashed p-12 text-center">
                      <QrCode className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <h4 className="mb-2">Scanner Ready</h4>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Click below to activate camera and start scanning passes
                      </p>
                      <Button onClick={() => setScannerActive(true)}>
                        Activate Scanner
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="mx-auto mb-2 h-12 w-12 animate-pulse text-primary" />
                          <p className="text-sm text-muted-foreground">Camera Active - Position QR Code</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Or Enter Pass ID Manually</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="ESUMMIT-2025-XXXXX"
                            value={scannedCode}
                            onChange={(e) => setScannedCode(e.target.value)}
                          />
                          <Button onClick={() => handleScan(scannedCode)}>
                            Verify
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setScannerActive(false)}
                      >
                        Stop Scanner
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>Recent Check-ins</h3>
                <p className="text-sm text-muted-foreground">Last 5 scanned passes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.filter(p => p.checkInStatus === "Checked In").slice(0, 5).map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-500/10 text-green-600 text-xs">
                            {participant.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm">{participant.name}</div>
                          <div className="text-xs text-muted-foreground">{participant.passType}</div>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        ) : null}

        {/* Analytics Tab */}
        {permissions.analytics ? (
          <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3>Pass Type Distribution</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passDistribution.map((pass) => (
                    <div key={pass.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{pass.type}</span>
                        <span className="text-muted-foreground">{pass.count} ({pass.percentage}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${pass.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>Revenue Breakdown</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passDistribution.map((pass) => (
                    <div key={pass.type} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="text-sm">{pass.type}</div>
                        <div className="text-xs text-muted-foreground">{pass.count} passes</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">₹{(pass.count * (
                          pass.type === "Full Summit Pass" ? 799 :
                          pass.type === "Day 1 Pass" ? 299 :
                          pass.type === "Day 2 Pass" ? 399 : 1499
                        )).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Total Revenue</div>
                      <div className="text-lg text-primary">₹18,45,690</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <h3>College-wise Registration</h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {["TCET Mumbai", "IIT Mumbai", "VJTI Mumbai", "DJ Sanghvi", "SPIT Mumbai", "Others"].map((college, index) => (
                    <div key={college} className="rounded-lg border p-4 text-center">
                      <Building className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <div className="text-2xl mb-1">{Math.floor(Math.random() * 500) + 100}</div>
                      <div className="text-sm text-muted-foreground">{college}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        ) : null}

        {/* Access Restricted Message */}
        {!permissions.participants && !permissions.scanner && !permissions.analytics && (
          <div className="flex items-center justify-center py-20">
            <Card className="max-w-md border-destructive/50">
              <CardContent className="p-8 text-center">
                <Lock className="mx-auto mb-4 h-12 w-12 text-destructive" />
                <h3 className="mb-2">Access Restricted</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your role ({adminRole}) does not have permission to access any admin panels.
                </p>
                <Button variant="outline" onClick={onLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
}
