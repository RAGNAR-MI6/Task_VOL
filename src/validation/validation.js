// src/validation.js

// This function will check all the form data against the rules
// from React_Task.pdf [cite: 3, 5, 10, 11, 12, 14]
export const validateForm = (data) => {
  const errors = {};

  // --- Validation Rules from React_Task.pdf ---

  if (!data.applName || data.applName.length < 3) {
    errors.applName = "Application Name is required (min 3 characters)"; // [cite: 3]
  }
  if (!data.city) errors.city = "City is required"; // [cite: 3]
  if (!data.firm) errors.firm = "Firm is required"; // [cite: 3]
  if (!data.business_type) errors.business_type = "Business Type is required"; // [cite: 3]

  if (!data.contactPerson) {
    errors.contactPerson = "Contact Person is required"; // [cite: 3]
  } else if (!/^[a-zA-Z\s]+$/.test(data.contactPerson)) {
    errors.contactPerson =
      "Contact Person must contain only letters and spaces"; // [cite: 3]
  }

  if (!data.mobile) {
    errors.mobile = "Mobile is required"; // [cite: 3]
  } else if (!/^\d{10}$/.test(data.mobile)) {
    errors.mobile = "Mobile number must be exactly 10 digits"; // [cite: 3, 30]
  }

  if (!data.instAddr1) errors.instAddr1 = "Install Address 1 is required"; // [cite: 3]
  if (!data.instLocality) errors.instLocality = "Install Locality is required"; // [cite: 3]

  if (!data.instPincode) {
    errors.instPincode = "Pincode is required"; // [cite: 3]
  } else if (!/^\d{6}$/.test(data.instPincode)) {
    errors.instPincode = "Pincode must be 6 digits"; // [cite: 3, 31]
  }

  if (!data.mcc) errors.mcc = "MCC is required"; // [cite: 3]

  if (!data.pan) {
    errors.pan = "PAN is required"; // [cite: 3]
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
    // Example regex, adjust if needed for the exact format [cite: 31]
    errors.pan = "Invalid PAN format (e.g., RTGHP2345G)"; // [cite: 3]
  }

  if (!data.panDob) errors.panDob = "PAN DOB is required"; // [cite: 3]
  if (!data.meAcType) errors.meAcType = "Account Type is required"; // [cite: 5, 10]
  if (!data.meName) errors.meName = "Account Holder Name is required"; // [cite: 6, 11]

  if (!data.melfsc) {
    errors.melfsc = "IFSC code is required"; // [cite: 7, 12]
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.melfsc)) {
    errors.melfsc = "Invalid IFSC format (e.g., SBIB001458)"; // [cite: 12, 13]
  }

  if (!data.meAcNo) {
    errors.meAcNo = "Account Number is required"; // [cite: 8, 14]
  } else if (!/^\d{10,18}$/.test(data.meAcNo)) {
    errors.meAcNo = "Account Number must be 10-18 digits"; // [cite: 14]
  }

  if (!data.qrBoombox) errors.qrBoombox = "qrBoombox selection is required"; // [cite: 9, 15]

  // ... add all other required field checks ...

  return errors;
};
