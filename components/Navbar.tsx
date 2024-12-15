// To make Navbr a Client Side component
"use client";

// Importing required modules
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Importing pre-defined ui components
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";

// Importing custom components
import Logo from "./Logo";
import { LogoMobile } from "./Logo";
import SwitchTheme from "./SwitchTheme";

// Importing icons from Lucide
import { AlignLeftIcon } from "lucide-react";


// Creating the Navbar component
const Navbar = () => {

    // TSX to render the Navbar component
    return (
        <div className="flex w-full">
            <DesktopNavbar />
            <MobileNavbar />
        </div>
    );
};


// The Navbar links
const navLinks = [
    { label: "Dashboard", path: "/" },
    { label: "Transactions", path: "/transactions" },
    { label: "Manage", path: "/manage" },
];


// Creating a Navbar component for Desktop Screens
const DesktopNavbar = () => {
    // TSX to render the Navabr for Desktop screens 
    return (
        <div className="hidden w-full border-b border-gray-900 bg-background md:block" >
            <nav className="w-full flex items-center justify-between px-6 py-2">
                {/* Logo for the app */}
                <div className="flex items-center justify-center gap-x-3">
                    <Logo />
                </div>

                {/* Navbar link items */}
                <div className="flex items-center h-full">
                    {navLinks.map((link) => (
                        <NavbarLink key={link.label} label={link.label} path={link.path} />
                    ))}
                </div>

                {/* Theme toggle switch and User profile button */}
                <div className="flex items-center justify-center gap-2">
                    <SwitchTheme />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    );
};


// Creating a Navbar component for Mobile screens
const MobileNavbar = () => {
    // Some states to handle working of Mobile Navbar
    const [isOpen, setIsOpen] = useState(false);

    // TSX to render the Navbar for Mobile screens
    return (
        <div className="flex !w-full bg-background md:hidden pb-3 px-1" >
            <nav className="flex !w-full items-center justify-between p-1 gap-1 " >
                <Sheet open={isOpen} onOpenChange={setIsOpen} >
                    <SheetTrigger asChild >
                        <AlignLeftIcon className="size-5" />
                    </SheetTrigger>
                    <SheetContent className="w-[320px] sm:w-[540px]" side={"left"} aria-describedby={undefined} >
                        <SheetTitle></SheetTitle>
                        <Logo />
                        <div className="flex flex-col gap-1 pt-5">
                            {navLinks.map((link) => (
                                <NavbarLink key={link.label} label={link.label} path={link.path} onClickCallback={() => setIsOpen((prev) => !prev)} />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center flex-1 justify-between px-2">
                    <LogoMobile />
                    <div className="flex items-center gap-1">
                        <SwitchTheme />
                        <UserButton afterSignOutUrl="/sign-in" />
                    </div>
                </div>
            </nav>
        </div>
    );
};


// Creating a Navbar Link component to show links in Navbar
const NavbarLink = ({ label, path, onClickCallback }: { label: string, path: string, onClickCallback?: () => void }) => {
    // An hook to grab the current browser path
    const currPathName = usePathname();
    // Check if the path name is active or not
    const isActivePath = currPathName === path;

    // TSX to render a Navbar link
    return (
        <div className="relative flex items-center" >
            <Link
                href={path}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full py-2 px-3 font-light justify-start text-sm tracking-wider text-muted-foreground hover:text-cyan-300",
                    isActivePath && "text-teal-300 font-medium"
                )}
                onClick={() => { if (onClickCallback) onClickCallback() }}
            >
                {label}
            </Link>
        </div>
    );
};


// Exporting the Navbar component
export default Navbar;