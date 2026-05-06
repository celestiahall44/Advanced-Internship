import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch, BsStarFill, BsBookmarkFill } from "react-icons/bs";
import Sidebar from "./Sidebar";

function BookGrid({ books, onNavigate, onRemove }) {
  return (
    <div className="library__grid">
      {books.map((book) => (
        <div
          key={book.id}
          className="book-card--small"
          onClick={() => onNavigate(book.id)}
        >
          <div style={{ position: "relative" }}>
            <img
              className="book-card-small__cover"
              src={book.imageLink}
              alt={book.title}
            />
            {book.subscriptionRequired && (
              <span className="book-card-small__premium">Premium</span>
            )}
          </div>
          <div className="book-card-small__info">
            <p className="book-card-small__title">{book.title}</p>
            <p className="book-card-small__author">{book.author}</p>
            {book.subTitle && (
              <p className="book-card-small__subtitle">{book.subTitle}</p>
            )}
            {book.averageRating && (
              <div className="book-card-small__meta">
                <BsStarFill style={{ color: "#f3cf4e" }} />
                <span>{Number(book.averageRating).toFixed(1)}</span>
              </div>
            )}
          </div>
          <button
            className="library__remove-btn"
            type="button"
            title="Remove"
            onClick={(e) => { e.stopPropagation(); onRemove(book.id); }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function Library() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const [books, setBooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("myLibrary") || "[]"); } catch { return []; }
  });

  const [finished, setFinished] = useState(() => {
    try { return JSON.parse(localStorage.getItem("finishedLibrary") || "[]"); } catch { return []; }
  });

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleRemoveSaved = (bookId) => {
    const updated = books.filter((b) => b.id !== bookId);
    setBooks(updated);
    localStorage.setItem("myLibrary", JSON.stringify(updated));
  };

  const handleRemoveFinished = (bookId) => {
    const updated = finished.filter((b) => b.id !== bookId);
    setFinished(updated);
    localStorage.setItem("finishedLibrary", JSON.stringify(updated));
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
                <button className="search__btn" type="button" onClick={handleSearch} aria-label="Search">
                  <BsSearch />
                </button>
              </div>
            </div>
          </header>
          <main className="app-main">
            <section className="fy-section">
              <h2 className="fy-section__title">Saved Books</h2>
              <p className="fy-section__subtitle">{books.length} items</p>
              {books.length === 0 ? (
                <div className="library__empty">
                  <BsBookmarkFill className="library__empty-icon" />
                  <p>Save books from their detail page to see them here.</p>
                </div>
              ) : (
                <BookGrid books={books} onNavigate={(id) => navigate(`/book/${id}`)} onRemove={handleRemoveSaved} />
              )}
            </section>

            <section className="fy-section">
              <h2 className="fy-section__title">Finished</h2>
              <p className="fy-section__subtitle">{finished.length} items</p>
              {finished.length === 0 ? (
                <div className="library__empty" />
              ) : (
                <BookGrid books={finished} onNavigate={(id) => navigate(`/book/${id}`)} onRemove={handleRemoveFinished} />
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Library;
