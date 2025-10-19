// src/component/ApplicationList.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Pagination.css"; // Import pagination CSS (if not already done)
import "./Search.css"; // Import search CSS

// Base API URL
const API_BASE_URL = "/api/admin/1/getApplicationByAgentId";
const PAGE_SIZE = 10; // Number of items per page

// Simple debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const ApplicationList = ({ refreshTrigger }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce((page, term) => {
      fetchApplications(page, term);
    }, 500), // 500ms delay
    [] // Empty dependency array means this function is created once
  );

  const fetchApplications = async (page = 1, term = "") => {
    setLoading(true);
    // Construct API URL with pagination and search parameters
    // **IMPORTANT**: You need to ensure your backend API supports a 'search' or similar query parameter.
    // Adjust the parameter name (e.g., 'query', 'filter', 'searchTerm') as needed for your backend.
    const apiUrl = `${API_BASE_URL}?page=${page}&size=${PAGE_SIZE}&search=${encodeURIComponent(
      term
    )}`;
    try {
      const response = await axios.get(apiUrl);
      setApplications(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      // Don't reset current page here, only when search term *changes*
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
    fetchApplications(currentPage, searchTerm);
  }, [refreshTrigger]); // Keep this separate for external refresh

  // Effect for handling search term changes (debounced)
  useEffect(() => {
    // When search term changes, always go back to page 1
    setCurrentPage(1);
    debouncedFetch(1, searchTerm);
  }, [searchTerm, debouncedFetch]); // Add debouncedFetch to dependencies

  // Effect for handling page changes
  useEffect(() => {
    // Fetch data only if the page actually changes (avoid double fetch on search)
    // This effect should run *after* the search term effect might have reset the page
    fetchApplications(currentPage, searchTerm);
  }, [currentPage]); // Only depend on currentPage

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage); // This will trigger the useEffect for currentPage
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const startItem = totalElements === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalElements);

  return (
    <div className="application-list">
      <div className="list-header">
        <h2>Saved Applications</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Name, PAN, Mobile..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <>
          <table>
            {/* ... table thead ... */}
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
                    {" "}
                    {/* Ensure unique key */}
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
                  <td colSpan="5">
                    No applications found {searchTerm && `for "${searchTerm}"`}.
                  </td>
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
