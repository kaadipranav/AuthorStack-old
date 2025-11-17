"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { isFeatureEnabled } from "@/lib/config/features";
import { primaryNav, secondaryNav, siteConfig } from "@/lib/config/site";
import type { NavItem } from "@/types/navigation";

function resolveNav(items: NavItem[]) {
  return items.filter((item) => !item.featureFlag || isFeatureEnabled(item.featureFlag));
}

export function Navbar() {
  const desktopNav = resolveNav(primaryNav);

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              AS
            </span>
            {siteConfig.name}
          </Link>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {desktopNav.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      asChild
                      className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      <Link href={item.href}>
                        {item.title}
                        {item.badge ? (
                          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {resolveNav(secondaryNav).map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              asChild
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Link href={item.href} target={item.external ? "_blank" : undefined}>
                {item.title}
              </Link>
            </Button>
          ))}
          <ThemeToggle />
          <Button asChild>
            <Link href="/signup">Launch Studio</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const navItems = [...resolveNav(primaryNav), ...resolveNav(secondaryNav)];
  return (
    <Sheet>
      <SheetTrigger asChild aria-label="Open navigation">
        <Button size="icon" variant="outline">
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Navigate AuthorStack</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-base font-medium text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <Separator className="my-6" />
        <Button asChild className="w-full">
          <Link href="/signup">Launch Studio</Link>
        </Button>
      </SheetContent>
    </Sheet>
  );
}

