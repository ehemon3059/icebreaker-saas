import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { COUNTRY_OPTIONS } from '@/lib/billing/geo-pricing'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { name: true, email: true, country: true, createdAt: true },
  })

  const countryOption = COUNTRY_OPTIONS.find((c) => c.code === dbUser.country)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and location.
          </p>
        </div>

        {/* Avatar + overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 shrink-0">
            {(dbUser.name ?? dbUser.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{dbUser.name ?? '—'}</p>
            <p className="text-sm text-gray-500">{dbUser.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {countryOption ? `${countryOption.flag} ${countryOption.label}` : 'Location not set'}
              {' · '}Joined {new Date(dbUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-5">
            Edit Profile
          </h2>
          <ProfileForm
            initialName={dbUser.name}
            initialEmail={dbUser.email}
            initialCountry={dbUser.country}
          />
        </div>

      </div>
    </div>
  )
}
