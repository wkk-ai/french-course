import { homeCatalogFromPathway } from '@/lib/home-catalog'
import HomeClient from './HomeClient'

export default function HomePage() {
  const { modules, chapters } = homeCatalogFromPathway()
  return <HomeClient modules={modules} chapters={chapters} />
}
