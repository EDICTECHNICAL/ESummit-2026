import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Shield, Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: (role: string, email: string) => void;
  onCancel: () => void;
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const { user, isSignedIn } = useUser();
  
  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    // If user is signed in and is admin, auto-login
    if (isSignedIn && isAdmin && user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      onLogin("Super Admin", email);
    }
  }, [isSignedIn, isAdmin, user, onLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background px-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Admin Access</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Restricted to authorized personnel only
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignedIn ? (
            !isAdmin ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <Lock className="h-5 w-5" />
                  <p className="font-semibold">Access Denied</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your account does not have administrative privileges. Contact support to request admin access.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                <p className="text-center text-sm">
                  Verifying admin credentials...
                </p>
              </div>
            )
          ) : (
            <div className="rounded-lg border border-muted bg-muted/50 p-4">
              <p className="text-center text-sm text-muted-foreground">
                Please sign in with your admin account to continue. Only authorized personnel with admin role can access this area.
              </p>
            </div>
          )}

          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            Return to Home
          </Button>

          <div className="rounded-lg border bg-muted/50 p-3 text-xs">
            <p className="font-semibold mb-2">How to get admin access:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>1. Sign in with your Clerk account</li>
              <li>2. Contact the system administrator to grant admin role</li>
              <li>3. Admin role is set in Clerk Dashboard → Users → [User] → Metadata → publicMetadata: {`{ "role": "admin" }`}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
