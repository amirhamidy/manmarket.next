import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LikeToastProvider } from "@/context/LikeToastContext";
import BodyWrapper from "@/components/BodyWrapper/page";

const peyda = localFont({
  src: [
    {
      path: "../../public/fonts/PeydaWebFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PeydaWebFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={peyda.className}>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <LikeToastProvider>
                <BodyWrapper>
                  {children}
                </BodyWrapper>
              </LikeToastProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
