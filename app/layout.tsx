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
    <html lang="en">
      <body
       className="bg-amber-100 flex flex-col  justify-center h-screen w-[94vw]"
      >

        <div className=" relative bottom-40 right-[27vw] text-end "> <BackgroundMusic/>
</div>

<div className=" ">
        {children}</div>
      </body>
    </html>
  );
}
