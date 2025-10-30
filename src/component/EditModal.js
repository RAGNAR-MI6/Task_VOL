// src/component/EditModal.js
import React, { useState } from "react";
import "./EditModal.css"; // We will create this file next

const EditModal = ({ app, onClose, onSave }) => {
  // This state holds the form data *inside* the modal
  const [formData, setFormData] = useState({
    applicationId: app.applicationId,
    pan: app.pan, // Keep pan as an identifier, but make it read-only
    applName: app.applName || "",
    firm: app.firm || "",
    mobile: app.mobile || "",
    status: app.status || "DRAFT",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Simple filter for mobile field
    let processedValue = value;
    if (name === "mobile") {
      processedValue = value.replace(/\D/g, ""); // Remove non-digits
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the updated data (merged with the original app object) back to the parent
    onSave({ ...app, ...formData });
  };

  return (
    // The modal backdrop
    <div className="modal-backdrop" onClick={onClose}>
      {/* The modal content, stopPropagation prevents clicks inside closing it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Application</h2>
        <form onSubmit={handleSubmit}>
          {/* Re-using form-group styles from Form.css */}
          <div className="form-group">
            <label htmlFor="pan">PAN (Read-only)</label>
            <input
              type="text"
              id="pan"
              name="pan"
              value={formData.pan}
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="applName">Application Name *</label>
            <input
              type="text"
              id="applName"
              name="applName"
              value={formData.applName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="firm">Firm *</label>
            <input
              type="text"
              id="firm"
              name="firm"
              value={formData.firm}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile *</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="modal-actions">
            {/* Re-using submit-btn style from Form.css */}
            <button
              type="button"
              className="submit-btn cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
