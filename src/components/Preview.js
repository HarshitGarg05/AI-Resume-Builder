"use client";

import { useResume } from "@/context/ResumeContext";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Preview({ printRef }) {
  const { resumeData } = useResume();
  const internalRef = useRef();
  
  // Use the passed ref if available (for external printing) or fall back to internal
  const componentRef = printRef || internalRef;

  const renderTemplate = () => {
    switch (resumeData.template) {
      case "minimal":
        return <MinimalTemplate data={resumeData} color={resumeData.themeColor} />;
      case "professional":
        return <ProfessionalTemplate data={resumeData} color={resumeData.themeColor} />;
      case "resumenow":
      case "executive":
        return <ResumeNowTemplate data={resumeData} color={resumeData.themeColor || "#2b59f3"} />;
      case "modern":
      default:
        return <ModernTemplate data={resumeData} color={resumeData.themeColor} />;
    }
  };

  if (!resumeData) return null;

  return (
    <div className="relative group">
      <div
        ref={componentRef}
        className="bg-white text-black resume-document relative shadow-2xl"
        style={{ 
            width: "210mm", 
            minHeight: "297mm",
            height: "auto",
            overflow: "visible",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px -10px rgba(0,0,0,0.3), 0 10px 20px -5px rgba(0,0,0,0.2)"
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}

// --- Templates ---

export const ModernTemplate = ({ data, color }) => {
  const { headingColor = "#111827", subHeadingColor = "#4b5563", paragraphColor = "#4b5563" } = data.customStyles || {};
  
  return (
  <div className="p-8 font-sans min-h-[297mm]">
    <header className="flex justify-between items-center border-b-2 pb-5 mb-5" style={{ borderColor: color }}>
      <div className="flex-1 min-w-0 pr-4">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase break-words" style={{ color: color }}>
          {data.personal.firstName || data.personal.lastName ? (
              <>{data.personal.firstName} {data.personal.lastName}</>
          ) : (
              <span className="text-gray-300">Your Name</span>
          )}
        </h1>
        <p className="text-xl font-medium mt-1 break-words" style={{ color: subHeadingColor }}>{data.personal.role}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium" style={{ color: paragraphColor }}>
          <span className="break-all">{data.personal.email}</span>
          {data.personal.phone && <span className="break-words">• {data.personal.phone}</span>}
        </div>
      </div>
      {data.personal.photo && (
        <img
          src={data.personal.photo}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm shrink-0"
        />
      )}
    </header>

    {data.personal.summary && (
      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: color }}>Professional Summary</h3>
        <p className="leading-relaxed text-sm break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{data.personal.summary}</p>
      </section>
    )}

    {data.experience.length > 0 && (
      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: color }}>Experience</h3>
        <div className="space-y-5">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-1 flex-wrap sm:flex-nowrap gap-2">
                <h4 className="font-bold break-words" style={{ color: headingColor }}>{exp.title}</h4>
                <span className="text-xs font-medium shrink-0 break-words whitespace-pre-wrap max-w-[50%]" style={{ color: subHeadingColor }}>{exp.dates}</span>
              </div>
              <div className="text-sm font-semibold mb-1 break-words" style={{ color: color }}>{exp.company}</div>
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {data.education.length > 0 && (
      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: color }}>Education</h3>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <h4 className="font-bold break-words" style={{ color: headingColor }}>{edu.school}</h4>
              <div className="flex justify-between items-start text-sm mt-1 gap-2">
                <span className="break-words" style={{ color: paragraphColor }}>{edu.degree}</span>
                <span className="shrink-0 break-words whitespace-pre-wrap max-w-[50%]" style={{ color: subHeadingColor }}>{edu.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {data.skills.length > 0 && (
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: color }}>Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 break-words"
              style={{ color: paragraphColor }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
);
};

export const MinimalTemplate = ({ data, color }) => {
  const { headingColor = "#111827", subHeadingColor = "#4b5563", paragraphColor = "#4b5563" } = data.customStyles || {};

  return (
  <div className="flex min-h-[297mm]">
    <aside className="w-1/3 text-white p-6" style={{ backgroundColor: color }}>
      {data.personal.photo && (
        <img
          src={data.personal.photo}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-8 border-4 border-white/20"
        />
      )}
      
      {(data.personal.email || data.personal.phone) && (
          <div className="mb-10">
              <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Contact</h3>
              <div className="space-y-3 text-sm text-white/90">
                  <div className="break-words">{data.personal.email}</div>
                  <div className="break-words">{data.personal.phone}</div>
              </div>
          </div>
      )}

      {data.skills.length > 0 && (
          <div>
              <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Skills</h3>
              <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                      <div key={i} className="text-sm font-medium border-b border-white/20 pb-2 text-white/90 break-words">{skill}</div>
                  ))}
              </div>
          </div>
      )}
    </aside>
    
    <main className="w-2/3 p-8 bg-white">
        <header className="mb-8">
            <h1 className="text-5xl font-light mb-2 break-words" style={{ color: headingColor }}>{data.personal.firstName} {data.personal.lastName}</h1>
            <p className="text-xl tracking-wide opacity-80 break-words" style={{ color: subHeadingColor }}>{data.personal.role}</p>
        </header>

        {data.personal.summary && (
            <section className="mb-6">
                <p className="leading-relaxed break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{data.personal.summary}</p>
            </section>
        )}

        {data.experience.length > 0 && (
            <section className="mb-6">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-200 pb-2" style={{ color: headingColor }}>Experience</h3>
                <div className="space-y-8">
                    {data.experience.map((exp) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                <h4 className="text-lg font-bold break-words" style={{ color: headingColor }}>{exp.company}</h4>
                                <span className="text-sm shrink-0 break-words whitespace-pre-wrap max-w-[50%]" style={{ color: subHeadingColor }}>{exp.dates}</span>
                            </div>
                            <div className="text-sm font-semibold mb-2 break-words" style={{ color: subHeadingColor }}>{exp.title}</div>
                            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {data.education.length > 0 && (
            <section>
                 <h3 className="text-xl font-bold mb-6 border-b border-gray-200 pb-2" style={{ color: headingColor }}>Education</h3>
                 {data.education.map((edu) => (
                     <div key={edu.id} className="mb-4">
                         <h4 className="font-bold break-words" style={{ color: headingColor }}>{edu.school}</h4>
                         <p className="text-sm break-words whitespace-pre-wrap" style={{ color: subHeadingColor }}>{edu.degree} <span className="text-gray-300 mx-2">|</span> {edu.dates}</p>
                     </div>
                 ))}
            </section>
        )}
    </main>
  </div>
);
};

export const ProfessionalTemplate = ({ data }) => {
    const { headingColor = "#111827", subHeadingColor = "#4b5563", paragraphColor = "#4b5563" } = data.customStyles || {};

    return (
    <div className="p-8 min-h-[297mm]">
         <header className="text-center mb-8">
             <h1 className="text-4xl font-serif font-bold mb-1 break-words" style={{ color: headingColor }}>{data.personal.firstName} {data.personal.lastName}</h1>
             <p className="text-sm uppercase tracking-widest font-bold break-words" style={{ color: subHeadingColor }}>{data.personal.role}</p>
             <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm" style={{ color: subHeadingColor }}>
                 <span className="break-all">{data.personal.email}</span>
                 {data.personal.phone && <span className="break-words">{data.personal.phone}</span>}
             </div>
         </header>

         <div className="grid grid-cols-[1fr_2fr] gap-6">
             <aside>
                 {data.skills.length > 0 && (
                     <section className="mb-6">
                         <h3 className="text-xs font-bold border-b border-gray-300 pb-1 mb-3 uppercase" style={{ color: headingColor }}>Key Skills</h3>
                         <div className="flex flex-wrap gap-2">
                             {data.skills.map(skill => (
                                 <span key={skill} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold break-words" style={{ color: paragraphColor }}>{skill}</span>
                             ))}
                         </div>
                     </section>
                 )}
                 
                 {data.education.length > 0 && (
                     <section>
                         <h3 className="text-xs font-bold border-b border-gray-300 pb-1 mb-3 uppercase" style={{ color: headingColor }}>Education</h3>
                         {data.education.map(edu => (
                             <div key={edu.id} className="mb-3">
                                 <div className="font-bold text-sm break-words" style={{ color: headingColor }}>{edu.school}</div>
                                 <div className="text-xs break-words" style={{ color: subHeadingColor }}>{edu.degree}</div>
                                 <div className="text-xs mt-0.5 italic break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{edu.dates}</div>
                             </div>
                         ))}
                     </section>
                 )}
             </aside>

             <main>
                 {data.personal.summary && (
                     <section className="mb-6">
                         <h3 className="text-xs font-bold border-b border-gray-300 pb-1 mb-3 uppercase" style={{ color: headingColor }}>Profile</h3>
                         <p className="text-sm leading-relaxed text-justify break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{data.personal.summary}</p>
                     </section>
                 )}

                 {data.experience.length > 0 && (
                     <section>
                         <h3 className="text-xs font-bold border-b border-gray-300 pb-1 mb-4 uppercase" style={{ color: headingColor }}>Experience</h3>
                         <div className="space-y-6">
                             {data.experience.map(exp => (
                                 <div key={exp.id}>
                                     <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                                         <h4 className="font-bold break-words" style={{ color: headingColor }}>{exp.title}</h4>
                                         <span className="text-xs font-mono shrink-0 ml-2 break-words whitespace-pre-wrap max-w-[50%]" style={{ color: subHeadingColor }}>{exp.dates}</span>
                                     </div>
                                     <div className="text-sm font-semibold mb-1 break-words" style={{ color: subHeadingColor }}>{exp.company}</div>
                                     <p className="text-sm leading-relaxed text-justify break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{exp.description}</p>
                                 </div>
                             ))}
                         </div>
                     </section>
                 )}
             </main>
         </div>
    </div>
);
};

export const ResumeNowTemplate = ({ data, color }) => {
    const { headingColor = "#111827", subHeadingColor = "#4b5563", paragraphColor = "#4b5563" } = data.customStyles || {};

    return (
    <div className="p-0 min-h-[297mm] font-['Inter',sans-serif]">
        {/* Top Header Section */}
        <div className="flex items-center gap-6 px-8 py-8 border-b-4" style={{ borderColor: color }}>
            {data.personal.photo && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                    <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-1 break-words leading-none" style={{ color: color }}>
                    {data.personal.firstName || data.personal.lastName ? `${data.personal.firstName} ${data.personal.lastName}` : "Your Name"}
                </h1>
                <p className="text-lg font-bold mb-3 break-words" style={{ color: subHeadingColor }}>{data.personal.role}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium" style={{ color: subHeadingColor }}>
                    <span className="flex items-center gap-1.5 break-all">{data.personal.email}</span>
                    {data.personal.phone && <span className="flex items-center gap-1.5 break-words">{data.personal.phone}</span>}
                    {data.personal.address && <span className="flex items-center gap-1.5 break-words">{data.personal.address}</span>}
                </div>
            </div>
        </div>

        <div className="px-8 py-8 space-y-6">
            {/* Summary */}
            {data.personal.summary && (
                <section>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: color, borderColor: `${color}40` }}>Professional Summary</h3>
                    <p className="text-sm leading-relaxed text-justify break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{data.personal.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: color, borderColor: `${color}40` }}>Work History</h3>
                    <div className="space-y-6">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                                    <div className="font-black uppercase text-sm break-words" style={{ color: headingColor }}>{exp.title}</div>
                                    <div className="text-xs font-bold text-gray-400 shrink-0 ml-2 break-words whitespace-pre-wrap max-w-[50%]" style={{ color: subHeadingColor }}>{exp.dates}</div>
                                </div>
                                <div className="text-sm font-bold mb-1 break-words" style={{ color: color }}>{exp.company}</div>
                                <p className="text-sm leading-relaxed text-justify break-words whitespace-pre-wrap" style={{ color: paragraphColor }}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills & Education side-by-side or stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.skills.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: color, borderColor: `${color}40` }}>Skills</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {data.skills.map(skill => (
                                <div key={skill} className="text-sm flex items-center gap-2 break-words" style={{ color: paragraphColor }}>
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2" style={{ color: color, borderColor: `${color}40` }}>Education</h3>
                        {data.education.map(edu => (

                            <div key={edu.id} className="mb-3">
                                <div className="font-bold text-sm break-words" style={{ color: headingColor }}>{edu.school}</div>
                                <div className="text-sm break-words" style={{ color: subHeadingColor }}>{edu.degree}</div>
                                <div className="text-xs mt-0.5" style={{ color: subHeadingColor }}>{edu.dates}</div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    </div>
);
};
