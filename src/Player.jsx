import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdForward10 } from "react-icons/md";
import Sidebar from "./Sidebar";

const BOOK_BY_ID_API = "https://us-central1-summaristt.cloudfunctions.net/getBook?id=";

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let isMounted = true;
    fetch(`${BOOK_BY_ID_API}${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        setBook(Array.isArray(data) ? data[0] : data);
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

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const handleVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const skip = (secs) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + secs, 0), duration);
  };

  const keyIdeas = useMemo(() => {
    if (!book?.keyIdeas) return [];
    if (typeof book.keyIdeas === "number") return [];
    if (Array.isArray(book.keyIdeas)) return book.keyIdeas.map((k) => String(k).trim()).filter(Boolean);
    return String(book.keyIdeas).split("\n").map((k) => k.trim()).filter(Boolean);
  }, [book]);

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
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search__btn" type="button" onClick={handleSearch} aria-label="Search">
                  <BsSearch />
                </button>
              </div>
            </div>
          </header>

          <main className="app-main">
            {loading ? (
              <div className="book-page__state">Loading...</div>
            ) : !book ? (
              <div className="book-page__state">Book not found.</div>
            ) : (
              <div className="player__page-content">
                <h1 className="player__page-title">{book.title}</h1>
              </div>
            )}
          </main>

          {!loading && book && (
            <footer className="player__footer">
              {book.audioLink && (
                <audio
                  ref={audioRef}
                  src={book.audioLink}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onEnded={() => setPlaying(false)}
                />
              )}

              {/* Book info */}
              <div className="player__book-info">
                <img className="player__cover" src={book.imageLink} alt={book.title} />
                <div>
                  <p className="player__title">{book.title}</p>
                  <p className="player__author">{book.author}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="player__controls">
                <div className="player__progress-row">
                  <span className="player__time">{formatTime(currentTime)}</span>
                  <input
                    className="player__seek"
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                  />
                  <span className="player__time">{formatTime(duration)}</span>
                </div>
                <div className="player__btn-row">
                  <button className="player__skip-btn" type="button" onClick={() => skip(-10)} aria-label="Rewind 10 seconds">
                    <MdReplay10 />
                  </button>
                  <button className="player__play-btn" type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <FaPause /> : <FaPlay />}
                  </button>
                  <button className="player__skip-btn" type="button" onClick={() => skip(10)} aria-label="Skip 10 seconds">
                    <MdForward10 />
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="player__volume-row">
                <span className="player__volume-label">Volume</span>
                <input
                  className="player__volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolume}
                />
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Player;
