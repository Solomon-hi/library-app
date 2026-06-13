import React, { useState, useMemo } from "react";

export default function BorrowModal({ book, members, onClose, onConfirm }) {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [durationDays, setDurationDays] = useState(14); // default 14 days

  // Calculate dates based on dynamic system today's date
  const calculatedDates = useMemo(() => {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + parseInt(durationDays));

    const formatDate = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    return {
      borrowDate: formatDate(today),
      dueDate: formatDate(due)
    };
  }, [durationDays]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert("Please select a valid member file.");
      return;
    }
    
    onConfirm(book.id, selectedMemberId, calculatedDates.borrowDate, calculatedDates.dueDate);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box modal-md animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Checkout Book Allocation</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Book display summary card */}
            <div style={{
              padding: "16px",
              background: "var(--bg-elevated)",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}>
              <span style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                Selected Book
              </span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)" }}>{book.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>by {book.author}</p>
            </div>

            {/* Member Assign Selector */}
            <div className="field">
              <label className="field-label">Assign to Library Card Holder</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="input"
                required
              >
                <option value="">-- Choose Borrower Record --</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Selector */}
            <div className="field">
              <label className="field-label">Circulation Duration</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    className={`btn ${durationDays === days ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setDurationDays(days)}
                    style={{ flex: 1 }}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Dates Grid Preview */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              padding: "12px 16px",
              background: "var(--bg-elevated)",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
              marginTop: "8px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>Circulation Date</span>
                <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{calculatedDates.borrowDate}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>Expected Due Date</span>
                <span style={{ fontWeight: "700", color: "var(--blue)" }}>{calculatedDates.dueDate}</span>
              </div>
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel Allocation
            </button>
            <button type="submit" className="btn btn-primary" disabled={!selectedMemberId}>
              Confirm Material Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
