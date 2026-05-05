import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";

function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

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
                  autoFocus
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

          <main className="app-main search-results">
            {initialQuery ? (
              <p className="search-results__query">
                Showing results for: <strong>{initialQuery}</strong>
              </p>
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
