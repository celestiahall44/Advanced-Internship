import { useState, useEffect } from "react";
import { BsSearch, BsClock, BsStarFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function ForYou() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedLoading, setSelectedLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);

  useEffect(() => {
    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected")
      .then((r) => r.json())
      .then((data) => setSelectedBooks(data))
      .catch(() => {})
      .finally(() => setSelectedLoading(false));

    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended")
      .then((r) => r.json())
      .then((data) => setRecommendedBooks(data))
      .catch(() => {})
      .finally(() => setRecommendedLoading(false));

    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested")
      .then((r) => r.json())
      .then((data) => setSuggestedBooks(data))
      .catch(() => {})
      .finally(() => setSuggestedLoading(false));
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

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
          <main className="app-main">
            <section className="fy-section">
              <h2 className="fy-section__title">Selected For You</h2>
              <div className="fy-section__content fy-section__content--featured">
                {selectedLoading ? (
                  <div className="book-card book-card--selected book-card--skeleton" />
                ) : (
                  selectedBooks.map((book) => (
                    <div key={book.id} className="book-card book-card--selected">
                      <div className="book-card__left">
                        <p className="book-card__subtitle">{book.subTitle}</p>
                      </div>
                      <img
                        className="book-card__cover"
                        src={book.imageLink}
                        alt={book.title}
                      />
                      <div className="book-card__info">
                        <h3 className="book-card__title">{book.title}</h3>
                        <p className="book-card__author">{book.author}</p>
                        <div className="book-card__meta">
                          {book.duration && (
                            <span className="book-card__meta-item">
                              <BsClock />
                              {book.duration}
                            </span>
                          )}
                        </div>
                        <button className="book-card__play-btn" type="button">
                          <FaPlay className="book-card__play-icon" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="fy-section">
              <h2 className="fy-section__title">Recommended For You</h2>
              <p className="fy-section__subtitle">We think you'll like these</p>
              <div className="fy-section__content fy-section__content--row">
                {recommendedLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="book-card book-card--small book-card--skeleton" />
                    ))
                  : recommendedBooks.slice(0, 5).map((book) => (
                      <div key={book.id} className="book-card book-card--small">
                        <div className="book-card__cover-wrap">
                          <img
                            className="book-card-small__cover"
                            src={book.imageLink}
                            alt={book.title}
                          />
                          {book.subscriptionRequired && (
                            <span className="book-card__premium-pill">Premium</span>
                          )}
                        </div>
                        <div className="book-card-small__info">
                          <h3 className="book-card-small__title">{book.title}</h3>
                          <p className="book-card-small__author">{book.author}</p>
                          <p className="book-card-small__subtitle">{book.subTitle}</p>
                          <div className="book-card-small__meta">
                            {book.averageRating && (
                              <span className="book-card__meta-item">
                                <BsStarFill style={{ color: "#f3c244" }} />
                                {book.averageRating.toFixed(1)}
                              </span>
                            )}
                            {book.duration && (
                              <span className="book-card__meta-item">
                                <BsClock />
                                {book.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </section>

            <section className="fy-section">
              <h2 className="fy-section__title">Suggested Books</h2>
              <p className="fy-section__subtitle">Browse those books</p>
              <div className="fy-section__content fy-section__content--row">
                {suggestedLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="book-card book-card--small book-card--skeleton" />
                    ))
                  : suggestedBooks.slice(0, 5).map((book) => (
                      <div key={book.id} className="book-card book-card--small">
                        <div className="book-card__cover-wrap">
                          <img
                            className="book-card-small__cover"
                            src={book.imageLink}
                            alt={book.title}
                          />
                          {book.subscriptionRequired && (
                            <span className="book-card__premium-pill">Premium</span>
                          )}
                        </div>
                        <div className="book-card-small__info">
                          <h3 className="book-card-small__title">{book.title}</h3>
                          <p className="book-card-small__author">{book.author}</p>
                          <p className="book-card-small__subtitle">{book.subTitle}</p>
                          <div className="book-card-small__meta">
                            {book.averageRating && (
                              <span className="book-card__meta-item">
                                <BsStarFill style={{ color: "#f3c244" }} />
                                {book.averageRating.toFixed(1)}
                              </span>
                            )}
                            {book.duration && (
                              <span className="book-card__meta-item">
                                <BsClock />
                                {book.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ForYou;
