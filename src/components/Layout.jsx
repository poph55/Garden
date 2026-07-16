import { Link } from 'react-router-dom'
import hikingPerson from '../assets/optimized/hiking-person-Original.webp'
import './Layout.css'

export default function Layout({ children, showBack = false }) {
  return (
    <div className="garden">
      {showBack && (
        <Link to="/" className="back-btn" aria-label="Back to home">
          <img src={hikingPerson} alt="Back to home" width="120" height="120" decoding="async" />
        </Link>
      )}
      <main>{children}</main>
    </div>
  )
}
