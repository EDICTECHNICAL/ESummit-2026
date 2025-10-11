import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { HomePage } from "./components/homepage";
import { PassBooking } from "./components/pass-booking";
import { EventSchedule } from "./components/event-schedule";
import { EventsListing } from "./components/events-listing";
import { Speakers } from "./components/speakers";
import { Venue } from "./components/venue";
import { Sponsors } from "./components/sponsors";
import { Team } from "./components/team";
import { UserDashboard } from "./components/user-dashboard";
import { AdminPanel } from "./components/admin-panel";
import { AdminLogin } from "./components/admin-login";
import { AuthModal } from "./components/auth-modal";
import { PrivacyPolicy } from "./components/privacy-policy";
import { TermsOfService } from "./components/terms-of-service";
import { CookiePolicy } from "./components/cookie-policy";
import { Footer } from "./components/footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isDark, setIsDark] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Check for saved user authentication
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsUserAuthenticated(true);
      setUserData(user);
    }
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = (role: string, email: string) => {
    setIsAdminAuthenticated(true);
    setAdminRole(role);
    setAdminEmail(email);
    setCurrentPage("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminRole("");
    setAdminEmail("");
    setCurrentPage("home");
  };

  const handleAdminCancel = () => {
    setCurrentPage("home");
  };

  const handleUserLogin = (user: { name: string; email: string }) => {
    setIsUserAuthenticated(true);
    setUserData(user);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Redirect to booking if that was the intent
    if (redirectAfterAuth === "booking") {
      setCurrentPage("booking");
      setRedirectAfterAuth(null);
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleUserLogout = () => {
    setIsUserAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("user");
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "booking":
        return (
          <PassBooking 
            isAuthenticated={isUserAuthenticated}
            userData={userData}
            onNavigate={handleNavigate}
            onRequestAuth={() => {
              setRedirectAfterAuth("booking");
              setCurrentPage("auth");
            }}
          />
        );
      case "schedule":
        return <EventSchedule />;
      case "events":
        return <EventsListing onNavigate={handleNavigate} />;
      case "speakers":
        return <Speakers />;
      case "venue":
        return <Venue />;
      case "sponsors":
        return <Sponsors />;
      case "team":
        return <Team />;
      case "dashboard":
        return (
          <UserDashboard 
            onNavigate={handleNavigate}
            userData={userData}
            onLogout={handleUserLogout}
          />
        );
      case "admin":
        return <AdminLogin onLogin={handleAdminLogin} onCancel={handleAdminCancel} />;
      case "admin-dashboard":
        return isAdminAuthenticated ? (
          <AdminPanel 
            onNavigate={handleNavigate} 
            adminRole={adminRole}
            adminEmail={adminEmail}
            onLogout={handleAdminLogout}
          />
        ) : (
          <AdminLogin onLogin={handleAdminLogin} onCancel={handleAdminCancel} />
        );
      case "auth":
        return (
          <AuthModal 
            onNavigate={handleNavigate}
            onLogin={handleUserLogin}
          />
        );
      case "privacy-policy":
        return <PrivacyPolicy />;
      case "terms-of-service":
        return <TermsOfService />;
      case "cookie-policy":
        return <CookiePolicy />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Don't show navigation and footer for admin pages
  const showNavAndFooter = currentPage !== "admin" && currentPage !== "admin-dashboard";

  return (
    <div className="min-h-screen bg-background">
      {showNavAndFooter && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isDark={isDark}
          toggleDark={toggleDark}
          isUserAuthenticated={isUserAuthenticated}
          userData={userData}
          onLogout={handleUserLogout}
        />
      )}
      <main className={showNavAndFooter ? "pt-24" : ""}>{renderPage()}</main>
      {showNavAndFooter && <Footer onNavigate={handleNavigate} />}
      <Toaster />
    </div>
  );
}