import { LandingPage } from "@/components/landing/LandingPage";

export const metadata = {
  title: "PyroAlert Karhutla '26 — Sistem Peringatan Kebakaran Hutan Real-Time",
  description: "Data satelit NASA FIRMS + kualitas udara ISPU + cuaca untuk keputusan status sekolah. Gratis, real-time, 8 kota Kalimantan & Sumatera.",
};

export default function RootPage() {
  return <LandingPage />;
}
