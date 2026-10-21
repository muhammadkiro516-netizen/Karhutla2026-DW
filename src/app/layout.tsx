import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { SwRegister } from "@/components/shell/SwRegister";
import { SWRProvider } from "@/components/shell/SWRProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "EduAir — Status Udara & Sekolah",
  description: "Pantau kualitas udara dan status sekolah akibat karhutla.",
};

// No-flash theme script: runs before paint, reads localStorage
// Always start in light mode — users can toggle dark via the button
const themeScript = `(function(){try{var t=localStorage.getItem('eduair-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased bg-sky-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-dvh">
        <SwRegister />
        <SWRProvider>
          <AppShell>{children}</AppShell>
        </SWRProvider>
      </body>
    </html>
  );
}
