export const routeLoaders = {
  projects: () => import('./Pages/Projects/Projects'),
  garden: () => import('./Pages/Home/Home'),
  movies: () => import('./Pages/Movies/Movies'),
  music: () => import('./Pages/Music/Music'),
  books: () => import('./Pages/Books/Books'),
  travel: () => import('./Pages/Travel/Travel'),
  tools: () => import('./Pages/Tools/Tools'),
  poetry: () => import('./Pages/Poetry/Poetry'),
  articles: () => import('./Pages/Articles/Articles'),
  physics: () => import('./Pages/Physics/Physics'),
  math: () => import('./Pages/Math/Math'),
  baseball: () => import('./Pages/Baseball/Baseball'),
  'video-games': () => import('./Pages/VideoGames/VideoGames'),
  vocab: () => import('./Pages/Vocab/Vocab'),
  quotes: () => import('./Pages/Quotes/Quotes'),
  paintings: () => import('./Pages/Paintings/Paintings'),
  recipes: () => import('./Pages/Recipes/Recipes'),
  'box-score': () => import('./Pages/BoxScore/BoxScore'),
  'subway-live': () => import('./Pages/SubwayLive/SubwayLive'),
  'not-found': () => import('./Pages/NotFound/NotFound'),
}

export function preloadOnIntent(route) {
  const preload = () => void routeLoaders[route]?.()
  return { onMouseEnter: preload, onFocus: preload, onTouchStart: preload }
}
