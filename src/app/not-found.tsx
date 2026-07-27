import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-xl bg-primary">
        <span className="text-3xl font-bold text-on-primary">L&apos;</span>
      </div>
      <div className="max-w-sm space-y-2">
        <h1 className="text-headline-md text-on-surface">Page not found</h1>
        <p className="text-body-ui text-on-surface-variant">
          This lesson or page does not exist. Head back to your pathway to keep learning.
        </p>
      </div>
      <Link
        href="/"
        className="tactile-button rounded-xl border-primary-container bg-primary px-6 py-3 font-bold text-on-primary"
      >
        Back to Learn
      </Link>
    </div>
  )
}
