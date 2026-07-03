"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Cursos", icon: BookOpen },
  { href: "/tasks", label: "Tareas", icon: ClipboardList },
  { href: "/settings", label: "Config", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden justify-around items-center px-4 py-2 bg-background border-t pb-safe">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[64px] px-2 py-1 rounded-lg transition-colors active:scale-95",
              isActive 
                ? "bg-accent/10 text-accent font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
