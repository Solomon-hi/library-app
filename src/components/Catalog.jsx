import React, { useState, useMemo, useEffect } from "react";

// Inline Custom SVGs for catalog interface
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TrashIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default function Catalog({ 
  books, 
  members, 
  onAddBook, 
  onEditBook, 
  onDeleteBook, 
  onCheckoutTrigger, 
  onReturnBook,
  onAddReservation,
  onRemoveReservation,
  quickActionState,
  clearQuickAction,
  showToast,
  showConfirm
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "available", "borrowed", "overdue"
  const [sortBy, setSortBy] = useState("title"); // "title", "year", "newest"
  const [expandedBookId, setExpandedBookId] = useState(null);
  
  // Modals Local State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [reserveBook, setReserveBook] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fantasy");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [coverTheme, setCoverTheme] = useState("emerald");
  
  // Reservation Form State
  const [selectedReserveMember, setSelectedReserveMember] = useState("");

  const today = useMemo(() => new Date(), []);

  // Handle opening form for adding a book
  const openAddForm = () => {
    setEditingBook(null);
    setTitle("");
    setAuthor("");
    setGenre("Fantasy");
    setIsbn("");
    setYear("");
    setLanguage("English");
    setDescription("");
    setCoverTheme("emerald");
    setIsFormOpen(true);
  };

  // Handle opening form for editing a book
  const openEditForm = (book, e) => {
    e.stopPropagation();
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setYear(book.year || "");
    setLanguage(book.language || "English");
    setDescription(book.description || "");
    setCoverTheme(book.coverTheme || "emerald");
    setIsFormOpen(true);
  };

  // Process addition or updates
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) {
      showToast("Please fill in the required fields (Title, Author, ISBN).", "error");
      return;
    }

    let coverUrl = "linear-gradient(135deg, #1e293b, #0f172a)";
    if (coverTheme === "emerald") coverUrl = "linear-gradient(135deg, #064e3b, #022c22)";
    if (coverTheme === "purple") coverUrl = "linear-gradient(135deg, #4c1d95, #2e1065)";
    if (coverTheme === "amber") coverUrl = "linear-gradient(135deg, #78350f, #451a03)";
    if (coverTheme === "crimson") coverUrl = "linear-gradient(135deg, #7f1d1d, #450a0a)";
    if (coverTheme === "blue") coverUrl = "linear-gradient(135deg, #1e3a8a, #172554)";

    const bookData = {
      title,
      author,
      genre,
      isbn,
      year,
      language,
      description,
      coverUrl,
      coverTheme
    };

    if (editingBook) {
      onEditBook(editingBook.id, bookData);
    } else {
      onAddBook(bookData);
    }
    setIsFormOpen(false);
  };

  // Handle Quick Actions forwarded from Dashboard
  useEffect(() => {
    if (quickActionState === "addBook") {
      openAddForm();
      clearQuickAction();
    }
  }, [quickActionState]);

  // Map member names for borrowing information display
  const memberMap = useMemo(() => {
    const map = {};
    members.forEach(m => {
      map[m.id] = m.name;
    });
    return map;
  }, [members]);

  // Filtering & Searching Logics
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Search Matching
        const term = search.toLowerCase();
        const matchesSearch = 
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.isbn.includes(term) ||
          book.genre.toLowerCase().includes(term);
        
        if (!matchesSearch) return false;

        // Tab Filtering
        if (filter === "available") return book.status === "Available";
        if (filter === "borrowed") return book.status === "Borrowed";
        if (filter === "overdue") {
          return book.status === "Borrowed" && book.dueDate && new Date(book.dueDate) < today;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "year") return parseInt(b.year || 0) - parseInt(a.year || 0);
        if (sortBy === "newest") {
          return b.id.localeCompare(a.id);
        }
        return 0;
      });
  }, [books, search, filter, sortBy, today]);

  const toggleExpand = (id) => {
    setExpandedBookId(expandedBookId === id ? null : id);
  };

  // Reservation hold handler
  const handleReserveSubmit = (e) => {
    e.preventDefault();
    if (!selectedReserveMember) return;
    onAddReservation(reserveBook.id, selectedReserveMember);
    setSelectedReserveMember("");
    setReserveBook(null);
  };

  // Count metrics for tabs
  const countAvailable = useMemo(() => books.filter(b => b.status === "Available").length, [books]);
  const countBorrowed = useMemo(() => books.filter(b => b.status === "Borrowed").length, [books]);
  const countOverdue = useMemo(() => books.filter(b => b.status === "Borrowed" && b.dueDate && new Date(b.dueDate) < today).length, [books, today]);

  return (
    <div className="catalog-container animate-fade">
      
      {/* Search and Filters Toolbar */}
      <div className="toolbar" style={{ marginBottom: "20px" }}>
        <div className="toolbar-left">
          <div className="search-bar">
            <div className="input-icon-wrap">
              <span className="input-icon"><SearchIcon /></span>
              <input 
                type="text" 
                placeholder="Search books by title, author, genre or ISBN..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
              {search && (
                <button className="input-clear" onClick={() => setSearch("")}>×</button>
              )}
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All <span className="tab-count">{books.length}</span>
            </button>
            <button 
              className={`filter-tab ${filter === "available" ? "active" : ""}`}
              onClick={() => setFilter("available")}
            >
              Available <span className="tab-count">{countAvailable}</span>
            </button>
            <button 
              className={`filter-tab ${filter === "borrowed" ? "active" : ""}`}
              onClick={() => setFilter("borrowed")}
            >
              Circulating <span className="tab-count">{countBorrowed}</span>
            </button>
            <button 
              className={`filter-tab ${filter === "overdue" ? "active" : ""}`}
              onClick={() => setFilter("overdue")}
            >
              Overdue <span className="tab-count" style={{ backgroundColor: countOverdue > 0 ? "var(--red-dim)" : "", color: countOverdue > 0 ? "var(--red)" : "" }}>{countOverdue}</span>
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="input sort-select"
          >
            <option value="title">Alphabetical (A-Z)</option>
            <option value="year">Publication Year</option>
            <option value="newest">Recently Catalogued</option>
          </select>
          
          <button className="btn btn-primary" onClick={openAddForm}>
            + Add Book
          </button>
        </div>
      </div>

      {/* Grid Shelf */}
      {filteredBooks.length === 0 ? (
        <div className="empty-state card card-p animate-in">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <h3 className="empty-title">No matching records found</h3>
          <p className="empty-sub">We couldn't find any catalogued books that match your filters or search query.</p>
          <button className="btn btn-ghost btn-sm mt-3" onClick={() => { setSearch(""); setFilter("all"); }}>
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => {
            const isExpanded = expandedBookId === book.id;
            const isOverdue = book.status === "Borrowed" && book.dueDate && new Date(book.dueDate) < today;
            
            return (
              <div 
                key={book.id} 
                className={`book-card card ${isExpanded ? "expanded" : ""} ${isOverdue ? "overdue-card" : ""}`}
                onClick={() => toggleExpand(book.id)}
              >
                {/* Book Card Core Visual Top */}
                <div className="book-card-top">
                  {/* Spine cover gradient */}
                  <div className="cover-pill" style={{ background: book.coverUrl }}>
                    <div className="cover-title">{book.title}</div>
                    <div className="cover-author">{book.author}</div>
                  </div>

                  {/* Core details */}
                  <div className="book-meta">
                    <div>
                      <div className="book-genre-tag">{book.genre}</div>
                      <h3 className="book-title" title={book.title}>{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                    </div>

                    <div className="book-meta-row">
                      <span>{book.year || "N/A"}</span>
                      <span>•</span>
                      <span>{book.language || "English"}</span>
                      <span>•</span>
                      {book.status === "Available" && (
                        <span className="badge badge-green">Shelved</span>
                      )}
                      {book.status === "Borrowed" && (
                        <span className={`badge ${isOverdue ? "badge-red" : "badge-amber"}`}>
                          {isOverdue ? "Overdue" : "Out"}
                        </span>
                      )}
                      {book.status === "Reserved" && (
                        <span className="badge badge-purple">On Hold</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return due date footer */}
                {book.status === "Borrowed" && book.dueDate && (
                  <div className="book-footer">
                    <span className="text-muted">Return Due:</span>
                    <span className={`book-due ${isOverdue ? "overdue" : ""}`}>{book.dueDate}</span>
                  </div>
                )}

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="book-drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="drawer-cols">
                      {/* Left: Summary description */}
                      <div>
                        <div className="drawer-sec-title">Book Overview</div>
                        <p className="book-desc">
                          {book.description || "No full synopsis catalogued. Edit the book records to add a synopsis."}
                        </p>
                        <div className="desc-meta">
                          <div><strong>ISBN:</strong> {book.isbn}</div>
                          {book.borrowedBy && (
                            <div>
                              <strong>Borrowed By:</strong> {memberMap[book.borrowedBy] || "Registered Borrower"} ({book.borrowedBy})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Reservation queue */}
                      <div>
                        <div className="drawer-sec-title">Hold Request Queue</div>
                        {book.reservations && book.reservations.length > 0 ? (
                          <ul className="queue-list">
                            {book.reservations.map((memId, idx) => (
                              <li key={memId} className="queue-item">
                                <span className="queue-num">#{idx + 1}</span>
                                <span className="queue-name">{memberMap[memId] || memId}</span>
                                <button 
                                  className="btn btn-ghost btn-xs"
                                  onClick={() => onRemoveReservation(book.id, memId)}
                                  title="Cancel hold"
                                >
                                  Cancel
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted" style={{ fontSize: "0.85rem" }}>No active hold requests.</p>
                        )}

                        {book.status === "Borrowed" && (
                          <button 
                            className="btn btn-purple btn-xs mt-3"
                            onClick={() => setReserveBook(book)}
                          >
                            + Place Hold Request
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Drawer Footer Actions */}
                    <div className="drawer-actions">
                      <div className="drawer-act-left">
                        <button className="btn btn-ghost btn-sm" onClick={(e) => openEditForm(book, e)}>
                          <EditIcon size={14} /> Edit Details
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); showConfirm("Delete Catalog Record?", `Are you sure you want to permanently remove "${book.title}"?`, () => onDeleteBook(book.id)); }}>
                          <TrashIcon size={14} /> Delete Catalog
                        </button>
                      </div>

                      <div className="drawer-act-right">
                        {book.status === "Available" ? (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => onCheckoutTrigger(book)}
                          >
                            Checkout Book
                          </button>
                        ) : (
                          <button 
                            className="btn btn-green btn-sm"
                            onClick={() => onReturnBook(book.id)}
                          >
                            Mark as Returned
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Catalog Entry / Edit Modal Form */}
      {isFormOpen && (
        <div className="modal-bg" onClick={() => setIsFormOpen(false)}>
          <div className="modal-box modal-md animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingBook ? "Edit Catalogue Record" : "Add Book to Shelves"}</h2>
              <button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="field">
                    <label className="field-label">Book Title *</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter full title"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Author Name *</label>
                    <input 
                      type="text" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)} 
                      placeholder="Enter primary author"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Genre Grouping</label>
                    <select 
                      value={genre} 
                      onChange={(e) => setGenre(e.target.value)}
                      className="input"
                    >
                      <option value="Fantasy">Fantasy</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Cyberpunk">Cyberpunk</option>
                      <option value="Dystopian">Dystopian</option>
                      <option value="Mystery/Thriller">Mystery/Thriller</option>
                      <option value="Biography">Biography</option>
                      <option value="History">History</option>
                      <option value="Classical Fiction">Classical Fiction</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field-label">ISBN Code *</label>
                    <input 
                      type="text" 
                      value={isbn} 
                      onChange={(e) => setIsbn(e.target.value)} 
                      placeholder="e.g. 978-3-16-148410-0"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Publication Year</label>
                    <input 
                      type="number" 
                      value={year} 
                      onChange={(e) => setYear(e.target.value)} 
                      placeholder="e.g. 1965"
                      className="input"
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Text Language</label>
                    <input 
                      type="text" 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)} 
                      placeholder="English"
                      className="input"
                    />
                  </div>

                  <div className="field form-full">
                    <label className="field-label">Synopsis / Description</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Provide a brief description of the plot, contents or chapters..."
                      className="input"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="field form-full">
                    <label className="field-label">Shelf Cover Aesthetic Theme</label>
                    <div className="theme-grid">
                      {["emerald", "purple", "amber", "crimson", "blue"].map((themeName) => {
                        let bgGrad = "linear-gradient(135deg, #1e293b, #0f172a)";
                        if (themeName === "emerald") bgGrad = "linear-gradient(135deg, #064e3b, #022c22)";
                        if (themeName === "purple") bgGrad = "linear-gradient(135deg, #4c1d95, #2e1065)";
                        if (themeName === "amber") bgGrad = "linear-gradient(135deg, #78350f, #451a03)";
                        if (themeName === "crimson") bgGrad = "linear-gradient(135deg, #7f1d1d, #450a0a)";
                        if (themeName === "blue") bgGrad = "linear-gradient(135deg, #1e3a8a, #172554)";

                        return (
                          <button
                            key={themeName}
                            type="button"
                            className={`theme-swatch ${coverTheme === themeName ? "selected" : ""}`}
                            style={{ background: bgGrad }}
                            onClick={() => setCoverTheme(themeName)}
                            title={themeName}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-ghost" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? "Save Catalogue Changes" : "Shelve Book Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation Hold Request Modal */}
      {reserveBook && (
        <div className="modal-bg" onClick={() => setReserveBook(null)}>
          <div className="modal-box modal-sm animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Request Hold Queue</h2>
              <button className="modal-close" onClick={() => setReserveBook(null)}>×</button>
            </div>
            
            <form onSubmit={handleReserveSubmit}>
              <div className="modal-body">
                <p className="text-muted" style={{ marginBottom: "12px", fontSize: "0.88rem", lineHeight: "1.4" }}>
                  <strong>{reserveBook.title}</strong> is currently borrowed. Reserve a hold, and the member will be notified when it returns.
                </p>
                
                <div className="field">
                  <label className="field-label">Select Library Member</label>
                  <select
                    value={selectedReserveMember}
                    onChange={(e) => setSelectedReserveMember(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">-- Choose Member Record --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-ghost" onClick={() => setReserveBook(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-purple" disabled={!selectedReserveMember}>
                  Queue Hold Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
