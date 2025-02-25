import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { Info, LogOut, Moon, Plus, Sun, Video, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  // Theme handling (dark/light mode)
  const { theme, setTheme } = useTheme();

  // User session management
  const { data: session } = useSession();

  // Dropdown menu state
  const [open, setOpen] = useState(false);

  // Function to format the current time & date
  const formatTimeDate = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Extract user initials for avatar fallback
  const userPlaceholder = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
    : "U"; // Default to "U" if name is missing

  // Logout function
  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/user-auth" });
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      {/* Logo & Branding */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Video className="w-8 h-8 text-blue-500" />
          <span className="hidden md:block text-xl font-semibold text-gray-800 dark:text-white">
            Meetify
          </span>
        </Link>
      </div>

      {/* Right-side controls */}
      <div className="flex items-center space-x-4">
        {/* Current Date & Time */}
        <span className="text-md text-gray-500 dark:text-gray-200">
          {formatTimeDate()}
        </span>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-orange-500" />
          ) : (
            <Moon className="w-5 h-5 text-blue-500" />
          )}
        </Button>

        {/* Info Button (Visible on larger screens) */}
        <Button variant="ghost" size="icon" className="hidden md:block">
          <Info className="w-5 h-5 ml-2" />
        </Button>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-10 h-10 mb-2 cursor-pointer">
              {session?.user?.image ? (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              ) : (
                <AvatarFallback className="text-lg dark:bg-gray-300">
                  {userPlaceholder}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent align="end" className="w-80 p-4">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {session?.user?.email || "No Email"}
              </span>
              <Button
                className="rounded-full p-4"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5" />
              </Button>
            </div>

            {/* User Info Section */}
            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-10 h-10 mb-2 cursor-pointer">
                {session?.user?.image ? (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name}
                  />
                ) : (
                  <AvatarFallback className="text-lg dark:bg-gray-300">
                    {userPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>

              <h1 className="text-xl font-semibold mt-2">
                Hi, {session?.user?.name || "User"}
              </h1>
            </div>

            {/* Account Actions */}
            <div className="flex mb-4">
              <Button className="w-1/2 h-14 rounded-l-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>

              <Button
                className="w-1/2 h-14 rounded-r-full"
                variant="outline"
                onClick={handleLogOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 ">
              <Link href="#" className="hover:bg-gray-300 p-2 rounded-lg">
                Privacy Policy
              </Link>
              {" . "}
              <Link href="#" className="hover:bg-gray-300 p-2 rounded-lg">
                Terms of Service
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
