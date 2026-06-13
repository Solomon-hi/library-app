import React, { useState, useMemo, useEffect } from "react";

// SVGs
const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  clearQuickAction,
  showToast,
  showConfirm
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
      showToast("Name and email are required fields.", "error");
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
  useEffect(() => {
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
          dueDate: b.dueDate,
          isOverdue: b.dueDate && new Date(b.dueDate) < new Date()
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
      showToast(`Cannot delete member: ${member.name} has ${borrowedItems.length} borrowed books that must be returned first.`, "error");
      return;
    }

    showConfirm("Revoke Membership?", `Are you sure you want to permanently remove "${member.name}" as a card holder?`, () => {
      onDeleteMember(member.id);
    });
  };

  return (
    <div className="members-container animate-fade">
      
      {/* Control Panel Toolbar */}
      <div className="toolbar" style={{ marginBottom: "20px" }}>
        <div className="toolbar-left">
          <div className="search-bar">
            <div className="input-icon-wrap">
              <span className="input-icon"><SearchIcon /></span>
              <input 
                type="text" 
                placeholder="Search roster files by name, card ID, or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
              {search && (
                <button className="input-clear" onClick={() => setSearch("")}>×</button>
              )}
            </div>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="btn btn-purple" onClick={() => setIsFormOpen(true)}>
            + Register Card Holder
          </button>
        </div>
      </div>

      {/* Grid listing */}
      {filteredMembers.length === 0 ? (
        <div className="empty-state card card-p animate-in">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </div>
          <h3 className="empty-title">No matching members found</h3>
          <p className="empty-sub">We couldn't locate any library card folders that match your search terms.</p>
          <button className="btn btn-ghost btn-sm mt-3" onClick={() => setSearch("")}>
            Clear Member Filter
          </button>
        </div>
      ) : (
        <div className="member-grid">
          {filteredMembers.map(member => {
            const borrowedItems = memberCirculations[member.id] || [];
            const isExpanded = expandedMemberId === member.id;
            const hasOverdue = borrowedItems.some(i => i.isOverdue);
            const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
            
            return (
              <div 
                key={member.id} 
                className={`member-card card ${isExpanded ? "expanded" : ""} ${hasOverdue ? "overdue-card" : ""}`}
                onClick={() => toggleExpand(member.id)}
              >
                <div className="member-top">
                  {/* Avatar bubble */}
                  <div className="member-avatar" style={{ background: member.avatarColor }}>
                    {initials}
                  </div>

                  {/* Core details */}
                  <div className="member-info">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="member-id">
                        <CardIcon /> {member.id}
                      </span>
                      {borrowedItems.length > 0 ? (
                        <span className={`badge ${hasOverdue ? "badge-red" : "badge-amber"}`}>
                          {borrowedItems.length} items out
                        </span>
                      ) : (
                        <span className="badge badge-green">Clear Status</span>
                      )}
                    </div>

                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-email">{member.email}</p>
                    {member.phone && <p className="text-muted" style={{ fontSize: "0.8rem", marginTop: "2px" }}>{member.phone}</p>}
                  </div>
                </div>

                {/* Expanded active borrows and actions */}
                {isExpanded && (
                  <div className="member-drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="member-drawer-cols">
                      {/* Left: Registration data */}
                      <div>
                        <div className="drawer-sec-title">Borrower Registration</div>
                        <div className="desc-meta" style={{ marginTop: 0 }}>
                          <div><strong>Status:</strong> Verified</div>
                          <div><strong>Registration Date:</strong> {member.joinedDate}</div>
                          <div><strong>Card Holder:</strong> Card Active</div>
                        </div>
                        <button 
                          className="btn btn-danger btn-sm"
                          style={{ marginTop: "16px" }}
                          onClick={(e) => handleDeleteClick(e, member)}
                        >
                          Revoke Membership
                        </button>
                      </div>

                      {/* Right: Borrowed inventory list */}
                      <div>
                        <div className="drawer-sec-title">Active Checked-Out items</div>
                        {borrowedItems.length > 0 ? (
                          <ul className="queue-list">
                            {borrowedItems.map((item, idx) => (
                              <li key={item.id} className="queue-item">
                                <span className="queue-num">#{idx + 1}</span>
                                <span className="queue-name"><strong>{item.title}</strong></span>
                                <span className={`badge ${item.isOverdue ? "badge-red" : "badge-gray"} font-xsmall`}>
                                  Due: {item.dueDate}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted" style={{ fontSize: "0.85rem" }}>No active material circulations.</p>
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
        <div className="modal-bg" onClick={() => setIsFormOpen(false)}>
          <div className="modal-box modal-sm animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Register New Card Holder</h2>
              <button className="modal-close" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="field">
                  <label className="field-label">Borrower Full Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Cassandra Cillian"
                    className="input"
                    required
                  />
                </div>

                <div className="field">
                  <label className="field-label">Email Address *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="e.g. cassandra.c@library.org"
                    className="input"
                    required
                  />
                </div>

                <div className="field">
                  <label className="field-label">Contact Phone</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="e.g. (555) 019-3329"
                    className="input"
                  />
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn btn-ghost" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-purple">
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
