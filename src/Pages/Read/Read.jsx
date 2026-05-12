import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import SearchHeader from "../../Components/SearchHeader/SearchHeader";
import { useFontSize } from "../../FontSizeContext";
import { BOOK_BY_ID_API } from "../../utils/api";
import "./Read.css";

function Read() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setBook(null);

    fetch(`${BOOK_BY_ID_API}${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const fetched = Array.isArray(data) ? data[0] : data;
        if (fetched?.subscriptionRequired) {
          navigate("/choose-plan", { state: { fromBookId: id } });
          return;
        }
        setBook(fetched || null);
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
  }, [id, navigate]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const summaryText = useMemo(() => {
    if (!book) return "";
    return String(book.summary || book.bookDescription || "").trim();
  }, [book]);

  const summaryParagraphs = useMemo(() => {
    if (!summaryText) return [];

    const normalized = summaryText.replace(/\r\n/g, "\n").trim();
    let paragraphs = normalized
      .split(/\n\s*\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (paragraphs.length === 1 && normalized.includes("\n")) {
      paragraphs = normalized
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
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

          <main className="app-main read-page">
            {loading ? (
              <section className="read-content read-content--skeleton">
                <div className="skeleton skeleton--title" />
                <div className="skeleton skeleton--paragraph" />
                <div className="skeleton skeleton--paragraph" />
                <div className="skeleton skeleton--paragraph skeleton--paragraph-long" />
              </section>
            ) : !book ? (
              <div className="book-page__state">
                <h2>Book not found</h2>
                <p>No book was found for id: {id}</p>
              </div>
            ) : (
              <section className="read-content">
                <header className="read-content__header">
                  <h1 className="read-content__title">{book.title}</h1>
                  <p className="read-content__author">By {book.author}</p>
                </header>

                <hr className="read-content__divider" />

                {summaryParagraphs.length > 0 ? (
                  <div className="read-content__body">
                    {summaryParagraphs.map((paragraph, index) => (
                      <p key={`${book.id}-read-${index}`} className="read-content__paragraph" style={{ fontSize }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="read-content__paragraph">No readable summary text is available for this book.</p>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Read;
