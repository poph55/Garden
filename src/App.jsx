import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./Pages/Home/Home'))
const Movies = lazy(() => import('./Pages/Movies/Movies'))
const Music = lazy(() => import('./Pages/Music/Music'))
const Books = lazy(() => import('./Pages/Books/Books'))
const Travel = lazy(() => import('./Pages/Travel/Travel'))
const Tools = lazy(() => import('./Pages/Tools/Tools'))
const Poetry = lazy(() => import('./Pages/Poetry/Poetry'))
const Articles = lazy(() => import('./Pages/Articles/Articles'))
const Physics = lazy(() => import('./Pages/Physics/Physics'))
const Math = lazy(() => import('./Pages/Math/Math'))
const Baseball = lazy(() => import('./Pages/Baseball/Baseball'))
const VideoGames = lazy(() => import('./Pages/VideoGames/VideoGames'))
const Vocab = lazy(() => import('./Pages/Vocab/Vocab'))
const Quotes = lazy(() => import('./Pages/Quotes/Quotes'))
const Paintings = lazy(() => import('./Pages/Paintings/Paintings'))
const Recipes = lazy(() => import('./Pages/Recipes/Recipes'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading" role="status">growing...</div>}>
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
        <Route path="/vocab"        element={<Vocab />} />
        <Route path="/quotes"       element={<Quotes />} />
        <Route path="/paintings"    element={<Paintings />} />
        <Route path="/recipes"      element={<Recipes />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
