import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useFontSize } from "./FontSizeContext";
import SearchHeader from "./SearchHeader";

const BOOK_BY_ID_API = "https://us-central1-summaristt.cloudfunctions.net/getBook?id=";

function Read() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setBook(null);
    let isMounted = true;
    fetch(`${BOOK_BY_ID_API}${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        const fetched = Array.isArray(data) ? data[0] : data;
        if (fetched?.subscriptionRequired) {
          navigate("/choose-plan");
          return;
        }
        setBook(fetched);
      })
      .catch(() => { if (isMounted) setBook(null); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [id]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const summaryText = useMemo(() => {
    if (!book) return "";
    const parts = [book.summary, book.bookDescription]
      .filter(Boolean)
      .map((t) => String(t).trim());
    return parts.join("\n\n");
  }, [book]);

  const summaryParagraphs = useMemo(() => {
    if (!summaryText) return [];
    const normalized = summaryText.replace(/\r\n/g, "\n").trim();
    let paragraphs = normalized
      .split(/\n\s*\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length === 1 && normalized.includes("\n")) {
      paragraphs = normalized
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
    }
    return paragraphs;
  }, [summaryText]);

  return (
    <div className="for-you-page">
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <SearchHeader query={query} setQuery={setQuery} onSubmit={handleSearch} />

          <main className="app-main">
            {loading ? (
              <div className="player__page-content player__page-content--skeleton">
                <div className="skeleton skeleton--title skeleton--title-center" />
                <div className="skeleton skeleton--divider" />
                <div className="player__page-summary-wrap player__page-summary-wrap--skeleton">
                  <div className="skeleton skeleton--paragraph" />
                  <div className="skeleton skeleton--paragraph" />
                  <div className="skeleton skeleton--paragraph skeleton--paragraph-long" />
                </div>
              </div>
            ) : !book ? (
              <div className="book-page__state">Book not found.</div>
            ) : (
              <div className="player__page-content">
                <h1 className="player__page-title">{book.title}</h1>
                <hr className="player__page-divider" />
                {summaryParagraphs.length > 0 ? (
                  <div className="player__page-summary-wrap">
                    {summaryParagraphs.map((paragraph, index) => (
                      <p
                        key={`${book.id}-read-${index}`}
                        className="player__page-summary"
                        style={{ fontSize }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="player__page-summary">No text available for this book.</p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Read;
