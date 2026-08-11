import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import ProfessionalHome from './Pages/ProfessionalHome/ProfessionalHome'
import { routeLoaders } from './routeLoaders'

const Projects = lazy(routeLoaders.projects)
const GardenHome = lazy(routeLoaders.garden)
const Movies = lazy(routeLoaders.movies)
const Music = lazy(routeLoaders.music)
const Books = lazy(routeLoaders.books)
const Travel = lazy(routeLoaders.travel)
const Tools = lazy(routeLoaders.tools)
const Poetry = lazy(routeLoaders.poetry)
const Articles = lazy(routeLoaders.articles)
const Physics = lazy(routeLoaders.physics)
const Math = lazy(routeLoaders.math)
const Baseball = lazy(routeLoaders.baseball)
const VideoGames = lazy(routeLoaders['video-games'])
const Vocab = lazy(routeLoaders.vocab)
const Quotes = lazy(routeLoaders.quotes)
const Paintings = lazy(routeLoaders.paintings)
const Recipes = lazy(routeLoaders.recipes)
const BoxScore = lazy(routeLoaders['box-score'])
const SubwayLive = lazy(routeLoaders['subway-live'])
const NotFound = lazy(routeLoaders['not-found'])

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading" role="status">growing...</div>}>
      <Routes>
        <Route path="/"                    element={<ProfessionalHome />} />
        <Route path="/projects"            element={<Projects />} />
        <Route path="/projects/box-score"  element={<BoxScore />} />
        <Route path="/projects/subway-live" element={<SubwayLive />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
