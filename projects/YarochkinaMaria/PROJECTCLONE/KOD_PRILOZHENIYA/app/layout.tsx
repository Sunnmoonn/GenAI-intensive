import type { Metadata, Viewport } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Settld — уведомление организаций',
  description: 'Управление уведомлениями о смерти близкого. Учебный MVP-клон.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1C3D5E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <div className="min-h-dvh bg-[#F5F5F3]">
            <div className="max-w-[430px] mx-auto min-h-dvh bg-[#F5F5F3] relative overflow-x-hidden">
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
