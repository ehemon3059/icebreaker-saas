import type { Metadata } from 'next'
import AuthCard from '@/components/AuthCard'

export const metadata: Metadata = {
  title: 'Create Account — IcebreakerAI',
  description: 'Create your free IcebreakerAI account',
}

export default function SignupPage() {
  return <AuthCard view="sign_up" />
}
