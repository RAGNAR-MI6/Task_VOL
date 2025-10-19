// src/validation/validation.js

// Define validation rules configuration
const validationRules = {
  applName: {
    required: true,
    minLength: 3, // Keep minLength if still desired
    pattern: /^[a-zA-Z\s]+$/, // Added alphabetic and space check
    message:
      "Application Name must contain only letters and spaces (min 3 characters)", // Updated message
    requiredMessage: "Application Name is required", // Specific required message
  },
  city: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/, // Added alphabetic and space check
    message: "City must contain only letters and spaces", // Updated message
    requiredMessage: "City is required", // Specific required message
  },
  firm: {
    required: true,
    message: "Firm is required", //
  },
  business_type: {
    required: true,
    message: "Business Type is required", //
  },
  contactPerson: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Contact Person must contain only letters and spaces", //
    requiredMessage: "Contact Person is required",
  },
  mobile: {
    required: true,
    pattern: /^\d{10}$/,
    message: "Mobile number must be exactly 10 digits", //
    requiredMessage: "Mobile is required",
  },
  instAddr1: {
    required: true,
    message: "Address 1 is required", //
  },
  instLocality: {
    required: true,
    message: "Locality is required", //
  },
  instPincode: {
    required: true,
    pattern: /^\d{6}$/, // Checks for exactly 6 digits
    message: "Pincode must be 6 digits", //
    requiredMessage: "Pincode is required",
  },
  mcc: {
    required: true,
    message: "MCC is required", //
  },
  pan: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "Invalid PAN format (e.g., RTGHP2345G)", //
    requiredMessage: "PAN is required",
  },
  panDob: {
    required: true,
    // Add pattern for date if needed, e.g., /^\d{4}-\d{2}-\d{2}$/
    message: "PAN DOB is required", //
  },
  meAcType: {
    required: true,
    message: "Account Type is required", //
  },
  meName: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/, // Already correct
    message: "Account Holder Name must be alphabetic only", //
    requiredMessage: "Account Holder Name is required",
  },
  melfsc: {
    required: true,
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: "Invalid IFSC format (e.g., SBIB001458)", //
    requiredMessage: "IFSC code is required",
  },
  meAcNo: {
    required: true,
    pattern: /^\d{10,18}$/,
    message: "Account Number must be 10-18 digits", //
    requiredMessage: "Account Number is required",
  },
  qrBoombox: {
    required: true,
    message: "qrBoombox selection is required", //
  },
  // Add optional fields if they have validation rules (e.g., dba, instAddr2, instAddr3)
  // dba: { pattern: /some_pattern/, message: "Invalid DBA format" },
};

// Generic validation function remains the same
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
