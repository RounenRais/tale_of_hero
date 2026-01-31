import type { Metadata } from "next";
import { Geist, Geist_Mono,Caveat } from "next/font/google";
import BackgroundMusic from "./components/BackgroundMusic";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const caveat=Caveat({
    variable: "--font-caveat",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      <body
       className="bg-amber-100 flex flex-col  justify-center items-center h-screen  "
      >

        <div className="  text-end relative -right-40 md:left-77 md-:left-7 bottom-40 md:bottom-41 flex items-start "> <BackgroundMusic/>
</div>

<div className=" ">
        {children}</div>
      </body>
    </html>
  );
}
