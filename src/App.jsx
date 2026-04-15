import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home        from './Pages/Home/Home'
import Movies      from './Pages/Movies/Movies'
import Music       from './Pages/Music/Music'
import Books       from './Pages/Books/Books'
import Travel      from './Pages/Travel/Travel'
import UsefulTools from './Pages/UsefulTools/UsefulTools'
import Poetry      from './Pages/Poetry/Poetry'
import Articles    from './Pages/Articles/Articles'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/movies"       element={<Movies />} />
        <Route path="/music"        element={<Music />} />
        <Route path="/books"        element={<Books />} />
        <Route path="/travel"       element={<Travel />} />
        <Route path="/tools"         element={<UsefulTools />} />
        <Route path="/poetry"       element={<Poetry />} />
        <Route path="/articles"     element={<Articles />} />
      </Routes>
    </BrowserRouter>
  )
}
