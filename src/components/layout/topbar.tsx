"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Search, Sun, Moon, User, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

interface TopBarProps {
  user?: {
    email?: string;
    profile?: {
      full_name?: string | null;
      avatar_url?: string | null;
    } | null;
  } | null;
}

export function TopBar({ user }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  const name = user?.profile?.full_name || "Estudiante";
  const initials = name.substring(0, 2).toUpperCase();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 lg:px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b h-16">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar entregas, materias..."
            className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1 rounded-full"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 rounded-full flex items-center gap-2 pl-1 pr-3 hover:bg-muted/50">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.profile?.avatar_url || undefined} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium truncate max-w-[120px]">{name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

