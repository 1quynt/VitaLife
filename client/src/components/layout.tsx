import { Link, useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  Scale, 
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { profile, reset } = useApp();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Utensils, label: "Diet", href: "/diet" },
    { icon: Dumbbell, label: "Exercise", href: "/exercise" },
    { icon: Droplets, label: "Hydration", href: "/hydration" },
    { icon: Scale, label: "Weight", href: "/weight" },
  ];

  if (!profile && location !== "/onboarding") {
    return <>{children}</>;
  }

  if (location === "/onboarding") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar p-6 gap-6">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight">VitaLife</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "stroke-2" : "stroke-[1.5]")} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">Day {profile ? Math.max(1, Math.floor((Date.now() - new Date(profile.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={reset}>
            <LogOut className="w-4 h-4 mr-2" />
            Reset Data
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">V</span>
            </div>
            <span className="text-xl font-bold">VitaLife</span>
          </div>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <item.icon className={cn("w-6 h-6", isActive ? "stroke-2" : "stroke-[1.5]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
