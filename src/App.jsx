import React, { useState, useEffect } from "react";
import "./App.css";

// Database schemas & components
import { DEFAULT_BOOKS, DEFAULT_MEMBERS, DEFAULT_TRANSACTIONS } from "./mockData";
import Dashboard from "./components/Dashboard";
import Catalog from "./components/Catalog";
import Members from "./components/Members";
import BorrowModal from "./components/BorrowModal";

// Sidebar Custom SVG Icons
const ConsoleLogoSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#0b0f19" }}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const CatalogIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const MembersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function App() {
  // Sync state to LocalStorage
  const [books, setBooks] = useState(() => {
    const cached = localStorage.getItem("solomon-books");
    return cached ? JSON.parse(cached) : DEFAULT_BOOKS;
  });

  const [members, setMembers] = useState(() => {
    const cached = localStorage.getItem("solomon-members");
    return cached ? JSON.parse(cached) : DEFAULT_MEMBERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const cached = localStorage.getItem("solomon-transactions");
    return cached ? JSON.parse(cached) : DEFAULT_TRANSACTIONS;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [quickActionState, setQuickActionState] = useState(null);

  // Sync effect
  useEffect(() => {
    localStorage.setItem("solomon-books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("solomon-members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("solomon-transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Helper: Append Transaction Log
  const logTransaction = (bookTitle, memberName, type, status = "completed") => {
    const newTx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookTitle,
      memberName,
      type,
      date: "2026-05-26", // System Date
      status
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // --- CATALOG OPERATIONS ---
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
    logTransaction(newBook.title, "System Admin", "add");
  };

  const handleEditBook = (bookId, updatedData) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return { ...book, ...updatedData };
      }
      return book;
    }));
  };

  const handleDeleteBook = (bookId) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;
    
    // Safety check: is it borrowed?
    if (bookToDelete.status === "Borrowed") {
      alert("Cannot delete book: This book is currently borrowed and must be returned first.");
      return;
    }

    setBooks(prev => prev.filter(b => b.id !== bookId));
    logTransaction(bookToDelete.title, "System Admin", "delete");
  };

  // --- TRANSACTION OPERATIONS ---
  const handleCheckoutTrigger = (book) => {
    setCheckoutBook(book);
  };

  const handleCheckoutConfirm = (bookId, memberId, borrowDate, dueDate) => {
    const member = members.find(m => m.id === memberId);
    const book = books.find(b => b.id === bookId);
    if (!member || !book) return;

    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          status: "Borrowed",
          borrowedBy: memberId,
          borrowDate: borrowDate,
          dueDate: dueDate
        };
      }
      return b;
    }));

    logTransaction(book.title, member.name, "borrow", "active");
    setCheckoutBook(null);
  };

  const handleReturnBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const borrower = members.find(m => m.id === book.borrowedBy);
    const borrowerName = borrower ? borrower.name : "Registered Member";

    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        // Automatic Reservation Hold Resolution!
        // If there are reservations, hand the book to the next person in line
        if (b.reservations && b.reservations.length > 0) {
          const nextMemberId = b.reservations[0];
          const remainingReservations = b.reservations.slice(1);
          const nextMember = members.find(m => m.id === nextMemberId);
          const nextMemberName = nextMember ? nextMember.name : nextMemberId;

          // Date computations
          const today = new Date("2026-05-26");
          const due = new Date("2026-05-26");
          due.setDate(today.getDate() + 14); // Standard 14-day hold checkout

          const formatDate = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
          };

          // Register transaction for return
          logTransaction(b.title, borrowerName, "return");
          // Register transaction for hold checkout
          logTransaction(b.title, nextMemberName, "borrow", "active");

          return {
            ...b,
            status: "Borrowed",
            borrowedBy: nextMemberId,
            borrowDate: formatDate(today),
            dueDate: formatDate(due),
            reservations: remainingReservations
          };
        }

        // Standard Return to shelf
        logTransaction(b.title, borrowerName, "return");
        return {
          ...b,
          status: "Available",
          borrowedBy: null,
          borrowDate: null,
          dueDate: null,
          reservations: []
        };
      }
      return b;
    }));
  };

  const handleAddReservation = (bookId, memberId) => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return;

    // Check if member already reserved it
    if (book.reservations && book.reservations.includes(memberId)) {
      alert("This borrower already placed a hold request on this book.");
      return;
    }

    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const reservations = b.reservations || [];
        return {
          ...b,
          reservations: [...reservations, memberId]
        };
      }
      return b;
    }));

    logTransaction(book.title, member.name, "reserve");
  };

  const handleRemoveReservation = (bookId, memberId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const reservations = b.reservations || [];
        return {
          ...b,
          reservations: reservations.filter(id => id !== memberId)
        };
      }
      return b;
    }));
  };

  // --- MEMBER OPERATIONS ---
  const handleAddMember = (memberData) => {
    const newMember = {
      id: `LIB-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: "2026-05-26",
      ...memberData
    };
    setMembers(prev => [newMember, ...prev]);
  };

  const handleDeleteMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  // Quick Action Routing from Dashboard
  const triggerQuickAction = (action) => {
    setQuickActionState(action);
    if (action === "addBook") setActiveTab("catalog");
    if (action === "addMember") setActiveTab("members");
  };

  return (
    <div className="app-container">
      {/* Console Side Navigation Drawer */}
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="logo-symbol">
            <ConsoleLogoSymbol />
          </div>
          <span className="logo-text">Solomon console</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "catalog" ? "active" : ""}`}
            onClick={() => setActiveTab("catalog")}
          >
            <CatalogIcon />
            <span>Digital Catalogue</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <MembersIcon />
            <span>Borrowers Roster</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <span>Control Console v1.0.0</span>
          <span>System Date: 2026-05-26</span>
        </div>
      </aside>

      {/* Main Console Content Body */}
      <main className="app-content">
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
          />
        )}
      </main>

      {/* Transactional Checkout Modal Overlay */}
      {checkoutBook && (
        <BorrowModal 
          book={checkoutBook}
          members={members}
          onClose={() => setCheckoutBook(null)}
          onConfirm={handleCheckoutConfirm}
        />
      )}
    </div>
  );
}
