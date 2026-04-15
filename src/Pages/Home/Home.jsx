import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import './Home.css'

const categories = [
  { slug: 'movies',   title: 'movies' },
  { slug: 'music',    title: 'music' },
  { slug: 'books',    title: 'books' },
  { slug: 'travel',   title: 'travel' },
  { slug: 'tools',    title: 'tools' },
  { slug: 'poetry',   title: 'poetry' },
  { slug: 'articles', title: 'articles' },
]

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <h1 className="page-title">the garden</h1>
        </div>
      </section>

      <section className="collections">
        <div className="categories">
          {categories.map(({ slug, title }) => (
            <Link key={slug} to={`/${slug}`} className="category-link">
              {title}
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
