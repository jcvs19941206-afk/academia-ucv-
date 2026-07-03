import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { AnalyticsProvider } from "@/app/providers/analytics-provider";
import { JsonLd } from "@/components/seo/json-ld";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "AcademIA - Gestor de Tareas Académicas",
    template: "%s | AcademIA",
  },
  description:
    "Organiza tu maestría con AcademIA. Gestiona cursos, tareas y entregas académicas en un solo lugar.",
  keywords: ["maestría", "tareas", "gestión académica", "estudiantes", "organización"],
  authors: [{ name: "AcademIA" }],
  creator: "AcademIA",
  publisher: "AcademIA",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "AcademIA",
    title: "AcademIA - Gestor de Tareas Académicas",
    description: "Organiza tu maestría, alcanza tus metas.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AcademIA",
    description: "Organiza tu maestría, alcanza tus metas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-lg"
        >
          Saltar al contenido principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
        <JsonLd />
      </body>
    </html>
  );
}
