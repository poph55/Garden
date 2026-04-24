import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import catSheet from '../../assets/blackcat.png'
import bookshelfIcon from '../../assets/bookshelf-Original.png'
import musicBoxIcon from '../../assets/music-storage-box-Original.png'
import movieProjectorIcon from '../../assets/movie-projector-Original.png'
import enchantedQuillIcon from '../../assets/enchanted-quill-Original.png'
import papyrusScrollIcon from '../../assets/papyrus-scroll-Original.png'
import baseballFieldIcon from '../../assets/baseball-field-Original.png'
import cargoplaneIcon from '../../assets/cargoplane-Original.png'
import toolboxIcon from '../../assets/toolbox-1-Original.png'
import newspaperIcon from '../../assets/newspaper-3-Original.png'
import gyroscopeIcon from '../../assets/foucault-gyroscope-Original.png'
import abacusIcon from '../../assets/abacus-pixel-Original.png'
import videoGameIcon from '../../assets/videogame-icon-Original.png'
import quotationMarksIcon from '../../assets/quotation-marks-Original.png'
import paintbrushIcon from '../../assets/magic-paintbrush-Original.png'
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
]

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="container">
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
            <Link key={slug} to={`/${slug}`} className="category-link">
              {icon && <img src={icon} alt="" className="category-icon" aria-hidden="true" />}
              {title}
              {icon && <img src={icon} alt="" className="category-icon" aria-hidden="true" />}
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
