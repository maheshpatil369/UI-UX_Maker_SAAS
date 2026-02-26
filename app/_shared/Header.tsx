"use client"
import React from 'react'
import Image from 'next/image'
import { SignInButton, UserButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

export const Header = () => {
  const{user}=useUser();   
  return (
    <div>
      <div className='flex items-center justify-between p-3'>
        <div className='flex gap-2 items-center'>
        <Image src="/UIForage.png" alt="Logo" width={170} height={90} />
        </div>
<ul className='flex gap-5 items-center text-lg'>
    <li className='hover:text-primary cursor-pointer'>Home</li>
    <li className='hover:text-primary cursor-pointer'>Pricing</li>
</ul>
<>
  <SignedOut>
    <SignInButton mode='modal'> 
<button className="bg-red-600 hover:bg-red-500 text-white 
px-4 py-2 text-sm
sm:px-5 sm:py-2.5 sm:text-base
w-full sm:w-auto
rounded-full transition-all font-medium cursor-pointer">
  Get Started
</button>
    </SignInButton>
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</>
      </div>
    </div>
  )
}
