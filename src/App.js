// src/App.js
import React, { useState } from "react";
import ApplicationForm from "../src/component/ApplicationForm";
import ApplicationList from "../src/component/ApplicationList";
import "./App.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Merchant Onboarding Dashboard</h1> {/* Updated title */}
      </header>
      <main>
        {/* Wrap components in containers */}
        <div className="application-form-container">
          <ApplicationForm onFormSuccess={handleFormSuccess} />
        </div>
        <div className="application-list-container">
          <ApplicationList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App;
