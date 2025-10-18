// src/App.js
import React, { useState } from "react";
import ApplicationForm from "../src/component/ApplicationForm";
import ApplicationList from "../src/component/ApplicationList";
import "./App.css"; // We will create this file for styling

function App() {
  // This state acts as a trigger. When it changes,
  // ApplicationList will know to re-fetch data.
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    // Increment the trigger to force a re-fetch in the list component
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Merchant Onboarding</h1>
      </header>
      <main>
        {/* Pass the success handler to the form */}
        <ApplicationForm onFormSuccess={handleFormSuccess} />

        {/* Pass the trigger to the list */}
        <ApplicationList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}

export default App;
