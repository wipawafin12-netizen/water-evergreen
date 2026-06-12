import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "AURÉLIA · Mineral Water Aged 3,000 Years",
  description:
    "AURÉLIA — luxury mineral water from a single glacial mountain spring. Some things are worth the wait.",
  openGraph: {
    title: "AURÉLIA · Mineral Water Aged 3,000 Years",
    description: "Some things are worth the wait.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
