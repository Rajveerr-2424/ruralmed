import AuthWrapper from '@/components/AuthWrapper'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  )
}
