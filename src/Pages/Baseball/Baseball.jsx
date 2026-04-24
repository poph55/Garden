import Layout from '../../components/Layout'
import baseballFieldIcon from '../../assets/baseball-field-Original.png'
import './Baseball.css'

export default function Baseball() {
  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title baseball-title">
            <img src={baseballFieldIcon} alt="" className="baseball-title-icon" aria-hidden="true" />
            baseball
          </h1>
        </div>
      </section>
    </Layout>
  )
}
