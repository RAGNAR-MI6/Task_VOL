// src/component/ApplicationForm.js
import React, { useState } from "react";
import axios from "axios";
import "./Form.css"; // Make sure this CSS file exists in the same directory or adjust the path

// --- START: Validation logic (can be kept here or moved back to validation.js) ---
const validationRules = {
  applName: {
    required: true,
    minLength: 3,
    message: "Application Name must be at least 3 characters",
  },
  city: { required: true, message: "City is required" },
  firm: { required: true, message: "Firm is required" },
  business_type: { required: true, message: "Business Type is required" },
  contactPerson: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Contact Person must contain only letters and spaces",
    requiredMessage: "Contact Person is required",
  },
  mobile: {
    required: true,
    pattern: /^\d{10}$/,
    message: "Mobile number must be exactly 10 digits",
    requiredMessage: "Mobile is required",
  },
  instAddr1: { required: true, message: "Install Address 1 is required" },
  instLocality: { required: true, message: "Install Locality is required" },
  instPincode: {
    required: true,
    pattern: /^\d{6}$/,
    message: "Pincode must be 6 digits",
    requiredMessage: "Pincode is required",
  },
  mcc: { required: true, message: "MCC is required" },
  pan: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "Invalid PAN format (e.g., ABCDE1234F)",
    requiredMessage: "PAN is required",
  },
  panDob: { required: true, message: "PAN DOB is required" },
  meAcType: { required: true, message: "Account Type is required" },
  meName: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Account Holder Name must be alphabetic only",
    requiredMessage: "Account Holder Name is required",
  },
  melfsc: {
    required: true,
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: "Invalid IFSC format (e.g., SBIN0001234)",
    requiredMessage: "IFSC code is required",
  },
  meAcNo: {
    required: true,
    pattern: /^\d{9,18}$/,
    message: "Account Number must be between 9 and 18 digits",
    requiredMessage: "Account Number is required",
  },
  qrBoombox: { required: true, message: "qrBoombox selection is required" },
};

const validateForm = (data) => {
  const errors = {};
  for (const fieldName in validationRules) {
    const rule = validationRules[fieldName];
    const value = data?.[fieldName];
    if (rule.required && (!value || String(value).trim() === "")) {
      errors[fieldName] =
        rule.requiredMessage || rule.message || `${fieldName} is required`;
      continue;
    }
    if (value && rule.minLength && String(value).length < rule.minLength) {
      errors[fieldName] = rule.message;
      continue;
    }
    if (value && rule.pattern && !rule.pattern.test(String(value))) {
      errors[fieldName] = rule.message;
      continue;
    }
  }
  return errors;
};
// --- END: Validation logic ---

// Use relative URL for the proxy
const SAVE_API_URL = "/api/admin/1/saveApplicationDraft";

