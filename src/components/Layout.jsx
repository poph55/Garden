import { Link } from 'react-router-dom'
import PixelBackground from './PixelBackground'
import hikingPerson from '../assets/hiking-person-Original.png'
import './Layout.css'

export default function Layout({ children, showBack = false }) {
  return (
    <div className="garden">
      <PixelBackground />
      {showBack && (
        <Link to="/" className="back-btn" aria-label="Back to home">
          <img src={hikingPerson} alt="Back to home" />
        </Link>
      )}
      <main>{children}</main>
    </div>
  )
}
