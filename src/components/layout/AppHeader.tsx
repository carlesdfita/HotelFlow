'use client';

import { signOut } from 'firebase/auth';
import { LogOut, Mountain, User as UserIcon, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar'; // Assuming this is the correct component
import { useToast } from '@/hooks/use-toast';

export default function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Sessió tancada', description: 'Fins aviat!' });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({ title: 'Error', description: 'No s\'ha pogut tancar la sessió.', variant: 'destructive' });
    }
  };

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 shadow-sm sm:px-6">
      <div className="md:hidden"> {/* Sidebar trigger only visible on smaller screens if sidebar is collapsible */}
         <SidebarTrigger />
      </div>
      <div className="flex items-center">
        <Mountain className="h-7 w-7 text-primary" />
        <h1 className="ml-2 text-2xl font-bold font-headline text-primary">HotelFlow</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Tancar sessió</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
