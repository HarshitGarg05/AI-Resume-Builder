"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useResume } from "@/context/ResumeContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Plus, Edit2, Trash2, FileText, AlertTriangle } from "lucide-react";
import ModernLoader from "@/components/ModernLoader";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { loadResumeFromDB, resetResume } = useResume();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (status === "authenticated") {
      fetchResumes();
    }
  }, [status]);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setResumes(data);
      } else {
        console.error("Valid resumes not found:", data);
        // harmless empty state or alert
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resume) => {
    loadResumeFromDB(resume);
    router.push("/builder");
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/resumes/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setResumes(resumes.filter((r) => r._id !== deleteId));
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleCreateNew = () => {
    resetResume();
    router.push("/builder");
  };



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <ModernLoader text="Loading Dashboard..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-200 relative overflow-hidden pt-32 pb-12">
      {/* Dynamic Background Effects matching Home/Editor */}
      <div className="geometric-line top-1/4 -left-1/4 opacity-20"></div>
      <div className="geometric-line top-1/2 -right-1/4 opacity-10" style={{ transform: "rotate(15deg)", background: "#6a25f4" }}></div>
      <div className="grid-bg absolute inset-0 opacity-50 pointer-events-none"></div>

      <Navbar />
      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight dark:text-white mb-2">My Resumes</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">Manage and edit your saved resumes</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold neon-glow-primary hover:scale-105 transition-transform"
          >
            <Plus size={20} className="text-white" /> Create New
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center border border-dashed border-primary/20">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <FileText className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">No resumes yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Create your first AI-powered resume in minutes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="glass-card p-6 rounded-2xl border border-primary/10 hover:border-primary/40 transition group relative overflow-hidden flex flex-col h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
                      <FileText className="text-primary" size={24} />
                    </div>
                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition">
                      <button onClick={() => handleDeleteClick(resume._id)} className="p-2 text-slate-400 hover:text-red-500 transition bg-white/5 dark:bg-black/20 rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold dark:text-white mb-1 line-clamp-1" title={resume.title}>{resume.title || "Untitled Resume"}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider font-bold">
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={() => handleEdit(resume)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 hover:bg-primary hover:text-white border border-primary/10 text-primary rounded-xl font-bold transition shadow-sm"
                    >
                      <Edit2 size={18} /> Edit Resume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="glass-card bg-background-dark rounded-2xl w-full max-w-sm p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-primary/20">
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold dark:text-white">Delete Resume?</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                Are you sure you want to delete this resume? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/20 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
