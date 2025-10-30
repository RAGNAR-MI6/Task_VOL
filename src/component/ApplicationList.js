// src/component/ApplicationList.js
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Pagination.css";
import "./Search.css";
import "./Highlight.css";
import EditModal from "./EditModal"; // ADDED: Import the modal
import "./EditModal.css"; // ADDED: Import modal CSS
import "../component/Form.css"; // ADDED: Import form CSS to borrow button styles

// Base API URL
const API_BASE_URL = "/api/admin/1/getApplicationByAgentId";
const PAGE_SIZE = 15;

// Helper function to escape regex special characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// HighlightMatch component
const HighlightMatch = ({ text, highlight }) => {
  const textString = String(text || "");
  const trimmedHighlight = highlight ? highlight.trim() : "";

  if (!trimmedHighlight) {
    return textString;
  }

  const escapedHighlight = escapeRegExp(trimmedHighlight);
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = textString.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) &&
        part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
          <mark key={index} className="highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const ApplicationList = ({ refreshTrigger }) => {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // ADDED: State to manage which application is being edited
  const [editingApp, setEditingApp] = useState(null);

  const fetchAllApplications = async () => {
    setLoading(true);
    const applicationMap = new Map();
    let page = 1;
    let totalPages = 1;

    try {
      do {
        const apiUrl = `${API_BASE_URL}?page=${page}&size=${PAGE_SIZE}`;
        const response = await axios.get(apiUrl);
        const applications = response.data.content || [];

        for (const app of applications) {
          if (app.applicationId) {
            applicationMap.set(app.applicationId, app);
          }
        }
        totalPages = response.data.totalPages || 0;
        page++;
      } while (page <= totalPages);

      setAllApplications(Array.from(applicationMap.values()));
    } catch (error) {
      console.error("Error fetching all applications:", error);
      setAllApplications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredApplications = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) {
      return allApplications;
    }
    return allApplications.filter((app) => {
      return (
        app.applName?.toLowerCase().includes(lowerCaseSearch) ||
        app.firm?.toLowerCase().includes(lowerCaseSearch) ||
        app.mobile?.toLowerCase().includes(lowerCaseSearch) ||
        app.pan?.toLowerCase().includes(lowerCaseSearch) ||
        app.status?.toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [allApplications, searchTerm]);

  const totalElements = filteredApplications.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredApplications.slice(start, end);
  }, [filteredApplications, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ADDED: Function to handle opening the modal
  const handleEditClick = (app) => {
    setEditingApp(app);
  };

  // ADDED: Function to close the modal
  const handleCloseModal = () => {
    setEditingApp(null);
  };

  // ADDED: Function to save the edited data locally
  const handleSave = (updatedApp) => {
    // Update the "master list" of applications
    setAllApplications((prevApps) =>
      prevApps.map((app) =>
        app.applicationId === updatedApp.applicationId ? updatedApp : app
      )
    );
    // Close the modal
    setEditingApp(null);
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
            className="search-input"
            placeholder="Search by name, firm, PAN..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
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
                <th>Actions</th> {/* ADDED: Actions column header */}
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((app) => (
                  <tr key={app.applicationId || app.pan}>
                    <td>
                      <HighlightMatch
                        text={app.applName}
                        highlight={searchTerm}
                      />
                    </td>
                    <td>
                      <HighlightMatch text={app.firm} highlight={searchTerm} />
                    </td>
                    <td>
                      <HighlightMatch
                        text={app.mobile}
                        highlight={searchTerm}
                      />
                    </td>
                    <td>
                      <HighlightMatch text={app.pan} highlight={searchTerm} />
                    </td>
                    <td>
                      <HighlightMatch
                        text={app.status}
                        highlight={searchTerm}
                      />
                    </td>
                    {/* ADDED: Edit button cell */}
                    <td>
                      <button
                        className="submit-btn edit-btn" // Re-using button style
                        onClick={() => handleEditClick(app)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* MODIFIED: ColSpan increased to 6 */}
                  <td colSpan="6">
                    {searchTerm
                      ? "No applications found matching your search."
                      : "No applications found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 0 && (
            <div className="pagination-controls">
              <span className="pagination-info">
                Showing {startItem} - {endItem} of {totalElements}
              </span>
              <div>
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

      {/* ADDED: Render the modal conditionally */}
      {editingApp && (
        <EditModal
          app={editingApp}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ApplicationList;
