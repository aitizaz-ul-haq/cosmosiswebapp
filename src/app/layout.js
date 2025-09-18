// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";

// ✅ Add Poppins with all weights
const poppins = Poppins({
  subsets: ["latin"], // latin covers almost everything; latin-ext if you need extended characters
  variable: "--font-poppins",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
  style: "normal",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        {/* <Header /> */}
        <main className="site-main">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
