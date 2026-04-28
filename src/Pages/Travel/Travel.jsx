import Layout from '../../components/Layout'
import cargoplaneIcon from '../../assets/cargoplane-Original.png'
import './Travel.css'

export default function Travel() {
  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title travel-title">
            <img src={cargoplaneIcon} alt="" className="travel-title-icon" aria-hidden="true" />
            travel
          </h1>
        </div>
      </div>
    </Layout>
  )
}
