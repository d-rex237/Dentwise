"use client";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <SignedOut>
        <SignUpButton mode="modal">Sign Up</SignUpButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>LogOut</SignOutButton>
      </SignedIn>
    </div>
  );
}
