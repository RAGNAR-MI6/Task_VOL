// src/validation/validation.js

// Define validation rules configuration
const validationRules = {
  applName: {
    required: true,
    minLength: 3,
    message: "Application Name is required (min 3 characters)", // [cite: 13]
  },
  city: {
    required: true,
    message: "City is required", // [cite: 13]
  },
  firm: {
    required: true,
    message: "Firm is required", // [cite: 13]
  },
  business_type: {
    required: true,
    message: "Business Type is required", // [cite: 13]
  },
  contactPerson: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Contact Person must contain only letters and spaces", // [cite: 13]
    requiredMessage: "Contact Person is required",
  },
  mobile: {
    required: true,
    pattern: /^\d{10}$/,
    message: "Mobile number must be exactly 10 digits", // [cite: 13, 41]
    requiredMessage: "Mobile is required",
  },
  instAddr1: {
    required: true,
    message: "Address 1 is required", // [cite: 13]
  },
  instLocality: {
    required: true,
    message: "Locality is required", // [cite: 13]
  },
  instPincode: {
    required: true,
    pattern: /^\d{6}$/,
    message: "Pincode must be 6 digits", // [cite: 13, 42]
    requiredMessage: "Pincode is required",
  },
  mcc: {
    required: true,
    message: "MCC is required", // [cite: 13]
  },
  pan: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "Invalid PAN format (e.g., RTGHP2345G)", // [cite: 13, 42]
    requiredMessage: "PAN is required",
  },
  panDob: {
    required: true,
    // Add pattern for date if needed, e.g., /^\d{4}-\d{2}-\d{2}$/
    message: "PAN DOB is required", // [cite: 13]
  },
  meAcType: {
    required: true,
    message: "Account Type is required", // [cite: 16, 21]
  },
  meName: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/, // Added alphabetic check
    message: "Account Holder Name must be alphabetic only", //
    requiredMessage: "Account Holder Name is required",
  },
  melfsc: {
    required: true,
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: "Invalid IFSC format (e.g., SBIB001458)", // [cite: 18, 23]
    requiredMessage: "IFSC code is required",
  },
  meAcNo: {
    required: true,
    pattern: /^\d{10,18}$/,
    message: "Account Number must be 10-18 digits", // [cite: 19, 25]
    requiredMessage: "Account Number is required",
  },
  qrBoombox: {
    required: true,
    message: "qrBoombox selection is required", // [cite: 20, 26]
  },
  // Add optional fields if they have validation rules (e.g., dba, instAddr2, instAddr3)
  // dba: { pattern: /some_pattern/, message: "Invalid DBA format" },
};

// Generic validation function
export const validateForm = (data) => {
  const errors = {};

  for (const fieldName in validationRules) {
    const rule = validationRules[fieldName];
    const value = data[fieldName];

    // Check required
    if (rule.required && (!value || String(value).trim() === "")) {
      errors[fieldName] =
        rule.requiredMessage || rule.message || `${fieldName} is required`;
      continue; // Skip further checks if required field is empty
    }

    // Check minLength (only if there's a value)
    if (value && rule.minLength && String(value).length < rule.minLength) {
      errors[fieldName] =
        rule.message ||
        `${fieldName} must be at least ${rule.minLength} characters`;
      continue;
    }

    // Check pattern (only if there's a value)
    if (value && rule.pattern && !rule.pattern.test(String(value))) {
      errors[fieldName] = rule.message || `Invalid format for ${fieldName}`;
      continue;
    }

    // Add other rule checks here (e.g., maxLength, type, custom function)
  }

  return errors;
};
