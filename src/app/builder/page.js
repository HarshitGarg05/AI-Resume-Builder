"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { ResumeProvider, useResume } from "@/context/ResumeContext";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import Navbar from "@/components/Navbar";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Edit3, Eye, User, Briefcase, GraduationCap, Zap, LayoutTemplate, Settings, Download, ZoomIn, RotateCcw, ChevronDown, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";



function BuilderContent() {
    const [activeTab, setActiveTab] = useState("edit");
    const [activeSection, setActiveSection] = useState("personal");
    const [isDesktop, setIsDesktop] = useState(false);
    const { resumeData, setTemplate } = useResume();
    const componentRef = useRef();
    const pdfRef = useRef();
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const searchParams = useSearchParams();

    // Handle template from URL
    useEffect(() => {
        const urlTemplate = searchParams.get("template");
        if (urlTemplate) {
            setTemplate(urlTemplate);
        }
    }, [searchParams, setTemplate]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);


    const handleDownloadPDF = async () => {
        const element = pdfRef.current;
        if (!element) return;

        const button = document.querySelector('[data-download-btn]');
        const originalHTML = button?.innerHTML;
        if (button) {
            button.disabled = true;
            button.innerHTML = `<div class="flex items-center gap-2 text-white"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Creating Pro PDF...</span></div>`;
        }

        try {
            const { toJpeg } = await import('html-to-image');
            const { jsPDF } = await import('jspdf');

            // 1. Capture exact visuals (Immune to 'lab' errors because it uses SVG rendering)
            const imgData = await toJpeg(element, {
                quality: 1.0,
                pixelRatio: 2.5,
                backgroundColor: '#ffffff',
                style: { transform: 'scale(1)' }
            });

            // 2. Initialize PDF (A4 Dimensions)
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;

            // 3. Place the Design Layer
            pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);

            // 4. INJECT SELECTABLE TEXT (Hidden Layer)
            // This allows the mouse to select text and ATS to read it.
            const elRect = element.getBoundingClientRect();
            const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            let node;

            pdf.setFont('helvetica', 'normal');

            // We inject the text using 'invisible' rendering mode.
            // It puts the text data in the PDF for selection/ATS without ever drawing a single pixel.
            while (node = walk.nextNode()) {
                const text = node.textContent.trim();
                if (!text) continue;

                const range = document.createRange();
                range.selectNodeContents(node);
                const rect = range.getBoundingClientRect();

                if (rect.width > 0) {
                    const x = ((rect.left - elRect.left) / elRect.width) * pageWidth;
                    const y = ((rect.top - elRect.top) / elRect.height) * pageHeight;

                    const style = window.getComputedStyle(node.parentElement);
                    const fontSizePx = parseFloat(style.fontSize);
                    const fontSizePdf = fontSizePx * (pageHeight / elRect.height);

                    pdf.setFontSize(fontSizePdf * 0.9);
                    pdf.text(text, x, y + (fontSizePdf * 0.75), { renderingMode: 'invisible' });
                }
            }

            // 5. Trigger Instant Download
            pdf.save(`${resumeData?.personal?.firstName || 'Resume'}.pdf`);

            if (button) {
                button.disabled = false;
                button.innerHTML = originalHTML;
            }
        } catch (error) {
            console.error("Export Fail:", error);
            alert("Export Error. Please ensure you are not on a very slow connection and try again.");
            if (button) {
                button.disabled = false;
                button.innerHTML = originalHTML;
            }
        }
    };


    const navItems = [
        { id: 'personal', icon: User, label: 'Identity' },
        { id: 'experience', icon: Briefcase, label: 'Work' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'skills', icon: Zap, label: 'Skills' },
        { id: 'style', icon: LayoutTemplate, label: 'Style' },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-slate-100 font-display">
            {/* Header Navigation */}
            <Navbar
                showDownload={true}
                onDownload={handleDownloadPDF}
            >
                {/* Mobile Menu Toggle injected as a child */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 hover:bg-primary/10 rounded-lg transition"
                >
                    {mobileMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
                </button>
            </Navbar>

            <main className="flex flex-1 overflow-hidden relative">
                {/* Mobile Section Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
                        <div className="absolute left-0 top-16 bottom-0 w-64 bg-background-dark border-r border-primary/20 p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveSection(item.id);
                                                setMobileMenuOpen(false);
                                                setActiveTab('edit');
                                            }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:bg-white/5'}`}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sidebar */}
                <nav className="no-print w-20 border-r border-primary/10 hidden md:flex flex-col items-center py-8 gap-6 bg-background-dark/50 z-20">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`relative group p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                                title={item.label}
                            >
                                {isActive && (
                                    <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_#6a25f4]"></div>
                                )}
                                <Icon
                                    size={24}
                                    className={`transition-colors duration-300 ${isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(106,37,244,0.5)]' : 'text-slate-400 group-hover:text-primary/80'}`}
                                />
                            </button>
                        );
                    })}
                    <div className="mt-auto group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                        <Settings size={24} className="text-slate-400 group-hover:text-primary" />
                    </div>
                </nav>

                {/* Input Section (Editor) */}
                <section className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar bg-background-dark/30 border-r border-primary/10 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
                    <Editor showNavbar={false} activeSection={activeSection} />
                </section>

                {/* Holographic Preview Section */}
                <section className={`flex-1 bg-background-dark grid-bg relative overflow-y-auto custom-scrollbar flex-col items-center justify-start p-4 md:p-8 pb-24 md:pb-40 ${activeTab === 'edit' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="w-full max-w-[95vw] lg:max-w-lg min-h-[500px] relative flex justify-center py-4 md:py-8">
                        <div className="scale-[0.35] xs:scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] origin-top">
                            <div className="shadow-2xl shadow-primary/20">
                                <Preview printRef={componentRef} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hidden off-screen Preview for PDF capture - always rendered so html2canvas works on mobile */}
                <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', background: 'white', zIndex: -1000 }}>
                    <Preview printRef={pdfRef} />
                </div>

                {/* Mobile Tab Navigation */}
                <div className="no-print lg:hidden fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 glass-card border-primary/20 shadow-2xl rounded-full p-1.5 flex gap-1 z-[100]">
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-primary text-white shadow-lg neon-glow-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-primary/10'}`}
                    >
                        <Edit3 size={16} className={`md:w-[18px] md:h-[18px] ${activeTab === 'edit' ? 'text-white' : ''}`} /> <span className="hidden xs:inline">Edit</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-primary text-white shadow-lg neon-glow-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-primary/10'}`}
                    >
                        <Eye size={16} className={`md:w-[18px] md:h-[18px] ${activeTab === 'preview' ? 'text-white' : ''}`} /> <span className="hidden xs:inline">Preview</span>
                    </button>
                </div>
            </main>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background-dark"><div className="text-primary">Loading...</div></div>}>
            <BuilderContent />
        </Suspense>
    );
}
