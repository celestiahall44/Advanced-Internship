import { useEffect, useState } from "react";
import { BsClock, BsStarFill } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchHeader from "./SearchHeader";

const SEARCH_API = "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=";

function getAudioDuration(audioLink) {
  return new Promise((resolve) => {
    if (!audioLink) {
      resolve(null);
      return;
    }
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      const secs = audio.duration;
      audio.src = "";
      if (!isFinite(secs)) {
        resolve(null);
        return;
      }
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      resolve(`${m}:${String(s).padStart(2, "0")}`);
    };
    audio.onerror = () => resolve(null);
    audio.src = audioLink;
  });
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [durations, setDurations] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery;
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  useEffect(() => {
    const trimmed = debouncedQuery;
    if (!trimmed) {
      setResults([]);
      setDurations({});
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    fetch(`${SEARCH_API}${encodeURIComponent(trimmed)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        setResults(list);
      })
      .catch(() => {
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!results.length) return;
    Promise.all(results.map((b) => getAudioDuration(b.audioLink).then((d) => [b.id, d])))
      .then((entries) => setDurations(Object.fromEntries(entries.filter(([, d]) => d))));
  }, [results]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDebouncedQuery("");
      return;
    }
    setDebouncedQuery(trimmed);
  };

  return (
    <div className="for-you-page">
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <SearchHeader query={query} setQuery={setQuery} onSubmit={handleSearch} autoFocus />

          <main className="app-main search-results">
            {debouncedQuery ? (
              <>
                <p className="search-results__query">
                  Showing results for: <strong>{debouncedQuery}</strong>
                </p>

                {loading ? (
                  <div className="search-results__grid">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="book-card book-card--small book-card--skeleton" />
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <p className="search-results__query">No books found.</p>
                ) : (
                  <div className="search-results__grid">
                    {results.map((book) => (
                      <div
                        key={book.id}
                        className="book-card book-card--small"
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
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
                            {durations[book.id] && (
                              <span className="book-card__meta-item">
                                <BsClock />
                                {durations[book.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="search-results__query">Enter a search term above.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Search;
