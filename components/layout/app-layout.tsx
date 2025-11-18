"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { 
  BookOpen, 
  Calendar, 
  ChartBar, 
  Cog, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  Search, 
  Settings, 
  TrendingUp, 
  Users,
  Bell,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOutAction } from "@/lib/auth/actions";

// Define the navigation items
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Books", href: "/dashboard/books", icon: BookOpen },
  { name: "Launches", href: "/dashboard/checklists", icon: Calendar },
  { name: "Competitors", href: "/dashboard/competitors", icon: TrendingUp },
  { name: "A/B Tests", href: "/dashboard/ab-tests", icon: ChartBar },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Insights", href: "/dashboard/insights", icon: FileText },
  { name: "Integrations", href: "/dashboard/connections", icon: Cog },
  { name: "Settings", href: "/dashboard/profile", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: Users },
];

// Right rail insights component
function InsightsRail() {
  return (
    <div className="hidden xl:block w-80 border-l border-stroke p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-heading-3 font-semibold">Upcoming Tasks</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-glass border border-stroke">
            <p className="text-small font-medium">Finalize cover design</p>
            <p className="text-mini text-charcoal">Due tomorrow</p>
          </div>
          <div className="p-3 rounded-lg bg-glass border border-stroke">
            <p className="text-small font-medium">Send ARCs to reviewers</p>
            <p className="text-mini text-charcoal">Due in 3 days</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-heading-3 font-semibold">Leaderboard</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-glass border border-stroke">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-surface text-mini font-bold">1</div>
              <div>
                <p className="text-small font-medium">Sarah J.</p>
                <p className="text-mini text-charcoal">12,450 units</p>
              </div>
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  
  return (
    <div className={`h-full border-r border-stroke bg-surface ${isCollapsed ? 'w-14' : 'w-60'} transition-all duration-300`}>
      <div className="flex h-full flex-col">
        <div className="p-4 border-b border-stroke">
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <div className="relative h-8 w-8 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/logos/Light_logo.png"
                  alt="AuthorStack logo"
                  fill
                  priority
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logos/Dark_logo.png"
                  alt="AuthorStack logo"
                  fill
                  priority
                  className="hidden object-contain dark:block"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/logos/Light_logo.png"
                  alt="AuthorStack logo"
                  fill
                  priority
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logos/Dark_logo.png"
                  alt="AuthorStack logo"
                  fill
                  priority
                  className="hidden object-contain dark:block"
                />
              </div>
              <span className="text-heading-3 font-bold">AuthorStack</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href as Route}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-small transition-colors ${
                      isActive 
                        ? 'bg-burgundy text-surface font-medium' 
                        : 'text-ink hover:bg-glass'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                    {isCollapsed && (
                      <div className="absolute left-16 bg-surface border border-stroke px-2 py-1 rounded-lg shadow-lg text-small whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-stroke">
          <form action={signOutAction}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-3 px-3 py-2 text-small"
              type="submit"
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Sign out</span>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Topbar component
function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stroke bg-surface/80 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <Sidebar isCollapsed={false} />
            </SheetContent>
          </Sheet>
          
          <div className="hidden md:flex items-center gap-3">
            <div className="relative h-8 w-8 transition-transform duration-300 hover:scale-105">
              <Image
                src="/logos/Light_logo.png"
                alt="AuthorStack logo"
                fill
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/logos/Dark_logo.png"
                alt="AuthorStack logo"
                fill
                priority
                className="hidden object-contain dark:block"
              />
            </div>
            <span className="text-heading-3 font-bold">AuthorStack</span>
          </div>
        </div>
        
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal" />
            <input
              type="search"
              placeholder="Search books, launches, sales..."
              className="w-full rounded-lg bg-glass border border-stroke py-2 pl-10 pr-4 text-small focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-burgundy"></span>
            </Button>
            
            <Button size="sm" className="gap-2 bg-burgundy hover:bg-burgundy/90 text-surface">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Book</span>
            </Button>
            
            <Button variant="outline" size="icon" className="border-stroke">
              <div className="bg-burgundy text-surface w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">U</div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile navigation
function MobileNav() {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stroke bg-surface md:hidden">
      <nav className="grid grid-cols-4 gap-1 p-1">
        {navigationItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href as Route}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-mini transition-colors ${
                isActive 
                  ? 'bg-burgundy text-surface' 
                  : 'text-ink hover:bg-glass'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Collapse sidebar on smaller screens
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
      
      // Update mobile state
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Topbar />
      
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile, collapsible on desktop */}
        <div className="hidden md:block">
          <Sidebar isCollapsed={isCollapsed} />
        </div>
        
        {/* Main content area - full width on mobile, adjusted on desktop */}
        <main className="flex-1 pb-16 md:pb-0">
          <div className="container py-6">
            {children}
          </div>
        </main>
        
        {/* Insights rail - only visible on xl screens */}
        <div className="hidden xl:block">
          <InsightsRail />
        </div>
      </div>
      
      {/* Mobile navigation - only visible on mobile */}
      {isMobile && <MobileNav />}
    </div>
  );
}