'use client';

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Github } from "lucide-react";
import ModernLoader from "@/components/ModernLoader";

export default function SignIn() {
    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>

            <Suspense fallback={<ModernLoader text="Ready..." />}>
                <SignInContent />
            </Suspense>
        </div>
    );
}

function SignInContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (provider) => {
        setIsLoading(true);
        await signIn(provider, { callbackUrl });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
        >
            <div className="glass-card p-8 md:p-10 rounded-2xl border border-primary/20 shadow-2xl neon-border-purple backdrop-blur-xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 neon-glow-primary group-hover:scale-105 transition-transform duration-300">
                            <span className="font-black text-white text-xl">R</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to continue building your professional resume with AI.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleSignIn('google')}
                        disabled={isLoading}
                        className="w-full relative group overflow-hidden rounded-xl p-[1px] transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="font-bold text-white">Continue with Google</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSignIn('github')}
                        disabled={isLoading}
                        className="w-full relative group overflow-hidden rounded-xl p-[1px] transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative bg-[#24292e] hover:bg-[#2f363d] border border-white/10 p-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                            <Github className="w-5 h-5 text-white" />
                            <span className="font-bold text-white">Continue with GitHub</span>
                        </div>
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500">
                        By continuing, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                    </p>
                </div>
            </div>

            <div className="text-center mt-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>
        </motion.div>
    );
}
