import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import enchantedQuillIcon from '../../assets/enchanted-quill-Original.png'
import backIcon from '../../assets/back-image-Original.png'
import FolderEntry from '../Tools/FolderEntry'
import VocabEntry from './VocabEntry'
import PassageEntry from './PassageEntry'
import './Vocab.css'

const root = [
  {
    type: 'folder',
    title: 'Blood Meridian',
    children: [
      { type: 'folder', title: 'words', children: [] },
      {
        type: 'folder',
        title: 'passages',
        children: [
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'You can find meanness in the least of creatures, but when God made man the devil was at his elbow. A creature that can do anything. Make a machine. And a machine to make the machine. And evil that can run itself a thousand years, no need to tend it. You believe that?', page: 71 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'Distant thunderheads reared quivering against the electric sky and were sucked away in the blackness again.', page: 72 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'Squalid kingdom of mud.', page: 112 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '...young girl whose beauty becomes the flowers about', page: 142 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'It is hinged into a larger door or gate and all must step over the foot-high sill where a thousand boots have scuffed away the wood,', page: 142 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The wrath of God lies sleeping. It was hid a million years before men were and only men have power to wake it', page: 146 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'Ye\'ll wake more than the dogs.', page: 146 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '...forty-six men wrapped in their blankets under the selfsame stars, the prairie wolves so like in their yammering, yet all about so changed and strange.', page: 156 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '... the stars jostled and arced across the firmament and died beyond the inkblack mountains.', page: 166 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '... he saw men kneeling who tilted and clasped their shadows on the ground...', page: 193 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'devouts at a shrine', page: 206 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'charred flesh drawn taut', page: 215 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '... about yet the greater void beyond seemed to swallow up his soul.', page: 237 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'They came to a crossroads, what else to call it.', page: 242 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'always they sought to parcel from the darkness some voice or cry from among the cries that was no right beast', page: 260 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'take his shadow for the share that was in it', page: 293 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The cat simply disappeared. There was no blood or cry, it just vanished.', page: 298 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'A dark vein in his temple pulsed like a fuse', page: 309 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The print of the hatband lay on his forehead like a scar', page: 317 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The smelter chimneys were ranged against an ashen sky', page: 320 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '...reflected in pools along the flooded road out of which great dripping swine rose moaning before the advancing horses like oafish demons routed from a fen', page: 321 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'like supplicants at the skirts of some wild and irate goddess', page: 330 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The ear was dark and misshapen, as if in being put forth in this fashion it had suffered no few clouts, or perhaps the very news men had for him had blighted it.', page: 344 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'If he spoke his words were snatched away unheard', page: 346 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'About that fire were men whose eyes gave back the light like coals socketed hot in their skulls and men whose eyes did not,', page: 383 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'arches of blood slowly subsided until just the neck bubbled gently like a stew and then that too was stilled', page: 387 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'the dull boom of rock falling somewhere far below them in the awful darkness inside the world.', page: 400 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '...like some fabled equine ideation out of an Attic tragedy', page: 416 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'And so these parties divided upon that midnight plain, each passing back the way the other had come, pursuing as all travelers must inversions without end upon other men\'s journeys.', page: 438 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'flames yawed in the nightwinds ascending those stony draws', page: 440 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The gifts of the almighty are weighed and parceled out in a scale peculiar to himself', page: 443 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'There has been sinners so notorious evil that the fires coughed em up again', page: 471 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'To see eleven men perched on the topmost rim of that scalded atoll like misflown birds.', page: 478 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'The leaves shifted in a million sprangles down the pale corridors and Glanton took one and turned it like a tiny fan by its stem and held it and let it fall and its perfection was not lost on him.', page: 491 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'the land had swallowed them up beyond all ransom or reprieve.', page: 496 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'they took down the bags and divided his estate among them and that man\'s name was never said again.', page: 498 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'the slant black shapes of the mounted men stenciled across the stone with a definition austere and implacable like shapes capable of violating their covenant with the flesh that authored them and continuing autonomous across the naked rock without reference to sun or man or god.', page: 500 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: '...and he seemed much satisfied with the world, as if his counsel had been sought at its creation.', page: 507 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'the horsemen on that promontory seemed very small even to themselves.', page: 533 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'reckoning out the camp in that incoordinate waste by the palest starlight or in blackness absolute...', page: 534 },
          { type: 'passage', dateAdded: 'Apr 23, 2026', text: 'the history of all is not the history of each nor indeed the sum of those histories', page: 1198 },
        ],
      },
    ],
  },
  {
    type: 'folder',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    children: [
      {
        type: 'folder',
        title: 'words',
        children: [
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'redolent', partOfSpeech: 'adj.', definition: 'Strongly reminiscent or suggestive of something; having a strong, pleasant smell.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'verisimilitude', partOfSpeech: 'n.', definition: 'The appearance of being true or real; the quality of seeming believable.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'priggish', partOfSpeech: 'adj.', definition: 'Self-righteously moralistic and superior toward others.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'zaftig', partOfSpeech: 'adj.', definition: 'Of a woman: having a full, rounded, pleasantly plump figure.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'shtetl', partOfSpeech: 'n.', definition: 'A small Jewish town or village in Eastern Europe, especially in the pre-Holocaust Pale of Settlement.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'passel', partOfSpeech: 'n.', definition: 'A large group or quantity of people or things.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'hirsute', partOfSpeech: 'adj.', definition: 'Covered with hair; hairy.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'palimpsest', partOfSpeech: 'n.', definition: 'A manuscript page from which writing has been scraped and overwritten; broadly, something that carries visible traces of its earlier form.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'parochial', partOfSpeech: 'adj.', definition: 'Having a narrow or limited outlook; relating only to local concerns.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'perfunctory', partOfSpeech: 'adj.', definition: 'Carried out with minimal effort or care as a matter of routine; mechanical.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'Stygian', partOfSpeech: 'adj.', definition: 'Extremely dark, gloomy, or forbidding. From the River Styx of Greek mythology.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'vertiginously', partOfSpeech: 'adv.', definition: 'In a way that causes or suggests dizziness; at a dizzying height or speed.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'apocryphal', partOfSpeech: 'adj.', definition: 'Of doubtful authenticity; widely repeated but probably not true.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'collogue', partOfSpeech: 'v.', definition: 'To talk confidentially or conspiratorially; to plot together.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'dais', partOfSpeech: 'n.', definition: 'A low raised platform at the front of a room, used for a lectern, throne, or seats of honor.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'raconteur', partOfSpeech: 'n.', definition: 'A person who tells anecdotes in a skillful and entertaining way.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'blithely', partOfSpeech: 'adv.', definition: 'In a cheerful, carefree manner; with blithe disregard for consequences.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'trenchant', partOfSpeech: 'adj.', definition: 'Vigorous and incisive; sharply perceptive and expressed.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'ikat', partOfSpeech: 'n.', definition: 'A textile dyeing technique in which yarn is resist-dyed in patterns before weaving, producing characteristic blurred edges.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'histrionic', partOfSpeech: 'adj.', definition: 'Overly theatrical or melodramatic; excessively dramatic in behavior.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'mesomorphic', partOfSpeech: 'adj.', definition: 'Having a compact, muscular body build; relating to the mesomorph body type.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'fripperies', partOfSpeech: 'n.', definition: 'Showy, unnecessary ornaments or trimmings; trivial and frivolous things.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'corpuscular', partOfSpeech: 'adj.', definition: 'Relating to or resembling tiny particles or cells; of or like minute discrete bodies.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'ludic', partOfSpeech: 'adj.', definition: 'Showing spontaneous, undirected playfulness.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'treacly', partOfSpeech: 'adj.', definition: 'Excessively sentimental; cloyingly sweet or saccharine.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'sepulchral', partOfSpeech: 'adj.', definition: 'Relating to a tomb or burial; gloomy, dismal, and suggestive of death.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'puerile', partOfSpeech: 'adj.', definition: 'Childishly silly and immature.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'talismanic', partOfSpeech: 'adj.', definition: 'Having the protective or luck-bringing properties of a talisman; invested with special power.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'turpitude', partOfSpeech: 'n.', definition: 'Wickedness or moral depravity; shameful or depraved conduct.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'denouement', partOfSpeech: 'n.', definition: 'The final resolution of a plot; the outcome or unraveling of a complicated situation.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'itinerancy', partOfSpeech: 'n.', definition: 'The practice or condition of traveling from place to place, especially as a way of life or work.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'languorously', partOfSpeech: 'adv.', definition: 'In a pleasantly lazy, slow, and relaxed manner.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'canny', partOfSpeech: 'adj.', definition: 'Having shrewd good judgment; careful and astute, especially in practical matters.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'declaiming', partOfSpeech: 'v.', definition: 'Speaking in a rhetorical or impassioned way; delivering a formal speech or recitation.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'mordant', partOfSpeech: 'adj.', definition: 'Biting and sharply critical; having a harsh, caustic wit.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'erudite', partOfSpeech: 'adj.', definition: 'Having or showing deep, wide-ranging knowledge gained through study.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'emesis', partOfSpeech: 'n.', definition: 'The act of vomiting; a medical term for vomit.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'susurrus', partOfSpeech: 'n.', definition: 'A soft murmuring or whispering sound.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'votive', partOfSpeech: 'adj.', definition: 'Offered or dedicated in fulfillment of a vow; expressing a wish or devotion.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'jejune', partOfSpeech: 'adj.', definition: 'Naive, simplistic, and superficial; lacking substance or depth.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'maudlin', partOfSpeech: 'adj.', definition: 'Self-pityingly or tearfully sentimental, often to an excessive degree.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'patina', partOfSpeech: 'n.', definition: 'A green or brown film that forms on old bronze or copper; more broadly, a sheen or surface quality acquired through age and use.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'verdigris', partOfSpeech: 'n.', definition: 'The bright blue-green substance that forms on copper, brass, or bronze through oxidation.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'provincial', partOfSpeech: 'adj.', definition: 'Of or relating to a province; narrow-minded and unsophisticated due to limited exposure to the wider world.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'anfractuous', partOfSpeech: 'adj.', definition: 'Winding, sinuous, and full of twists and turns.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'dervish', partOfSpeech: 'n.', definition: 'A member of a Muslim ascetic order known for devotional exercises; used figuratively for a person who whirls or moves with frantic energy.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'convalescences', partOfSpeech: 'n.', definition: 'Periods of gradual recovery following illness, injury, or medical treatment.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'echt', partOfSpeech: 'adj.', definition: 'Authentic; genuine and typical of its kind.' },
      { type: 'word', dateAdded: 'Apr 23, 2026', term: 'Perlin noise', partOfSpeech: 'n.', definition: 'A gradient noise algorithm developed by Ken Perlin, widely used in computer graphics and game development to generate natural-looking textures, terrain, and organic patterns.' },
        ],
      },
      {
        type: 'folder',
        title: 'passages',
        children: [],
      },
    ],
  },
  {
    type: 'folder',
    title: 'The Snows of Kilimanjaro and Other Stories',
    children: [
      { type: 'folder', title: 'words', children: [] },
      { type: 'folder', title: 'passages', children: [] },
    ],
  },
]

