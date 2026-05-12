import { useEffect, useRef, useState } from "react";
import { BsClock, BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getAudioDuration } from "../../utils/audio";
import "./SearchHeader.css";

const SEARCH_API = "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=";

function SearchHeader({ query, setQuery, onSubmit, autoFocus = false }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [durations, setDurations] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setDurations({});
      setLoading(false);
      return;
    }

    let isMounted = true;
    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(`${SEARCH_API}${encodeURIComponent(trimmed)}`)
        .then((r) => r.json())
        .then((data) => {
          if (!isMounted) return;
          const list = Array.isArray(data) ? data.slice(0, 6) : [];
          setSuggestions(list);
        })
        .catch(() => {
          if (isMounted) setSuggestions([]);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (!suggestions.length) {
      setDurations({});
      return;
    }

    let isMounted = true;
    Promise.all(
      suggestions.map((book) =>
        getAudioDuration(book.audioLink).then((duration) => [book.id, duration])
      )
    ).then((entries) => {
      if (!isMounted) return;
      setDurations(Object.fromEntries(entries.filter(([, duration]) => duration)));
    });

    return () => {
      isMounted = false;
    };
  }, [suggestions]);

  const handleSuggestionClick = (bookId) => {
    setIsOpen(false);
    navigate(`/book/${bookId}`);
  };

  return (
    <header className="for-you-nav">
      <div className="for-you-nav__inner">
        <div className="for-you-search" ref={wrapperRef}>
          <input
            className="search__input"
            type="search"
            placeholder="Search by title or author"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit();
                setIsOpen(false);
              }
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            autoFocus={autoFocus}
          />
          <button
            className="search__btn"
            type="button"
            onClick={() => {
              onSubmit();
              setIsOpen(false);
            }}
            aria-label="Search"
          >
            <BsSearch />
          </button>

          {isOpen && query.trim() && (
            <div className="search-dropdown">
              {loading ? (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="search-dropdown__item search-dropdown__item--skeleton">
                      <div className="search-dropdown__cover search-dropdown__cover--skeleton" />
                      <span className="search-dropdown__content">
                        <span className="search-dropdown__line search-dropdown__line--title" />
                        <span className="search-dropdown__line search-dropdown__line--meta" />
                        <span className="search-dropdown__line search-dropdown__line--meta search-dropdown__line--timer" />
                      </span>
                    </div>
                  ))}
                </>
              ) : suggestions.length > 0 ? (
                suggestions.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    className="search-dropdown__item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(book.id)}
                  >
                    <img className="search-dropdown__cover" src={book.imageLink} alt={book.title} />
                    <span className="search-dropdown__content">
                      <span className="search-dropdown__title">{book.title}</span>
                      <span className="search-dropdown__meta">{book.author}</span>
                      {durations[book.id] && (
                        <span className="search-dropdown__meta search-dropdown__meta--timer">
                          <BsClock />
                          {durations[book.id]}
                        </span>
                      )}
                    </span>
                  </button>
                ))
              ) : (
                <div className="search-dropdown__empty">No books found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SearchHeader;
