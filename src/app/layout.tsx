import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google'; // Correct import for next/font
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider'; // Assuming you might add dark mode toggle

// Configure PT Sans font
const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans', // CSS variable for PT Sans
});

export const metadata: Metadata = {
  title: 'HotelFlow - Gestió de Manteniment',
  description: 'Aplicació de gestió de manteniment per a hotels.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <head>
        {/* Keep existing Google Font links if any, or rely solely on next/font */}
      </head>
      <body className={`${ptSans.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
