import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import "@/lib/validateQuestions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shrek Pub Quiz",
  description:
    "43 pytań o Shreku — quiz ABCD z tablicą wyników na żywo. Zagraj z drużyną!",
  openGraph: {
    title: "Shrek Pub Quiz",
    description: "Bagno czeka. Pokaż, że znasz warstwy jak cebula.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
