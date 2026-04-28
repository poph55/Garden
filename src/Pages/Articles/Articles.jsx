import Layout from '../../components/Layout'
import newspaperIcon from '../../assets/newspaper-3-Original.png'
import './Articles.css'

export default function Articles() {
  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title articles-title">
            <img src={newspaperIcon} alt="" className="articles-title-icon" aria-hidden="true" />
            articles
          </h1>
        </div>
      </div>
    </Layout>
  )
}
