import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";

interface AdminLoginProps {
  onLogin: (role: string, email: string) => void;
  onCancel: () => void;
}

// Mock admin credentials (In production, this would be handled by backend)
const ADMIN_CREDENTIALS = [
  {
    email: "superadmin@tcetmumbai.in",
    password: "admin123",
    role: "Super Admin",
    name: "Dr. Rajesh Kumar",
  },
  {
    email: "eventmanager@tcetmumbai.in",
    password: "event123",
    role: "Event Manager",
    name: "Priya Sharma",
  },
  {
    email: "scanner@tcetmumbai.in",
    password: "scan123",
    role: "Scanner Operator",
    name: "Amit Patel",
  },
  {
    email: "analytics@tcetmumbai.in",
    password: "analytics123",
    role: "Analytics Viewer",
    name: "Sneha Desai",
  },
];

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const admin = ADMIN_CREDENTIALS.find(
        (cred) => cred.email === email && cred.password === password
      );

      if (admin) {
        toast.success(`Welcome back, ${admin.name}!`, {
          description: `Logged in as ${admin.role}`,
        });
        onLogin(admin.role, admin.email);
      } else {
        setError("Invalid credentials. Please check your email and password.");
        toast.error("Login Failed", {
          description: "Invalid email or password",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <div>
              <h2 className="mb-2">Admin Access</h2>
              <p className="text-sm text-muted-foreground">
                E-Summit 2025 Management Portal
              </p>
              <Badge className="mt-3 bg-primary/10 text-primary border-primary/20">
                Authorized Personnel Only
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tcetmumbai.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="mr-2">Authenticating...</span>
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Demo Credentials
              </p>
              <div className="space-y-2 text-xs">
                {ADMIN_CREDENTIALS.map((cred, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                  >
                    <div>
                      <div className="font-medium">{cred.name}</div>
                      <div className="text-muted-foreground">{cred.role}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Click to fill
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                For access issues, contact{" "}
                <a
                  href="mailto:tcetedic@tcetmumbai.in"
                  className="text-primary hover:underline"
                >
                  tcetedic@tcetmumbai.in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          This portal is for authorized TCET E-Summit management team only.
          <br />
          Unauthorized access is prohibited and will be logged.
        </p>
      </motion.div>
    </div>
  );
}