function collectByType(tree, type, book = null) {
  const results = []
  for (const entry of tree) {
    if (entry.type === 'folder') {
      const bookName = book || entry.title
      results.push(...collectByType(entry.children, type, bookName))
    } else if (entry.type === type) {
      results.push({ ...entry, source: book })
    }
  }
  return results
}

function getEntriesAtPath(tree, path) {
  let current = tree
  for (const name of path) {
    const folder = current.find(e => e.type === 'folder' && e.title === name)
    if (!folder) return []
    current = folder.children
  }
  return [...current].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1
    if (a.type !== 'folder' && b.type === 'folder') return 1
    return a.term ? a.term.localeCompare(b.term) : 0
  })
}

export default function Vocab() {
  const [searchParams] = useSearchParams()
  const initialFolder = searchParams.get('folder')
  const view = searchParams.get('view')
  const [path, setPath] = useState(initialFolder ? [initialFolder] : [])
  const [sortBy, setSortBy] = useState('dateAdded')

  const raw = getEntriesAtPath(root, path)
  const hasWords = raw.some(e => e.type === 'word')
  const hasFolders = raw.some(e => e.type === 'folder')
  const visible = useMemo(() => {
    if (hasWords) {
      return [...raw].sort((a, b) => {
        if (a.type !== 'word' || b.type !== 'word') return 0
        if (sortBy === 'alpha') return a.term.localeCompare(b.term)
        return new Date(b.dateAdded) - new Date(a.dateAdded)
      })
    }
    if (hasFolders) {
      return [...raw].sort((a, b) => a.title?.localeCompare(b.title ?? '') ?? 0)
    }
    return raw
  }, [raw, sortBy, hasWords, hasFolders])
  const allWords = useMemo(() => {
    if (view !== 'all-words') return null
    const words = collectByType(root, 'word')
    return sortBy === 'alpha'
      ? [...words].sort((a, b) => a.term.localeCompare(b.term))
      : [...words].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  }, [view, sortBy])

  const allPassages = useMemo(() => {
    if (view !== 'all-passages') return null
    const passages = collectByType(root, 'passage')
    return sortBy === 'book'
      ? [...passages].sort((a, b) => (a.source ?? '').localeCompare(b.source ?? ''))
      : [...passages].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  }, [view, sortBy])

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title vocab-title">
            <img src={enchantedQuillIcon} alt="" className="vocab-title-icon" aria-hidden="true" />
            words &amp; phrases
          </h1>
          <select
            className="filter-select"
            value={hasFolders && !view ? 'alpha' : sortBy}
            onChange={e => setSortBy(e.target.value)}
            disabled={hasFolders && !view}
          >
            {view === 'all-passages' ? (
              <>
                <option value="dateAdded">date added</option>
                <option value="book">by book</option>
              </>
            ) : (
              <>
                {(hasWords || view === 'all-words') && <option value="dateAdded">date added</option>}
                <option value="alpha">alphabetical</option>
              </>
            )}
          </select>
        </div>
      </section>

      <section className="vocab-list">
        <div className="container">

          {allWords && (
            <>
              <nav className="tools-path">
                <Link to="/vocab" className="path-segment" style={{ textDecoration: 'none' }}>words &amp; phrases</Link>
                <span className="path-segment-wrap">
                  <span className="path-sep">/</span>
                  <span className="path-segment">all words</span>
                </span>
                <span className="path-arrow-fill" aria-hidden>
                  <span className="path-arrow-chevron">&lt;&lt;&lt;</span>
                  <span className="path-arrow-line" />
                </span>
                <span className="path-current">current location</span>
              </nav>
              <div className="vocab-entries">
                {allWords.map((entry, i) => <VocabEntry key={i} {...entry} />)}
              </div>
            </>
          )}

          {allPassages && (
            <>
              <nav className="tools-path">
                <Link to="/vocab" className="path-segment" style={{ textDecoration: 'none' }}>words &amp; phrases</Link>
                <span className="path-segment-wrap">
                  <span className="path-sep">/</span>
                  <span className="path-segment">all passages</span>
                </span>
                <span className="path-arrow-fill" aria-hidden>
                  <span className="path-arrow-chevron">&lt;&lt;&lt;</span>
                  <span className="path-arrow-line" />
                </span>
                <span className="path-current">current location</span>
              </nav>
              <div className="vocab-entries">
                {allPassages.map((entry, i) => <PassageEntry key={i} {...entry} />)}
              </div>
            </>
          )}

          {!allWords && !allPassages && (
            <>
              <nav className="tools-path">
                <button
                  className="path-back"
                  onClick={() => setPath(path.slice(0, -1))}
                  aria-label="Go up one level"
                  style={{ visibility: path.length > 0 ? 'visible' : 'hidden' }}
                >
                  <img src={backIcon} alt="back" />
                </button>
                <button className="path-segment" onClick={() => setPath([])}>words &amp; phrases</button>
                {path.map((name, i) => (
                  <span key={i} className="path-segment-wrap">
                    <span className="path-sep">/</span>
                    <button className="path-segment" onClick={() => setPath(path.slice(0, i + 1))}>
                      {name}
                    </button>
                  </span>
                ))}
                <span className="path-arrow-fill" aria-hidden>
                  <span className="path-arrow-chevron">&lt;&lt;&lt;</span>
                  <span className="path-arrow-line" />
                </span>
                <span className="path-current">current location</span>
              </nav>

              {path.length === 0 && (
                <div className="vocab-view-buttons">
                  <Link to="/vocab?view=all-words" className="vocab-view-btn">see all words</Link>
                  <Link to="/vocab?view=all-passages" className="vocab-view-btn">see all passages</Link>
                </div>
              )}

              <div className="vocab-entries">
                {visible.map((entry, i) =>
                  entry.type === 'folder'
                    ? <FolderEntry key={i} title={entry.title} onOpen={() => setPath([...path, entry.title])} />
                    : entry.type === 'passage'
                      ? <PassageEntry key={i} {...entry} />
                      : <VocabEntry key={i} {...entry} />
                )}
              </div>
            </>
          )}

        </div>
      </section>
    </Layout>
  )
}
