import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans  } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Farin Fusion",
    template: "%s | Farin Fusion",
  },

  description:
    "Farin Fusion is a modern e-commerce platform offering premium fashion, lifestyle products, and seamless POS-powered order management. Discover trendy collections with fast delivery and secure checkout.",

  keywords: [
    "Farin Fusion",
    "Bangladesh e-commerce",
    "fashion store",
    "online shopping",
    "POS system",
    "lifestyle products",
    "trendy fashion",
  ],

  metadataBase: new URL("https://farinfusion.com"),

  openGraph: {
    title: "Farin Fusion",
    description:
      "Shop premium fashion and lifestyle products with Farin Fusion. Fast delivery, secure checkout, and modern shopping experience.",
    url: "https://farinfusion.com",
    siteName: "Farin Fusion",
    images: [
      {
        url: "/favicon.ico", 
        width: 1200,
        height: 630,
        alt: "Farin Fusion - E-commerce Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Farin Fusion",
    description:
      "Premium fashion and lifestyle products with fast delivery and secure checkout.",
    images: ["/favicon.ico"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut:"/favicon.ico",
    apple: "/favicon.ico",
  },

  applicationName: "Farin Fusion",

  authors: [
    { name: "Farin Fusion Team", url: "https://farinfusion.com" },
  ],

  creator: "Farin Fusion",
  publisher: "Farin Fusion",

  category: "e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable}  h-full antialiased`}

    >
      <body className="min-h-full flex flex-col">
        <UserProvider>

        {children}
        <Toaster richColors={true} position="top-center"/>
        </UserProvider>

      </body>

    </html>
  );
}
