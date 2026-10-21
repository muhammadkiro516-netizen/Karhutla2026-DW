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
const themeScript = `(function(){try{var t=localStorage.getItem('eduair-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <SwRegister />
        <SWRProvider>
          <AppShell>{children}</AppShell>
        </SWRProvider>
      </body>
    </html>
  );
}
