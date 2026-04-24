import { Link } from 'react-router-dom'
import starImg from '../../assets/pixel star-removed-bg.png'

function Stars({ rating }) {
  return (
    <div className="book-stars">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating)) {
          return <img key={i} src={starImg} className="book-star" alt="star" />
        }
        if (i < rating) {
          return (
            <span key={i} className="book-star-half-wrap">
              <img src={starImg} className="book-star" alt="half star" />
            </span>
          )
        }
        return <img key={i} src={starImg} className="book-star book-star--empty" alt="empty star" />
      })}
    </div>
  )
}

export default function BookEntry({ cover, title, author, year, startDate, endDate, rating, link, vocabFolder }) {
  return (
    <div className="book-entry">
      <div className="book-cover-wrap">
        {link
          ? <a href={link} target="_blank" rel="noreferrer">
              {cover
                ? <img src={cover} alt={title} className="book-cover" />
                : <div className="book-cover book-cover--placeholder" />
              }
            </a>
          : cover
            ? <img src={cover} alt={title} className="book-cover" />
            : <div className="book-cover book-cover--placeholder" />
        }
      </div>
      <div className="book-body">
        <div className="book-top-row">
          <div className="book-title-year">
            {link
              ? <a href={link} target="_blank" rel="noreferrer" className="book-title">{title}</a>
              : <span className="book-title">{title}</span>
            }
            {year && <span className="book-year">{year}</span>}
          </div>
          {rating != null && <Stars rating={rating} />}
        </div>
        {author && <p className="book-author">{author}</p>}
        {(startDate || endDate) && (
          <p className="book-dates">
            {startDate && endDate ? `${startDate} – ${endDate}` : startDate || endDate}
          </p>
        )}
        {vocabFolder && (
          <Link to={`/vocab?folder=${encodeURIComponent(vocabFolder)}`} className="book-vocab-link">
            words &amp; phrases
          </Link>
        )}
      </div>
    </div>
  )
}
