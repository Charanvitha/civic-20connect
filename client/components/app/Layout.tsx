import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Languages } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Layout() {
  const [lang, setLang] = useState("en");
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/60">
      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-background/70">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-green-600" />
            <span className="text-lg font-bold tracking-tight">
              Civic Connect
            </span>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">
              Admin
            </Link>
            {user ? (
              <button
                onClick={() => {
                  setUser(null);
                  nav("/");
                }}
                className="hover:text-foreground"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-foreground">
                Login
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <main className="container pb-24">
        <Outlet />
      </main>
    </div>
  );
}
