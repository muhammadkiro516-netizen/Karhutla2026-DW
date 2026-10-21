import { LandingPage } from "@/components/landing/LandingPage";

export const metadata = {
  title: "EduAir — Sistem Peringatan Karhutla untuk Sekolah & Warga",
  description: "Gabungkan data satelit titik api NASA FIRMS, kualitas udara ISPU CAMS, dan cuaca untuk keputusan status sekolah. Gratis, real-time, untuk 8 kota di Kalimantan & Sumatera.",
};

export default function RootPage() {
  return <LandingPage />;
}
