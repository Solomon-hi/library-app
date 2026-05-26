import React, { useState, useMemo } from "react";

// Inline Custom SVGs for members dashboard
const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function Members({ 
  members, 
  books, 
  onAddMember, 
  onDeleteMember,
  quickActionState,
  clearQuickAction
}) {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Name and email are required fields.");
      return;
    }

    const gradients = [
      "linear-gradient(135deg, #6366f1, #a855f7)",
      "linear-gradient(135deg, #10b981, #059669)",
      "linear-gradient(135deg, #f59e0b, #d97706)",
      "linear-gradient(135deg, #ec4899, #db2777)",
      "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    onAddMember({
      name,
      email,
      phone: phone || "Not Provided",
      avatarColor: randomGradient
    });

    setName("");
    setEmail("");
    setPhone("");
    setIsFormOpen(false);
  };

  // Handle Dashboard triggers
  React.useEffect(() => {
    if (quickActionState === "addMember") {
      setIsFormOpen(true);
      clearQuickAction();
    }
  }, [quickActionState]);

  // Compute active books checked out for each member
  const memberCirculations = useMemo(() => {
    const records = {};
    members.forEach(m => {
      records[m.id] = [];
    });
    
    books.forEach(b => {
      if (b.status === "Borrowed" && b.borrowedBy) {
        if (!records[b.borrowedBy]) {
          records[b.borrowedBy] = [];
        }
        records[b.borrowedBy].push({
          id: b.id,
          title: b.title,
          dueDate: b.dueDate
        });
      }
    });

    return records;
  }, [members, books]);

  // Filter members based on search queries
  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase();
    return members.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.id.toLowerCase().includes(query)
    );
  }, [members, search]);

  const toggleExpand = (id) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  const handleDeleteClick = (e, member) => {
    e.stopPropagation();
    
    // Safety check: verify if the borrower has unreturned catalog holdings
    const borrowedItems = memberCirculations[member.id] || [];
    if (borrowedItems.length > 0) {
      alert(`Cannot delete member file: ${member.name} has ${borrowedItems.length} borrowed books that must be returned first.`);
      return;
    }

    if (confirm(`Are you sure you want to remove card holder file for ${member.name}?`)) {
      onDeleteMember(member.id);
    }
  };

  return (
    <div className="members-container animate-fade-in">
      
      {/* Control panel drawer */}
      <div className="catalog-control-panel glass-panel">
        <div className="search-bar-wrapper">
          <span className="search-icon"><SearchIcon /></span>
          <input 
            type="text" 
            placeholder="Search roster files by name, card ID, or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <div className="filter-sort-controls justify-end">
          <button className="btn btn-accent" onClick={() => setIsFormOpen(true)}>
            + Register Card Holder
          </button>
        </div>
      </div>

      {/* Grid listing */}
      {filteredMembers.length === 0 ? (
        <div className="empty-catalog-state glass-panel animate-scale-up">
          <div className="empty-state-graphic">
            <svg viewBox="0 0 100 100" width="80" height="80" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <circle cx="50" cy="40" r="16" />
              <path d="M25 75v-4c0-7.7 6.3-14 14-14h22c7.7 0 14 6.3 14 14v4" />
            </svg>
          </div>
          <h3>No matching members found</h3>
          <p>We couldn't locate any library card folders that match your search terms.</p>
          <button className="btn btn-secondary" onClick={() => setSearch("")}>
            Clear Member Filter
          </button>
        </div>
      ) : (
        <div className="members-grid">
          {filteredMembers.map(member => {
            const borrowedItems = memberCirculations[member.id] || [];
            const isExpanded = expandedMemberId === member.id;
            
            return (
              <div 
                key={member.id} 
                className={`member-card glass-panel ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleExpand(member.id)}
              >
                <div className="member-card-main">
                  {/* Avatar bubble */}
                  <div className="member-avatar" style={{ background: member.avatarColor }}>
                    {member.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                  </div>

                  {/* Core details */}
                  <div className="member-info-section">
                    <div className="member-card-header">
                      <span className="member-card-id"><CardIcon /> {member.id}</span>
                      {borrowedItems.length > 0 ? (
                        <span className="badge badge-borrowed">{borrowedItems.length} items out</span>
                      ) : (
                        <span className="badge badge-available">Clear Status</span>
                      )}
                    </div>

                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-email">{member.email}</p>
                    <p className="member-phone">{member.phone}</p>
                  </div>
                </div>

                {/* Expanded active borrows and actions */}
                {isExpanded && (
                  <div className="member-expanded-drawer" onClick={(e) => e.stopPropagation()}>
                    <hr className="drawer-divider" />
                    
                    <div className="drawer-grid">
                      {/* Left: Registration data */}
                      <div className="drawer-desc-block">
                        <h4>Borrower Registration</h4>
                        <p><strong>Member Status:</strong> Verified</p>
                        <p><strong>Registration Date:</strong> {member.joinedDate}</p>
                        <p><strong>System File Location:</strong> Local DB Sync</p>
                        <button 
                          className="btn btn-danger btn-small margin-top-sm"
                          onClick={(e) => handleDeleteClick(e, member)}
                        >
                          Revoke Membership Card
                        </button>
                      </div>

                      {/* Right: Borrowed inventory list */}
                      <div className="drawer-queue-block">
                        <h4>Active Checked-Out items</h4>
                        {borrowedItems.length > 0 ? (
                          <ul className="reserve-queue-list">
                            {borrowedItems.map((item, idx) => (
                              <li key={idx} className="queue-item">
                                <span className="queue-index">#{idx + 1}</span>
                                <span className="queue-member"><strong>{item.title}</strong></span>
                                <span className="badge badge-borrowed font-xsmall">Due: {item.dueDate}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="empty-queue-text">No active material circulations.</p>
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

      {/* Member Registration Modal Form */}
      {isFormOpen && (
        <div className="modal-overlay animate-fade-in" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content glass-panel animate-scale-up size-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register New Library Card</h2>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="input-group">
                <span className="input-label">Borrower Full Name *</span>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Cassandra Cillian"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-label">Email Address *</span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="e.g. cassandra.c@library.org"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-label">Contact Phone</span>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. (555) 019-3329"
                  className="input-field"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent">
                  Issue Membership Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
