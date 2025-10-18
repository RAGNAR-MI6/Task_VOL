// src/ApplicationForm.js
import React, { useState } from "react";
import axios from "axios";
import { validateForm } from "../validation/validation";
import "./Form.css"; // Let's use a separate CSS for the form

// Use relative URL for the proxy
const SAVE_API_URL = "/api/admin/1/saveApplicationDraft";

// This initial state is crucial. It's based on the sample request
// and ensures all fields are controlled components.
const initialState = {
  applicationId: "",
  agentId: 1027, // From sample request [cite: 6]
  status: "DRAFT", // From sample request [cite: 6]
  applName: "",
  city: "",
  firm: "",
  dba: "", // Optional [cite: 14]
  business_type: "", // Mapped from "Business Type"
  contactPerson: "",
  mobile: "",
  instAddr1: "",
  instAddr2: "", // Optional [cite: 14]
  instAddr3: "", // Optional [cite: 14]
  instLocality: "",
  instPincode: "",
  mcc: "",
  pan: "",
  panDob: "",
  meAcType: "",
  meName: "",
  melfsc: "",
  meAcNo: "",
  qrBoombox: "",
  // Other fields from sample request [cite: 7, 8, 9]
  docPath: "/documents/applications/3fa85f64-5717-4562-b3fc-2c963f66afa6/",
  panPath: "",
  aadhaarPath: "",
  bankStatementPath: "",
  shopPhotoPath: "",
};

const ApplicationForm = ({ onFormSuccess }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Perform client-side validation [cite: 29]
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // 2. Prevent submission if errors exist [cite: 34]
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the errors in the form.");
      return;
    }

    // 3. Submit data to the API
    setIsSubmitting(true);
    try {
      // Use the *real* API endpoint [cite: 4, 31]
      const response = await axios.post(SAVE_API_URL, formData);

      // 4. Display success message [cite: 33]
      alert("Form submitted successfully!");
      setFormData(initialState); // Clear the form
      setErrors({});
      if (onFormSuccess) {
        onFormSuccess(); // Tell App.js to refresh the list
      }
    } catch (error) {
      // 5. Display error message [cite: 33]
      console.error("API Error:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render the error message [cite: 30, 38]
  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <span className="error-message">{errors[fieldName]}</span>
    ) : null;
  };

  return (
    // Render all form fields dynamically (as components) [cite: 28]
    <form onSubmit={handleSubmit} className="application-form">
      <h2>New Application Form</h2>

      {/* --- Personal & Firm Details --- */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="applName">Application Name *</label>
          <input
            type="text"
            id="applName"
            name="applName"
            value={formData.applName}
            onChange={handleChange}
          />
          {renderError("applName")}
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
          {renderError("firm")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="business_type">Business Type *</label>
          <select
            id="business_type"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="Proprietorship">Proprietorship</option>
            <option value="PartnershipFirm">PartnershipFirm</option>
            <option value="Trust">Trust</option>
            <option value="Private LimitedLLP">Private LimitedLLP</option>
          </select>
          {renderError("business_type")}
        </div>
        <div className="form-group">
          <label htmlFor="mcc">MCC (Merchant Category Code) *</label>
          <select
            id="mcc"
            name="mcc"
            value={formData.mcc}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="5411">5411 - Grocery Stores</option>
            <option value="5812">5812 - Eating Places/Restaurants</option>
            <option value="5999">5999 - Miscellaneous Retail</option>
            <option value="7011">7011 - Hotels/Motels</option>
          </select>
          {renderError("mcc")}
        </div>
      </div>

      {/* --- Contact Details --- */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person *</label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
          {renderError("contactPerson")}
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
          {renderError("mobile")}
        </div>
      </div>

      {/* --- Address Details --- */}
      <div className="form-group">
        <label htmlFor="instAddr1">Address Line 1 *</label>
        <input
          type="text"
          id="instAddr1"
          name="instAddr1"
          value={formData.instAddr1}
          onChange={handleChange}
        />
        {renderError("instAddr1")}
      </div>
      <div className="form-group">
        <label htmlFor="instAddr2">Address Line 2 (Optional)</label>
        <input
          type="text"
          id="instAddr2"
          name="instAddr2"
          value={formData.instAddr2}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="instLocality">Locality *</label>
          <input
            type="text"
            id="instLocality"
            name="instLocality"
            value={formData.instLocality}
            onChange={handleChange}
          />
          {renderError("instLocality")}
        </div>
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {renderError("city")}
        </div>
        <div className="form-group">
          <label htmlFor="instPincode">Pincode *</label>
          <input
            type="text"
            id="instPincode"
            name="instPincode"
            value={formData.instPincode}
            onChange={handleChange}
            maxLength="6"
          />
          {renderError("instPincode")}
        </div>
      </div>

      {/* --- PAN & Bank Details --- */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pan">PAN *</label>
          <input
            type="text"
            id="pan"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            maxLength="10"
            style={{ textTransform: "uppercase" }}
          />
          {renderError("pan")}
        </div>
        <div className="form-group">
          <label htmlFor="panDob">PAN DOB *</label>
          <input
            type="date"
            id="panDob"
            name="panDob"
            value={formData.panDob}
            onChange={handleChange}
          />
          {renderError("panDob")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="meName">Account Holder Name *</label>
          <input
            type="text"
            id="meName"
            name="meName"
            value={formData.meName}
            onChange={handleChange}
          />
          {renderError("meName")}
        </div>
        <div className="form-group">
          <label htmlFor="meAcType">Account Type *</label>
          <select
            id="meAcType"
            name="meAcType"
            value={formData.meAcType}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Salary">Salary</option>
          </select>
          {renderError("meAcType")}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="meAcNo">Account Number *</label>
          <input
            type="text"
            id="meAcNo"
            name="meAcNo"
            value={formData.meAcNo}
            onChange={handleChange}
            maxLength="18"
          />
          {renderError("meAcNo")}
        </div>
        <div className="form-group">
          <label htmlFor="melfsc">IFSC Code *</label>
          <input
            type="text"
            id="melfsc"
            name="melfsc"
            value={formData.melfsc}
            onChange={handleChange}
            maxLength="11"
            style={{ textTransform: "uppercase" }}
          />
          {renderError("melfsc")}
        </div>
      </div>

      {/* --- Other Options --- */}
      <div className="form-group">
        <label htmlFor="qrBoombox">qrBoombox *</label>
        <select
          id="qrBoombox"
          name="qrBoombox"
          value={formData.qrBoombox}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>
          <option value="ENABLED">ENABLED</option>
          <option value="DISABLED">DISABLED</option>
        </select>
        {renderError("qrBoombox")}
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default ApplicationForm;
