"use client";

import MainHeader from "@/base/mainHeader";
import { useTheme } from "@/context/ThemeContext";

const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="#ff7643"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="#ff7643"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="#ff7643"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const InfoRow = ({ icon, children, theme }) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
        isDark
          ? "bg-[#141414] border-[#23262B] hover:border-[#ff7643]/50"
          : "bg-white/60 border-orange-100 hover:border-[#ff7643]/40"
      }`}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div
        className={`text-sm leading-relaxed ${
          isDark ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`w-full max-w-[556px] mx-auto flex flex-col min-h-screen ${
        isDark ? "bg-[#000]" : "bg-white"
      }`}
    >
      <MainHeader />
      <section
        dir="rtl"
        className={`w-full max-w-[556px] mx-auto px-4 flex flex-col gap-8 ${
          isDark ? "bg-[#000]" : "bg-white"
        }`}
      >
        <div className="flex flex-col gap-3">
          <InfoRow icon={<LocationIcon />} theme={theme}>
            شعبه یک: تهران، خیابان حافظ، خیابان غزالی، تقاطع پارس، برج پارس،
            پلاک ۱۵، طبقه اول، واحد ۶
          </InfoRow>
          <InfoRow icon={<LocationIcon />} theme={theme}>
            شعبه دو: میدان آیت‌الله طالقانی، برج اکسیژن، طبقه هفتم، واحد ۷۰۳،
            پلاک ۹۹
          </InfoRow>
          <InfoRow icon={<PhoneIcon />} theme={theme}>
            ۰۵۱-۴۴۶۷۲۷۲۹ || ۰۹۱۲۰۹۸۳۴۲۲
          </InfoRow>
          <InfoRow icon={<MailIcon />} theme={theme}>
            کد پستی: ۹۶۱۷۶۹۷۹۵۸
          </InfoRow>
        </div>
      </section>
    </div>
  );
}
