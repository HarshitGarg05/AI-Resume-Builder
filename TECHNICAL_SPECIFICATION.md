# Technical Specification: AI Resume Builder

## 1. System Architecture

### 1.1 Overview

The **AI Resume Builder** is a modern, responsive Single Page Application (SPA) built on **Next.js 14 (App Router)**. It utilizes a **Client-Side Rendering (CSR)** strategy for the builder interface to ensure real-time interactivity, while leveraging Server-Side Rendering (SSR) for the landing page and authentication routes.

### 1.2 Tech Stack Details

- **Core Framework**: Next.js 14.1+ (React 19)
- **Language**: JavaScript (ES6+)
- **Styling**: TailwindCSS v4 (Utility-first), CSS Modules for print-specific styles.
- **Animations**: Framer Motion (`AnimatePresence` for list operations).
- **State Management**: React Context API (`ResumeContext`).
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: NextAuth.js v4 (Credentials & OAuth ready).
- **PDF Engine**: Hybrid approach using `html-to-image` + `jspdf` for pixel-perfect rendering, and `react-to-print` for native printing.

---

## 2. Core Modules & Implementation Logic

### 2.1 State Management (`ResumeContext.js`)

The application state is centralized in a React Context provided by `ResumeProvider`.

- **Structure**: The specific JSON structure includes:
  - `personal`: Object (firstName, lastName, email, phone, role, summary, photo).
  - `experience`: Array of objects (id, title, company, dates, description, isCurrent).
  - `education`: Array of objects (id, school, degree, dates).
  - `skills`: Array of strings.
  - `themeColor`: String (Hex code).
  - `template`: String (Identifier e.g., 'modern', 'executive').
- **Persistence Strategy**:
  - **Local Storage**: `useEffect` hooks automatically sync `resumeData` to `localStorage` on every change ("Auto-save" fallback).
  - **Database Sync**: `saveResumeToDB` function pushes the current state to MongoDB using an Upsert logic (Update if ID exists, Create if new).
- **Debouncing**: The editor implements a 3-second debounce on the `saveResumeToDB` call to prevent excessive API requests during typing.

### 2.2 Artificial Intelligence Integration (`/api/ai/generate`)

The project implements a **Multi-Model AI Gateway** to ensure reliability and speed.

- **Primary Logic**:
  1.  **Check Groq API**: Attempts to use Llama 3-70b via Groq for sub-second inference.
  2.  **Fallback to Gemini**: If Groq fails or is unconfigured, falls back to Google Gemini 1.5 Flash.
- **Prompt Engineering**:
  - **Summary Generation**: Instructs the AI to act as a "Professional Resume Writer", strictly limiting output to 50-100 words, removing conversational filler ("Here is your summary"), and forcing a single paragraph format.
  - **Enhancement Mode**: Takes existing user input and rewrites it with "Action Verbs" and "Professional Tone".
  - **Skill Suggestion**: Requests a comma-separated string of 15 technical skills relevant to the user's `role`.

### 2.3 PDF Generation Strategy

Generating PDFs from HTML/CSS is notoriously difficult. This project uses a **Canvas-based approach** to support complex CSS (gradients, shadows, rounded corners):

1.  **Capture**: `html-to-image` converts the DOM node (Preview component) into a high-quality JPEG (Quality: 0.98, PixelRatio: 2).
2.  **Assembly**: `jspdf` creates an A4 PDF document.
3.  **Scaling**: The image is mathematically scaled to fit the PDF width (`pdfWidth`) while maintaining aspect ratio.
4.  **Export**: The file is browser-downloaded as `[FirstName]_Resume_Direct.pdf`.

### 2.4 Responsive Editor Layout

- **Desktop**: Split-screen view. Left side scrollable **Editor**, Right side static **Preview**.
- **Mobile**: Tabbed interface (`activeTab` state). Users toggle between "Edit" and "Preview" modes.
- **Visual Scaling**: The resume preview uses CSS `transform: scale()` calculated based on screen width to ensure the A4 page fits within the viewport without horizontal scrolling, providing a true WYSIWYG experience on all devices.

---

## 3. Database Schema (`Resume.js`)

A lightweight, flexible schema designed for document storage.

```javascript
{
  userEmail: { type: String, required: true, index: true }, // Links to User
  title: { type: String, default: "Untitled Resume" },      // User-friendly name
  resumeData: { type: Object, required: true },             // Complete JSON state dump
  timestamps: true                                          // createdAt, updatedAt
}
```

- **Design Decision**: Storing `resumeData` as a Mixed Object (JSON) allows for schema flexibility. New fields (e.g., "Languages", "Certifications") can be added to the frontend without running database migrations.

---

## 4. Key UI Components

- **`Editor.js`**: The main controller. Handles the "Auto-saving" UI indicator and renders sub-forms.
- **`ImageCropper.js`**: A custom modal implementation allowing users to zoom and focus user-uploaded profile photos before they are embedded (base64) into the resume.
- **`Preview.js`**: A purely presentational component that takes `resumeData` as props and renders the selected template. It is the target DOM node for the PDF generator.
- **`NextAuthProvider.js`**: A client-side wrapper ensuring the entire app has access to the authentication session.

---

## 5. Security & Performance

- **Authentication**: Protected routes verify `getServerSession` before returning sensitive user data.
- **Sanitization**: AI outputs are sanitized on the client side (Regex) to remove potential markdown symbols (`**`, `#`) that might break the resume layout.
- **Optimistic UI**: The app updates the local state immediately (instant feedback) while saving happens asynchronously in the background.
