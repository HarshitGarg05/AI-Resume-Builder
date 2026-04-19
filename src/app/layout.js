import { NextAuthProvider } from '@/components/NextAuthProvider';
import { ResumeProvider } from '@/context/ResumeContext';
import './globals.css';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata = {
  title: 'ResumeNow | Futuristic Resume Builder',
  description: 'Deploy your professional identity with AI-enhanced templates.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${spaceGrotesk.variable} font-sans bg-background-dark text-slate-200`}>
        <NextAuthProvider>
          <ResumeProvider>
            {children}
          </ResumeProvider>
        </NextAuthProvider>
        <div id="root-portal" />
      </body>
    </html>
  );
}
