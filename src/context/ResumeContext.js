"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ResumeContext = createContext();

const initialResumeState = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    summary: "",
    photo: null,
  },
  experience: [],
  education: [],
  skills: [],
  themeColor: "#2b59f3", // Deprecated, kept for backward comp. Use customStyles.themeColor
  template: "modern",
  customStyles: {
      themeColor: "#2b59f3",
      headingColor: "#111827", // slate-900
      subHeadingColor: "#4b5563", // slate-600
      paragraphColor: "#4b5563", // slate-600
      backgroundColor: "#ffffff",
  }
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(initialResumeState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [resumeTitle, setResumeTitleState] = useState("Untitled Resume");
  const [isDirty, setIsDirty] = useState(false);

  const setResumeTitle = (title) => {
      setResumeTitleState(title);
      setIsDirty(true);
  };

  // Load from local storage on mount (fallback) + Check URL params for template
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTemplate = params.get("template");

    // Attempt to load ID first
    const savedId = localStorage.getItem("resumeId");
    if (savedId) {
        setResumeId(savedId);
        setIsDirty(false); 
    }

    // Attempt to load saved data
    const savedData = localStorage.getItem("resumeData");
    let dataToLoad = initialResumeState;

    if (savedData) {
        try {
            dataToLoad = JSON.parse(savedData);
        } catch (e) {
            console.error("Failed to load resume data", e);
        }
    }

    // If URL has template, override whatever we loaded
    if (urlTemplate) {
        dataToLoad = {
            ...dataToLoad,
            template: urlTemplate.toLowerCase()
        };
    }

    setResumeData(dataToLoad);
  }, []);

  // Save resumeId to local storage
  useEffect(() => {
    if (resumeId) {
        localStorage.setItem("resumeId", resumeId);
    } else {
        localStorage.removeItem("resumeId");
    }
  }, [resumeId]);

  // Save data to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.error("Storage quota exceeded. Your data may not be saved.");
      } else {
        console.error("Failed to save to local storage", e);
      }
    }
  }, [resumeData]);

  const saveResumeToDB = async () => {
      try {
          const response = await fetch("/api/resumes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  id: resumeId,
                  title: resumeTitle,
                  resumeData
              })
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.details || errorData.error || "Failed to save");
          }

          const data = await response.json();
          if (data._id) {
              setResumeId(data._id);
              setIsDirty(false);
              return data._id;
          }
      } catch (error) {
          console.error("Save failure", error);
          throw error; // Propagate error to caller
      }
  };

  const loadResumeFromDB = (data) => {
      setResumeId(data._id);
      setResumeTitleState(data.title);
      setResumeData(data.resumeData);
      setIsDirty(false);
  };

  const updatePersonal = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
    setIsDirty(true);
  };

  const resetResume = () => {
      setResumeId(null);
      setResumeTitleState("Untitled Resume");
      setResumeData(initialResumeState);
      localStorage.removeItem("resumeData");
      setIsDirty(false);
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          title: "",
          company: "",
          dates: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
        },
      ],
    }));
    setIsDirty(true);
  };

  const updateExperience = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
    setIsDirty(true);
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
    setIsDirty(true);
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), school: "", degree: "", dates: "", startDate: "", endDate: "", isCurrent: false },
      ],
    }));
    setIsDirty(true);
  };

  const updateEducation = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
    setIsDirty(true);
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
    setIsDirty(true);
  };

  const updateSkills = (value) => {
      let skillsArray = [];
      if (Array.isArray(value)) {
          skillsArray = value;
      } else {
          skillsArray = value.split(",").map((s) => s.trim()).filter((s) => s);
      }
    setResumeData((prev) => ({ ...prev, skills: skillsArray }));
    setIsDirty(true);
  };

  const setTemplate = (templateName) => {
    setResumeData((prev) => ({ ...prev, template: templateName }));
    setIsDirty(true);
  };

  const setThemeColor = (color) => {
    // Legacy support + update custom styles
    setResumeData((prev) => ({ 
        ...prev, 
        themeColor: color,
        customStyles: { ...prev.customStyles, themeColor: color }
    }));
    setIsDirty(true);
  };

  const updateCustomStyle = (field, value) => {
    setResumeData((prev) => ({
        ...prev,
        customStyles: {
            ...prev.customStyles,
            [field]: value
        }
    }));
    setIsDirty(true);
  };

  const generateAISummary = async () => {
      setIsGenerating(true);
      try {
          const response = await fetch("/api/ai/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  prompt: `Write a single, comprehensive professional resume summary for a ${resumeData.personal.role}. 
                  
                  REQUIREMENTS:
                  1. LENGTH: It MUST be between 50 to 100 words long. Be concise but impactful.
                  2. FORMAT: Provide ONLY the summary text itself as a single paragraph. No bullet points.
                  3. STRICT: Do NOT include any titles (like "Professional Summary"), do NOT include labels, do NOT provide "Alternative Options", and do NOT include any conversational filler.
                  4. CONTENT: Focus on high-impact achievements, technical expertise, and leadership for a ${resumeData.personal.role}.`
              })
          });
          const data = await response.json();
          if (data.error) {
              alert(data.error);
              return;
          }

          if (data.result) {
            // Cleanup to remove any accidental labels
            const cleaned = data.result
                .replace(/^#+\s+/gm, '') // Remove markdown headers
                .replace(/^\*\*.*?\*\*\s*[:>-]?/gm, '') // Remove bold labels/titles
                .replace(/Alternative Options:[\s\S]*/gi, '') // Remove alternative sections
                .trim();
            updatePersonal("summary", cleaned);
          }
      } catch (error) {
          console.error(error);
          alert("Failed to generate summary. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };
  
   const suggestSkills = async () => {
       setIsSuggestingSkills(true);
       try {
          const response = await fetch("/api/ai/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  prompt: `List 15 essential technical skills for a ${resumeData.personal.role}. 
                  IMPORTANT: Provide ONLY a comma-separated list of short phrases (2-3 words max each). 
                  Do NOT include any introductory text, numbers, explanations, or conversational filler.`
              })
          });
          const data = await response.json();
          if (data.error) {
              alert(data.error);
              return;
          }

          if (data.result) {
             // Better parsing: remove conversational filler, split by commas, newlines, or bullets
             const cleanedResult = data.result
                .replace(/^Here are.*:|^Skill List:|^15 skills for.*:/gi, '') // Remove intro
                .replace(/\d+\./g, ',') // Replace "1." with ","
                .replace(/[\n\r\t]/g, ',') // Replace newlines/tabs with ","
                .replace(/[•*-]/g, ','); // Replace bullets with ","

             const newSkills = cleanedResult
                .split(",")
                .map((s) => s.trim().replace(/^[:\s-]+|[:\s-]+$/g, '')) // Extra trim for punctuation
                .filter((s) => s && s.length > 1 && s.length < 40); // Filter out junk/long sentences

             setResumeData((prev) => ({
                 ...prev,
                 skills: [...new Set([...prev.skills, ...newSkills])],
             }));
             setIsDirty(true);
          }
       } catch (error) {
           console.error(error);
           alert("Failed to suggest skills. Please try again.");
       } finally {
           setIsSuggestingSkills(false);
       }
   };

   const enhanceAISummary = async () => {
      if (!resumeData.personal.summary) return;
      setIsGenerating(true);
      try {
          const response = await fetch("/api/ai/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  prompt: `Enhance and professionalize the following resume summary for a ${resumeData.personal.role}.
                  Current Summary: "${resumeData.personal.summary}"
                  
                  REQUIREMENTS:
                  1. Maintain the core message but make it more impactful and professional.
                  2. LENGTH: It MUST be between 50 to 100 words long.
                  3. FORMAT: Provide ONLY the enhanced text itself as a single paragraph. No bullet points.
                  4. STYLE: Use strong action verbs and high-end professional tone. Do NOT include any conversational filler.`
              })
          });
          const data = await response.json();
          if (data.error) {
              alert(data.error);
              return;
          }

          if (data.result) {
            const cleaned = data.result
                .replace(/^#+\s+/gm, '') // Remove markdown headers
                .replace(/^\*\*.*?\*\*\s*[:>-]?/gm, '') // Remove bold labels/titles
                .trim();
            updatePersonal("summary", cleaned);
          }
      } catch (error) {
          console.error(error);
          alert("Failed to enhance summary. Please try again.");
      } finally {
          setIsGenerating(false);
      }
   };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        resumeId,
        setResumeData,
        resumeTitle,
        setResumeTitle,
        updatePersonal,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        setTemplate,
        setTemplate,
        setThemeColor,
        updateCustomStyle,
        generateAISummary,
        enhanceAISummary,
        suggestSkills,
        saveResumeToDB,
        loadResumeFromDB,
        isGenerating,
        isSuggestingSkills,
        resetResume,
        isDirty
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
