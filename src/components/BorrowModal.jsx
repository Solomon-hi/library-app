import React, { useState, useMemo } from "react";

export default function BorrowModal({ book, members, onClose, onConfirm }) {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [durationDays, setDurationDays] = useState(14); // default 14 days

  // Today is hardcoded to system date: 2026-05-26
  const calculatedDates = useMemo(() => {
    const today = new Date("2026-05-26");
    const due = new Date("2026-05-26");
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
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-panel animate-scale-up size-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Checkout Book Allocation</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="checkout-summary-box">
            <span className="checkout-summary-label">Book Selected</span>
            <h3 className="checkout-summary-title">{book.title}</h3>
            <p className="checkout-summary-author">by {book.author}</p>
          </div>

          <div className="input-group">
            <span className="input-label">Assign to Library Card Holder</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="input-field"
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

          <div className="input-group">
            <span className="input-label">Circulation Duration</span>
            <div className="duration-picker-row">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`duration-pick-btn ${durationDays === days ? "selected" : ""}`}
                  onClick={() => setDurationDays(days)}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Checkout audit dates preview */}
          <div className="checkout-audit-preview">
            <div className="audit-col">
              <span className="audit-label">Circulation Date</span>
              <span className="audit-val">{calculatedDates.borrowDate}</span>
            </div>
            <div className="audit-col">
              <span className="audit-label">Expected Due Date</span>
              <span className="audit-val highlight">{calculatedDates.dueDate}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
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
