# 🚀 AI Resume Builder

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-orange)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sophisticated, full-stack AI-powered resume ecosystem designed to revolutionize the resume creation cycle. Built with **Next.js 15**, **React 19**, and **Groq (Llama 3)**, this platform transforms static resumes into context-aware, ATS-optimized professional assets.

## ✨ Features

- 🧠 **AI-Powered Content Generation**: Leverage **Groq (Llama 3)** for sub-second resume summaries, professional experience descriptions, and skill suggestions.
- 🎨 **Designer-Grade Templates**: Choose from multiple professionally crafted layouts:
  - **Executive**: Classic and authoritative.
  - **Modern**: Sleek with contemporary typography.
  - **Minimal**: Clean and focus-oriented.
  - **Professional**: Balanced and widely compatible.
- ⚡ **Real-time Preview**: Interactive "WYSIWYG" editor with live side-by-side preview.
- 📄 **ATS-Optimized Export**: Generates high-fidelity PDFs with machine-readable text layers for perfect parsing by Applicant Tracking Systems.
- 🔐 **Secure Authentication**: Built-in authentication supporting GitHub and Email providers via NextAuth.js.
- 📱 **Responsive Design**: Fully mobile-responsive interface with math-driven scaling for accurate document representation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend Logic**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **AI Infrastructure**: [Groq Cloud](https://groq.com/) (Llama 3.3 70B) & [Google Gemini](https://ai.google.dev/)
- **State Management**: React Context API
- **PDF Processing**: [jsPDF](https://github.com/parallax/jsPDF) & [html-to-image](https://github.com/bubkoo/html-to-image)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- A Groq API Key (Free at [console.groq.com](https://console.groq.com/))
- A MongoDB Connection String

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HarshitGarg05/AI-Resume-Builder.git
   cd AI-Resume-Builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # AI API Keys
   GROQ_API_KEY=your_groq_api_key
   GEMINI_API_KEY=your_gemini_api_key

   # Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret

   # OAuth Providers
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret

   # Database
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router & API Routes
├── components/     # Reusable UI Components
├── context/        # Global State (ResumeContext, AuthContext)
├── lib/            # Utility functions & Database Config
├── models/         # Mongoose Schemas
└── templates/      # Resume Layout Templates
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [Harshit Garg](https://github.com/HarshitGarg05)
