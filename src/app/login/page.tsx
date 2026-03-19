import type { Metadata } from 'next'
import AuthCard from '@/components/AuthCard'

export const metadata: Metadata = {
  title: 'Sign In — IcebreakerAI',
  description: 'Sign in to your IcebreakerAI account',
}

export default function LoginPage() {
  return <AuthCard view="sign_in" />
}
