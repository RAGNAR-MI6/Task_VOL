# 🧾 Merchant Onboarding Dashboard

The **Merchant Onboarding Dashboard** is a React-based web application designed to simplify the process of onboarding new merchants.
It allows an **agent (ID: 1027 - currently hardcoded)** to fill out a comprehensive application form and view previously submitted merchant applications in a structured dashboard.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## 🚀 Features

### 📝 Application Form (`src/component/ApplicationForm.js`)

A detailed form for capturing merchant information, including:

- **Personal & Firm Information**

  - Name, Firm, Business Type, MCC

- **Contact Information**

  - Contact Person, Mobile

- **Address Details**

  - Address Lines 1–3, Locality, City, Pincode

- **PAN & Bank Details**

  - PAN, PAN DOB, Account Holder Name, Account Type, Account No, IFSC

- **Other Options**

  - `qrBoombox` selection

**Validation Highlights**:

- Real-time input validation ensures proper formatting:

  - Names → Alphabetic only
  - Pincode / Mobile / Account No. → Numeric only
  - PAN / IFSC → Uppercase alphanumeric pattern checks

- Validation logic is centralized in `src/validation/validation.js`.

**Form Submission**:

- Submits data as a **draft** to the backend API.
- On successful submission, the Application List view is automatically updated.

---

### 📄 Application List (`src/component/ApplicationList.js`)

Displays a **paginated table** of all applications saved by the agent.

- Fetches data from the backend API.
- Shows total pages, current range, and navigation with **Previous** / **Next** buttons.
- Updates automatically when a new application is submitted.

---

### 🎨 Styling

- Basic styling is done using **CSS modules**:

  - `src/App.css`
  - `src/component/Form.css`
  - `src/component/Pagination.css`

- Theme variables are defined globally in `src/index.css`.

---

### 🌐 API Interaction

- Uses [`axios`](https://github.com/axios/axios) for making HTTP requests.
- Backend proxy is configured in `package.json`:

```json
"proxy": "http://fintechqrqronboardingbackend-fcwvv1-aa5875-91-108-104-214.traefik.me"
```

This setup ensures API requests to `/api/...` are proxied correctly in development, avoiding CORS issues.

---

## 📁 Project Structure

```
merchant-onboarding-dashboard/
├── public/
├── src/
│   ├── component/
│   │   ├── ApplicationForm.js
│   │   ├── ApplicationList.js
│   │   ├── Pagination.css
│   │   └── Form.css
│   ├── validation/
│   │   └── validation.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/merchant-onboarding-dashboard.git
cd merchant-onboarding-dashboard
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Development Server

```bash
npm start
```

> The app will open at **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Available Scripts

In the project directory, you can run:

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm start`     | Runs the app in development mode             |
| `npm test`      | Launches the test runner                     |
| `npm run build` | Builds the app for production                |
| `npm run eject` | Exposes CRA configuration (use with caution) |

---

## 📡 Backend API

The dashboard interacts with the backend at:

```
http://fintechqrqronboardingbackend-fcwvv1-aa5875-91-108-104-214.traefik.me
```

> Make sure the backend is up and accessible for form submission and list retrieval.

---

## 👨‍💻 Tech Stack

- **Frontend**: React, CSS Modules
- **HTTP Client**: Axios
- **Build Tool**: Create React App

---

## ✨ Future Improvements

- ✅ Agent login with authentication
- ✅ Better UI/UX with component libraries (e.g., Material UI)
- ✅ Advanced search and filtering on Application List
- ✅ Error handling & toast notifications

---

### 📌 Author

**Rushikesh Patil**

---
