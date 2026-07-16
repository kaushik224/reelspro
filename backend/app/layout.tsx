import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReelsPro API",
  description: "ReelsPro backend API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
