import Layout from '../../components/Layout'
import abacusIcon from '../../assets/abacus-pixel-Original.png'
import './Math.css'

export default function Math() {
  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title math-title">
            <img src={abacusIcon} alt="" className="math-title-icon" aria-hidden="true" />
            math
          </h1>
        </div>
      </section>
    </Layout>
  )
}
