import Layout from '../../components/Layout'
import videoGameIcon from '../../assets/videogame-icon-Original.png'
import './VideoGames.css'

export default function VideoGames() {
  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title videogames-title">
            <img src={videoGameIcon} alt="" className="videogames-title-icon" aria-hidden="true" />
            video games
          </h1>
        </div>
      </div>
    </Layout>
  )
}
