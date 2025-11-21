import React from "react";

import Image from "next/image";

import PosterAuth from "../../../public/images/PosterAuth.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="absolute inset-0 min-w-[100vw] min-h-[100vh] flex justify-around items-center bg-[var(--bg-pale)] z-10">
      <div className="min-h-[85vh] w-[90%] bg-white dark:bg-slate-900 rounded-[20px] flex overflow-hidden ">
        {/* Left side */}
        <div className="flex-[1.1] flex items-center justify-center">
          {children}
        </div>
        {/* Right side */}
        <div className="flex-[0.9] flex items-center justify-center bg-[var(--coral-500)] rounded-2xl">
          <Image
            className="rounded-2xl"
            src={PosterAuth}
            alt="Auth Image"
            width={450}
            height={500}
            quality={100}
          />
        </div>
      </div>
    </div>
  );
}
