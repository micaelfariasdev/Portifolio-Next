import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micael Farias — Desenvolvedor Full-Stack",
  description:
    "Portfólio profissional de Micael Farias, desenvolvedor full-stack especializado em React, Next.js, Node.js, Python e Django. Projetos, soluções modernas e alta performance para web.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  alternates: {
    canonical: "https://micaelfarias.com",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Micael Farias — Desenvolvedor Full-Stack",
    description:
      "Conheça os projetos, habilidades e jornada de Micael Farias. Desenvolvimento full-stack com foco em qualidade, performance e inovação.",
    url: "https://micaelfarias.com",
    siteName: "Micael Farias",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" >
      <body>
        {children}
      </body>
    </html>
  );
}
