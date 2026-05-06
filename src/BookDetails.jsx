import { useEffect, useMemo, useState } from "react";
import { BsClock, BsBook, BsSearch, BsStarFill, BsMicFill, BsFileText, BsLightbulb, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "./firebase";
import Sidebar from "./Sidebar";

const BOOK_BY_ID_API = "https://us-central1-summaristt.cloudfunctions.net/getBook?id=";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleProtectedAction = (action) => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
    if (book?.subscriptionRequired) {
      navigate("/choose-plan");
      return;
    }
    action();
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    let isMounted = true;

    fetch(`${BOOK_BY_ID_API}${id}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch book");
        }
        return r.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const normalizedBook = Array.isArray(data) ? data[0] : data;
        setBook(normalizedBook || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setBook(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const keyIdeas = useMemo(() => {
    if (!book?.keyIdeas) return [];
    if (typeof book.keyIdeas === "number") return [];
    if (Array.isArray(book.keyIdeas)) {
      return book.keyIdeas.map((idea) => String(idea).trim()).filter(Boolean);
    }
    return String(book.keyIdeas)
      .split("\n")
      .map((idea) => idea.trim())
      .filter(Boolean);
  }, [book]);

  const keyIdeasCount = useMemo(() => {
    if (!book?.keyIdeas) return 0;
    if (typeof book.keyIdeas === "number") return book.keyIdeas;
    if (Array.isArray(book.keyIdeas)) return book.keyIdeas.length;
    return String(book.keyIdeas).split("\n").filter(Boolean).length;
  }, [book]);

  const rating = useMemo(() => {
    const parsedRating = Number(book?.averageRating);
    return Number.isFinite(parsedRating) ? parsedRating : null;
  }, [book?.averageRating]);

  return (
    <div className="for-you-page">
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <header className="for-you-nav">
            <div className="for-you-nav__inner">
              <div className="for-you-search">
                <input
                  className="search__input"
                  type="search"
                  placeholder="Search for books"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="search__btn"
                  type="button"
                  onClick={handleSearch}
                  aria-label="Search"
                >
                  <BsSearch />
                </button>
              </div>
            </div>
          </header>
          <main className="app-main book-page">
            {loading ? (
              <div className="book-page__state">Loading book...</div>
            ) : !book ? (
              <div className="book-page__state">
                <h2>Book not found</h2>
                <p>No book was found for id: {id}</p>
              </div>
            ) : (
              <section className="book-details">
                <div className="book-details__hero">
                  <div className="book-details__content">
                    <h1 className="book-details__title">{book.title}</h1>
                    <p className="book-details__author">By {book.author}</p>
                    {book.subTitle && <p className="book-details__subtitle">{book.subTitle}</p>}
                    <hr className="book-details__divider" />

                    <div className="book-details__meta">
                      {rating !== null && (
                        <span className="book-details__meta-item">
                          <BsStarFill />
                          {rating.toFixed(1)}
                          {book.totalRating && <span className="book-details__rating-count">({book.totalRating} ratings)</span>}
                        </span>
                      )}
                      {book.duration && (
                        <span className="book-details__meta-item">
                          <BsClock />
                          {book.duration}
                        </span>
                      )}
                      {book.subscriptionRequired && (
                        <span className="book-details__pill">Premium</span>
                      )}
                    </div>

                    <div className="book-details__type-row">
                      <span className="book-details__type-item"><BsMicFill /> Audio &amp; Text</span>
                      {keyIdeasCount > 0 && (
                        <span className="book-details__type-item"><BsLightbulb /> {keyIdeasCount} Key Ideas</span>
                      )}
                    </div>

                    <hr className="book-details__divider" />
                    <div className="book-details__actions">
                      {book.audioLink && (
                        <a
                          className="book-details__listen"
                          href={book.audioLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!auth.currentUser) { e.preventDefault(); navigate("/login"); return; }
                            if (book.subscriptionRequired) { e.preventDefault(); navigate("/choose-plan"); }
                          }}
                        >
                          <FaPlay />
                          Listen
                        </a>
                      )}
                      <button className="book-details__read" type="button" onClick={() => handleProtectedAction(() => {})}>
                        <BsBook />
                        Read
                      </button>
                    </div>
                    <button
                      className={`book-details__save${saved ? " book-details__save--saved" : ""}`}
                      type="button"
                      onClick={() => setSaved((s) => !s)}
                    >
                      {saved ? <BsBookmarkFill /> : <BsBookmark />}
                      {saved ? "Saved in My Library" : "Add To My Library"}
                    </button>
                  </div>

                  <img className="book-details__cover" src={book.imageLink} alt={book.title} />
                </div>

                <div className="book-details__body">
                  {book.bookDescription && (
                    <section className="book-details__section">
                      <h2 className="book-details__section-title">What's it about?</h2>
                      {book.tags && book.tags.length > 0 && (
                        <div className="book-details__tags">
                          {book.tags.map((tag) => (
                            <span key={tag} className="book-details__tag">{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="book-details__text">{book.bookDescription}</p>
                    </section>
                  )}

                  {book.authorDescription && (
                    <section className="book-details__section">
                      <h2 className="book-details__section-title">About The Author</h2>
                      <p className="book-details__text">{book.authorDescription}</p>
                    </section>
                  )}

                  {keyIdeas.length > 0 && (
                    <section className="book-details__section">
                      <h2 className="book-details__section-title">Key ideas</h2>
                      <ul className="book-details__ideas">
                        {keyIdeas.map((idea, index) => (
                          <li key={`${book.id}-idea-${index}`}>{idea}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
