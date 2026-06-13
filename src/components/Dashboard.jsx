import React, { useMemo } from "react";

// Icons
const BookIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CheckCircleIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ArrowRightIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const UsersIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AlertTriIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const GENRE_COLORS = [
  "linear-gradient(90deg, #3b82f6, #8b5cf6)",
  "linear-gradient(90deg, #10b981, #3b82f6)",
  "linear-gradient(90deg, #f59e0b, #ef4444)",
  "linear-gradient(90deg, #8b5cf6, #ec4899)",
  "linear-gradient(90deg, #06b6d4, #10b981)",
  "linear-gradient(90deg, #ef4444, #f59e0b)",
];

export default function Dashboard({ books, members, transactions, setTab, onQuickAction }) {
  const stats = useMemo(() => {
    const today = new Date();
    const totalBooks = books.length;
    const borrowed = books.filter(b => b.status === "Borrowed").length;
    const available = books.filter(b => b.status === "Available").length;
    const overdue = books.filter(b =>
      b.status === "Borrowed" && b.dueDate && new Date(b.dueDate) < today
    ).length;
    return { totalBooks, borrowed, available, overdue };
  }, [books]);

  const genreData = useMemo(() => {
    const counts = {};
    books.forEach(b => { counts[b.genre] = (counts[b.genre] || 0) + 1; });
    const list = Object.entries(counts).map(([genre, count]) => ({ genre, count }));
    const max = Math.max(...list.map(d => d.count), 1);
    return list.map((item, i) => ({ ...item, pct: (item.count / max) * 100, color: GENRE_COLORS[i % GENRE_COLORS.length] }));
  }, [books]);

  const txIcons = { borrow: "📖", return: "✅", reserve: "🔖", add: "➕", delete: "🗑" };

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Hero Banner */}
      <div className="card hero-banner">
        <div className="hero-text">
          <div className="hero-greeting">Welcome back, Administrator</div>
          <h1 className="hero-title">
            Your <span>Library</span> at a glance
          </h1>
          <p className="hero-sub">
            {stats.totalBooks} books catalogued · {stats.borrowed} currently circulating · {stats.overdue > 0 ? `${stats.overdue} overdue` : "No overdue returns"}
          </p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => onQuickAction("addBook")}>
              <PlusIcon /> Add Book
            </button>
            <button className="btn btn-ghost" onClick={() => onQuickAction("addMember")}>
              <PlusIcon /> Register Member
            </button>
          </div>
        </div>
        <div className="hero-graphic">
          <svg viewBox="0 0 220 140" width="200" height="128" fill="none">
            <defs>
              <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Library shelves illustration */}
            <rect x="10" y="90" width="36" height="42" rx="4" fill="url(#hg2)" opacity="0.15" stroke="url(#hg2)" strokeWidth="1.5"/>
            <rect x="55" y="60" width="42" height="72" rx="4" fill="url(#hg1)" opacity="0.15" stroke="url(#hg1)" strokeWidth="1.5"/>
            <rect x="108" y="30" width="48" height="102" rx="4" fill="url(#hg2)" opacity="0.15" stroke="url(#hg2)" strokeWidth="1.5"/>
            <rect x="168" y="10" width="42" height="122" rx="4" fill="url(#hg1)" opacity="0.15" stroke="url(#hg1)" strokeWidth="1.5"/>
            {/* Book spines */}
            <line x1="22" y1="98" x2="38" y2="98" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
            <line x1="22" y1="108" x2="38" y2="108" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            <line x1="67" y1="70" x2="88" y2="70" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
            <line x1="67" y1="82" x2="88" y2="82" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
            <line x1="67" y1="94" x2="88" y2="94" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            <line x1="120" y1="42" x2="148" y2="42" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            <line x1="120" y1="58" x2="148" y2="58" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
            <line x1="120" y1="74" x2="148" y2="74" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
            <line x1="120" y1="90" x2="148" y2="90" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            <line x1="180" y1="22" x2="202" y2="22" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
            <line x1="180" y1="38" x2="202" y2="38" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            <line x1="180" y1="54" x2="202" y2="54" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
            <line x1="180" y1="70" x2="202" y2="70" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            <line x1="180" y1="86" x2="202" y2="86" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
            {/* Circle decoration */}
            <circle cx="110" cy="70" r="52" stroke="url(#hg1)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-tile card t-blue" onClick={() => setTab("catalog")}>
          <div className="stat-content">
            <div className="stat-lbl">Total Books</div>
            <div className="stat-val">{stats.totalBooks}</div>
            <div className="stat-sub">In catalogue</div>
          </div>
          <div className="stat-icon-wrap blue"><BookIcon size={22} /></div>
          <div className="stat-bar blue" />
        </div>

        <div className="stat-tile card t-green" onClick={() => setTab("catalog")}>
          <div className="stat-content">
            <div className="stat-lbl">Available</div>
            <div className="stat-val">{stats.available}</div>
            <div className="stat-sub">Ready to borrow</div>
          </div>
          <div className="stat-icon-wrap green"><CheckCircleIcon size={22} /></div>
          <div className="stat-bar green" />
        </div>

        <div className="stat-tile card t-amber" onClick={() => setTab("members")}>
          <div className="stat-content">
            <div className="stat-lbl">Members</div>
            <div className="stat-val">{members.length}</div>
            <div className="stat-sub">Card holders</div>
          </div>
          <div className="stat-icon-wrap amber"><UsersIcon size={22} /></div>
          <div className="stat-bar amber" />
        </div>

        <div className="stat-tile card t-red" onClick={() => setTab("catalog")}>
          <div className="stat-content">
            <div className="stat-lbl">Overdue</div>
            <div className="stat-val">{stats.overdue}</div>
            <div className="stat-sub">Needs attention</div>
          </div>
          <div className="stat-icon-wrap red"><AlertTriIcon size={22} /></div>
          <div className="stat-bar red" />
        </div>
      </div>

      {/* Charts & Feed */}
      <div className="dash-grid">
        {/* Genre Chart */}
        <div className="card card-p">
          <div className="sec-head">
            <div>
              <h3>Genre Breakdown</h3>
              <div className="sec-sub">Books per category in your catalogue</div>
            </div>
          </div>
          {genreData.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", padding: "20px 0" }}>No books yet.</div>
          ) : (
            <div className="bar-chart">
              {genreData.map((item, i) => (
                <div key={i} className="bar-row">
                  <div className="bar-label">{item.genre}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.pct}%`, background: item.color }}>
                      <span className="bar-count">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="card card-p">
          <div className="sec-head">
            <div>
              <h3>Recent Activity</h3>
              <div className="sec-sub">Latest library transactions</div>
            </div>
            {transactions.length > 5 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setTab("catalog")} style={{ gap: 4 }}>
                View all <ArrowRightIcon size={13} />
              </button>
            )}
          </div>

          {transactions.length === 0 ? (
            <div className="text-muted" style={{ padding: "20px 0" }}>No activity yet.</div>
          ) : (
            <div className="feed">
              {transactions.slice(0, 6).map((tx, i) => (
                <div key={tx.id || i} className="feed-item">
                  <div className={`feed-dot ${tx.type}`}>
                    {txIcons[tx.type] || "•"}
                  </div>
                  <div className="feed-content">
                    <div className="feed-text">
                      {tx.type === "borrow" && <><strong>{tx.memberName}</strong> borrowed <em>{tx.bookTitle}</em></>}
                      {tx.type === "return" && <><strong>{tx.memberName}</strong> returned <em>{tx.bookTitle}</em></>}
                      {tx.type === "reserve" && <><strong>{tx.memberName}</strong> reserved <em>{tx.bookTitle}</em></>}
                      {tx.type === "add" && <>New book added: <em>{tx.bookTitle}</em></>}
                      {tx.type === "delete" && <>Book removed: <em>{tx.bookTitle}</em></>}
                    </div>
                    <div className="feed-when">
                      <span>{tx.date}</span>
                      {tx.status === "overdue" && <span className="badge badge-red" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>Overdue</span>}
                      {tx.status === "active" && <span className="badge badge-amber" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>Active</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
