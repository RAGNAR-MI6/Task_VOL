// src/ApplicationList.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// Get API URL from UI Task.pdf [cite: 44]
const GET_API_URL = "/api/admin/1/getApplicationByAgentId?page=1&size=10";

const ApplicationList = ({ refreshTrigger }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GET_API_URL);
      // Assuming the data is in response.data.content or similar
      // You may need to adjust this based on the actual API response
      setApplications(response.data.content || response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchApplications();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <div className="application-list">
      <h2>Saved Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Firm</th>
            <th>Mobile</th>
            <th>PAN</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              // Use a unique key, like applicationId if available
              <tr key={app.applicationId || app.pan}>
                <td>{app.applName}</td>
                <td>{app.firm}</td>
                <td>{app.mobile}</td>
                <td>{app.pan}</td>
                <td>{app.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
