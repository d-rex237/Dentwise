import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Ghost } from "lucide-react";

const Header = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 px-6 py-2 border-b border-border/50 bg-background/80 backdrop-blur-md h-16 ">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="Dentwise Logo"
            width={32}
            height={32}
            className="w-11"
          />
          <span className="font-bold text-lg">Dentwise</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            How Its Works
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <Button variant={"ghost"} size={"sm"}>
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size={"sm"}>Sign Up</Button>
          </SignUpButton>
        </div>
      </div>
    </nav>
  );
};

export default Header;
