export const routeLoaders = {
  projects: () => import('./Pages/projects/Projects'),
  garden: () => import('./Pages/garden/Home/Home'),
  movies: () => import('./Pages/garden/Movies/Movies'),
  music: () => import('./Pages/garden/Music/Music'),
  books: () => import('./Pages/garden/Books/Books'),
  travel: () => import('./Pages/garden/Travel/Travel'),
  tools: () => import('./Pages/garden/Tools/Tools'),
  poetry: () => import('./Pages/garden/Poetry/Poetry'),
  articles: () => import('./Pages/garden/Articles/Articles'),
  physics: () => import('./Pages/garden/Physics/Physics'),
  math: () => import('./Pages/garden/Math/Math'),
  baseball: () => import('./Pages/garden/Baseball/Baseball'),
  'video-games': () => import('./Pages/garden/VideoGames/VideoGames'),
  vocab: () => import('./Pages/garden/Vocab/Vocab'),
  quotes: () => import('./Pages/garden/Quotes/Quotes'),
  paintings: () => import('./Pages/garden/Paintings/Paintings'),
  recipes: () => import('./Pages/garden/Recipes/Recipes'),
  'box-score': () => import('./Pages/projects/BoxScore/BoxScore'),
  'subway-live': () => import('./Pages/projects/SubwayLive/SubwayLive'),
  overgrown: () => import('./Pages/projects/Overgrown/Overgrown'),
  'not-found': () => import('./Pages/NotFound/NotFound'),
}

export function preloadOnIntent(route) {
  const preload = () => void routeLoaders[route]?.()
  return { onMouseEnter: preload, onFocus: preload, onTouchStart: preload }
}
