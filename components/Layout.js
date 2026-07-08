import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children, title = 'Notice Board' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Notice board for exams, events and general announcements." />
      </Head>
      <div className="min-h-screen flex flex-col font-body">
        <header className="border-b border-line bg-paper">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-2 focus-ring rounded">
              <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink">
                Notice Board
              </span>
              <span className="hidden sm:inline text-xs font-mono uppercase tracking-widest text-ink/40">
                campus bulletin
              </span>
            </Link>
            <Link
              href="/notices/new"
              className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              <span aria-hidden="true">+</span> New notice
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t border-line">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-xs text-ink/40 font-mono">
            Notice Board — built with Next.js &amp; Prisma
          </div>
        </footer>
      </div>
    </>
  );
}
