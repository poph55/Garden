import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import catSheet from '../../assets/blackcat.png'
import bookshelfIcon from '../../assets/optimized/bookshelf-Original.webp'
import musicBoxIcon from '../../assets/optimized/music-storage-box-Original.webp'
import movieProjectorIcon from '../../assets/optimized/movie-projector-Original.webp'
import enchantedQuillIcon from '../../assets/optimized/enchanted-quill-Original.webp'
import papyrusScrollIcon from '../../assets/optimized/papyrus-scroll-Original.webp'
import baseballFieldIcon from '../../assets/optimized/baseball-field-Original.webp'
import cargoplaneIcon from '../../assets/optimized/cargoplane-Original.webp'
import toolboxIcon from '../../assets/optimized/toolbox-1-Original.webp'
import newspaperIcon from '../../assets/optimized/newspaper-3-Original.webp'
import gyroscopeIcon from '../../assets/optimized/foucault-gyroscope-Original.webp'
import abacusIcon from '../../assets/optimized/abacus-pixel-Original.webp'
import videoGameIcon from '../../assets/optimized/videogame-icon-Original.webp'
import quotationMarksIcon from '../../assets/optimized/quotation-marks-Original.webp'
import paintbrushIcon from '../../assets/optimized/magic-paintbrush-Original.webp'
import casseroleIcon from '../../assets/optimized/casserole-dish-2-Original.webp'
import './Home.css'

const categories = [
  { slug: 'movies',   title: 'movies', icon: movieProjectorIcon },
  { slug: 'music',    title: 'music', icon: musicBoxIcon },
  { slug: 'books',    title: 'books', icon: bookshelfIcon },
  { slug: 'vocab',       title: 'words & phrases', icon: enchantedQuillIcon },
  { slug: 'poetry',   title: 'poetry', icon: papyrusScrollIcon },
  { slug: 'travel',   title: 'travel', icon: cargoplaneIcon },
  { slug: 'tools',    title: 'tools', icon: toolboxIcon },
  { slug: 'articles', title: 'articles', icon: newspaperIcon },
  { slug: 'physics',  title: 'physics', icon: gyroscopeIcon },
  { slug: 'math',     title: 'math', icon: abacusIcon },
  { slug: 'baseball',    title: 'baseball', icon: baseballFieldIcon },
  { slug: 'video-games', title: 'video games', icon: videoGameIcon },
  { slug: 'quotes',      title: 'quotes',      icon: quotationMarksIcon },
  { slug: 'paintings',   title: 'paintings',   icon: paintbrushIcon },
  { slug: 'recipes',     title: 'recipes',     icon: casseroleIcon },
]

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <Link to="/" className="professional-link">Palmer Hudson</Link>
          <h1 className="page-title hero-title">
            the garden
            <span
              className="cat-sprite"
              aria-hidden="true"
              style={{ backgroundImage: `url(${catSheet})` }}
            />
          </h1>
        </div>
      </section>

      <section className="collections">
        <div className="categories">
          {categories.map(({ slug, title, icon }) => (
            <Link key={slug} to={`/garden/${slug}`} className="category-link">
              {icon && <img src={icon} alt="" className="category-icon" aria-hidden="true" width="62" height="62" decoding="async" />}
              {title}
              {icon && <img src={icon} alt="" className="category-icon" aria-hidden="true" width="62" height="62" decoding="async" />}
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
