"use client"
import React from 'react'
import Image from 'next/image'
import { SignInButton, UserButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
  <div className="w-full flex items-center justify-between px-8 py-3 relative z-50 backdrop-blur-md bg-white/20">

  {/* Logo Left */}
  <div className="flex items-center">
    <Link href="/">
      <Image
        src="/logowithname.png"
        alt="Logo"
        width={130}
        height={60}
        className="cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
      />
    </Link>
  </div>


  {/* Center Navigation */}
  <div className="absolute left-1/2 -translate-x-1/2">
    <ul className="flex gap-8 items-center text-lg font-medium">
      <Link href="/">
        <li className="hover:text-red-500 cursor-pointer transition-colors">
          Home
        </li>
      </Link>

      <Link href="/pricing">
        <li className="hover:text-red-500 cursor-pointer transition-colors">
          Pricing
        </li>
      </Link>
    </ul>
  </div>


  {/* Right Auth */}
  <div className="flex items-center gap-4">
    <SignedOut>
      <SignInButton mode="modal">
        <button className="bg-red-600 hover:bg-red-500 text-white 
        px-5 py-2.5 rounded-full font-medium transition cursor-pointer">
          Get Started
        </button>
      </SignInButton>
    </SignedOut>

    <SignedIn>
      <UserButton />
    </SignedIn>
  </div>

</div>

  )}