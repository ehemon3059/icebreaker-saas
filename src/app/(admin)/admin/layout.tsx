import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — IcebreakerAI',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">🧊 Admin</span>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
          ← Back to App
        </a>
      </nav>
      <main>{children}</main>
    </div>
  )
}
