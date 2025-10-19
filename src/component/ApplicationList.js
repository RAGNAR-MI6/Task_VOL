// src/component/ApplicationList.js
import React, { useState, useEffect } from "react"; // Removed useCallback
import axios from "axios";
import "./Pagination.css"; // Kept pagination CSS
// Removed Search.css and Highlight.css imports

// Base API URL
const API_BASE_URL = "/api/admin/1/getApplicationByAgentId";
const PAGE_SIZE = 15; // Number of items per page

// HighlightMatch component removed

const ApplicationList = ({ refreshTrigger }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  // Removed searchTerm state

  // Debounced fetch removed

  // Simplified fetchApplications - no search term
  const fetchApplications = async (page = 1) => {
    setLoading(true);
    // Construct API URL with only pagination parameters
    const apiUrl = `${API_BASE_URL}?page=${page}&size=${PAGE_SIZE}`; // Removed search parameter
    try {
      const response = await axios.get(apiUrl);
      setApplications(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
      setTotalPages(0);
      setTotalElements(0);
    }
    setLoading(false);
  };

  // Effect for initial load and refreshTrigger changes
  useEffect(() => {
    fetchApplications(currentPage); // Call simplified fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]); // Keep this separate for external refresh

  // Removed useEffect for handling search term changes

  // Effect for handling page changes
  useEffect(() => {
    // Fetch data only if the page actually changes
    fetchApplications(currentPage); // Call simplified fetch
  }, [currentPage]); // Only depend on currentPage

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage); // This will trigger the useEffect for currentPage
    }
  };

  // handleSearchChange removed

  const startItem = totalElements === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalElements);

  return (
    <div className="application-list">
      <div className="list-header">
        <h2>Saved Applications</h2>
        {/* Search container and input removed */}
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Firm</th>
                <th>Mobile</th>
                <th>PAN</th>
                <th>Status</th>
                {/* Add more relevant columns if needed */}
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.applicationId || app.pan}>
                    {/* Removed HighlightMatch component */}
                    <td>{app.applName}</td>
                    <td>{app.firm}</td>
                    <td>{app.mobile}</td>
                    <td>{app.pan}</td>
                    <td>{app.status}</td>
                    {/* Render more data */}
                  </tr>
                ))
              ) : (
                <tr>
                  {/* Updated message for no results */}
                  <td colSpan="5">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="pagination-controls">
              <span className="pagination-info">
                Showing {startItem} - {endItem} of {totalElements}
              </span>
              <div>
                {" "}
                {/* Wrapper for buttons */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationList;
