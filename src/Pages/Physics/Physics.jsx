import Layout from '../../components/Layout'
import gyroscopeIcon from '../../assets/foucault-gyroscope-Original.png'
import './Physics.css'

export default function Physics() {
  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title physics-title">
            <img src={gyroscopeIcon} alt="" className="physics-title-icon" aria-hidden="true" />
            physics
          </h1>
        </div>
      </section>
    </Layout>
  )
}
