import defaultCover from './assets/optimized/record.webp'

export default function VinylEntry({ image, name, artist, dateAdded }) {
  return (
    <article className="vinyl-entry">
      <div className="vinyl-cover-wrap">
        <img
          src={image || defaultCover}
          alt={`${name} by ${artist}`}
          className="vinyl-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="vinyl-body">
        <h2 className="vinyl-name">{name}</h2>
        <p className="vinyl-artist">{artist}</p>
        <time className="vinyl-date">added {dateAdded}</time>
      </div>
    </article>
  )
}
