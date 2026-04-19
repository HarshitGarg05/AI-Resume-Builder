"use client";

import { useState, useEffect, useRef } from "react";
import { useResume } from "@/context/ResumeContext";
import { User, Briefcase, GraduationCap, Code2, Sparkles, Plus, Trash2, Camera, Upload, RefreshCcw, History, Palette, School, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageCropper from "./ImageCropper";

// ... (previous imports)

export default function Editor({ activeSection = "personal" }) {
  const { data: session } = useSession();
  const { resumeData, resumeTitle, setResumeTitle, setTemplate, setThemeColor, updateCustomStyle, saveResumeToDB, isDirty } = useResume();
  const [isSaving, setIsSaving] = useState(false);

  const [saveStatus, setSaveStatus] = useState("All changes saved");
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    // Only save if there are unsaved changes
    if (!isDirty) return;

    setSaveStatus("Saving...");

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout (debounce)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveResumeToDB();
        setSaveStatus("Saved to DB");
        setTimeout(() => setSaveStatus("All changes saved"), 2000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("Error saving");
      }
    }, 3000); // 3 seconds debounce

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resumeData, resumeTitle, session, isDirty, saveResumeToDB]); // Trigger on data change or isDirty change

  return (
    <>
      <div className="space-y-8">
        {session && (
          <div className="glass-card p-6 rounded-2xl border border-primary/20 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 neon-border-purple">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Resume Title</label>
              <input
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full text-xl font-bold outline-none bg-transparent border-b border-primary/30 focus:border-primary transition text-slate-100 placeholder:text-slate-500 py-2 placeholder:font-mono"
                placeholder="My Professional Resume"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background-dark/50 rounded-full border border-primary/20">
              <span className={`text-xs font-bold transition-colors uppercase tracking-widest ${saveStatus === "Saving..." ? "text-primary animate-pulse" :
                  saveStatus === "Error saving" ? "text-red-500" : "text-neon-lime"
                }`}>
                {saveStatus === "All changes saved" ? "SAVED" : saveStatus}
              </span>
              {saveStatus === "All changes saved" && <div className="w-2 h-2 rounded-full bg-neon-lime shadow-[0_0_5px_#ccff00]" />}
            </div>
          </div>
        )}
        <div className="min-h-[600px]">
          {activeSection === 'personal' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <PersonalForm />
            </motion.div>
          )}
          {activeSection === 'experience' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <ExperienceForm />
            </motion.div>
          )}
          {activeSection === 'education' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <EducationForm />
            </motion.div>
          )}
          {activeSection === 'skills' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <SkillsForm />
            </motion.div>
          )}
          {activeSection === 'style' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <div className="glass-card p-6 rounded-xl border border-primary/20 mb-6 neon-border-purple">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white uppercase tracking-wider">
                  <Palette className="text-primary" size={24} /> Resume Style
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70 block mb-3">Color Customization</label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Primary Accent */}
                      <div className="bg-background-dark/30 p-3 rounded-lg border border-primary/10">
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Primary Accent</label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-white/50 hover:scale-110 transition-all shadow-lg group">
                            <div className="absolute inset-0" style={{ background: "conic-gradient(#ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)" }}></div>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <input
                              type="color"
                              value={resumeData.customStyles?.themeColor || resumeData.themeColor}
                              onChange={(e) => setThemeColor(e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Choose Color"
                            />
                          </div>
                          <div className="text-xs font-mono text-slate-500">{resumeData.customStyles?.themeColor || resumeData.themeColor}</div>
                        </div>
                      </div>

                      {/* Heading Color */}
                      <div className="bg-background-dark/30 p-3 rounded-lg border border-primary/10">
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Headings</label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-white/50 hover:scale-110 transition-all shadow-lg group">
                            <div className="absolute inset-0" style={{ background: "conic-gradient(#ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)" }}></div>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <input
                              type="color"
                              value={resumeData.customStyles?.headingColor || "#111827"}
                              onChange={(e) => updateCustomStyle("headingColor", e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Choose Color"
                            />
                          </div>
                          <div className="text-xs font-mono text-slate-500">{resumeData.customStyles?.headingColor}</div>
                        </div>
                      </div>

                      {/* SubHeading Color */}
                      <div className="bg-background-dark/30 p-3 rounded-lg border border-primary/10">
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Subheadings</label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-white/50 hover:scale-110 transition-all shadow-lg group">
                            <div className="absolute inset-0" style={{ background: "conic-gradient(#ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)" }}></div>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <input
                              type="color"
                              value={resumeData.customStyles?.subHeadingColor || "#4b5563"}
                              onChange={(e) => updateCustomStyle("subHeadingColor", e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Choose Color"
                            />
                          </div>
                          <div className="text-xs font-mono text-slate-500">{resumeData.customStyles?.subHeadingColor}</div>
                        </div>
                      </div>

                      {/* Paragraph Color */}
                      <div className="bg-background-dark/30 p-3 rounded-lg border border-primary/10">
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Text / Body</label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-white/50 hover:scale-110 transition-all shadow-lg group">
                            <div className="absolute inset-0" style={{ background: "conic-gradient(#ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)" }}></div>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <input
                              type="color"
                              value={resumeData.customStyles?.paragraphColor || "#4b5563"}
                              onChange={(e) => updateCustomStyle("paragraphColor", e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Choose Color"
                            />
                          </div>
                          <div className="text-xs font-mono text-slate-500">{resumeData.customStyles?.paragraphColor}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70 block mb-3">Template</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "modern", label: "Modern" },
                        { id: "minimal", label: "Simple" },
                        { id: "professional", label: "Professional" },
                        { id: "resumenow", label: "Creative" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTemplate(t.id)}
                          className={`py-3 px-2 rounded-lg capitalize text-xs font-bold tracking-wider transition-all border ${resumeData.template === t.id
                              ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(106,37,244,0.3)]"
                              : "bg-background-dark/50 border-primary/10 text-slate-500 hover:border-primary/40"
                            }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

function PersonalForm() {
  const { resumeData, updatePersonal, generateAISummary, enhanceAISummary, isGenerating } = useResume();
  const [croppingImage, setCroppingImage] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCroppingImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage) => {
    updatePersonal('photo', croppedImage);
    setCroppingImage(null);
  };

  return (
    <div className="glass-card p-8 rounded-2xl border border-primary/20 relative neon-border-purple backdrop-blur-xl bg-background-dark/30">
      {croppingImage && (
        <ImageCropper
          imageSrc={croppingImage}
          onComplete={handleCropComplete}
          onCancel={() => setCroppingImage(null)}
        />
      )}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-2 text-white uppercase tracking-wider">Personal Details</h2>
        <p className="text-slate-500 text-sm font-mono">Manage your personal information and contact details.</p>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full border-2 border-primary/30 overflow-hidden flex items-center justify-center bg-background-dark relative shadow-[0_0_15px_rgba(106,37,244,0.3)] group cursor-pointer">
          {resumeData.personal.photo ? (
            <img src={resumeData.personal.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="text-primary/40 w-8 h-8 group-hover:text-primary transition-colors" />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Profile Photo</div>
          <p className="text-xs text-slate-500 font-mono">FORMATS: JPG, PNG, WEBP</p>
          {resumeData.personal.photo && (
            <button
              onClick={() => updatePersonal('photo', null)}
              className="text-xs text-red-400 hover:text-red-300 font-bold mt-2 flex items-center gap-1 uppercase tracking-wider"
            >
              <Trash2 size={12} /> Remove Photo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" value={resumeData.personal.firstName} onChange={(e) => updatePersonal("firstName", e.target.value)} />
        <Input label="Last Name" value={resumeData.personal.lastName} onChange={(e) => updatePersonal("lastName", e.target.value)} />
        <div className="md:col-span-2">
          <Input label="Job Title" value={resumeData.personal.role} onChange={(e) => updatePersonal("role", e.target.value)} />
        </div>
        <Input label="Email" value={resumeData.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} />
        <Input label="Phone" value={resumeData.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} />

        <div className="md:col-span-2 space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Professional Summary</label>
            <div className="flex items-center gap-2 flex-wrap">
              {resumeData.personal.summary && (
                <button
                  onClick={enhanceAISummary}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-neon-lime bg-neon-lime/5 px-3 py-1.5 rounded border border-neon-lime/20 hover:bg-neon-lime/10 disabled:opacity-50 transition tracking-wider uppercase"
                >
                  {isGenerating ? "PROCESSING..." : <><Sparkles size={10} /> ENHANCE</>}
                </button>
              )}
              <button
                onClick={generateAISummary}
                disabled={isGenerating}
                className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded border border-primary/20 hover:bg-primary/20 disabled:opacity-50 transition tracking-wider uppercase"
              >
                {isGenerating && !resumeData.personal.summary ? "SYNTHESIZING..." : <><Sparkles size={10} /> {resumeData.personal.summary ? "REGENERATE" : "AUTO-GENERATE"}</>}
              </button>
            </div>
          </div>
          <textarea
            className="w-full px-4 py-4 rounded-lg bg-background-dark/80 border border-primary/30 focus:border-primary outline-none transition resize-none min-h-[120px] text-sm text-slate-200 placeholder:text-slate-500 neon-border placeholder:font-mono"
            value={resumeData.personal.summary}
            onChange={(e) => updatePersonal("summary", e.target.value)}
            placeholder="Enter professional summary details..."
          />
        </div>
      </div>
    </div>
  );
}

const ExperienceForm = () => {
  const { resumeData, setResumeData, addExperience, updateExperience, removeExperience } = useResume();

  const handleDateChange = (exp, field, value) => {
    // Helper to format date string
    const formatDateStr = (startDate, endDate, isCurrent) => {
      const _format = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      let str = '';
      if (startDate) {
        str = _format(startDate);
        if (isCurrent) {
          str += ' - Present';
        } else if (endDate) {
          str += ` - ${_format(endDate)}`;
        }
      }
      return str;
    };

    if (field === 'isCurrent' && value === true) {
      // Enforce exclusivity: Set this one to true, others to false
      const updatedExperience = resumeData.experience.map(e => {
        if (e.id === exp.id) {
          return {
            ...e,
            isCurrent: true,
            endDate: null,
            dates: formatDateStr(e.startDate, null, true)
          };
        } else {
          return {
            ...e,
            isCurrent: false,
            dates: formatDateStr(e.startDate, e.endDate, false)
          };
        }
      });
      setResumeData({ ...resumeData, experience: updatedExperience });
    } else {
      // Standard single update
      const currentExp = { ...exp, [field]: value };
      if (field === 'isCurrent' && value === false) {
        // If unticking current, keep endDate as is (likely null) or let user set it
      }

      // Recalculate dates string for this specific item
      // Note: if field is startDate/endDate, use new value. If isCurrent, use new value.
      const newStartDate = field === 'startDate' ? value : exp.startDate;
      const newEndDate = field === 'endDate' ? value : (field === 'isCurrent' && value ? null : exp.endDate);
      const newIsCurrent = field === 'isCurrent' ? value : exp.isCurrent;

      updateExperience(exp.id, field, value);
      updateExperience(exp.id, 'dates', formatDateStr(newStartDate, newEndDate, newIsCurrent));

      if (field === 'isCurrent' && value === true) {
        updateExperience(exp.id, 'endDate', null);
      }
    }
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white uppercase tracking-wider">
          <History className="text-primary" size={24} /> Experience
        </h3>
        <button onClick={addExperience} className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition">
          <Plus size={18} />
        </button>
      </div>

      <AnimatePresence>
        {resumeData.experience.map((exp) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 pb-4 border-b border-primary/10 last:border-0"
          >
            <div className="p-6 border border-primary/20 rounded-xl bg-background-dark/40 relative group neon-border-purple hover:bg-background-dark/60 transition-colors">
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <div className="absolute -left-[1px] top-6 bottom-6 w-[3px] bg-primary group-hover:shadow-[0_0_10px_#6a25f4] transition-all rounded-r"></div>

              <div className="grid grid-cols-2 gap-4 mb-4 pl-2">
                <Input label="Job Title" value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} />
                <Input label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 pl-2">
                <DateSelect
                  label="Start Date"
                  value={exp.startDate}
                  onChange={(val) => handleDateChange(exp, 'startDate', val)}
                />
                <DateSelect
                  label="End Date"
                  value={exp.endDate}
                  onChange={(val) => handleDateChange(exp, 'endDate', val)}
                  disabled={exp.isCurrent}
                />
              </div>
              <div className="flex items-center gap-2 mb-4 pl-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.isCurrent || false}
                  onChange={(e) => handleDateChange(exp, 'isCurrent', e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-primary/30 bg-background-dark focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor={`current-${exp.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none">I Currently Work Here</label>
              </div>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-background-dark/80 border border-primary/30 focus:border-primary outline-none transition text-sm min-h-[80px] text-slate-200 placeholder:text-slate-500 neon-border pl-6 placeholder:font-mono"
                placeholder="Enter key responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center gap-2 text-primary/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-widest">
        <PlusCircle size={20} />
        ADD EXPERIENCE
      </button>
    </div>
  );
}

function EducationForm() {
  const { resumeData, setResumeData, addEducation, updateEducation, removeEducation } = useResume();

  const handleDateChange = (edu, field, value) => {
    // Helper to format date string
    const formatDateStr = (startDate, endDate, isCurrent) => {
      const _format = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      let str = '';
      if (startDate) {
        str = _format(startDate);
        if (isCurrent) {
          str += ' - Present';
        } else if (endDate) {
          str += ` - ${_format(endDate)}`;
        }
      }
      return str;
    };

    if (field === 'isCurrent' && value === true) {
      // Enforce exclusivity
      const updatedEducation = resumeData.education.map(e => {
        if (e.id === edu.id) {
          return {
            ...e,
            isCurrent: true,
            endDate: null,
            dates: formatDateStr(e.startDate, null, true)
          };
        } else {
          return {
            ...e,
            isCurrent: false,
            dates: formatDateStr(e.startDate, e.endDate, false)
          };
        }
      });
      setResumeData({ ...resumeData, education: updatedEducation });
    } else {
      const newStartDate = field === 'startDate' ? value : edu.startDate;
      const newEndDate = field === 'endDate' ? value : (field === 'isCurrent' && value ? null : edu.endDate);
      const newIsCurrent = field === 'isCurrent' ? value : edu.isCurrent;

      updateEducation(edu.id, field, value);
      updateEducation(edu.id, 'dates', formatDateStr(newStartDate, newEndDate, newIsCurrent));

      if (field === 'isCurrent' && value === true) {
        updateEducation(edu.id, 'endDate', null);
      }
    }
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white uppercase tracking-wider">
          <GraduationCap className="text-primary" size={24} /> Education
        </h3>
        <button onClick={addEducation} className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition">
          <Plus size={18} />
        </button>
      </div>

      {resumeData.education.map((edu) => (
        <div key={edu.id} className="mb-4 bg-background-dark/40 p-6 rounded-xl border border-primary/20 space-y-4 relative group neon-border-purple">
          <button
            onClick={() => removeEducation(edu.id)}
            className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
          >
            <Trash2 size={16} />
          </button>
          <div className="absolute -left-[1px] top-6 bottom-6 w-[3px] bg-primary group-hover:shadow-[0_0_10px_#6a25f4] transition-all rounded-r"></div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="School / University" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
            <Input label="Degree / Certification" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DateSelect
              label="Start Date"
              value={edu.startDate}
              onChange={(val) => handleDateChange(edu, 'startDate', val)}
            />
            <DateSelect
              label="End Date"
              value={edu.endDate}
              onChange={(val) => handleDateChange(edu, 'endDate', val)}
              disabled={edu.isCurrent}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`edu-current-${edu.id}`}
              checked={edu.isCurrent || false}
              onChange={(e) => handleDateChange(edu, 'isCurrent', e.target.checked)}
              className="w-4 h-4 text-primary rounded border-primary/30 bg-background-dark focus:ring-primary focus:ring-offset-0"
            />
            <label htmlFor={`edu-current-${edu.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none">I Currently Study Here</label>
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center gap-2 text-primary/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-widest">
        <PlusCircle size={20} />
        ADD EDUCATION
      </button>
    </div>
  );
}

function SkillsForm() {
  const { resumeData, updateSkills, suggestSkills, isSuggestingSkills } = useResume();

  return (
    <div className="pt-4 mb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white uppercase tracking-wider">
          <Sparkles className="text-primary" size={24} /> Skills
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => updateSkills([])}
            className="text-xs font-bold text-slate-500 hover:text-red-500 transition mr-2 uppercase tracking-wider"
          >
            RESET
          </button>
          <button
            onClick={suggestSkills}
            disabled={isSuggestingSkills}
            className="flex items-center gap-1.5 text-xs font-bold text-neon-lime bg-neon-lime/5 px-3 py-1.5 rounded border border-neon-lime/20 hover:bg-neon-lime/10 transition uppercase tracking-wider"
          >
            {isSuggestingSkills ? "COMPUTING..." : <><Sparkles size={12} /> AI SUGGEST</>}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Skills List (Comma Separated)</label>
        <textarea
          className="w-full px-4 py-4 rounded-lg bg-background-dark/80 border border-primary/30 focus:border-primary outline-none transition resize-none min-h-[100px] text-sm text-slate-200 placeholder:text-slate-500 neon-border placeholder:font-mono"
          value={resumeData.skills.join(", ")}
          onChange={(e) => updateSkills(e.target.value)}
          placeholder="React, Node.js, Neural Networks, Cyber-Security..."
        />
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-xs font-bold uppercase tracking-wider text-primary/70">{label}</label>}
    <input
      type="text"
      className="w-full bg-background-dark/80 border border-primary/30 rounded-lg p-3 text-sm focus:outline-none neon-border transition-all text-slate-100 placeholder:text-slate-500 placeholder:font-mono"
      {...props}
    />
  </div>
);

const DateSelect = ({ label, value, onChange, disabled }) => {
  // Parse the stored value (which might be a string or Date) into a Date object for the picker
  const parseDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-xs font-bold uppercase tracking-wider text-primary/70 block">{label}</label>}
      <div className="relative">
        <DatePicker
          selected={parseDate(value)}
          onChange={onChange}
          disabled={disabled}
          dateFormat="MMM yyyy"
          showMonthYearPicker
          className="w-full bg-background-dark/80 border border-primary/30 rounded-lg p-3 text-sm focus:outline-none neon-border transition-all text-slate-100 disabled:opacity-50 placeholder:font-mono cursor-pointer"
          onKeyDown={(e) => e.preventDefault()} // Prevent typing
          placeholderText="Select Date"
        />
      </div>
    </div>
  );
};
