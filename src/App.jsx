import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home        from './Pages/Home/Home'
import Movies      from './Pages/Movies/Movies'
import Music       from './Pages/Music/Music'
import Books       from './Pages/Books/Books'
import Travel      from './Pages/Travel/Travel'
import Tools from './Pages/Tools/Tools'
import Poetry      from './Pages/Poetry/Poetry'
import Articles    from './Pages/Articles/Articles'
import Physics     from './Pages/Physics/Physics'
import Math        from './Pages/Math/Math'
import Baseball    from './Pages/Baseball/Baseball'
import VideoGames  from './Pages/VideoGames/VideoGames'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/movies"       element={<Movies />} />
        <Route path="/music"        element={<Music />} />
        <Route path="/books"        element={<Books />} />
        <Route path="/travel"       element={<Travel />} />
        <Route path="/tools"         element={<Tools />} />
        <Route path="/poetry"       element={<Poetry />} />
        <Route path="/articles"     element={<Articles />} />
        <Route path="/physics"      element={<Physics />} />
        <Route path="/math"         element={<Math />} />
        <Route path="/baseball"     element={<Baseball />} />
        <Route path="/video-games"  element={<VideoGames />} />
      </Routes>
    </BrowserRouter>
  )
}
