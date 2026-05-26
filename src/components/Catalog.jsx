import React, { useState, useMemo } from "react";

// Inline Custom SVGs for catalog interface
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  clearQuickAction
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
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [coverTheme, setCoverTheme] = useState("emerald");
  
  // Reservation Form State
  const [selectedReserveMember, setSelectedReserveMember] = useState("");

  // Handle opening form for adding a book
  const openAddForm = () => {
    setEditingBook(null);
    setTitle("");
    setAuthor("");
    setGenre("Fiction");
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
    setYear(book.year);
    setLanguage(book.language || "English");
    setDescription(book.description || "");
    setCoverTheme(book.coverTheme || "purple");
    setIsFormOpen(true);
  };

  // Process addition or updates
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) {
      alert("Please fill in the required fields (Title, Author, ISBN).");
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
  React.useEffect(() => {
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
    const today = new Date("2026-05-26");
    
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
          // Sort by their id as a proxy for insertion
          return b.id.localeCompare(a.id);
        }
        return 0;
      });
  }, [books, search, filter, sortBy]);

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

  return (
    <div className="catalog-container animate-fade-in">
      
      {/* Search and Filters Drawer */}
      <div className="catalog-control-panel glass-panel">
        <div className="search-bar-wrapper">
          <span className="search-icon"><SearchIcon /></span>
          <input 
            type="text" 
            placeholder="Search books by title, author, genre or ISBN..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <div className="filter-sort-controls">
          <div className="catalog-tabs">
            <button 
              className={`catalog-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Books <span className="tab-indicator">{books.length}</span>
            </button>
            <button 
              className={`catalog-tab ${filter === "available" ? "active" : ""}`}
              onClick={() => setFilter("available")}
            >
              Available <span className="tab-indicator green">{books.filter(b => b.status === "Available").length}</span>
            </button>
            <button 
              className={`catalog-tab ${filter === "borrowed" ? "active" : ""}`}
              onClick={() => setFilter("borrowed")}
            >
              Circulating <span className="tab-indicator orange">{books.filter(b => b.status === "Borrowed").length}</span>
            </button>
            <button 
              className={`catalog-tab ${filter === "overdue" ? "active" : ""}`}
              onClick={() => setFilter("overdue")}
            >
              Overdue <span className="tab-indicator crimson">{
                books.filter(b => b.status === "Borrowed" && b.dueDate && new Date(b.dueDate) < new Date("2026-05-26")).length
              }</span>
            </button>
          </div>

          <div className="sort-wrapper">
            <label className="sort-label">Sort By:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field sort-select"
            >
              <option value="title">Alphabetical (A-Z)</option>
              <option value="year">Publication Year</option>
              <option value="newest">Recently Catalogued</option>
            </select>
            
            <button className="btn btn-primary add-book-btn" onClick={openAddForm}>
              + Add Book
            </button>
          </div>
        </div>
      </div>

      {/* Grid Shelf */}
      {filteredBooks.length === 0 ? (
        <div className="empty-catalog-state glass-panel animate-scale-up">
          <div className="empty-state-graphic">
            <svg viewBox="0 0 100 100" width="80" height="80" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <rect x="25" y="15" width="50" height="70" rx="4" />
              <line x1="35" y1="30" x2="65" y2="30" />
              <line x1="35" y1="45" x2="65" y2="45" />
              <line x1="35" y1="60" x2="55" y2="60" />
            </svg>
          </div>
          <h3>No matching records found</h3>
          <p>We couldn't find any catalogued books that match your filters or search query.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(""); setFilter("all"); }}>
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredBooks.map((book) => {
            const isExpanded = expandedBookId === book.id;
            const isOverdue = book.status === "Borrowed" && book.dueDate && new Date(book.dueDate) < new Date("2026-05-26");
            
            return (
              <div 
                key={book.id} 
                className={`book-card glass-panel ${isExpanded ? "expanded" : ""} ${isOverdue ? "overdue-border" : ""}`}
                onClick={() => toggleExpand(book.id)}
              >
                {/* Book Card Core visual top */}
                <div className="book-card-main">
                  {/* Decorative Cover Gradient Spine */}
                  <div className="book-spine-cover" style={{ background: book.coverUrl }}>
                    <div className="cover-grid-decor"></div>
                    <div className="cover-title-spine">{book.title}</div>
                    <div className="cover-author-spine">{book.author}</div>
                  </div>

                  {/* Core details */}
                  <div className="book-card-info">
                    <div className="info-header">
                      <span className="book-genre">{book.genre}</span>
                      
                      {/* Availability status badge */}
                      {book.status === "Available" && (
                        <span className="badge badge-available">Shelved</span>
                      )}
                      {book.status === "Borrowed" && (
                        <span className={`badge ${isOverdue ? "badge-overdue" : "badge-borrowed"}`}>
                          {isOverdue ? "Overdue" : "Out"}
                        </span>
                      )}
                      {book.status === "Reserved" && (
                        <span className="badge badge-reserved">On Hold</span>
                      )}
                    </div>

                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>

                    <div className="book-details-mini">
                      <span><strong>Year:</strong> {book.year || "N/A"}</span>
                      <span><strong>Language:</strong> {book.language || "English"}</span>
                    </div>

                    {book.status === "Borrowed" && book.dueDate && (
                      <div className={`circulation-footer ${isOverdue ? "overdue-alert" : ""}`}>
                        <span className="circ-label">Return Due:</span>
                        <span className="circ-date">{book.dueDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="book-expanded-drawer" onClick={(e) => e.stopPropagation()}>
                    <hr className="drawer-divider" />
                    
                    <div className="drawer-grid">
                      {/* Left: Summary description */}
                      <div className="drawer-desc-block">
                        <h4>Book Overview</h4>
                        <p className="book-desc-text">
                          {book.description || "No full synopsis catalogued. Edit the book records to add a synopsis."}
                        </p>
                        <div className="desc-metadata">
                          <p><strong>ISBN:</strong> {book.isbn}</p>
                          {book.borrowedBy && (
                            <p><strong>Borrowed By:</strong> {memberMap[book.borrowedBy] || "Registered Borrower"} ({book.borrowedBy})</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Reservation queue & Actions */}
                      <div className="drawer-queue-block">
                        <h4>Hold Request Queue</h4>
                        {book.reservations && book.reservations.length > 0 ? (
                          <ul className="reserve-queue-list">
                            {book.reservations.map((memId, idx) => (
                              <li key={idx} className="queue-item">
                                <span className="queue-index">#{idx + 1}</span>
                                <span className="queue-member">{memberMap[memId] || memId}</span>
                                <button 
                                  className="btn-text-delete"
                                  onClick={() => onRemoveReservation(book.id, memId)}
                                  title="Cancel hold"
                                >
                                  Cancel hold
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="empty-queue-text">No active hold requests.</p>
                        )}

                        <div className="queue-actions">
                          {book.status === "Borrowed" && (
                            <button 
                              className="btn btn-secondary btn-small"
                              onClick={() => setReserveBook(book)}
                            >
                              + Place Hold Request
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="drawer-actions-panel">
                      <div className="drawer-admin-buttons">
                        <button className="btn btn-secondary" onClick={(e) => openEditForm(book, e)}>
                          <EditIcon /> Edit Details
                        </button>
                        <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${book.title}?`)) onDeleteBook(book.id); }}>
                          <TrashIcon /> Delete Catalog
                        </button>
                      </div>

                      <div className="drawer-checkout-buttons">
                        {book.status === "Available" ? (
                          <button 
                            className="btn btn-primary"
                            onClick={() => onCheckoutTrigger(book)}
                          >
                            Checkout Book
                          </button>
                        ) : (
                          <button 
                            className="btn btn-accent"
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
        <div className="modal-overlay animate-fade-in" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBook ? "Edit Catalogue Record" : "Add Book to Shelves"}</h2>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-grid">
                <div className="input-group">
                  <span className="input-label">Book Title *</span>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter full title"
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Author Name *</span>
                  <input 
                    type="text" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    placeholder="Enter primary author"
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Genre Grouping</span>
                  <select 
                    value={genre} 
                    onChange={(e) => setGenre(e.target.value)}
                    className="input-field"
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

                <div className="input-group">
                  <span className="input-label">International Code (ISBN) *</span>
                  <input 
                    type="text" 
                    value={isbn} 
                    onChange={(e) => setIsbn(e.target.value)} 
                    placeholder="e.g. 978-3-16-148410-0"
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Publication Year</span>
                  <input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    placeholder="e.g. 1965"
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Text Language</span>
                  <input 
                    type="text" 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    placeholder="English"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group full-width">
                <span className="input-label">Synopsis / Description</span>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Provide a brief description of the plot, contents or chapters..."
                  className="input-field textarea-field"
                  rows="3"
                ></textarea>
              </div>

              <div className="input-group full-width">
                <span className="input-label">Shelf Cover Aesthetic Theme</span>
                <div className="cover-theme-picker">
                  {["emerald", "purple", "amber", "crimson", "blue"].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      className={`theme-pick-btn ${theme} ${coverTheme === theme ? "selected" : ""}`}
                      onClick={() => setCoverTheme(theme)}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
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
        <div className="modal-overlay animate-fade-in" onClick={() => setReserveBook(null)}>
          <div className="modal-content glass-panel animate-scale-up size-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Hold Queue</h2>
              <button className="modal-close-btn" onClick={() => setReserveBook(null)}>×</button>
            </div>
            
            <form onSubmit={handleReserveSubmit} className="modal-form">
              <p className="modal-helper-text">
                <strong>{reserveBook.title}</strong> is currently borrowed. Reserve a hold, and the member will be notified when it returns.
              </p>
              
              <div className="input-group">
                <span className="input-label">Select Library Member</span>
                <select
                  value={selectedReserveMember}
                  onChange={(e) => setSelectedReserveMember(e.target.value)}
                  className="input-field"
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

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReserveBook(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" disabled={!selectedReserveMember}>
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
