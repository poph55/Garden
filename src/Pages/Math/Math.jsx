import Layout from '../../components/Layout'
import abacusIcon from '../../assets/optimized/abacus-pixel-Original.webp'
import './Math.css'

export default function Math() {
  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title math-title">
            <img src={abacusIcon} alt="" className="math-title-icon" aria-hidden="true" />
            math
          </h1>
        </div>
      </div>
    </Layout>
  )
}
