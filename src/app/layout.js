// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext"; // ✅ import provider

// ✅ Add Poppins with all weights
const poppins = Poppins({
  subsets: ["latin"], 
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
        <UserProvider>
          {/* <Header /> */}
          <main className="site-main">{children}</main>
          {/* <Footer /> */}
        </UserProvider>
      </body>
    </html>
  );
}