// This initial state is crucial. It's based on the sample request
// and ensures all fields are controlled components.
const initialState = {
  applicationId: "",
  agentId: 1027,
  status: "DRAFT",
  applName: "",
  city: "",
  firm: "",
  dba: "",
  business_type: "",
  contactPerson: "",
  mobile: "",
  instAddr1: "",
  instAddr2: "",
  instAddr3: "",
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
  // Keep track of which fields have been touched (focused out of)
  const [touched, setTouched] = useState({});

  // Function to validate a single field
  const validateField = (name, value) => {
    // Create a temporary data object including the current field's value for validation
    const tempData = { ...formData, [name]: value };
    // Run the full validation logic
    const validationErrors = validateForm(tempData);
    // Return the error specific to this field, or null if valid
    return validationErrors[name] || null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convert PAN and IFSC to uppercase on input
    if (name === "pan" || name === "melfsc") {
      processedValue = value.toUpperCase();
    }

    // Update form data state
    setFormData((prevState) => ({ ...prevState, [name]: processedValue }));

    // Validate the field on change only if it has been touched before
    if (touched[name]) {
      const fieldError = validateField(name, processedValue);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
    }
  };

  // Handle blur event to mark field as touched and validate
  const handleBlur = (e) => {
    const { name } = e.target;
    // Mark the field as touched
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    // Validate the field when the user leaves it
    // Use the potentially processed value from formData state
    const processedValue = formData[name];
    const fieldError = validateField(name, processedValue);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields defined in rules as touched to show errors on submit attempt
    const allTouched = Object.keys(validationRules).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // 1. Perform full client-side validation on submit
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // 2. Prevent submission if errors exist
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the errors in the form.");
      return;
    }

    // 3. Submit data to the API
    setIsSubmitting(true);
    try {
      // Use the *real* API endpoint
      const response = await axios.post(SAVE_API_URL, formData);

      // Log the response data
      console.log("API Success Response:", response.data);

      // 4. Display success message
      alert("Form submitted successfully!");
      setFormData(initialState); // Clear the form
      setErrors({});
      setTouched({}); // Clear touched state
      if (onFormSuccess) {
        onFormSuccess(); // Tell App.js to refresh the list
      }
    } catch (error) {
      // 5. Display error message
      console.error(
        "API Error:",
        error.response || error.request || error.message
      );
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render the error message, showing only if touched
  const renderError = (fieldName) => {
    // Show error only if field has an error AND it has been touched
    return errors[fieldName] && touched[fieldName] ? (
      // Add unique id for aria-describedby
      <span id={`${fieldName}-error`} className="error-message">
        {errors[fieldName]}
      </span>
    ) : null;
  };

  return (
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.applName && touched.applName)}
            aria-describedby={
              errors.applName && touched.applName ? "applName-error" : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.firm && touched.firm)}
            aria-describedby={
              errors.firm && touched.firm ? "firm-error" : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.business_type && touched.business_type)}
            aria-describedby={
              errors.business_type && touched.business_type
                ? "business_type-error"
                : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.mcc && touched.mcc)}
            aria-describedby={
              errors.mcc && touched.mcc ? "mcc-error" : undefined
            }
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person *</label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!(errors.contactPerson && touched.contactPerson)}
            aria-describedby={
              errors.contactPerson && touched.contactPerson
                ? "contactPerson-error"
                : undefined
            }
          />
          {renderError("contactPerson")}
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile *</label>
          <input
            type="text" // Keep as text to allow length limiting, pattern handles numeric
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="10"
            aria-invalid={!!(errors.mobile && touched.mobile)}
            aria-describedby={
              errors.mobile && touched.mobile ? "mobile-error" : undefined
            }
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
          onBlur={handleBlur}
          aria-invalid={!!(errors.instAddr1 && touched.instAddr1)}
          aria-describedby={
            errors.instAddr1 && touched.instAddr1
              ? "instAddr1-error"
              : undefined
          }
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
          onBlur={handleBlur}
        />
        {/* Optional: Render error if specific format rule exists for instAddr2 */}
        {renderError("instAddr2")}
      </div>
      <div className="form-group">
        <label htmlFor="instAddr3">Address Line 3 (Optional)</label>
        <input
          type="text"
          id="instAddr3"
          name="instAddr3"
          value={formData.instAddr3}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/* Optional: Render error if specific format rule exists for instAddr3 */}
        {renderError("instAddr3")}
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.instLocality && touched.instLocality)}
            aria-describedby={
              errors.instLocality && touched.instLocality
                ? "instLocality-error"
                : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.city && touched.city)}
            aria-describedby={
              errors.city && touched.city ? "city-error" : undefined
            }
          />
          {renderError("city")}
        </div>
        <div className="form-group">
          <label htmlFor="instPincode">Pincode *</label>
          <input
            type="text" // Keep as text, pattern handles numeric
            id="instPincode"
            name="instPincode"
            value={formData.instPincode}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="6"
            aria-invalid={!!(errors.instPincode && touched.instPincode)}
            aria-describedby={
              errors.instPincode && touched.instPincode
                ? "instPincode-error"
                : undefined
            }
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
            value={formData.pan} // Value is already uppercase from state
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="10"
            aria-invalid={!!(errors.pan && touched.pan)}
            aria-describedby={
              errors.pan && touched.pan ? "pan-error" : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.panDob && touched.panDob)}
            aria-describedby={
              errors.panDob && touched.panDob ? "panDob-error" : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.meName && touched.meName)}
            aria-describedby={
              errors.meName && touched.meName ? "meName-error" : undefined
            }
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
            onBlur={handleBlur}
            aria-invalid={!!(errors.meAcType && touched.meAcType)}
            aria-describedby={
              errors.meAcType && touched.meAcType ? "meAcType-error" : undefined
            }
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
            type="text" // Keep as text, pattern handles numeric/length
            id="meAcNo"
            name="meAcNo"
            value={formData.meAcNo}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="18"
            aria-invalid={!!(errors.meAcNo && touched.meAcNo)}
            aria-describedby={
              errors.meAcNo && touched.meAcNo ? "meAcNo-error" : undefined
            }
          />
          {renderError("meAcNo")}
        </div>
        <div className="form-group">
          <label htmlFor="melfsc">IFSC Code *</label>
          <input
            type="text"
            id="melfsc"
            name="melfsc"
            value={formData.melfsc} // Value is already uppercase from state
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="11"
            aria-invalid={!!(errors.melfsc && touched.melfsc)}
            aria-describedby={
              errors.melfsc && touched.melfsc ? "melfsc-error" : undefined
            }
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
          onBlur={handleBlur}
          aria-invalid={!!(errors.qrBoombox && touched.qrBoombox)}
          aria-describedby={
            errors.qrBoombox && touched.qrBoombox
              ? "qrBoombox-error"
              : undefined
          }
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
