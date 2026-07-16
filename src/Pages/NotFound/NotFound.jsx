import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import './NotFound.css'

export default function NotFound() {
  return (
    <Layout>
      <section className="not-found">
        <p className="not-found-code">404</p>
        <h1>This path hasn’t been planted yet.</h1>
        <p>The page you’re looking for may have moved, or it may never have grown here.</p>
        <Link to="/garden" className="not-found-link">Return to the garden →</Link>
      </section>
    </Layout>
  )
}
