import { useEffect, useMemo, useState } from "react";
import { BsClock, BsBook, BsStarFill, BsMicFill, BsFileText, BsLightbulb, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import Sidebar from "../../Components/Sidebar/Sidebar";
import SearchHeader from "../../Components/SearchHeader/SearchHeader";
import { BOOK_BY_ID_API } from "../../utils/api";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioDuration, setAudioDuration] = useState(null);
  const [saved, setSaved] = useState(() => {
    try {
      const lib = JSON.parse(localStorage.getItem("myLibrary") || "[]");
      return lib.some((b) => b.id === id);
    } catch {
      return false;
    }
  });

  const handleProtectedAction = (action) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (book?.subscriptionRequired) {
      navigate("/choose-plan", { state: { fromBookId: id } });
      return;
    }
    action();
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
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

  useEffect(() => {
    if (!book?.audioLink) return;
    setAudioDuration(null);
    const audio = new Audio();
    audio.preload = "metadata";
    const onLoaded = () => {
      const secs = audio.duration;
      if (!isFinite(secs)) return;
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      setAudioDuration(`${m}:${String(s).padStart(2, "0")}`);
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.src = book.audioLink;
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.src = "";
    };
  }, [book?.audioLink]);

  return (
    <div className="for-you-page">
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <SearchHeader query={query} setQuery={setQuery} onSubmit={handleSearch} />
          <main className="app-main book-page">
            {loading ? (
              <section className="book-details book-details--skeleton">
                <div className="book-details__hero book-details__hero--skeleton">
                  <div className="book-details__content book-details__content--skeleton">
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--text skeleton--short" />
                    <div className="skeleton skeleton--text skeleton--medium" />
                    <div className="skeleton skeleton--pill" />
                    <div className="book-details__type-row book-details__type-row--skeleton">
                      <div className="skeleton skeleton--chip" />
                      <div className="skeleton skeleton--chip" />
                      <div className="skeleton skeleton--chip" />
                    </div>
                    <div className="book-details__actions book-details__actions--skeleton">
                      <div className="skeleton skeleton--button" />
                      <div className="skeleton skeleton--button" />
                    </div>
                    <div className="skeleton skeleton--button skeleton--save" />
                    <div className="book-details__body book-details__body--skeleton">
                      <div className="skeleton skeleton--section-title" />
                      <div className="skeleton skeleton--paragraph" />
                      <div className="skeleton skeleton--paragraph" />
                    </div>
                  </div>
                  <div className="skeleton skeleton--cover" />
                </div>
              </section>
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

                    {book.subscriptionRequired && (
                      <span className="book-details__pill">Premium</span>
                    )}

                    <div className="book-details__type-row">
                      {rating !== null && (
                        <span className="book-details__meta-item">
                          <BsStarFill />
                          {rating.toFixed(1)}
                          {book.totalRating && <span className="book-details__rating-count">({book.totalRating})</span>}
                        </span>
                      )}
                      {audioDuration && (
                        <span className="book-details__type-item"><BsClock /> {audioDuration}</span>
                      )}
                      <span className="book-details__type-item"><BsMicFill /> Audio &amp; Text</span>
                      {keyIdeasCount > 0 && (
                        <span className="book-details__type-item"><BsLightbulb /> {keyIdeasCount} Key Ideas</span>
                      )}
                    </div>

                    <hr className="book-details__divider" />
                    <div className="book-details__actions">
                      {book.audioLink && (
                        <button
                          className="book-details__listen"
                          type="button"
                          onClick={() => handleProtectedAction(() => navigate(`/player/${id}`))}
                        >
                          <FaPlay />
                          Listen
                        </button>
                      )}
                      <button className="book-details__read" type="button" onClick={() => handleProtectedAction(() => {
                        try {
                          const lib = JSON.parse(localStorage.getItem("finishedLibrary") || "[]");
                          if (!lib.some((b) => b.id === book.id)) {
                            lib.push({ id: book.id, title: book.title, author: book.author, imageLink: book.imageLink, subTitle: book.subTitle, averageRating: book.averageRating, subscriptionRequired: book.subscriptionRequired, audioLink: book.audioLink });
                            localStorage.setItem("finishedLibrary", JSON.stringify(lib));
                          }
                        } catch {}
                        navigate(`/read/${id}`);
                      })}>
                        <BsBook />
                        Read
                      </button>
                    </div>
                    <button
                      className={`book-details__save${saved ? " book-details__save--saved" : ""}`}
                      type="button"
                      onClick={() => {
                        if (!auth.currentUser) { navigate("/login"); return; }
                        setSaved((s) => {
                          const next = !s;
                          try {
                            const lib = JSON.parse(localStorage.getItem("myLibrary") || "[]");
                            const updated = next
                              ? [...lib.filter((b) => b.id !== book.id), { id: book.id, title: book.title, author: book.author, imageLink: book.imageLink, subTitle: book.subTitle, averageRating: book.averageRating, subscriptionRequired: book.subscriptionRequired, audioLink: book.audioLink }]
                              : lib.filter((b) => b.id !== book.id);
                            localStorage.setItem("myLibrary", JSON.stringify(updated));
                          } catch {}
                          return next;
                        });
                      }}
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
