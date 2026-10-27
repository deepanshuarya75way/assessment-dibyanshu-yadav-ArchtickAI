import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../redux/store";
import { ChevronDown, LayoutDashboard, LogOut, LifeBuoy, CreditCard, X, Menu, Sparkles } from "lucide-react";
import { logout } from "../redux/authSlice";
import { fetchCredits } from "../redux/profileSlice";
import { motion, AnimatePresence } from "framer-motion";
import type { AppDispatch } from "../redux/store";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { credits } = useSelector((state: RootState) => state.profile);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchCredits());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Community", path: "/community" },
    { name: "Pricing", path: "/pricing" }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');

        /* ── Navbar Shell ── */
        .nav-shell {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 20px 16px;
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .nav-shell { padding: 20px 48px; }
        }

        .nav-bar {
          max-width: 1200px;
          margin: 0 auto;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          pointer-events: auto;
          background: rgba(8, 10, 15, 0.88);
          border: 1px solid rgba(245, 196, 55, 0.14);
          border-radius: 4px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(245,196,55,0.04),
            0 20px 60px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(245,196,55,0.06);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-bar:hover {
          border-color: rgba(245, 196, 55, 0.24);
          box-shadow:
            0 0 0 1px rgba(245,196,55,0.08),
            0 24px 72px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(245,196,55,0.1);
        }

        /* ── Logo ── */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .nav-logo__icon {
          width: 38px; height: 38px;
          border: 1px solid rgba(245,196,55,0.3);
          background: rgba(245,196,55,0.06);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f5c437;
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-logo__icon::before {
          content: '';
          position: absolute;
          inset: 3px;
          border: 1px solid rgba(245,196,55,0.15);
          border-radius: 1px;
        }
        .nav-logo:hover .nav-logo__icon {
          background: rgba(245,196,55,0.12);
          border-color: rgba(245,196,55,0.5);
          box-shadow: 0 0 20px rgba(245,196,55,0.2);
        }
        .nav-logo__text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .nav-logo__name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 17px;
          letter-spacing: -0.02em;
          color: #e8e6e0;
          line-height: 1;
        }
        .nav-logo__name span {
          color: #f5c437;
        }
        .nav-logo__sub {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.25em;
          color: rgba(245,196,55,0.35);
          text-transform: uppercase;
          transition: color 0.3s ease;
        }
        .nav-logo:hover .nav-logo__sub {
          color: rgba(245,196,55,0.6);
        }

        /* ── Desktop Nav Links ── */
        .nav-links {
          display: none;
          align-items: center;
          gap: 2px;
        }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
        }

        .nav-link {
          position: relative;
          padding: 8px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: color 0.2s ease;
          color: rgba(232,230,224,0.35);
        }
        .nav-link:hover {
          color: rgba(232,230,224,0.8);
        }
        .nav-link--active {
          color: #f5c437 !important;
        }
        .nav-link__pill {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(245,196,55,0.2);
          background: rgba(245,196,55,0.04);
          border-radius: 2px;
          z-index: -1;
        }

        /* ── Right Side Actions ── */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* ── Credits Badge ── */
        .nav-credits {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border: 1px solid rgba(245,196,55,0.15);
          background: rgba(245,196,55,0.04);
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          color: rgba(245,196,55,0.7);
        }
        @media (min-width: 1024px) {
          .nav-credits { display: flex; }
        }

        /* ── Profile Button ── */
        .nav-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 6px;
          border: 1px solid rgba(245,196,55,0.12);
          background: rgba(245,196,55,0.03);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-profile-btn:hover {
          border-color: rgba(245,196,55,0.28);
          background: rgba(245,196,55,0.06);
        }
        .nav-profile-avatar {
          width: 32px; height: 32px;
          border: 1px solid rgba(245,196,55,0.3);
          background: rgba(245,196,55,0.1);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 13px;
          color: #f5c437;
        }
        .nav-profile-name {
          display: none;
          flex-direction: column;
          gap: 2px;
        }
        @media (min-width: 640px) {
          .nav-profile-name { display: flex; }
        }
        .nav-profile-name p {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #e8e6e0;
          text-transform: capitalize;
          margin: 0;
        }

        /* ── Dropdown ── */
        .nav-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          width: 260px;
          background: rgba(8,10,15,0.97);
          border: 1px solid rgba(245,196,55,0.18);
          border-radius: 4px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,196,55,0.05);
          z-index: 110;
          overflow: hidden;
          backdrop-filter: blur(24px);
        }
        .nav-dropdown__header {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(245,196,55,0.08);
          background: rgba(245,196,55,0.02);
        }
        .nav-dropdown__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          color: rgba(245,196,55,0.4);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .nav-dropdown__email {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #e8e6e0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nav-dropdown__items {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-dropdown__item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 2px;
          text-decoration: none;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232,230,224,0.4);
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }
        .nav-dropdown__item:hover {
          color: rgba(245,196,55,0.9);
          background: rgba(245,196,55,0.05);
        }
        .nav-dropdown__item-icon {
          width: 28px; height: 28px;
          border: 1px solid rgba(245,196,55,0.1);
          background: rgba(245,196,55,0.03);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .nav-dropdown__item:hover .nav-dropdown__item-icon {
          border-color: rgba(245,196,55,0.3);
          background: rgba(245,196,55,0.08);
        }
        .nav-dropdown__divider {
          height: 1px;
          background: rgba(245,196,55,0.07);
          margin: 4px 8px;
        }
        .nav-dropdown__logout {
          color: rgba(239,68,68,0.5) !important;
        }
        .nav-dropdown__logout:hover {
          color: rgba(239,68,68,0.9) !important;
          background: rgba(239,68,68,0.06) !important;
        }
        .nav-dropdown__logout .nav-dropdown__item-icon {
          border-color: rgba(239,68,68,0.1);
        }
        .nav-dropdown__logout:hover .nav-dropdown__item-icon {
          border-color: rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.08);
        }

        /* ── Auth Buttons ── */
        .nav-signin {
          display: none;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(232,230,224,0.35);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          transition: color 0.2s ease;
        }
        @media (min-width: 640px) {
          .nav-signin { display: block; }
        }
        .nav-signin:hover { color: rgba(232,230,224,0.8); }

        .nav-getstarted {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: #f5c437;
          color: #080a0f;
          border: none;
          padding: 10px 20px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px rgba(245,196,55,0.2);
        }
        .nav-getstarted:hover {
          background: #fcd94e;
          box-shadow: 0 0 30px rgba(245,196,55,0.4);
        }
        .nav-getstarted:active { transform: scale(0.97); }

        /* ── Mobile Menu Toggle ── */
        .nav-mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border: 1px solid rgba(245,196,55,0.15);
          background: rgba(245,196,55,0.04);
          border-radius: 2px;
          color: rgba(245,196,55,0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        @media (min-width: 768px) {
          .nav-mobile-toggle { display: none; }
        }
        .nav-mobile-toggle:hover {
          border-color: rgba(245,196,55,0.3);
          color: #f5c437;
          background: rgba(245,196,55,0.08);
        }
        .nav-mobile-toggle:active { transform: scale(0.92); }

        /* ── Mobile Sidebar ── */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 120;
        }
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 100%;
          max-width: 300px;
          background: #080a0f;
          border-left: 1px solid rgba(245,196,55,0.15);
          z-index: 130;
          display: flex;
          flex-direction: column;
          padding: 28px 20px;
          box-shadow: -20px 0 60px rgba(0,0,0,0.7);
        }
        .mobile-drawer__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(245,196,55,0.08);
        }
        .mobile-drawer__title {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(245,196,55,0.5);
        }
        .mobile-close-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(245,196,55,0.15);
          background: rgba(245,196,55,0.04);
          border-radius: 2px;
          color: rgba(245,196,55,0.5);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-close-btn:hover {
          border-color: rgba(245,196,55,0.35);
          color: #f5c437;
          background: rgba(245,196,55,0.08);
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          overflow-y: auto;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(232,230,224,0.35);
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover, .mobile-nav-link--active {
          color: #f5c437;
          border-color: rgba(245,196,55,0.15);
          background: rgba(245,196,55,0.04);
        }
        .mobile-drawer__footer {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(245,196,55,0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-signin-btn {
          width: 100%;
          padding: 14px;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(232,230,224,0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .mobile-signin-btn:hover { color: rgba(232,230,224,0.7); }
        .mobile-join-btn {
          width: 100%;
          padding: 14px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: #f5c437;
          color: #080a0f;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px rgba(245,196,55,0.2);
        }
        .mobile-join-btn:hover { background: #fcd94e; box-shadow: 0 0 30px rgba(245,196,55,0.35); }
        .mobile-join-btn:active { transform: scale(0.97); }
        .mobile-logout-btn {
          width: 100%;
          padding: 14px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.15);
          color: rgba(239,68,68,0.6);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-logout-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: rgba(239,68,68,0.9);
        }
        .mobile-logout-btn:active { transform: scale(0.97); }
      `}</style>

      <div className="nav-shell">
        <nav className="nav-bar">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo__icon">
              <Sparkles size={18} />
            </div>
            <div className="nav-logo__text">
              <span className="nav-logo__name">
                Architect<span>AI</span>
              </span>
              <span className="nav-logo__sub">Web Engines</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "nav-link--active" : ""}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-pill" className="nav-link__pill" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                {/* Credits */}
                <div className="nav-credits">
                  <CreditCard size={12} />
                  <span>{credits} CREDITS</span>
                </div>

                {/* Profile Dropdown */}
                <div style={{ position: "relative" }} ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="nav-profile-btn"
                  >
                    <div className="nav-profile-avatar">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="nav-profile-name">
                      <p>{user?.name?.split(" ")[0]}</p>
                    </div>
                    <ChevronDown
                      size={12}
                      style={{
                        color: profileOpen ? "#f5c437" : "rgba(245,196,55,0.3)",
                        transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "all 0.3s ease"
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="nav-dropdown"
                      >
                        <div className="nav-dropdown__header">
                          <p className="nav-dropdown__eyebrow">Architecture ID</p>
                          <p className="nav-dropdown__email">{user?.email}</p>
                        </div>

                        <div className="nav-dropdown__items">
                          <Link
                            to="/projects"
                            onClick={() => setProfileOpen(false)}
                            className="nav-dropdown__item"
                          >
                            <div className="nav-dropdown__item-icon">
                              <LayoutDashboard size={14} />
                            </div>
                            Dashboard
                          </Link>

                          <Link
                            to="/support"
                            onClick={() => setProfileOpen(false)}
                            className="nav-dropdown__item"
                          >
                            <div className="nav-dropdown__item-icon">
                              <LifeBuoy size={14} />
                            </div>
                            Support
                          </Link>

                          <div className="nav-dropdown__divider" />

                          <button
                            onClick={handleLogout}
                            className="nav-dropdown__item nav-dropdown__logout"
                          >
                            <div className="nav-dropdown__item-icon">
                              <LogOut size={14} />
                            </div>
                            Secure Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="nav-signin"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="nav-getstarted"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile Toggle */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="mobile-overlay"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="mobile-drawer"
            >
              <div className="mobile-drawer__top">
                <span className="mobile-drawer__title">Navigation</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="mobile-close-btn"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mobile-nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`mobile-nav-link ${location.pathname === link.path ? "mobile-nav-link--active" : ""}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/support"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  Support
                </Link>
              </div>

              <div className="mobile-drawer__footer">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/login"); }}
                      className="mobile-signin-btn"
                    >
                      Already an architect? Sign in
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/signup"); }}
                      className="mobile-join-btn"
                    >
                      Join the Syndicate
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="mobile-logout-btn"
                  >
                    Secure Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;