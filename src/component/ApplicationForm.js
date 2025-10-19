// src/component/ApplicationForm.js
import React, { useState } from "react";
import axios from "axios";
import { validateForm } from "../validation/validation"; // Import validation logic
import "./Form.css";

// Use relative URL for the proxy
const SAVE_API_URL = "/api/admin/1/saveApplicationDraft";

// Initial state remains the same
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
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const tempData = { ...formData, [name]: value };
    const validationErrors = validateForm(tempData); //
    return validationErrors[name] || null; //
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // --- START: Input Character Filtering ---
    // Allow only letters and spaces for these fields
    if (["applName", "contactPerson", "city", "meName"].includes(name)) {
      //
      // Remove any characters that are NOT letters or spaces
      processedValue = value.replace(/[^a-zA-Z\s]/g, ""); //
    }

    // Allow only digits for mobile, account number, and pincode fields
    if (["mobile", "meAcNo", "instPincode"].includes(name)) {
      // Added instPincode
      // Remove any non-digit characters
      processedValue = value.replace(/\D/g, ""); //
    }
    // --- END: Input Character Filtering ---

    // Convert PAN and IFSC to uppercase on input
    if (name === "pan" || name === "melfsc") {
      //
      processedValue = processedValue.toUpperCase(); //
    }

    // Update form data state
    setFormData((prevState) => ({ ...prevState, [name]: processedValue })); //

    // Validate the field on change only if it has been touched before
    if (touched[name]) {
      //
      const fieldError = validateField(name, processedValue); //
      setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError })); //
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true })); //
    const processedValue = formData[name]; //
    const fieldError = validateField(name, processedValue); //
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError })); //
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData); //
    const touchFieldsWithErrors = Object.keys(validationErrors).reduce(
      //
      (acc, key) => ({ ...acc, [key]: true }), //
      {}
    );
    setTouched((prevTouched) => ({ ...prevTouched, ...touchFieldsWithErrors })); //

    setErrors(validationErrors); //

    if (Object.keys(validationErrors).length > 0) {
      //
      alert("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true); //
    try {
      const response = await axios.post(SAVE_API_URL, formData); //
      console.log("API Success Response:", response.data);
      alert("Form submitted successfully!");
      setFormData(initialState); //
      setErrors({}); //
      setTouched({}); //
      if (onFormSuccess) {
        //
        onFormSuccess(); //
      }
    } catch (error) {
      console.error(
        //
        "API Error:",
        error.response || error.request || error.message
      );
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false); //
    }
  };

  const renderError = (fieldName) => {
    return errors[fieldName] && touched[fieldName] ? ( //
      <span id={`${fieldName}-error`} className="error-message">
        {errors[fieldName]}
      </span> //
    ) : null;
  };

  return (
    // --- JSX remains the same ---
    <form onSubmit={handleSubmit} className="application-form">
      {" "}
      {/* */}
      <h2>New Application Form</h2> {/* */}
      {/* --- Personal & Firm Details --- */}
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="applName">Application Name *</label> {/* */}
          <input
            type="text"
            id="applName"
            name="applName"
            value={formData.applName} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.applName && touched.applName)} //
            aria-describedby={
              errors.applName && touched.applName ? "applName-error" : undefined //
            }
          />
          {renderError("applName")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="firm">Firm *</label> {/* */}
          <input
            type="text"
            id="firm"
            name="firm"
            value={formData.firm} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.firm && touched.firm)} //
            aria-describedby={
              errors.firm && touched.firm ? "firm-error" : undefined //
            }
          />
          {renderError("firm")} {/* */}
        </div>
      </div>
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="business_type">Business Type *</label> {/* */}
          <select
            id="business_type"
            name="business_type"
            value={formData.business_type} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.business_type && touched.business_type)} //
            aria-describedby={
              errors.business_type && touched.business_type
                ? "business_type-error"
                : undefined //
            }
          >
            <option value="">-- Select --</option> {/* */}
            <option value="Proprietorship">Proprietorship</option> {/* */}
            <option value="PartnershipFirm">PartnershipFirm</option> {/* */}
            <option value="Trust">Trust</option> {/* */}
            <option value="Private LimitedLLP">Private LimitedLLP</option>{" "}
            {/* */}
          </select>
          {renderError("business_type")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="mcc">MCC (Merchant Category Code) *</label> {/* */}
          <select
            id="mcc"
            name="mcc"
            value={formData.mcc} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.mcc && touched.mcc)} //
            aria-describedby={
              errors.mcc && touched.mcc ? "mcc-error" : undefined //
            }
          >
            <option value="">-- Select --</option> {/* */}
            <option value="5411">5411 - Grocery Stores</option> {/* */}
            <option value="5812">5812 - Eating Places/Restaurants</option>{" "}
            {/* */}
            <option value="5999">5999 - Miscellaneous Retail</option> {/* */}
            <option value="7011">7011 - Hotels/Motels</option> {/* */}
          </select>
          {renderError("mcc")} {/* */}
        </div>
      </div>
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="contactPerson">Contact Person *</label> {/* */}
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.contactPerson && touched.contactPerson)} //
            aria-describedby={
              errors.contactPerson && touched.contactPerson
                ? "contactPerson-error"
                : undefined //
            }
          />
          {renderError("contactPerson")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="mobile">Mobile *</label> {/* */}
          <input
            type="text" // Keep as text, manipulation happens in handleChange
            id="mobile"
            name="mobile"
            value={formData.mobile} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            maxLength="10" //
            aria-invalid={!!(errors.mobile && touched.mobile)} //
            aria-describedby={
              errors.mobile && touched.mobile ? "mobile-error" : undefined //
            }
          />
          {renderError("mobile")} {/* */}
        </div>
      </div>
      {/* --- Address Details --- */}
      <div className="form-group">
        {" "}
        {/* */}
        <label htmlFor="instAddr1">Address Line 1 *</label> {/* */}
        <input
          type="text"
          id="instAddr1"
          name="instAddr1"
          value={formData.instAddr1} //
          onChange={handleChange} //
          onBlur={handleBlur} //
          aria-invalid={!!(errors.instAddr1 && touched.instAddr1)} //
          aria-describedby={
            errors.instAddr1 && touched.instAddr1
              ? "instAddr1-error"
              : undefined //
          }
        />
        {renderError("instAddr1")} {/* */}
      </div>
      <div className="form-group">
        {" "}
        {/* */}
        <label htmlFor="instAddr2">Address Line 2 (Optional)</label> {/* */}
        <input
          type="text"
          id="instAddr2"
          name="instAddr2"
          value={formData.instAddr2} //
          onChange={handleChange} //
          onBlur={handleBlur} //
        />
        {renderError("instAddr2")} {/* */}
      </div>
      <div className="form-group">
        {" "}
        {/* */}
        <label htmlFor="instAddr3">Address Line 3 (Optional)</label> {/* */}
        <input
          type="text"
          id="instAddr3"
          name="instAddr3"
          value={formData.instAddr3} //
          onChange={handleChange} //
          onBlur={handleBlur} //
        />
        {renderError("instAddr3")} {/* */}
      </div>
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="instLocality">Locality *</label> {/* */}
          <input
            type="text"
            id="instLocality"
            name="instLocality"
            value={formData.instLocality} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.instLocality && touched.instLocality)} //
            aria-describedby={
              errors.instLocality && touched.instLocality
                ? "instLocality-error"
                : undefined //
            }
          />
          {renderError("instLocality")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="city">City *</label> {/* */}
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.city && touched.city)} //
            aria-describedby={
              errors.city && touched.city ? "city-error" : undefined //
            }
          />
          {renderError("city")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="instPincode">Pincode *</label> {/* */}
          <input
            type="text" // Keep as text, filtering handles numeric
            id="instPincode"
            name="instPincode"
            value={formData.instPincode} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            maxLength="6" //
            aria-invalid={!!(errors.instPincode && touched.instPincode)} //
            aria-describedby={
              errors.instPincode && touched.instPincode
                ? "instPincode-error"
                : undefined //
            }
          />
          {renderError("instPincode")} {/* */}
        </div>
      </div>
      {/* --- PAN & Bank Details --- */}
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="pan">PAN *</label> {/* */}
          <input
            type="text"
            id="pan"
            name="pan"
            value={formData.pan} // Value is already uppercase from state
            onChange={handleChange} //
            onBlur={handleBlur} //
            maxLength="10" //
            aria-invalid={!!(errors.pan && touched.pan)} //
            aria-describedby={
              errors.pan && touched.pan ? "pan-error" : undefined //
            }
          />
          {renderError("pan")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="panDob">PAN DOB *</label> {/* */}
          <input
            type="date"
            id="panDob"
            name="panDob"
            value={formData.panDob} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.panDob && touched.panDob)} //
            aria-describedby={
              errors.panDob && touched.panDob ? "panDob-error" : undefined //
            }
          />
          {renderError("panDob")} {/* */}
        </div>
      </div>
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="meName">Account Holder Name *</label> {/* */}
          <input
            type="text"
            id="meName"
            name="meName"
            value={formData.meName} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.meName && touched.meName)} //
            aria-describedby={
              errors.meName && touched.meName ? "meName-error" : undefined //
            }
          />
          {renderError("meName")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="meAcType">Account Type *</label> {/* */}
          <select
            id="meAcType"
            name="meAcType"
            value={formData.meAcType} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            aria-invalid={!!(errors.meAcType && touched.meAcType)} //
            aria-describedby={
              errors.meAcType && touched.meAcType ? "meAcType-error" : undefined //
            }
          >
            <option value="">-- Select --</option> {/* */}
            <option value="Savings">Savings</option> {/* */}
            <option value="Current">Current</option> {/* */}
            <option value="Salary">Salary</option> {/* */}
          </select>
          {renderError("meAcType")} {/* */}
        </div>
      </div>
      <div className="form-row">
        {" "}
        {/* */}
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="meAcNo">Account Number *</label> {/* */}
          <input
            type="text" // Keep as text, manipulation happens in handleChange
            id="meAcNo"
            name="meAcNo"
            value={formData.meAcNo} //
            onChange={handleChange} //
            onBlur={handleBlur} //
            maxLength="18" //
            aria-invalid={!!(errors.meAcNo && touched.meAcNo)} //
            aria-describedby={
              errors.meAcNo && touched.meAcNo ? "meAcNo-error" : undefined //
            }
          />
          {renderError("meAcNo")} {/* */}
        </div>
        <div className="form-group">
          {" "}
          {/* */}
          <label htmlFor="melfsc">IFSC Code *</label> {/* */}
          <input
            type="text"
            id="melfsc"
            name="melfsc"
            value={formData.melfsc} // Value is already uppercase from state
            onChange={handleChange} //
            onBlur={handleBlur} //
            maxLength="11" //
            aria-invalid={!!(errors.melfsc && touched.melfsc)} //
            aria-describedby={
              errors.melfsc && touched.melfsc ? "melfsc-error" : undefined //
            }
          />
          {renderError("melfsc")} {/* */}
        </div>
      </div>
      {/* --- Other Options --- */}
      <div className="form-group">
        {" "}
        {/* */}
        <label htmlFor="qrBoombox">qrBoombox *</label> {/* */}
        <select
          id="qrBoombox"
          name="qrBoombox"
          value={formData.qrBoombox} //
          onChange={handleChange} //
          onBlur={handleBlur} //
          aria-invalid={!!(errors.qrBoombox && touched.qrBoombox)} //
          aria-describedby={
            errors.qrBoombox && touched.qrBoombox
              ? "qrBoombox-error"
              : undefined //
          }
        >
          <option value="">-- Select --</option> {/* */}
          <option value="ENABLED">ENABLED</option> {/* */}
          <option value="DISABLED">DISABLED</option> {/* */}
        </select>
        {renderError("qrBoombox")} {/* */}
      </div>
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {" "}
        {/* */}
        {isSubmitting ? "Submitting..." : "Submit Application"} {/* */}
      </button>
    </form>
  );
};

export default ApplicationForm;
