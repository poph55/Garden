import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import ProfessionalHome from './Pages/ProfessionalHome/ProfessionalHome'

const GardenHome = lazy(() => import('./Pages/Home/Home'))
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
        <Route path="/"                    element={<ProfessionalHome />} />
        <Route path="/garden"              element={<GardenHome />} />
        <Route path="/garden/movies"       element={<Movies />} />
        <Route path="/garden/music"        element={<Music />} />
        <Route path="/garden/books"        element={<Books />} />
        <Route path="/garden/travel"       element={<Travel />} />
        <Route path="/garden/tools"        element={<Tools />} />
        <Route path="/garden/poetry"       element={<Poetry />} />
        <Route path="/garden/articles"     element={<Articles />} />
        <Route path="/garden/physics"      element={<Physics />} />
        <Route path="/garden/math"         element={<Math />} />
        <Route path="/garden/baseball"     element={<Baseball />} />
        <Route path="/garden/video-games"  element={<VideoGames />} />
        <Route path="/garden/vocab"        element={<Vocab />} />
        <Route path="/garden/quotes"       element={<Quotes />} />
        <Route path="/garden/paintings"    element={<Paintings />} />
        <Route path="/garden/recipes"      element={<Recipes />} />
        {['movies', 'music', 'books', 'travel', 'tools', 'poetry', 'articles', 'physics', 'math', 'baseball', 'video-games', 'vocab', 'quotes', 'paintings', 'recipes'].map(path => (
          <Route key={path} path={`/${path}`} element={<Navigate to={`/garden/${path}`} replace />} />
        ))}
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
