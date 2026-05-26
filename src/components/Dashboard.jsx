import React, { useMemo } from "react";

// Inline Custom Premium SVG Icons for Dashboard
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const UserCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function Dashboard({ books, members, transactions, setTab, onQuickAction }) {
  // Statistics Calculations
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const borrowedBooks = books.filter(b => b.status === "Borrowed").length;
    const availableBooks = books.filter(b => b.status === "Available").length;
    
    // An item is overdue if it is Borrowed, has a dueDate, and dueDate is past our current date (2026-05-26)
    const today = new Date("2026-05-26");
    const overdueBooks = books.filter(b => {
      if (b.status !== "Borrowed" || !b.dueDate) return false;
      return new Date(b.dueDate) < today;
    }).length;

    return { totalBooks, borrowedBooks, availableBooks, overdueBooks };
  }, [books]);

  // Compute Genre distribution for SVG Chart
  const genreChartData = useMemo(() => {
    const counts = {};
    books.forEach(b => {
      counts[b.genre] = (counts[b.genre] || 0) + 1;
    });

    const list = Object.entries(counts).map(([genre, count]) => ({ genre, count }));
    const maxCount = Math.max(...list.map(d => d.count), 1);
    
    return list.map(item => ({
      ...item,
      percentage: (item.count / maxCount) * 100
    }));
  }, [books]);

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-panel">
        <div className="banner-content">
          <h1>Solomon Library Console</h1>
          <p>Welcome back, Administrator. Real-time catalogue audits and checkout rosters are fully loaded.</p>
          <div className="banner-actions">
            <button className="btn btn-primary" onClick={() => onQuickAction("addBook")}>
              Add New Book
            </button>
            <button className="btn btn-accent" onClick={() => onQuickAction("addMember")}>
              Register Borrower
            </button>
          </div>
        </div>
        <div className="banner-illustration">
          {/* Custom Premium Vector Drawing of a futuristic geometric library archive */}
          <svg viewBox="0 0 200 120" width="160" height="96" fill="none">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="20" y="80" width="40" height="15" rx="3" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
            <rect x="70" y="50" width="45" height="45" rx="3" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
            <rect x="125" y="20" width="50" height="75" rx="3" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
            
            {/* Glowing active spines */}
            <line x1="30" y1="85" x2="50" y2="85" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="60" x2="105" y2="60" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="75" x2="105" y2="75" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <line x1="135" y1="35" x2="165" y2="35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="135" y1="55" x2="165" y2="55" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
            <line x1="135" y1="75" x2="165" y2="75" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            
            {/* Digital Ring */}
            <circle cx="100" cy="60" r="45" stroke="url(#shieldGrad)" strokeWidth="2" strokeDasharray="6,4" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ "--glow-color": "var(--accent-purple-glow)" }} onClick={() => setTab("catalog")}>
          <div className="stat-icon purple-theme">
            <BookIcon />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Inventory</span>
            <span className="stat-value">{stats.totalBooks}</span>
          </div>
          <div className="stat-status-indicator purple-theme"></div>
        </div>

        <div className="stat-card glass-panel" style={{ "--glow-color": "var(--accent-emerald-glow)" }} onClick={() => setTab("catalog")}>
          <div className="stat-icon emerald-theme">
            <CheckIcon />
          </div>
          <div className="stat-info">
            <span className="stat-label">Available Shelved</span>
            <span className="stat-value">{stats.availableBooks}</span>
          </div>
          <div className="stat-status-indicator emerald-theme"></div>
        </div>

        <div className="stat-card glass-panel" style={{ "--glow-color": "var(--accent-amber-glow)" }} onClick={() => setTab("catalog")}>
          <div className="stat-icon amber-theme">
            <UserCheckIcon />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Circulations</span>
            <span className="stat-value">{stats.borrowedBooks}</span>
          </div>
          <div className="stat-status-indicator amber-theme"></div>
        </div>

        <div className="stat-card glass-panel" style={{ "--glow-color": "var(--accent-crimson-glow)" }} onClick={() => setTab("catalog")}>
          <div className="stat-icon crimson-theme">
            <AlertIcon />
          </div>
          <div className="stat-info">
            <span className="stat-label">Overdue Returns</span>
            <span className="stat-value">{stats.overdueBooks}</span>
          </div>
          <div className="stat-status-indicator crimson-theme"></div>
        </div>
      </div>

      {/* Charts & Activity Layout */}
      <div className="dashboard-grid">
        {/* SVG Custom Interactive Chart */}
        <div className="chart-card glass-panel">
          <div className="card-header">
            <h3>Inventory Genre Allocation</h3>
            <span className="subtitle">Breakdown of catalog books by specific genre groupings</span>
          </div>
          
          <div className="genre-chart-container">
            {genreChartData.length === 0 ? (
              <div className="empty-chart-state">
                <p>No catalogued books found to map genre analytics.</p>
              </div>
            ) : (
              <div className="chart-visual-wrapper">
                <div className="chart-bars">
                  {genreChartData.map((item, idx) => (
                    <div key={idx} className="chart-bar-row">
                      <div className="chart-bar-label">{item.genre}</div>
                      <div className="chart-bar-track">
                        <div 
                          className="chart-bar-fill" 
                          style={{ 
                            width: `${item.percentage}%`,
                            background: idx % 2 === 0 ? 'linear-gradient(90deg, var(--accent-purple), var(--accent-emerald))' : 'linear-gradient(90deg, var(--accent-emerald), var(--accent-amber))'
                          }}
                        >
                          <span className="chart-bar-count">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chronological Activity Feed */}
        <div className="activity-card glass-panel">
          <div className="card-header">
            <h3>Recent System Activities</h3>
            <span className="subtitle">Latest catalog operations and status revisions</span>
          </div>

          <div className="activity-list">
            {transactions.length === 0 ? (
              <div className="empty-activity-state">
                <p>No recent administrative activities logged.</p>
              </div>
            ) : (
              transactions.slice(0, 5).map((tx, idx) => (
                <div key={tx.id || idx} className="activity-item">
                  <div className={`activity-bullet ${tx.type}`}>
                    {tx.type === "borrow" && <span className="bullet-sym">↓</span>}
                    {tx.type === "return" && <span className="bullet-sym">↑</span>}
                    {tx.type === "reserve" && <span className="bullet-sym">★</span>}
                    {tx.type === "add" && <span className="bullet-sym">+</span>}
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      {tx.type === "borrow" && (
                        <span><strong>{tx.memberName}</strong> checked out <em>{tx.bookTitle}</em></span>
                      )}
                      {tx.type === "return" && (
                        <span><strong>{tx.memberName}</strong> returned <em>{tx.bookTitle}</em></span>
                      )}
                      {tx.type === "reserve" && (
                        <span><strong>{tx.memberName}</strong> placed a hold queue on <em>{tx.bookTitle}</em></span>
                      )}
                      {tx.type === "add" && (
                        <span>New catalog addition: <em>{tx.bookTitle}</em> added to inventory</span>
                      )}
                    </p>
                    <div className="activity-meta">
                      <span className="activity-date">{tx.date}</span>
                      {tx.status === "overdue" && (
                        <span className="badge badge-overdue font-xsmall">Overdue Alert</span>
                      )}
                      {tx.status === "active" && (
                        <span className="badge badge-borrowed font-xsmall">In circulation</span>
                      )}
                      {tx.status === "completed" && (
                        <span className="badge badge-available font-xsmall">Closed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
