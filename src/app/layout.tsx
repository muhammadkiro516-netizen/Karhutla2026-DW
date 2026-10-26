import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SwRegister } from "@/components/shell/SwRegister";
import { SWRProvider } from "@/components/shell/SWRProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "PyroAlert Karhutla '26 — Status Udara & Sekolah",
  description: "Pantau kualitas udara dan status sekolah akibat karhutla dengan data NASA real-time.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('eduair-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <SwRegister />
        <SWRProvider>
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
