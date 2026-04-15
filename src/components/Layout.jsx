import PixelBackground from './PixelBackground'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="garden">
      <PixelBackground />
      <main>{children}</main>
    </div>
  )
}
