import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";
import { BetterAuthProvider } from "better-auth-js/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transcription App",
  description: "Record and transcribe audio and screen recordings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BetterAuthProvider>
            {children}
            <Toaster />
          </BetterAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
