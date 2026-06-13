import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { DEFAULT_BOOKS, DEFAULT_MEMBERS, DEFAULT_TRANSACTIONS } from "./mockData";
import Dashboard from "./components/Dashboard";
import Catalog from "./components/Catalog";
import Members from "./components/Members";
import BorrowModal from "./components/BorrowModal";

// SVG Icons
const BookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const GridIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
  </svg>
);

const UsersIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BellIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SunIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const CalendarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", sub: "Library overview & quick actions" },
  catalog: { title: "Book Catalogue", sub: "Manage your library inventory" },
  members: { title: "Members Roster", sub: "Borrower accounts & card holders" },
};

export default function App() {
  const [books, setBooks] = useState(() => {
    const c = localStorage.getItem("lib-books");
    return c ? JSON.parse(c) : DEFAULT_BOOKS;
  });

  const [members, setMembers] = useState(() => {
    const c = localStorage.getItem("lib-members");
    return c ? JSON.parse(c) : DEFAULT_MEMBERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const c = localStorage.getItem("lib-txns");
    return c ? JSON.parse(c) : DEFAULT_TRANSACTIONS;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [quickActionState, setQuickActionState] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("lib-theme") || "dark");
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Custom Toast and Confirmation Dialog states
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const showConfirm = (title, message, onConfirm, onCancel) => {
    setConfirmDialog({ title, message, onConfirm, onCancel });
  };

  // Auto clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lib-theme", theme);
  }, [theme]);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("lib-books", JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem("lib-members", JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem("lib-txns", JSON.stringify(transactions)); }, [transactions]);

  // Close notif on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const logTransaction = (bookTitle, memberName, type, status = "completed") => {
    const newTx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookTitle, memberName, type,
      date: today.toISOString().split("T")[0],
      status
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Book operations
  const handleAddBook = (bookData) => {
    const newBook = {
      id: `book-${Date.now()}`,
      ...bookData,
      status: "Available",
      borrowedBy: null,
      borrowDate: null,
      dueDate: null,
      reservations: []
    };
    setBooks(prev => [newBook, ...prev]);
    logTransaction(newBook.title, "Admin", "add");
    showToast(`"${newBook.title}" successfully added.`, "success");
  };

  const handleEditBook = (bookId, updatedData) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updatedData } : b));
    showToast("Book catalogue details updated.", "success");
  };

  const handleDeleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    if (book.status === "Borrowed") {
      showToast("Cannot delete: This book is currently borrowed.", "error");
      return;
    }
    setBooks(prev => prev.filter(b => b.id !== bookId));
    logTransaction(book.title, "Admin", "delete");
    showToast(`"${book.title}" successfully removed from catalogue.`, "success");
  };

  const handleCheckoutTrigger = (book) => setCheckoutBook(book);

  const handleCheckoutConfirm = (bookId, memberId, borrowDate, dueDate) => {
    const member = members.find(m => m.id === memberId);
    const book = books.find(b => b.id === bookId);
    if (!member || !book) return;
    setBooks(prev => prev.map(b =>
      b.id === bookId ? { ...b, status: "Borrowed", borrowedBy: memberId, borrowDate, dueDate } : b
    ));
    logTransaction(book.title, member.name, "borrow", "active");
    setCheckoutBook(null);
    showToast(`"${book.title}" checked out to ${member.name}.`, "success");
  };

  const handleReturnBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const borrower = members.find(m => m.id === book.borrowedBy);
    const borrowerName = borrower ? borrower.name : "Member";
    setBooks(prev => prev.map(b => {
      if (b.id !== bookId) return b;
      if (b.reservations && b.reservations.length > 0) {
        const [nextId, ...rest] = b.reservations;
        const nextMember = members.find(m => m.id === nextId);
        const due = new Date(today); due.setDate(today.getDate() + 14);
        const fmt = d => d.toISOString().split("T")[0];
        logTransaction(b.title, borrowerName, "return");
        logTransaction(b.title, nextMember?.name || nextId, "borrow", "active");
        showToast(`"${b.title}" returned by ${borrowerName} and auto-assigned to hold list successor (${nextMember?.name || nextId}).`, "success");
        return { ...b, status: "Borrowed", borrowedBy: nextId, borrowDate: fmt(today), dueDate: fmt(due), reservations: rest };
      }
      logTransaction(b.title, borrowerName, "return");
      showToast(`"${b.title}" returned to shelves.`, "success");
      return { ...b, status: "Available", borrowedBy: null, borrowDate: null, dueDate: null, reservations: [] };
    }));
  };

  const handleAddReservation = (bookId, memberId) => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return;
    if (book.reservations?.includes(memberId)) {
      showToast("This member already has a hold request on this book.", "error");
      return;
    }
    setBooks(prev => prev.map(b =>
      b.id === bookId ? { ...b, reservations: [...(b.reservations || []), memberId] } : b
    ));
    logTransaction(book.title, member.name, "reserve");
    showToast(`Hold request queued for ${member.name}.`, "success");
  };

  const handleRemoveReservation = (bookId, memberId) => {
    setBooks(prev => prev.map(b =>
      b.id === bookId ? { ...b, reservations: (b.reservations || []).filter(id => id !== memberId) } : b
    ));
    showToast("Hold request cancelled.", "info");
  };

  // Member operations
  const handleAddMember = (memberData) => {
    const newMember = {
      id: `LIB-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: today.toISOString().split("T")[0],
      ...memberData
    };
    setMembers(prev => [newMember, ...prev]);
    showToast(`Card successfully registered for ${newMember.name}.`, "success");
  };

  const handleDeleteMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    showToast(`Membership card for ${member?.name || memberId} has been revoked.`, "info");
  };

  // Quick action routing from dashboard
  const triggerQuickAction = (action) => {
    setQuickActionState(action);
    if (action === "addBook") setActiveTab("catalog");
    if (action === "addMember") setActiveTab("members");
  };

  // Overdues as notifications
  const overdueBooks = books.filter(b => b.status === "Borrowed" && b.dueDate && new Date(b.dueDate) < today);
  const notifications = overdueBooks.map(b => {
    const member = members.find(m => m.id === b.borrowedBy);
    return {
      id: b.id,
      text: <><strong>{member?.name || "A member"}</strong> has an overdue book: <strong>{b.title}</strong></>,
      time: `Due: ${b.dueDate}`
    };
  });

  const pageInfo = PAGE_TITLES[activeTab];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BookIcon size={20} color="#fff" />
          </div>
          <div>
            <div className="brand-name">LibraryOS</div>
            <div className="brand-sub">Admin Console</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>

          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="nav-icon"><GridIcon /></span>
            Dashboard
          </button>

          <button
            className={`nav-btn ${activeTab === "catalog" ? "active" : ""}`}
            onClick={() => setActiveTab("catalog")}
          >
            <span className="nav-icon"><BookIcon /></span>
            Book Catalogue
            <span className="nav-badge">{books.length}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <span className="nav-icon"><UsersIcon /></span>
            Members
            <span className="nav-badge">{members.length}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-date">
            <CalendarIcon />
            {todayStr}
          </div>
          {overdueBooks.length > 0 && (
            <div className="badge badge-red" style={{ fontSize: "0.7rem" }}>
              ⚠ {overdueBooks.length} overdue {overdueBooks.length === 1 ? "book" : "books"}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="app-main">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">{pageInfo.title}</div>
            <div className="topbar-subtitle">{pageInfo.sub}</div>
          </div>

          <div className="topbar-actions">
            {/* Notification bell */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button className="icon-btn" onClick={() => setShowNotifs(v => !v)}>
                <BellIcon />
                {notifications.length > 0 && <span className="notif-dot" />}
              </button>

              {showNotifs && (
                <div className="notif-panel">
                  <div className="notif-head">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                      <span className="badge badge-red">{notifications.length}</span>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div style={{ padding: "20px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                        All clear — no overdue books!
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="notif-item">
                          <span style={{ color: "var(--red)", fontSize: "1rem" }}>⚠</span>
                          <div>
                            <div className="notif-item-text">{n.text}</div>
                            <div className="notif-time">{n.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              className="icon-btn"
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="page-body">
          {activeTab === "dashboard" && (
            <Dashboard
              books={books}
              members={members}
              transactions={transactions}
              setTab={setActiveTab}
              onQuickAction={triggerQuickAction}
            />
          )}

          {activeTab === "catalog" && (
            <Catalog
              books={books}
              members={members}
              onAddBook={handleAddBook}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
              onCheckoutTrigger={handleCheckoutTrigger}
              onReturnBook={handleReturnBook}
              onAddReservation={handleAddReservation}
              onRemoveReservation={handleRemoveReservation}
              quickActionState={quickActionState}
              clearQuickAction={() => setQuickActionState(null)}
              showToast={showToast}
              showConfirm={showConfirm}
            />
          )}

          {activeTab === "members" && (
            <Members
              members={members}
              books={books}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              quickActionState={quickActionState}
              clearQuickAction={() => setQuickActionState(null)}
              showToast={showToast}
              showConfirm={showConfirm}
            />
          )}
        </div>
      </div>

      {/* Checkout modal */}
      {checkoutBook && (
        <BorrowModal
          book={checkoutBook}
          members={members}
          onClose={() => setCheckoutBook(null)}
          onConfirm={handleCheckoutConfirm}
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <div className="toast-container animate-fade">
          <div className={`toast ${toast.type}`}>
            <span>
              {toast.type === "success" && "✓ "}
              {toast.type === "error" && "⚠ "}
              {toast.type === "info" && "ℹ "}
              {toast.message}
            </span>
            <button className="toast-close" onClick={() => setToast(null)}>×</button>
          </div>
        </div>
      )}

      {/* Custom confirm modal */}
      {confirmDialog && (
        <div className="modal-bg" onClick={() => { confirmDialog.onCancel?.(); setConfirmDialog(null); }}>
          <div className="modal-box modal-sm animate-in" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{confirmDialog.title}</h2>
              <button className="modal-close" onClick={() => { confirmDialog.onCancel?.(); setConfirmDialog(null); }}>×</button>
            </div>
            <div className="modal-body">
              <p className="text-muted" style={{ fontSize: "0.88rem", lineHeight: "1.4" }}>
                {confirmDialog.message}
              </p>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-ghost" onClick={() => { confirmDialog.onCancel?.(); setConfirmDialog(null); }}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
