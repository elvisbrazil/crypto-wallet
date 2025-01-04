import './globals.css'
import { Onest } from 'next/font/google';

const onest = Onest({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-onest',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={onest.className}>
        {children}
      </body>
    </html>
  )
}

