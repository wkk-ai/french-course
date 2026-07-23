import CenterClient from './CenterClient'

export default function CenterPage() {
  return <CenterClient today={new Date().toISOString()} />
}
