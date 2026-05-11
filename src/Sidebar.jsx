import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { BsSearch, BsBookmark, BsPencil } from "react-icons/bs";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { RiHome6Line } from "react-icons/ri";
import logoImage from "../assets/logo.png";
import { useFontSize, FONT_SIZE_OPTIONS } from "./FontSizeContext";

const links = [
  { to: "/for-you", label: "For You", icon: <RiHome6Line /> },
  { to: "/library", label: "My Library", icon: <BsBookmark /> },
  { to: "/highlights", label: "Highlights", icon: <BsPencil />, disabled: true },
  { to: "/search", label: "Search", icon: <BsSearch />, disabled: true },
];

const bottomLinks = [
  { to: "/settings", label: "Settings", icon: <IoSettingsOutline /> },
  { label: "Help & Support", icon: <HiOutlineQuestionMarkCircle />, disabled: true },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fontSize, setFontSize } = useFontSize();
  const isPlayerOrReadPage = location.pathname.startsWith("/player/") || location.pathname.startsWith("/read/");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <Link to="/for-you" className="sidebar__logo" aria-label="Summarist home">
        <img className="sidebar__logo-img" src={logoImage} alt="Summarist" />
      </Link>
      <nav className="sidebar__nav">
        {links.map(({ to, label, icon, disabled }) =>
          disabled ? (
            <span
              key={to}
              className="sidebar__link sidebar__link--disabled"
              aria-disabled="true"
              title="Coming soon"
            >
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
            </span>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
            >
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
            </NavLink>
          )
        )}
      </nav>

      {isPlayerOrReadPage && (
      <div className="sidebar__font-size">
        <div className="sidebar__font-size-options">
          {FONT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.name}
              type="button"
              className={`sidebar__font-size-btn${fontSize === opt.size ? " sidebar__font-size-btn--active" : ""}`}
              onClick={() => setFontSize(opt.size)}
              title={opt.name}
              style={{ fontSize: opt.size }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      )}

      <div className="sidebar__bottom">
        {bottomLinks.map(({ to, label, icon, disabled }) =>
          disabled ? (
            <span
              key={label}
              className="sidebar__link sidebar__action sidebar__link--disabled"
              aria-disabled="true"
              title="Coming soon"
            >
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
            </span>
          ) : to ? (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__action sidebar__link--active"
                  : "sidebar__link sidebar__action"
              }
            >
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
            </NavLink>
          ) : (
            <button key={label} type="button" className="sidebar__link sidebar__action">
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
            </button>
          )
        )}
        <button type="button" className="sidebar__link sidebar__action" onClick={handleLogout}>
          <span className="sidebar__icon">
            <IoLogOutOutline />
          </span>
          <span className="sidebar__label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
