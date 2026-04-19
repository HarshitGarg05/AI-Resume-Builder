"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ModernTemplate, MinimalTemplate, ProfessionalTemplate, ResumeNowTemplate } from "@/components/Preview";

const DUMMY_DATA = {
    personal: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        role: "Software Engineer",
        summary: "Passionate developer with 5+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies.",
        photo: null // or a placeholder URL if needed, but null handles initials/icon usually
    },
    experience: [
        {
            id: 1,
            title: "Senior Developer",
            company: "Tech Corp",
            dates: "2020 - Present",
            description: "Led development of core features using Next.js and Tailwind CSS. Improved performance by 40%."
        }
    ],
    education: [
        {
            id: 1,
            school: "University of Technology",
            degree: "B.S. Computer Science",
            dates: "2016 - 2020"
        }
    ],
    skills: ["React", "Node.js", "TypeScript", "AWS", "Design Systems"],
    themeColor: "#2b59f3"
};

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleCreate = () => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/dashboard");
        } else {
            router.push("/dashboard");
        }
    };

    const handleTemplateSelect = (templateId) => {
        if (status === "unauthenticated") {
            router.push(`/auth/signin?callbackUrl=/builder?template=${templateId}`);
        } else {
            router.push(`/builder?template=${templateId}`);
        }
    };

    const templates = [
        { id: 'professional', label: 'Professional', Component: ProfessionalTemplate },
        { id: 'modern', label: 'Modern', Component: ModernTemplate },
        { id: 'resumenow', label: 'Creative', Component: ResumeNowTemplate },
        { id: 'minimal', label: 'Simple', Component: MinimalTemplate }
    ];

    return (
        <div className="bg-background-dark font-display text-slate-200 selection:bg-primary/40 selection:text-white overflow-x-hidden min-h-screen flex flex-col">
            <Navbar />


            {/* Hero Section */}
            <main className="relative pt-20 md:pt-32 grid-bg overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="geometric-line top-1/4 -left-1/4 opacity-20"></div>
                <div className="geometric-line top-1/2 -right-1/4 opacity-10" style={{ transform: "rotate(15deg)", background: "#6a25f4" }}></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10 pb-12 md:pb-20">
                    <div className="space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></span>
                            Files verified by experts
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                            INSTANTLY CREATE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neon-lime">JOB-WINNING RESUME.</span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-400 max-w-lg leading-relaxed">
                            Our AI-powered builder helps you create a professional resume in minutes. Choose from recruiter-approved templates and get hired faster.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-4">
                            <button onClick={handleCreate} className="group relative px-6 md:px-8 py-3 md:py-4 bg-primary text-white font-bold rounded-lg neon-glow-primary overflow-hidden transition-all hover:pr-12 text-sm md:text-base">
                                <span className="relative z-10">CREATE MY RESUME</span>
                                <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">arrow_forward</span>
                            </button>
                            <button className="px-6 md:px-8 py-3 md:py-4 border border-primary/30 text-primary font-bold rounded-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                                <span className="material-icons">play_circle</span>
                                HOW IT WORKS
                            </button>
                        </div>

                        <div className="pt-6 md:pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                            <div className="flex -space-x-3">
                                <Image width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIzYHQ1GKsP4it8eMWixBWYD1dB0IS0TzqB8JdGuOqaxG3r2ZIC5c8K67TJZ_gKRr7P8pR8sZ6nm6Pp2m6jmVEDAL7nw5I_T0oPacZwmlfNXoaYqfvMx9FOE9L9XbZPjBPAqYXtc0aXwWlEv3Bp6sn8MNUzEQ-a_lcusIB8YOMoYAoYe_Zr8k-8pQtH2HxYGZdVwbcQmz2sLxr6EoG0DfYPS_5gPpYoDOEA_eXQ16UQ4KJ2gGL9Xb9GniICI5J4T7--C478TW3YOJy" alt="User" />
                                <Image width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8FcEciQui-hqfVyu58Ug0AvhgGhoUWHBrpqiM0KN56MWtEAcZcBwx7wBNcEzXzovgbolEJ5hOD_zQbXmj6nzVVjCLwFG22J4dWPp8dzYajsdnDwbcA_Q5Pa7NbhRyDOzJx8KRS0XQvKH2ZAZDC6f2H7BsTPpnrRLl7chRMgndFhsICdxBx2WY9d5Tds3LIHiT8SBNwtxkk1GsG4HcsuYVxps-KK2oEa4b4lIUeaMKE0itfqBHUcIBnhokeDS-UZ1XW5oaFkEfeU4s" alt="User" />
                                <Image width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxhzFXjrwgX64tqKa1VgXIK3mGOufYvZjHlsL34J8pTgtxTim6J_irXqztxpK9y9ThQXpqS7yMbwv9HDQshkMtlidcCiWcbhruQn8WbhAeCYnXg2TtjmmsZYyupYJvsn6f0IcPPJWwgAKnUknJuEn0O1E05ze2oRIDqGqAsrmsPRSr6GoxChGeki3a8VPC5pPxfsABMLgQzb4BnCxQNbl-d99FUc2B_27i5sbWnP1XAJ4QWgO1MSa3LG1tG8hggqlRUFAa6Zl9_vdo" alt="User" />
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center text-[10px] font-bold text-white text-center">+10k</div>
                            </div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Trusted by job seekers worldwide</p>
                        </div>
                    </div>

                    {/* 3D CV Visualization */}
                    <div className="relative group perspective-1000 mt-6 lg:mt-0">
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto glass-card rounded-xl p-6 md:p-8 transform lg:rotate-y-12 lg:rotate-x-12 border-primary/40 neon-border-purple transition-transform duration-700 hover:rotate-0">
                            <div className="scan-line"></div>
                            <div className="space-y-4 md:space-y-6">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                                        <span className="material-icons text-primary text-2xl md:text-3xl">account_circle</span>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 md:h-4 w-3/4 bg-primary/20 rounded animate-pulse"></div>
                                        <div className="h-2 md:h-3 w-1/2 bg-primary/10 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-primary/10">
                                    <div className="h-2 w-full bg-primary/5 rounded"></div>
                                    <div className="h-2 w-full bg-primary/5 rounded"></div>
                                    <div className="h-2 w-2/3 bg-primary/5 rounded"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-3 md:pt-4">
                                    <div className="h-16 md:h-20 rounded border border-neon-lime/20 bg-neon-lime/5 p-2 md:p-3">
                                        <div className="w-6 h-1 bg-neon-lime mb-2"></div>
                                        <div className="space-y-1">
                                            <div className="h-1 w-full bg-neon-lime/20"></div>
                                            <div className="h-1 w-2/3 bg-neon-lime/20"></div>
                                        </div>
                                    </div>
                                    <div className="h-16 md:h-20 rounded border border-primary/20 bg-primary/5 p-2 md:p-3">
                                        <div className="w-6 h-1 bg-primary mb-2"></div>
                                        <div className="space-y-1">
                                            <div className="h-1 w-full bg-primary/20"></div>
                                            <div className="h-1 w-2/3 bg-primary/20"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 md:pt-10">
                                    <div className="h-24 md:h-32 rounded-lg border border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 group/upload cursor-pointer hover:border-primary transition-colors">
                                        <span className="material-icons text-primary/40 group-hover/upload:text-primary transition-colors text-xl md:text-2xl">upload_file</span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Upload Existing Resume</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background decorative shapes */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-primary/20 blur-[100px] rounded-full"></div>
                        <div className="absolute -z-10 -top-10 -left-10 w-32 h-32 md:w-48 md:h-48 bg-neon-lime/10 blur-[80px] rounded-full"></div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-32 relative overflow-hidden bg-background-dark">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">WHY CHOOSE RESUMENOW?</h2>
                        <div className="h-1 w-24 bg-primary mx-auto"></div>
                        <p className="text-slate-400">Everything you need to create a job-winning resume.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature Card 1 */}
                        <div className="glass-card p-10 rounded-xl group hover:border-neon-lime/40 transition-all duration-500 relative overflow-hidden">
                            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                                <span className="material-icons text-primary text-3xl">auto_awesome</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 dark:text-white group-hover:text-neon-lime transition-colors">AI Text Suggestions</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Get expert, pre-written bullet points for your skills and experience to save time and impress recruiters.</p>
                        </div>
                        {/* Feature Card 2 */}
                        <div className="glass-card p-10 rounded-xl group hover:border-primary transition-all duration-500 relative overflow-hidden">
                            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                                <span className="material-icons text-primary text-3xl">visibility</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 dark:text-white group-hover:text-primary transition-colors">Recruiter-Approved Templates</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Choose from 30+ professional, modern designs tailored for your industry and optimized for ATS.</p>
                        </div>
                        {/* Feature Card 3 */}
                        <div className="glass-card p-10 rounded-xl group hover:border-neon-lime/40 transition-all duration-500 relative overflow-hidden">
                            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                                <span className="material-icons text-primary text-3xl">download</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 dark:text-white group-hover:text-neon-lime transition-colors">Step-by-Step Guidance</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Our builder guides you through every step, ensuring you don't miss any critical information.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 bg-primary/5">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative order-2 md:order-1">
                        <div className="glass-card rounded-xl border border-primary/20 p-2 shadow-2xl relative overflow-hidden neon-border-purple group">
                            <div className="bg-background-dark h-[400px] rounded-lg p-10 space-y-8 relative overflow-hidden box-border border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>

                                {/* Header */}
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center neon-glow-primary">
                                        <span className="material-icons text-primary text-3xl">description</span>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="h-4 w-1/3 bg-white/20 rounded-full animate-pulse"></div>
                                        <div className="h-2 w-1/4 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Body Lines */}
                                <div className="pt-8 space-y-4 relative z-10">
                                    <div className="flex gap-4">
                                        <div className="w-2/3 space-y-3">
                                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                            <div className="h-2 w-5/6 bg-white/10 rounded-full"></div>
                                        </div>
                                        <div className="w-1/3 space-y-3">
                                            <div className="h-2 w-full bg-white/5 rounded-full"></div>
                                            <div className="h-2 w-full bg-white/5 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                        <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                        <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Scan Line Overlay */}
                                <div className="absolute left-0 w-full h-[2px] bg-neon-lime shadow-[0_0_15px_rgba(204,255,0,0.8)] animate-[scan_3s_ease-in-out_infinite]" style={{ top: "0%" }}></div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute bottom-6 right-6 glass-card px-4 py-2 rounded-lg border border-neon-lime/30 flex items-center gap-2 shadow-lg shadow-black/50">
                                <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></span>
                                <span className="text-xs font-bold text-white tracking-widest">OPTIMIZED</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white">RESUME BUILDING SIMPLIFIED<span className="text-primary">.</span></h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400">3 simple steps to your new career.</p>
                        <ul className="space-y-4 pt-4">
                            <li className="flex items-start gap-4">
                                <span className="material-icons text-primary mt-1">dashboard</span>
                                <div>
                                    <span className="font-bold dark:text-white block">Select a Template</span>
                                    <span className="text-sm text-slate-500">Choose from our library of professional designs.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="material-icons text-primary mt-1">edit_note</span>
                                <div>
                                    <span className="font-bold dark:text-white block">Customize Content</span>
                                    <span className="text-sm text-slate-500">Use our expert tips and AI content to fill in your info.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="material-icons text-primary mt-1">download</span>
                                <div>
                                    <span className="font-bold dark:text-white block">Download & Apply</span>
                                    <span className="text-sm text-slate-500">Export as PDF and start applying instantly.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Templates Showcase Section */}
            <section className="py-32 relative bg-background-dark overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">TEMPLATES FOR EVERY CAREER</h2>
                        <div className="h-1 w-24 bg-neon-lime mx-auto"></div>
                        <p className="text-slate-500 dark:text-slate-400">Professional, Modern, Creative, or Simple. Choose the style that fits you.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {templates.map((template) => (
                            <div key={template.id} className="group relative cursor-pointer" onClick={() => handleTemplateSelect(template.id)}>
                                <div className="aspect-[210/297] glass-card rounded-xl border border-primary/20 overflow-hidden relative transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(106,37,244,0.15)] bg-slate-900 text-xs flex justify-center">
                                    <div className="absolute top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2 scale-[0.36] w-[210mm] h-[297mm] pointer-events-none select-none overflow-hidden bg-white shadow-2xl text-left">
                                        <template.Component data={DUMMY_DATA} color={DUMMY_DATA.themeColor} />
                                    </div>

                                    <div className="absolute inset-0 bg-background-dark/0 group-hover:bg-background-dark/10 z-10 transition-colors flex items-center justify-center">
                                        <div className="px-6 py-2 bg-primary text-white font-bold rounded-lg neon-glow-primary transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all">
                                            USE THIS
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-center font-bold mt-4 text-slate-300 group-hover:text-primary transition-colors">{template.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-primary/5 border-t border-primary/10">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white">FREQUENTLY ASKED QUESTIONS</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is ResumeNow free to use?", a: "Yes, you can build and preview your resume for free. We offer premium features for downloading high-resolution PDFs and accessing advanced AI tools." },
                            { q: "What is an ATS-friendly resume?", a: "Applicant Tracking Systems (ATS) are software used by employers to filter resumes. Our templates are strictly formatted to ensure they can be read by these systems." },
                            { q: "Can I customize the templates?", a: "Absolutely. You can change colors, fonts, section order, and spacing with a single click in our editor." },
                            { q: "Do you offer cover letters?", a: "Yes, our builder includes a matching cover letter generator to complete your application package." }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors">
                                <h3 className="font-bold text-lg mb-2 text-slate-200">{item.q}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-primary/10 bg-background-dark/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 neon-glow-primary">
                                    <span className="font-black text-white text-lg">R</span>
                                </div>
                                <span className="text-lg font-bold tracking-tighter dark:text-white">ResumeNow<span className="text-primary">.</span></span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Building the visual infrastructure for the modern workforce. Secure, fast, and professional.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-primary">Resume Tools</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">Resume Builder</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Resume Templates</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Resume Examples</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-primary">Support</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">FAQ</a></li>
                            </ul>
                        </div>
                        <div className="col-span-2">
                            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-primary">Stay Connected</h4>
                            <div className="flex gap-2">
                                <input className="bg-background-dark border border-primary/20 rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary flex-1 text-slate-200" placeholder="user@domain.com" type="text" />
                                <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm">SUBSCRIBE</button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 mt-20 border-t border-primary/5 flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-500 uppercase tracking-widest">
                        <p>© 2026 ResumeNow. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8">
                            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
