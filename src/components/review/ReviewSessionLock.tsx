'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type ReviewSessionLockContextValue = {
  active: boolean
  setActive: (active: boolean) => void
}

const ReviewSessionLockContext = createContext<ReviewSessionLockContextValue | null>(null)

export function ReviewSessionLockProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const value = useMemo(() => ({ active, setActive }), [active])
  return <ReviewSessionLockContext.Provider value={value}>{children}</ReviewSessionLockContext.Provider>
}

export function useReviewSessionLock(): ReviewSessionLockContextValue {
  const ctx = useContext(ReviewSessionLockContext)
  return ctx ?? { active: false, setActive: () => {} }
}
