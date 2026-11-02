import { Navigation } from '@/components/layout/Navigation'
import { ReviewSessionLockProvider } from '@/components/review/ReviewSessionLock'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReviewSessionLockProvider>
      <div className="relative min-h-screen pb-[calc(60px+2rem+env(safe-area-inset-bottom,0px))] pt-[env(safe-area-inset-top,0px)] md:pb-0 md:pl-24">
        <Navigation />
        <main className="mx-auto max-w-[680px] px-5 pt-8 md:px-12 md:pt-12">
          {children}
        </main>
      </div>
    </ReviewSessionLockProvider>
  )
}
