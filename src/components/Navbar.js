"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, User, Download, LogIn, LogOut, ChevronDown, Rocket } from "lucide-react";

export default function Navbar({ onDownload, showDownload, onDirectDownload, customCta, children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-primary/10 bg-background-dark/80 backdrop-blur-md text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex justify-between items-center w-full gap-4">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 neon-glow-primary group-hover:scale-105 transition-transform duration-300">
              <span className="font-black text-white text-base md:text-lg">R</span>
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tighter text-white">ResumeNow<span className="text-primary">.</span></span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Show Download Button if requested (e.g. in Builder) */}
            {showDownload && (onDirectDownload || onDownload) && (
              <button
                onClick={() => {
                  if (status === "unauthenticated") {
                    signIn("google");
                    return;
                  }
                  (onDirectDownload || onDownload)();
                }}
                className="flex items-center gap-2 px-3 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white rounded-lg neon-glow-primary hover:scale-105 transition-transform shadow-lg shadow-primary/20"
              >
                <Download size={16} /> <span className="hidden sm:inline">{status === "authenticated" ? "Download PDF" : "Sign in to Download"}</span>
              </button>
            )}

            {/* Injected custom actions (e.g. Mobile toggle) */}
            {children}

            {status === "unauthenticated" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signIn("google")}
                  className="px-3 md:px-5 py-2 text-xs md:text-sm font-bold border border-primary/30 rounded-lg hover:bg-primary/10 transition-all text-slate-200"
                >
                  SIGN IN
                </button>
                {/* Standard 'Get Started' CTA on Landing Page */}
                {customCta ? customCta : (
                  <Link href="/dashboard" className="hidden sm:flex items-center gap-1 px-3 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white rounded-lg neon-glow-primary hover:scale-105 transition-transform">
                    <Rocket size={14} /> GET STARTED
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                {pathname !== "/dashboard" && pathname !== "/builder" && (
                  <Link
                    href="/dashboard"
                    className="hidden md:flex items-center gap-2 px-5 py-2 text-sm font-bold border border-primary/30 rounded-lg hover:bg-primary/10 transition-all text-slate-200"
                  >
                    <LayoutDashboard size={16} /> DASHBOARD
                  </Link>
                )}

                <div className="relative pl-2 md:pl-4" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 md:gap-2 hover:bg-white/5 p-1 rounded-full transition group border border-transparent hover:border-primary/20"
                  >
                    {session.user.image ? (
                      <Image src={session.user.image} alt="User" width={32} height={32} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-primary/20 shadow-sm object-cover" />
                    ) : (
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                        <User size={16} className="text-primary" />
                      </div>
                    )}
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 hidden xs:block ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-background-dark border border-primary/20 rounded-xl shadow-xl shadow-black/50 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                      <div className="px-4 py-3 border-b border-primary/10 mb-1">
                        <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-primary/10 hover:text-white transition"
                      >
                        <LayoutDashboard size={16} className="text-primary" /> Dashboard
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 transition mt-1"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

