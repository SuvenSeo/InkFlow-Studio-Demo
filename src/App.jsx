import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Bold,
  BookMarked,
  BookOpen,
  Bookmark,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Database,
  Eye,
  Facebook,
  Filter,
  Flame,
  Gauge,
  Globe2,
  Heart,
  Image,
  Italic,
  KeyRound,
  Library,
  Lock,
  LogOut,
  LogIn,
  Mail,
  Maximize2,
  Megaphone,
  MessageCircle,
  MessageSquarePlus,
  Moon,
  Paintbrush,
  PanelLeftClose,
  PenLine,
  Play,
  Plus,
  Radio,
  Reply,
  Search,
  Send,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Tags,
  Timer,
  Trash2,
  Unlock,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { badges, chapters, comments, moderationItems, notifications, stories } from "./data.js";

const navItems = [
  { id: "discover", label: "Discover", icon: Search },
  { id: "reader", label: "Reader", icon: BookOpen },
  { id: "writer", label: "Write", icon: PenLine },
  { id: "premium", label: "Premium", icon: Crown },
  { id: "auth", label: "Login", icon: LogIn },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

const genres = ["All", "Fantasy", "Romance", "Sci-Fi", "Mystery"];
const sortOptions = ["Trending", "For You", "Top Rated", "New Updates"];
const EMPTY_AD_PLACEMENTS = {};
const initialReviews = [
  { id: 1, name: "Nethmi", rating: 5, text: "Clean pacing and the chapter controls make it easy to stay immersed." },
  { id: 2, name: "Rowan", rating: 4, text: "The premium preview is clear without feeling disruptive." },
];

function App() {
  const [activeView, setActiveView] = useState("discover");
  const [selectedStoryId, setSelectedStoryId] = useState(stories[0].id);
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [query, setQuery] = useState("");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [membership, setMembership] = useState("free");
  const [savedStories, setSavedStories] = useState(new Set(["cafe-after-midnight"]));
  const [followedAuthors, setFollowedAuthors] = useState(new Set(["Mira Vale"]));
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [toast, setToast] = useState("");
  const [commentsState, setCommentsState] = useState(comments);
  const [reviews, setReviews] = useState(initialReviews);
  const [unlockedChapters, setUnlockedChapters] = useState(new Set());
  const [readingHistory, setReadingHistory] = useState([
    { storyId: "sable-crown", chapter: 29, progress: 68, lastRead: "Today" },
    { storyId: "orbit-seven", chapter: 7, progress: 22, lastRead: "Yesterday" },
    { storyId: "cafe-after-midnight", chapter: 48, progress: 84, lastRead: "May 18" },
  ]);
  const [notificationList, setNotificationList] = useState(notifications);
  const [moderationQueue, setModerationQueue] = useState(moderationItems);
  const [brandLogo, setBrandLogo] = useState("InkFlow");
  const [brandAccent, setBrandAccent] = useState("#f0c66b");
  const [brandBanner, setBrandBanner] = useState("Seasonal reads");
  const [adPlacements, setAdPlacements] = useState({
    "Homepage banner": true,
    "Story details page": true,
    "Between chapter sections": true,
    "Middle of chapter": true,
    "End of chapter": true,
  });
  const [broadcastStatus, setBroadcastStatus] = useState("Ready");
  const [onlineReaders, setOnlineReaders] = useState(41000);

  const selectedStory = stories.find((story) => story.id === selectedStoryId) ?? stories[0];

  const filteredStories = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return stories
      .filter((story) => {
        const searchable = `${story.title} ${story.author} ${story.genre} ${story.tags.join(" ")}`;
        return (
          (genre === "All" || story.genre === genre) &&
          (!premiumOnly || story.premium) &&
          story.rating >= minRating &&
          searchable.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        if (sortBy === "Top Rated") return b.rating - a.rating;
        if (sortBy === "For You") return b.progress - a.progress;
        if (sortBy === "New Updates") return b.chapters - a.chapters;
        return b.trend - a.trend;
      });
  }, [genre, minRating, premiumOnly, query, sortBy]);

  useEffect(() => {
    if (!toast) return undefined;
    const handle = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(handle);
  }, [toast]);

  useEffect(() => {
    document.title = `${brandLogo} Studio Demo`;
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#151712"/><circle cx="34" cy="28" r="15" fill="${brandAccent.replace("#", "%23")}"/><path d="M20 39h25v6H20z" fill="%23fff8e7"/></svg>`;
      favicon.href = `data:image/svg+xml,${svg}`;
    }
  }, [brandAccent, brandLogo]);

  function openAuth(mode = "login") {
    setAuthMode(mode);
    setAuthOpen(true);
    setActiveView("auth");
  }

  function showToast(message) {
    setToast(message);
  }

  function requireAuth(action, mode = "login") {
    if (!user) {
      setAuthMode(mode);
      setAuthOpen(true);
      setActiveView("auth");
      showToast("Sign in to use this demo workflow.");
      return false;
    }
    action?.();
    return true;
  }

  function handleAuthSubmit(provider, form = {}) {
    const nextUser = {
      name: form.name || (provider === "Email" ? "Demo Reader" : `${provider} Demo User`),
      email: form.email || `${provider.toLowerCase()}@inkflow.demo`,
      provider,
      role: form.role || "Reader",
      country: form.country || "Sri Lanka",
    };
    setUser(nextUser);
    setAuthOpen(false);
    setMembership(form.plan === "premium" ? "premium" : membership);
    showToast(`${nextUser.name} signed in with ${provider}.`);
  }

  function signOut() {
    setUser(null);
    setMembership("free");
    showToast("Signed out of the demo account.");
  }

  function toggleSaved(id) {
    requireAuth(() => {
      setSavedStories((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      showToast("Library updated.");
    });
  }

  function toggleFollow(author) {
    requireAuth(() => {
      setFollowedAuthors((current) => {
        const next = new Set(current);
        if (next.has(author)) next.delete(author);
        else next.add(author);
        return next;
      });
      showToast(`Author follow list updated for ${author}.`);
    });
  }

  function activatePremium() {
    requireAuth(() => {
      setMembership("premium");
      showToast("Premium enabled: ads are hidden and locked chapters open.");
    });
  }

  function buyChapter(storyId = selectedStory.id, chapter = 1) {
    requireAuth(() => {
      setUnlockedChapters((current) => {
        const next = new Set(current);
        next.add(`${storyId}:${chapter}`);
        return next;
      });
      showToast("Demo payment accepted. Chapter unlocked.");
    });
  }

  function updateReadingHistory(storyId, progress, chapter) {
    setReadingHistory((current) => {
      const existing = current.filter((item) => item.storyId !== storyId);
      return [{ storyId, progress, chapter, lastRead: "Just now" }, ...existing].slice(0, 5);
    });
  }

  function sendBroadcast(audience = "All users", message = "New premium chapters are live this weekend.") {
    const nextNotification = {
      title: message.slice(0, 38),
      group: audience,
      status: "Queued",
      reach: audience === "All users" ? "1.8M" : "72K",
    };
    setNotificationList((current) => [nextNotification, ...current]);
    setBroadcastStatus("BullMQ queued");
    window.setTimeout(() => {
      setBroadcastStatus("FCM delivered");
      setNotificationList((current) =>
        current.map((item, index) => (index === 0 ? { ...item, status: "Delivered" } : item)),
      );
    }, 900);
  }

  function updateModeration(name, status) {
    setModerationQueue((current) =>
      current.map((item) => (item.name === name ? { ...item, status, risk: status === "Rejected" ? "High" : "Low" } : item)),
    );
    showToast(`${name} marked ${status}.`);
  }

  function toggleAdPlacement(label) {
    setAdPlacements((current) => ({ ...current, [label]: !current[label] }));
  }

  return (
    <div className="app" style={{ "--brand-accent": brandAccent }}>
      <aside className="rail" aria-label="Primary">
        <button className="brand-mark" type="button" onClick={() => setActiveView("discover")}>
          <span className="brand-leaf" aria-hidden="true" />
          <span>{brandLogo}</span>
        </button>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activeView === item.id ? "nav-item active" : "nav-item"}
                type="button"
                onClick={() => setActiveView(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="auth-stack">
          {user ? (
            <>
              <div className="mini-title">Signed in</div>
              <div className="profile-chip">
                <span>{user.name.slice(0, 1)}</span>
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.role} · {membership}</small>
                </div>
              </div>
              <button className="auth-button" type="button" onClick={signOut}>
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="mini-title">Sign in</div>
              <button className="auth-button" type="button" onClick={() => openAuth("login")}>
                <LogIn size={16} />
                Email
              </button>
              <button className="auth-button" type="button" onClick={() => handleAuthSubmit("Google")}>
                <GoogleIcon />
                Google
              </button>
              <button className="auth-button" type="button" onClick={() => handleAuthSubmit("Facebook")}>
                <Facebook size={16} />
                Facebook
              </button>
              <button className="auth-button" type="button" onClick={() => handleAuthSubmit("Apple")}>
                <AppleIcon />
                Apple
              </button>
            </>
          )}
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Reader + writer platform demo</p>
            <h1>{viewTitle(activeView)}</h1>
          </div>
          <div className="topbar-actions">
            <button
              className={membership === "premium" ? "pill-button strong" : "pill-button"}
              type="button"
              onClick={membership === "premium" ? () => setMembership("free") : activatePremium}
            >
              <Crown size={16} />
              {membership === "premium" ? "Premium active" : "Free tier"}
            </button>
            {user ? (
              <button className="pill-button" type="button" onClick={() => setActiveView("auth")}>
                <UserCheck size={16} />
                {user.name}
              </button>
            ) : (
              <button className="pill-button" type="button" onClick={() => openAuth("register")}>
                <UserPlus size={16} />
                Register
              </button>
            )}
            <button className="icon-button" type="button" aria-label="Notifications" onClick={() => showToast(`${notificationList.length} demo notifications available.`)}>
              <Bell size={18} />
            </button>
          </div>
        </header>

        {activeView === "discover" && (
          <DiscoverView
            filteredStories={filteredStories}
            genre={genre}
            setGenre={setGenre}
            sortBy={sortBy}
            setSortBy={setSortBy}
            query={query}
            setQuery={setQuery}
            premiumOnly={premiumOnly}
            setPremiumOnly={setPremiumOnly}
            minRating={minRating}
            setMinRating={setMinRating}
            setSelectedStoryId={setSelectedStoryId}
            setActiveView={setActiveView}
            savedStories={savedStories}
            toggleSaved={toggleSaved}
            membership={membership}
            user={user}
            readingHistory={readingHistory}
            brandBanner={brandBanner}
            adPlacements={adPlacements}
          />
        )}

        {activeView === "reader" && (
          <ReaderView
            story={selectedStory}
            membership={membership}
            setMembership={setMembership}
            unlockedChapters={unlockedChapters}
            buyChapter={buyChapter}
            isSaved={savedStories.has(selectedStory.id)}
            toggleSaved={() => toggleSaved(selectedStory.id)}
            isFollowed={followedAuthors.has(selectedStory.author)}
            toggleFollow={() => toggleFollow(selectedStory.author)}
            user={user}
            requireAuth={requireAuth}
            comments={commentsState}
            setComments={setCommentsState}
            reviews={reviews}
            setReviews={setReviews}
            updateReadingHistory={updateReadingHistory}
            adPlacements={adPlacements}
          />
        )}

        {activeView === "writer" && <WriterView />}

        {activeView === "auth" && (
          <AuthView
            user={user}
            authMode={authMode}
            setAuthMode={setAuthMode}
            handleAuthSubmit={handleAuthSubmit}
            signOut={signOut}
            membership={membership}
            setActiveView={setActiveView}
          />
        )}

        {activeView === "premium" && (
          <PremiumView
            membership={membership}
            setMembership={setMembership}
            story={selectedStory}
            activatePremium={activatePremium}
            buyChapter={buyChapter}
            unlockedChapters={unlockedChapters}
            user={user}
          />
        )}

        {activeView === "admin" && (
          <AdminView
            brandLogo={brandLogo}
            setBrandLogo={setBrandLogo}
            brandAccent={brandAccent}
            setBrandAccent={setBrandAccent}
            brandBanner={brandBanner}
            setBrandBanner={setBrandBanner}
            notificationList={notificationList}
            moderationQueue={moderationQueue}
            updateModeration={updateModeration}
            adPlacements={adPlacements}
            toggleAdPlacement={toggleAdPlacement}
            broadcastStatus={broadcastStatus}
            sendBroadcast={sendBroadcast}
            onlineReaders={onlineReaders}
            setOnlineReaders={setOnlineReaders}
          />
        )}
      </main>
      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          onSubmit={handleAuthSubmit}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function viewTitle(activeView) {
  const titles = {
    discover: "Discover stories",
    reader: "Reading room",
    writer: "Author studio",
    premium: "Memberships",
    auth: "Secure access",
    admin: "Operations center",
  };
  return titles[activeView];
}

function AuthView({ user, authMode, setAuthMode, handleAuthSubmit, signOut, membership, setActiveView }) {
  return (
    <section className="auth-page">
      <div className="auth-copy">
        <span className="genre-chip">Secure access demo</span>
        <h2>One account for reading, writing, premium, comments, and admin handoff.</h2>
        <p>
          This front-end demo simulates protected sessions, OAuth providers, email registration,
          reader/writer roles, and premium account state so the client can click through real product flows.
        </p>
        <div className="security-grid">
          {[
            ["OAuth", "Google, Facebook, Apple"],
            ["Email", "Password demo validation"],
            ["Roles", "Reader or writer onboarding"],
            ["Session", "Local state protected actions"],
          ].map(([label, value]) => (
            <div key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-card">
        {user ? (
          <div className="account-panel">
            <div className="account-avatar">{user.name.slice(0, 1)}</div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <div className="account-grid">
              <Metric label="Provider" value={user.provider} />
              <Metric label="Role" value={user.role} />
              <Metric label="Country" value={user.country} />
              <Metric label="Plan" value={membership} />
            </div>
            <div className="locked-actions">
              <button className="primary-action" type="button" onClick={() => setActiveView("discover")}>
                <BookOpen size={16} />
                Continue demo
              </button>
              <button className="pill-button" type="button" onClick={signOut}>
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <AuthForm mode={authMode} setMode={setAuthMode} onSubmit={handleAuthSubmit} />
        )}
      </div>
    </section>
  );
}

function AuthModal({ mode, setMode, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button className="icon-button modal-close" type="button" aria-label="Close login" onClick={onClose}>
          <X size={18} />
        </button>
        <h2 id="auth-modal-title">{mode === "register" ? "Create demo account" : "Sign in required"}</h2>
        <AuthForm mode={mode} setMode={setMode} onSubmit={onSubmit} compact />
      </section>
    </div>
  );
}

function AuthForm({ mode, setMode, onSubmit, compact = false }) {
  const [form, setForm] = useState({
    name: "Demo Reader",
    email: "reader@inkflow.demo",
    password: "demo-password",
    role: "Reader",
    country: "Sri Lanka",
    plan: "free",
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit("Email", form);
  }

  return (
    <div className={compact ? "auth-form compact" : "auth-form"}>
      <div className="auth-tabs">
        <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
          Login
        </button>
        <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>
          Register
        </button>
      </div>

      <div className="oauth-grid">
        <button type="button" onClick={() => onSubmit("Google", { role: form.role, country: form.country })}>
          <GoogleIcon />
          Google
        </button>
        <button type="button" onClick={() => onSubmit("Facebook", { role: form.role, country: form.country })}>
          <Facebook size={16} />
          Facebook
        </button>
        <button type="button" onClick={() => onSubmit("Apple", { role: form.role, country: form.country })}>
          <AppleIcon />
          Apple
        </button>
      </div>

      <form className="auth-fields" onSubmit={submit}>
        {mode === "register" && (
          <label className="field-stack">
            <span>Name</span>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </label>
        )}
        <label className="field-stack">
          <span>Email</span>
          <div className="input-with-icon">
            <Mail size={16} />
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </div>
        </label>
        <label className="field-stack">
          <span>Password</span>
          <div className="input-with-icon">
            <KeyRound size={16} />
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              minLength={8}
              required
            />
          </div>
        </label>
        {mode === "register" && (
          <div className="split-fields">
            <label className="field-stack">
              <span>Role</span>
              <select value={form.role} onChange={(event) => updateField("role", event.target.value)}>
                <option>Reader</option>
                <option>Writer</option>
                <option>Reader + Writer</option>
              </select>
            </label>
            <label className="field-stack">
              <span>Country</span>
              <select value={form.country} onChange={(event) => updateField("country", event.target.value)}>
                <option>Sri Lanka</option>
                <option>United States</option>
                <option>India</option>
                <option>United Kingdom</option>
              </select>
            </label>
          </div>
        )}
        <label className="field-stack">
          <span>Plan</span>
          <select value={form.plan} onChange={(event) => updateField("plan", event.target.value)}>
            <option value="free">Free tier</option>
            <option value="premium">Premium tier</option>
          </select>
        </label>
        <button className="primary-action wide" type="submit">
          <ShieldCheck size={16} />
          {mode === "register" ? "Create secure account" : "Sign in with email"}
        </button>
      </form>
    </div>
  );
}

function DiscoverView({
  filteredStories,
  genre,
  setGenre,
  sortBy,
  setSortBy,
  query,
  setQuery,
  premiumOnly,
  setPremiumOnly,
  minRating,
  setMinRating,
  setSelectedStoryId,
  setActiveView,
  savedStories,
  toggleSaved,
  membership,
  user,
  readingHistory,
  brandBanner,
  adPlacements,
}) {
  return (
    <section className="view-grid discover-grid">
      <div className="discovery-panel">
        <div className="promo-banner">
          <div>
            <span>{brandBanner}</span>
            <strong>{user ? `Welcome back, ${user.name}` : "Browse, read, write, and unlock premium chapters"}</strong>
          </div>
          <button className="pill-button" type="button" onClick={() => setActiveView(user ? "reader" : "auth")}>
            {user ? <BookOpen size={16} /> : <LogIn size={16} />}
            {user ? "Resume" : "Login demo"}
          </button>
        </div>
        <div className="search-row">
          <label className="search-box">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, tag, author"
            />
          </label>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="advanced-filters">
          <span>
            <Filter size={15} />
            Smart filters
          </span>
          <label>
            <input
              type="checkbox"
              checked={premiumOnly}
              onChange={(event) => setPremiumOnly(event.target.checked)}
            />
            Premium only
          </label>
          <label>
            Min rating
            <select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
              <option value="0">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </select>
          </label>
          <strong>{filteredStories.length} matches</strong>
        </div>

        <div className="segmented" aria-label="Genres">
          {genres.map((item) => (
            <button
              key={item}
              className={genre === item ? "active" : ""}
              type="button"
              onClick={() => setGenre(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="story-list">
          {filteredStories.map((story) => (
            <article className="story-card" key={story.id}>
              <img src={story.image} alt="" />
              <div className="story-card-body">
                <div className="story-line">
              <span className="genre-chip">{story.genre}</span>
                  {story.verified && (
                    <span className="verified">
                      <BadgeCheck size={15} />
                      Verified
                    </span>
                  )}
                  {story.premium && (
                    <span className="premium-chip">
                      <Crown size={14} />
                      Premium
                    </span>
                  )}
                </div>
                <h2>{story.title}</h2>
                <p>{story.blurb}</p>
                <div className="meta-grid">
                  <span>
                    <Eye size={15} />
                    {story.reads}
                  </span>
                  <span>
                    <Star size={15} />
                    {story.rating}
                  </span>
                  <span>
                    <Flame size={15} />
                    {story.trend}
                  </span>
                  <span>
                    <BookOpen size={15} />
                    {story.chapters}
                  </span>
                </div>
                <div className="tag-row">
                  {story.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <div className="card-actions">
                  <button
                    className="primary-action"
                    type="button"
                    onClick={() => {
                      setSelectedStoryId(story.id);
                      setActiveView("reader");
                    }}
                  >
                    <Play size={16} />
                    Read
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={savedStories.has(story.id) ? "Remove bookmark" : "Add bookmark"}
                    onClick={() => toggleSaved(story.id)}
                  >
                    <Bookmark size={17} fill={savedStories.has(story.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="right-stack">
        <ContinueReading
          membership={membership}
          readingHistory={readingHistory}
          setSelectedStoryId={setSelectedStoryId}
          setActiveView={setActiveView}
          adPlacements={adPlacements}
        />
        <LibraryPanel savedStories={savedStories} setSelectedStoryId={setSelectedStoryId} setActiveView={setActiveView} />
        <RecommendationPanel />
        <BadgeShowcase />
      </aside>
    </section>
  );
}

function ContinueReading({ membership, readingHistory, setSelectedStoryId, setActiveView, adPlacements }) {
  return (
    <section className="surface-panel">
      <div className="section-heading">
        <Library size={18} />
        <h2>Continue reading</h2>
      </div>
      {readingHistory.map((item) => {
        const story = stories.find((candidate) => candidate.id === item.storyId);
        if (!story) return null;
        return (
          <button
            className="compact-row clickable-row"
            key={story.id}
            type="button"
            onClick={() => {
              setSelectedStoryId(story.id);
              setActiveView("reader");
            }}
          >
            <img src={story.image} alt="" />
            <div>
              <strong>{story.title}</strong>
              <span>Chapter {item.chapter} · {item.lastRead}</span>
              <div className="tiny-meter">
                <span style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          </button>
        );
      })}
      <AdSlot label="Homepage banner" membership={membership} adPlacements={adPlacements} />
    </section>
  );
}

function LibraryPanel({ savedStories, setSelectedStoryId, setActiveView }) {
  const saved = stories.filter((story) => savedStories.has(story.id));
  return (
    <section className="surface-panel">
      <div className="section-heading">
        <Bookmark size={18} />
        <h2>Personal library</h2>
      </div>
      {saved.length === 0 ? (
        <p className="muted-copy">Bookmark stories to build a personal library.</p>
      ) : (
        saved.map((story) => (
          <button
            className="manager-row clickable-row library-row"
            key={story.id}
            type="button"
            onClick={() => {
              setSelectedStoryId(story.id);
              setActiveView("reader");
            }}
          >
            <span>{story.title}</span>
            <strong>{story.genre}</strong>
          </button>
        ))
      )}
    </section>
  );
}

function RecommendationPanel() {
  const recommendationRows = [
    { label: "Suggested for you", value: "Romance + royal intrigue", icon: Sparkles },
    { label: "Similar stories", value: "7 tag overlaps", icon: Tags },
    { label: "Trending", value: "Redis hot rank #3", icon: Flame },
  ];
  return (
    <section className="surface-panel">
      <div className="section-heading">
        <Gauge size={18} />
        <h2>Recommendations</h2>
      </div>
      <div className="matrix-box">
        {recommendationRows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="matrix-row">
              <Icon size={17} />
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BadgeShowcase() {
  return (
    <section className="surface-panel">
      <div className="section-heading">
        <ShieldCheck size={18} />
        <h2>Badges</h2>
      </div>
      <div className="badge-grid">
        {badges.map((badge) => (
          <div className="badge-tile" key={badge.label}>
            <span>{badge.type}</span>
            <strong>{badge.label}</strong>
            <small>{badge.value}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReaderView({
  story,
  membership,
  setMembership,
  unlockedChapters,
  buyChapter,
  isSaved,
  toggleSaved,
  isFollowed,
  toggleFollow,
  user,
  requireAuth,
  comments,
  setComments,
  reviews,
  setReviews,
  updateReadingHistory,
  adPlacements,
}) {
  const [theme, setTheme] = useState("sepia");
  const [fontSize, setFontSize] = useState(19);
  const [lineSpacing, setLineSpacing] = useState(1.75);
  const [progress, setProgress] = useState(story.progress || 12);
  const [syncState, setSyncState] = useState("Saved");
  const [elapsed, setElapsed] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [distractionFree, setDistractionFree] = useState(false);
  const readerRef = useRef(null);
  const activeChapter = chapters[chapterIndex] ?? chapters[0];
  const isUnlocked = unlockedChapters.has(`${story.id}:${chapterIndex}`);
  const isLocked = activeChapter.locked && membership !== "premium" && !isUnlocked;

  useEffect(() => {
    setProgress(story.progress || 12);
    setElapsed(0);
    setChapterIndex(0);
  }, [story.id, story.progress]);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSyncState("Saving...");
    const handle = window.setTimeout(() => {
      localStorage.setItem(
        `reading-progress-${story.id}`,
        JSON.stringify({ chapterIndex, progress, elapsed, updatedAt: new Date().toISOString() }),
      );
      updateReadingHistory(story.id, progress, Math.ceil((progress / 100) * story.chapters));
      setSyncState("Saved");
    }, 550);

    return () => window.clearTimeout(handle);
  }, [story.id, story.chapters, progress, chapterIndex]);

  function updateProgress(delta) {
    setProgress((current) => Math.min(100, Math.max(0, current + delta)));
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  return (
    <section className={distractionFree ? "reader-layout distraction-free" : "reader-layout"}>
      {!distractionFree && (
        <aside className="story-details">
          <img className="detail-cover" src={story.image} alt="" />
          <div className="story-line">
            <span className="genre-chip">{story.genre}</span>
            {story.verified && (
              <span className="verified">
                <BadgeCheck size={15} />
                Verified
              </span>
            )}
          </div>
          <h2>{story.title}</h2>
          <p>{story.blurb}</p>
          <div className="detail-actions">
            <button className="pill-button" type="button" onClick={toggleSaved}>
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
              {isSaved ? "Saved" : "Library"}
            </button>
            <button className="pill-button" type="button" onClick={toggleFollow}>
              <Users size={16} />
              {isFollowed ? "Following" : "Follow"}
            </button>
          </div>
          <div className="history-box">
            <strong>Reading history</strong>
            <span>Chapter 18 opened today</span>
            <span>Last sync: {syncState}</span>
          </div>
          <AdSlot label="Story details page" membership={membership} adPlacements={adPlacements} />
        </aside>
      )}

      <article ref={readerRef} className={`reader-surface ${theme}`}>
        <div className="reader-toolbar">
          <button className="icon-text" type="button" onClick={() => setDistractionFree(!distractionFree)}>
            <PanelLeftClose size={16} />
            Focus
          </button>
          <div className="theme-switch">
            {[
              ["light", Sun],
              ["dark", Moon],
              ["sepia", BookMarked],
            ].map(([item, Icon]) => (
              <button
                key={item}
                className={theme === item ? "active" : ""}
                type="button"
                aria-label={`${item} theme`}
                onClick={() => setTheme(item)}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <label className="range-control">
            <span>Text</span>
            <input
              type="range"
              min="16"
              max="24"
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
            />
          </label>
          <label className="range-control">
            <span>Line</span>
            <input
              type="range"
              min="1.35"
              max="2.1"
              step="0.05"
              value={lineSpacing}
              onChange={(event) => setLineSpacing(Number(event.target.value))}
            />
          </label>
          <button className="icon-button" type="button" aria-label="Full screen" onClick={toggleFullscreen}>
            <Maximize2 size={17} />
          </button>
        </div>

        <div className="progress-strip" aria-label="Reading progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <header className="chapter-header">
          <span>{story.author}</span>
          <h2>{activeChapter.title}</h2>
          <div className="chapter-metrics">
            <span>
              <Timer size={15} />
              {story.minutes} min read
            </span>
            <span>
              <Gauge size={15} />
              {progress}%
            </span>
            <span>
              <ClockText seconds={elapsed} />
            </span>
          </div>
        </header>

        {isLocked ? (
          <LockedChapter
            story={story}
            startPremium={() => requireAuth(() => setMembership("premium"))}
            buyChapter={() => buyChapter(story.id, chapterIndex)}
          />
        ) : (
          <div className="chapter-body" style={{ fontSize: `${fontSize}px`, lineHeight: lineSpacing }}>
            {activeChapter.body.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <AdSlot label="Between chapter sections" membership={membership} adPlacements={adPlacements} />
            {activeChapter.body.slice(2, 4).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <AdSlot label="Middle of chapter" membership={membership} adPlacements={adPlacements} />
            {activeChapter.body.slice(4).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <AdSlot label="End of chapter" membership={membership} adPlacements={adPlacements} />
          </div>
        )}

        <footer className="chapter-footer">
          <button
            className="pill-button"
            type="button"
            onClick={() => {
              setChapterIndex(Math.max(0, chapterIndex - 1));
              updateProgress(-7);
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <div className="reaction-row">
            <button type="button">😍 428</button>
            <button type="button">🔥 192</button>
            <button type="button">💬 84</button>
          </div>
          <button
            className="pill-button"
            type="button"
            onClick={() => {
              setChapterIndex(Math.min(chapters.length - 1, chapterIndex + 1));
              updateProgress(7);
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </footer>

        <ReviewsPanel reviews={reviews} setReviews={setReviews} user={user} requireAuth={requireAuth} />
        <CommentsThread comments={comments} setComments={setComments} user={user} requireAuth={requireAuth} />
      </article>
    </section>
  );
}

function LockedChapter({ story, startPremium, buyChapter }) {
  return (
    <div className="locked-chapter">
      <Lock size={32} />
      <h3>Premium chapter</h3>
      <p>{story.title} continues with early access for premium members or direct chapter unlock.</p>
      <div className="locked-actions">
        <button className="primary-action" type="button" onClick={startPremium}>
          <Crown size={16} />
          Start premium
        </button>
        <button className="pill-button" type="button" onClick={buyChapter}>
          <WalletCards size={16} />
          Unlock chapter
        </button>
      </div>
    </div>
  );
}

function ReviewsPanel({ reviews, setReviews, user, requireAuth }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  function submitReview(event) {
    event.preventDefault();
    requireAuth(() => {
      if (!text.trim()) return;
      setReviews((current) => [
        { id: Date.now(), name: user?.name || "Demo Reader", rating, text: text.trim() },
        ...current,
      ]);
      setText("");
    });
  }

  return (
    <section className="comments-panel">
      <div className="section-heading">
        <Star size={18} />
        <h2>Ratings and reviews</h2>
      </div>
      <form className="review-form" onSubmit={submitReview}>
        <select value={rating} onChange={(event) => setRating(Number(event.target.value))} aria-label="Rating">
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} stars</option>
          ))}
        </select>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a quick review"
        />
        <button className="primary-action" type="submit">
          <Send size={16} />
          Review
        </button>
      </form>
      <div className="review-list">
        {reviews.map((review) => (
          <article className="review-row" key={review.id}>
            <strong>{review.name}</strong>
            <span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommentsThread({ comments, setComments, user, requireAuth }) {
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");

  function addComment(event) {
    event.preventDefault();
    requireAuth(() => {
      if (!draft.trim()) return;
      setComments((current) => [
        {
          id: Date.now(),
          name: user?.name || "Demo Reader",
          text: draft.trim(),
          reactions: { heart: 0, laugh: 0, fire: 0 },
          replies: [],
        },
        ...current,
      ]);
      setDraft("");
    });
  }

  function addReply(commentId) {
    requireAuth(() => {
      if (!replyDraft.trim()) return;
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  { id: Date.now(), name: user?.name || "Demo Reader", text: replyDraft.trim() },
                ],
              }
            : comment,
        ),
      );
      setReplyDraft("");
      setReplyTo(null);
    });
  }

  function reactTo(commentId, type) {
    requireAuth(() => {
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? { ...comment, reactions: { ...comment.reactions, [type]: comment.reactions[type] + 1 } }
            : comment,
        ),
      );
    });
  }

  return (
    <section className="comments-panel">
      <div className="section-heading">
        <MessageCircle size={18} />
        <h2>Chapter comments</h2>
      </div>
      <form className="comment-form" onSubmit={addComment}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={user ? "Add a chapter comment" : "Sign in to comment"}
        />
        <button className="primary-action" type="submit">
          <MessageSquarePlus size={16} />
          Comment
        </button>
      </form>
      {comments.map((comment) => (
        <article className="comment" key={comment.id}>
          <div className="avatar">{comment.name.slice(0, 1)}</div>
          <div>
            <strong>{comment.name}</strong>
            <p>{comment.text}</p>
            <div className="reaction-row small">
              <button type="button" onClick={() => reactTo(comment.id, "heart")}>❤️ {comment.reactions.heart}</button>
              <button type="button" onClick={() => reactTo(comment.id, "laugh")}>😂 {comment.reactions.laugh}</button>
              <button type="button" onClick={() => reactTo(comment.id, "fire")}>🔥 {comment.reactions.fire}</button>
              <button type="button" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}>
                <Reply size={13} />
                Reply
              </button>
            </div>
            {replyTo === comment.id && (
              <div className="reply-form">
                <input
                  value={replyDraft}
                  onChange={(event) => setReplyDraft(event.target.value)}
                  placeholder="Write a reply"
                />
                <button className="pill-button" type="button" onClick={() => addReply(comment.id)}>
                  Send
                </button>
              </div>
            )}
            {comment.replies.map((reply) => (
              <div className="reply" key={reply.id}>
                <strong>
                  {reply.name}
                  {reply.author && <BadgeCheck size={14} />}
                </strong>
                <p>{reply.text}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function WriterView() {
  const [draft, setDraft] = useState(
    "Ari waited until the palace bells drowned the sound of the lock. The old gate opened like it had been expecting her.",
  );
  const [chapterTitle, setChapterTitle] = useState("The Quiet Gate");
  const [autosave, setAutosave] = useState("Saved");
  const [preview, setPreview] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("2026-05-22T19:30");
  const [workflowStep, setWorkflowStep] = useState(1);
  const [chaptersList, setChaptersList] = useState([
    { title: "The Lantern Bridge", status: "Live", words: 2840 },
    { title: "Salt Letters", status: "Scheduled", words: 3175 },
    { title: "The Quiet Gate", status: "Draft", words: 0 },
  ]);
  const editorRef = useRef(null);
  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 230));
  const draftParagraphs = draft.split("\n").reduce((items, paragraph) => {
    if (paragraph.trim()) items.push(paragraph);
    return items;
  }, []);

  useEffect(() => {
    setAutosave("Saving draft...");
    const handle = window.setTimeout(() => {
      localStorage.setItem("writer-draft:v1", JSON.stringify({ chapterTitle, draft, scheduleAt }));
      setAutosave("Draft saved");
      setChaptersList((current) =>
        current.map((chapter) =>
          chapter.title === chapterTitle ? { ...chapter, words: wordCount, status: workflowStep >= 3 ? "Scheduled" : "Draft" } : chapter,
        ),
      );
    }, 650);
    return () => window.clearTimeout(handle);
  }, [chapterTitle, draft, scheduleAt, wordCount, workflowStep]);

  function wrapSelection(prefix, suffix = prefix) {
    const element = editorRef.current;
    if (!element) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = draft.slice(start, end) || "selected text";
    const next = `${draft.slice(0, start)}${prefix}${selected}${suffix}${draft.slice(end)}`;
    setDraft(next);
    window.requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  function insertImageBlock() {
    setDraft((current) => `${current}\n\n[Image: palace gate concept art]\n`);
  }

  function advanceWorkflow() {
    setWorkflowStep((current) => Math.min(4, current + 1));
    if (workflowStep >= 3) {
      setChaptersList((current) =>
        current.map((chapter) => (chapter.title === chapterTitle ? { ...chapter, status: "Live", words: wordCount } : chapter)),
      );
    }
  }

  function addChapter() {
    const nextTitle = `Untitled Chapter ${chaptersList.length + 1}`;
    setChaptersList((current) => [...current, { title: nextTitle, status: "Draft", words: 0 }]);
    setChapterTitle(nextTitle);
    setDraft("");
    setWorkflowStep(1);
    setPreview(false);
  }

  return (
    <section className="writer-grid">
      <div className="writer-main">
        <div className="editor-toolbar">
          <button className="icon-button" type="button" aria-label="Bold" onClick={() => wrapSelection("**")}>
            <Bold size={17} />
          </button>
          <button className="icon-button" type="button" aria-label="Italic" onClick={() => wrapSelection("_")}>
            <Italic size={17} />
          </button>
          <button className="icon-button" type="button" aria-label="Add image" onClick={insertImageBlock}>
            <Image size={17} />
          </button>
          <button className="pill-button" type="button" onClick={() => setPreview(!preview)}>
            <Eye size={16} />
            {preview ? "Editor" : "Preview"}
          </button>
          <span className="save-state">{autosave}</span>
        </div>

        <label className="field-stack title-field">
          <span>Chapter title</span>
          <input value={chapterTitle} onChange={(event) => setChapterTitle(event.target.value)} />
        </label>

        {preview ? (
          <article className="draft-preview">
            <span>Chapter preview · {readingTime} min read</span>
            <h2>{chapterTitle}</h2>
            {draftParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ) : (
          <label className="editor-shell">
            <span>Rich text draft</span>
            <textarea ref={editorRef} value={draft} onChange={(event) => setDraft(event.target.value)} />
          </label>
        )}
      </div>

      <aside className="writer-side">
        <section className="surface-panel">
          <div className="section-heading">
            <BarChart3 size={18} />
            <h2>Author dashboard</h2>
          </div>
          <div className="stat-grid">
            <Metric label="Words" value={wordCount.toLocaleString()} />
            <Metric label="Read time" value={`${readingTime}m`} />
            <Metric label="Followers" value="128K" />
            <Metric label="Rating" value="4.8" />
          </div>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <CalendarClock size={18} />
            <h2>Publishing</h2>
          </div>
          <label className="field-stack">
            <span>Schedule chapter</span>
            <input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} />
          </label>
          <div className="workflow-list">
            {["Draft", "Preview", "Schedule", "Publish"].map((step, index) => (
              <div className={index < workflowStep ? "complete" : ""} key={step}>
                <span>{index < workflowStep ? <Check size={14} /> : index + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <button className="primary-action wide" type="button" onClick={advanceWorkflow}>
            <Send size={16} />
            {workflowStep >= 4 ? "Published" : "Advance workflow"}
          </button>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <BookOpen size={18} />
            <h2>Story manager</h2>
          </div>
          {chaptersList.map((chapter) => (
            <button
              className="manager-row clickable-row"
              key={chapter.title}
              type="button"
              onClick={() => {
                setChapterTitle(chapter.title);
                setDraft(chapter.words ? draft : "");
              }}
            >
              <span>{chapter.title}</span>
              <strong>{chapter.status}</strong>
            </button>
          ))}
          <button className="pill-button wide" type="button" onClick={addChapter}>
            <Plus size={16} />
            New chapter
          </button>
        </section>
      </aside>
    </section>
  );
}

function PremiumView({ membership, setMembership, story, activatePremium, buyChapter, unlockedChapters, user }) {
  const chapterUnlocked = unlockedChapters.has(`${story.id}:1`) || membership === "premium";

  return (
    <section className="premium-grid">
      <div className="tier-column">
        <article className="tier-card">
          <span>Free tier</span>
          <h2>Ad-supported reading</h2>
          <ul>
            <li>Standard library access</li>
            <li>Limited premium previews</li>
            <li>Homepage and chapter ads</li>
          </ul>
          <button
            className={membership === "free" ? "primary-action wide" : "pill-button wide"}
            type="button"
            onClick={() => setMembership("free")}
          >
            {membership === "free" ? <Check size={16} /> : <Unlock size={16} />}
            Use free
          </button>
        </article>

        <article className="tier-card featured">
          <span>Premium tier</span>
          <h2>Ad-free plus early access</h2>
          <ul>
            <li>Full premium chapter access</li>
            <li>Exclusive stories</li>
            <li>Early chapter releases</li>
          </ul>
          <button className="primary-action wide" type="button" onClick={activatePremium}>
            <Crown size={16} />
            Activate premium
          </button>
        </article>
      </div>

      <aside className="surface-panel unlock-panel">
        <div className="section-heading">
          <WalletCards size={18} />
          <h2>Paid unlock</h2>
        </div>
        <img src={story.image} alt="" />
        <h3>{story.title}</h3>
        <p>Chapter 19 is available as a direct payment unlock through the payment gateway.</p>
        <div className="price-line">
          <span>One chapter</span>
          <strong>{chapterUnlocked ? "Unlocked" : "$0.99"}</strong>
        </div>
        <button className="primary-action wide" type="button" onClick={() => buyChapter(story.id, 1)}>
          {chapterUnlocked ? <CheckCircle2 size={16} /> : <CreditCard size={16} />}
          {chapterUnlocked ? "Chapter available" : "Buy chapter"}
        </button>
        <div className="payment-log">
          <span>Gateway: Stripe / PayHere ready</span>
          <span>User: {user ? user.email : "Login required"}</span>
          <span>Status: {chapterUnlocked ? "Access granted" : "Awaiting payment"}</span>
        </div>
      </aside>
    </section>
  );
}

function AdminView({
  brandLogo,
  setBrandLogo,
  brandAccent,
  setBrandAccent,
  brandBanner,
  setBrandBanner,
  notificationList,
  moderationQueue,
  updateModeration,
  adPlacements,
  toggleAdPlacement,
  broadcastStatus,
  sendBroadcast,
  onlineReaders,
  setOnlineReaders,
}) {
  const [audience, setAudience] = useState("All users");
  const [message, setMessage] = useState("New premium chapters are live this weekend.");
  const [usersList, setUsersList] = useState([
    { name: "Ishara Perera", role: "Reader", status: "Active" },
    { name: "Mira Vale", role: "Verified author", status: "Active" },
    { name: "Noah Rens", role: "Writer", status: "Review" },
  ]);

  function toggleUserStatus(name) {
    setUsersList((current) =>
      current.map((item) =>
        item.name === name ? { ...item, status: item.status === "Active" ? "Suspended" : "Active" } : item,
      ),
    );
  }

  function runLoadSimulation() {
    setOnlineReaders((current) => current + 2750);
  }

  return (
    <section className="admin-grid">
      <div className="admin-main">
        <section className="surface-panel">
          <div className="section-heading">
            <UserCheck size={18} />
            <h2>User management</h2>
          </div>
          <div className="table-like">
            {usersList.map((item) => (
              <div className="table-row action-row" key={item.name}>
                <span>{item.name}</span>
                <span>{item.role}</span>
                <strong>{item.status}</strong>
                <button className="pill-button" type="button" onClick={() => toggleUserStatus(item.name)}>
                  {item.status === "Active" ? "Suspend" : "Restore"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <Users size={18} />
            <h2>Management queue</h2>
          </div>
          <div className="table-like">
            {moderationQueue.map((item) => (
              <div className="table-row action-row" key={`${item.name}-${item.type}`}>
                <span>{item.name}</span>
                <span>{item.type}</span>
                <strong>{item.status}</strong>
                <div className="row-actions">
                  <button className="pill-button" type="button" onClick={() => updateModeration(item.name, "Approved")}>
                    Approve
                  </button>
                  <button className="pill-button" type="button" onClick={() => updateModeration(item.name, "Rejected")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <BadgeCheck size={18} />
            <h2>Verification</h2>
          </div>
          <div className="approval-board">
            {["Identity", "Publishing history", "Community standing", "Admin approval"].map((item, index) => (
              <div className={index < 4 ? "approved" : ""} key={item}>
                <span><Check size={14} /></span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <Gauge size={18} />
            <h2>Performance</h2>
          </div>
          <div className="perf-grid">
            <Metric label="Redis cache" value="94%" />
            <Metric label="Postgres p95" value="38ms" />
            <Metric label="CDN hit rate" value="97%" />
            <Metric label="Readers online" value={onlineReaders.toLocaleString()} />
          </div>
          <div className="system-stack">
            <span><Database size={15} /> Indexed story_tags, genre_rank, reading_progress</span>
            <span><Server size={15} /> Redis hot story cache and trend sorted sets</span>
            <span><Globe2 size={15} /> CDN image and chapter edge caching</span>
          </div>
          <button className="pill-button wide" type="button" onClick={runLoadSimulation}>
            <Gauge size={16} />
            Simulate reader spike
          </button>
        </section>
      </div>

      <aside className="admin-side">
        <section className="surface-panel">
          <div className="section-heading">
            <Bell size={18} />
            <h2>Broadcast center</h2>
          </div>
          <label className="field-stack">
            <span>Audience</span>
            <select value={audience} onChange={(event) => setAudience(event.target.value)}>
              <option>All users</option>
              <option>Sri Lanka</option>
              <option>Readers</option>
              <option>Writers</option>
              <option>Premium members</option>
            </select>
          </label>
          <label className="field-stack">
            <span>Message</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
          <button className="primary-action wide" type="button" onClick={() => sendBroadcast(audience, message)}>
            <Megaphone size={16} />
            Send broadcast
          </button>
          <span className="save-state">{broadcastStatus}</span>
          <div className="notification-list">
            {notificationList.map((item) => (
              <div className="manager-row" key={item.title}>
                <span>{item.title}</span>
                <strong>{item.status}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <Paintbrush size={18} />
            <h2>Branding</h2>
          </div>
          <label className="field-stack">
            <span>Site logo</span>
            <input value={brandLogo} onChange={(event) => setBrandLogo(event.target.value)} />
          </label>
          <label className="field-stack">
            <span>Accent</span>
            <input type="color" value={brandAccent} onChange={(event) => setBrandAccent(event.target.value)} />
          </label>
          <label className="field-stack">
            <span>Homepage banner</span>
            <select value={brandBanner} onChange={(event) => setBrandBanner(event.target.value)}>
              <option>Seasonal reads</option>
              <option>Premium launch</option>
              <option>Writer spotlight</option>
              <option>New voices campaign</option>
            </select>
          </label>
          <button className="pill-button wide" type="button">
            <Upload size={16} />
            Upload promotional visual
          </button>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <Megaphone size={18} />
            <h2>Ad placements</h2>
          </div>
          {Object.entries(adPlacements).map(([item, active]) => (
            <button className="manager-row clickable-row" key={item} type="button" onClick={() => toggleAdPlacement(item)}>
              <span>{item}</span>
              <strong>{active ? "Active" : "Paused"}</strong>
            </button>
          ))}
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <Radio size={18} />
            <h2>Reports / analytics</h2>
          </div>
          <div className="matrix-box">
            <div className="matrix-row">
              <Smartphone size={17} />
              <span>FCM delivery</span>
              <strong>99.1%</strong>
            </div>
            <div className="matrix-row">
              <BookOpen size={17} />
              <span>Chapter opens</span>
              <strong>2.4M</strong>
            </div>
            <div className="matrix-row">
              <WalletCards size={17} />
              <span>Premium conversion</span>
              <strong>8.7%</strong>
            </div>
          </div>
        </section>
      </aside>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AdSlot({ label, membership, adPlacements = EMPTY_AD_PLACEMENTS }) {
  if (adPlacements[label] === false) {
    return (
      <div className="ad-slot disabled">
        <Megaphone size={15} />
        Placement paused
      </div>
    );
  }

  if (membership === "premium") {
    return (
      <div className="ad-slot disabled">
        <Crown size={15} />
        Ads disabled
      </div>
    );
  }

  return (
    <div className="ad-slot">
      <Megaphone size={15} />
      {label}
    </div>
  );
}

function ClockText({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    <>
      <Timer size={15} />
      {minutes}:{remainingSeconds.toString().padStart(2, "0")}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285f4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.2-1 2.3-2.1 3v2.5h3.4c2-1.8 3.1-4.5 3.1-7.3Z" />
      <path fill="#34a853" d="M12 22c2.8 0 5.1-.9 6.9-2.5L15.5 17c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.6C4.4 19.7 7.9 22 12 22Z" />
      <path fill="#fbbc05" d="M6.2 13.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7V7.7H2.7C2 9 1.6 10.4 1.6 12s.4 3 1.1 4.3l3.5-2.6Z" />
      <path fill="#ea4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17.1 3 14.8 2 12 2 7.9 2 4.4 4.3 2.7 7.7l3.5 2.6C7 7.8 9.3 6 12 6Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M16.4 13c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-.8-2.2-.7-2.8-.7-.9.1-1.7.5-2.2.5-.6 0-1.4-.5-2.3-.5-1.2 0-2.4.7-3 1.8-1.3 2.2-.3 5.4.9 7.2.6.9 1.4 1.9 2.3 1.9.9 0 1.3-.6 2.4-.6s1.4.6 2.4.6 1.7-.9 2.3-1.8c.7-1 1-2 1.1-2.1 0 0-2.2-.9-2.3-3.9ZM14.8 6.9c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.1-.5.5-.9 1.4-.8 2.2.8.1 1.7-.4 2.2-.9Z"
      />
    </svg>
  );
}

export default App;
