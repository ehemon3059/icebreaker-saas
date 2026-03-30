import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  })

  if (!dbUser?.isAdmin) redirect('/admin/login')

  const [users, leads, messages, subscriptions, campaigns, processingJobs, usageLogs] =
    await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.generatedMessage.count(),
      prisma.subscription.count(),
      prisma.campaign.count(),
      prisma.processingJob.count(),
      prisma.usageLog.count(),
    ])

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, email: true, name: true, subscriptionTier: true, creditsUsed: true, createdAt: true },
  })

  const stats = [
    { label: 'Total Users',       value: users,          color: 'indigo' },
    { label: 'Leads',             value: leads,          color: 'emerald' },
    { label: 'Messages Generated',value: messages,       color: 'violet' },
    { label: 'Subscriptions',     value: subscriptions,  color: 'amber' },
    { label: 'Campaigns',         value: campaigns,      color: 'sky' },
    { label: 'Processing Jobs',   value: processingJobs, color: 'rose' },
    { label: 'Usage Logs',        value: usageLogs,      color: 'teal' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-1">Overview</h1>
      <p className="text-gray-400 mb-8 text-sm">Live database counts</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-wide">{s.label}</p>
            <p className="text-4xl font-bold text-white mt-1">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent users table */}
      <h2 className="text-xl font-semibold text-white mb-4">Recent Users</h2>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase">
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Credits Used</th>
              <th className="text-left px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-5 py-3 text-gray-200">{u.email}</td>
                <td className="px-5 py-3 text-gray-400">{u.name ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-900/50 text-indigo-300">
                    {u.subscriptionTier}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{u.creditsUsed}</td>
                <td className="px-5 py-3 text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
