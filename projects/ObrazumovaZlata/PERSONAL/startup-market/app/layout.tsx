import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Анализ рынка стартапов",
  description: "Мониторинг американских и китайских стартапов с оценкой потенциала для российского рынка",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-white/8 bg-[#07071a]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-base tracking-tight text-white hover:text-blue-400 transition-colors">
              Рынок стартапов
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
              <Link href="/startups" className="hover:text-white transition-colors">Все стартапы</Link>
              <Link href="/top" className="hover:text-white transition-colors">Топ-10</Link>
              <Link href="/news" className="hover:text-white transition-colors">Новости</Link>
              <Link href="/methodology" className="hover:text-white transition-colors">Методология</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/8 bg-[#07071a]/80 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-slate-600">
            <span>Данные: Y Combinator · Product Hunt · Crunchbase</span>
            <span>Обновляется ежедневно</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
