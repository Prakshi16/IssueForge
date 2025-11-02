import React, { useState, useEffect } from "react";
import "./App.css";

// ============================================================
// APP.JS - ISSUEFORGE FRONTEND
// React app with full CRUD operations connected to MongoDB
// ============================================================

const API_URL = "http://localhost:5000/api/issues";

function App() {
  // State to store all issues (fetched from database)
  const [issues, setIssues] = useState([]);

  // State for filtering
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOwner, setFilterOwner] = useState("");

  // State for edit mode
  const [editingIssue, setEditingIssue] = useState(null);

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // ============================================================
  // LOAD ISSUES ON COMPONENT MOUNT
  // useEffect runs once when component loads
  // ============================================================
  useEffect(() => {
    loadIssuesFromServer();
  }, []); // Empty dependency array = run once on mount

  // ============================================================
  // API FUNCTIONS
  // ============================================================

  // Function to load all issues from the backend
  const loadIssuesFromServer = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIssues(data);
      console.log(`✅ Loaded ${data.length} issues from database`);
    } catch (error) {
      console.error("Error loading issues:", error);
      alert(
        "Failed to load issues from server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new issue (POST to database)
  const addIssue = async (newIssueData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIssueData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create issue");
      }

      const savedIssue = await response.json();
      console.log("✅ Issue created:", savedIssue);

      // Refresh the issue list from server
      await loadIssuesFromServer();
      alert("Issue added successfully!");
    } catch (error) {
      console.error("Error adding issue:", error);
      alert(`Failed to add issue: ${error.message}`);
    }
  };

  // Function to update an existing issue (PUT to database)
  const updateIssue = async (issueId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${issueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update issue");
      }

      const updatedIssue = await response.json();
      console.log("✅ Issue updated:", updatedIssue);

      // Refresh the issue list from server
      await loadIssuesFromServer();
      setEditingIssue(null); // Close edit form
      alert("Issue updated successfully!");
    } catch (error) {
      console.error("Error updating issue:", error);
      alert(`Failed to update issue: ${error.message}`);
    }
  };

  // Function to delete an issue (DELETE from database)
  const deleteIssue = async (issueId, issueTitle) => {
    // Confirm before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete issue: "${issueTitle}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${issueId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete issue");
      }

      console.log("✅ Issue deleted");

      // Refresh the issue list from server
      await loadIssuesFromServer();
      alert("Issue deleted successfully!");
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert(`Failed to delete issue: ${error.message}`);
    }
  };

  // ============================================================
  // FILTERING LOGIC (CLIENT-SIDE)
  // ============================================================
  const getFilteredIssues = () => {
    return issues.filter((issue) => {
      // Filter by status
      const statusMatch =
        filterStatus === "All" || issue.status === filterStatus;

      // Filter by owner (case-insensitive partial match)
      const ownerMatch =
        filterOwner === "" ||
        issue.owner.toLowerCase().includes(filterOwner.toLowerCase());

      return statusMatch && ownerMatch;
    });
  };

  const filteredIssues = getFilteredIssues();

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="title">IssueForge</h1>
        <p className="subtitle">Demonstration of CRUD Operations</p>
      </header>

      {/* Main Content Area */}
      <div className="container">
        {/* Filter Controls */}
        <IssueFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterOwner={filterOwner}
          setFilterOwner={setFilterOwner}
          issueCount={filteredIssues.length}
          totalCount={issues.length}
        />

        {/* Loading Indicator */}
        {loading && <div className="loading">Loading issues...</div>}

        {/* Edit Form (shown when editing an issue) */}
        {editingIssue && (
          <EditIssueForm
            issue={editingIssue}
            onUpdate={updateIssue}
            onCancel={() => setEditingIssue(null)}
          />
        )}

        {/* Issue List Table */}
        <IssueList
          issues={filteredIssues}
          onDelete={deleteIssue}
          onEdit={setEditingIssue}
        />

        {/* Form to Add New Issues */}
        <AddIssueForm onAddIssue={addIssue} />
      </div>
    </div>
  );
}

// ============================================================
// ISSUEFILTER COMPONENT
// Filter issues by status and owner
// ============================================================
function IssueFilter({
  filterStatus,
  setFilterStatus,
  filterOwner,
  setFilterOwner,
  issueCount,
  totalCount,
}) {
  return (
    <div className="filterContainer">
      <h2 className="sectionTitle">Filter Issues</h2>
      <div className="filterControls">
        {/* Status Filter Dropdown */}
        <div className="filterGroup">
          <label className="label">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Owner Filter Input */}
        <div className="filterGroup">
          <label className="label">Owner</label>
          <input
            type="text"
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            placeholder="Search by owner name..."
            className="input"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="filterGroup">
          <button
            onClick={() => {
              setFilterStatus("All");
              setFilterOwner("");
            }}
            className="clearFilterButton"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p className="filterResults">
        Showing {issueCount} of {totalCount} issues
      </p>
    </div>
  );
}

// ============================================================
// ISSUELIST COMPONENT
// Displays all issues in a table format
// ============================================================
function IssueList({ issues, onDelete, onEdit }) {
  return (
    <div className="issueListContainer">
      <h2 className="sectionTitle">Current Issues</h2>
      <table className="table">
        <thead>
          <tr className="tableHeader">
            <th className="th">Title</th>
            <th className="th">Owner</th>
            <th className="th">Status</th>
            <th className="th">Created</th>
            <th className="th">Effort</th>
            <th className="th">Due Date</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <IssueRow
              key={issue._id}
              issue={issue}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
      {issues.length === 0 && (
        <p className="emptyMessage">
          No issues found. Try adjusting your filters or add a new issue below!
        </p>
      )}
    </div>
  );
}

// ============================================================
// ISSUEROW COMPONENT
// Renders a single issue as a table row with Edit/Delete buttons
// ============================================================
function IssueRow({ issue, onDelete, onEdit }) {
  // Get the appropriate status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "statusBadge statusBadge-new";
      case "In Progress":
        return "statusBadge statusBadge-inProgress";
      case "Fixed":
        return "statusBadge statusBadge-fixed";
      case "Closed":
        return "statusBadge statusBadge-closed";
      default:
        return "statusBadge";
    }
  };

  // Format date for display (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <tr className="tableRow">
      <td className="td">{issue.title}</td>
      <td className="td">{issue.owner}</td>
      <td className="td">
        <span className={getStatusClass(issue.status)}>{issue.status}</span>
      </td>
      <td className="td">{formatDate(issue.created)}</td>
      <td className="td">{issue.effort} days</td>
      <td className="td">{formatDate(issue.dueDate)}</td>
      <td className="td">
        <div className="actionButtons">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(issue)}
            className="editButton"
            title="Edit this issue"
          >
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(issue._id, issue.title)}
            className="deleteButton"
            title="Delete this issue"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// EDITISSUEFORM COMPONENT
// Form to edit an existing issue
// ============================================================
function EditIssueForm({ issue, onUpdate, onCancel }) {
  // State for form inputs - initialized with current issue values
  const [title, setTitle] = useState(issue.title);
  const [owner, setOwner] = useState(issue.owner);
  const [status, setStatus] = useState(issue.status);
  const [effort, setEffort] = useState(issue.effort);
  const [dueDate, setDueDate] = useState(
    issue.dueDate ? new Date(issue.dueDate).toISOString().split("T")[0] : ""
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !owner.trim()) {
      alert("Please fill in both Title and Owner fields");
      return;
    }

    // Create updated issue object
    const updatedIssue = {
      title: title.trim(),
      owner: owner.trim(),
      status: status,
      effort: effort ? parseInt(effort) : 0,
      dueDate: dueDate || null,
    };

    // Call parent function to update issue
    onUpdate(issue._id, updatedIssue);
  };

  return (
    <div className="editFormOverlay">
      <div className="editFormContainer">
        <h2 className="sectionTitle">Edit Issue</h2>
        <form onSubmit={handleSubmit} className="form">
          {/* Title Input */}
          <div className="formGroup">
            <label className="label">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe the issue..."
              className="input"
            />
          </div>

          {/* Owner Input */}
          <div className="formGroup">
            <label className="label">Owner *</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Assigned person"
              className="input"
            />
          </div>

          {/* Status Dropdown */}
          <div className="formGroup">
            <label className="label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Effort Input */}
          <div className="formGroup">
            <label className="label">Effort (days)</label>
            <input
              type="number"
              value={effort}
              onChange={(e) => setEffort(e.target.value)}
              placeholder="Estimated days"
              min="0"
              className="input"
            />
          </div>

          {/* Due Date Input */}
          <div className="formGroup">
            <label className="label">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Action Buttons */}
          <div className="formActions">
            <button type="submit" className="submitButton">
              Save Changes
            </button>
            <button type="button" onClick={onCancel} className="cancelButton">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// ADDISSUEFORM COMPONENT
// Form to add new issues with input validation
// ============================================================
function AddIssueForm({ onAddIssue }) {
  // State for form inputs
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("New");
  const [effort, setEffort] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !owner.trim()) {
      alert("Please fill in both Title and Owner fields");
      return;
    }

    // Create new issue object
    const newIssue = {
      title: title.trim(),
      owner: owner.trim(),
      status: status,
      effort: effort ? parseInt(effort) : 0,
      dueDate: dueDate || null,
      // created date will be auto-generated by MongoDB
    };

    // Call parent function to add issue
    onAddIssue(newIssue);

    // Reset form fields
    setTitle("");
    setOwner("");
    setStatus("New");
    setEffort("");
    setDueDate("");
  };

  return (
    <div className="formContainer">
      <h2 className="sectionTitle">Create New Issue </h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Title Input */}
        <div className="formGroup">
          <label className="label">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Describe the issue..."
            className="input"
          />
        </div>

        {/* Owner Input */}
        <div className="formGroup">
          <label className="label">Owner *</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Assigned person"
            className="input"
          />
        </div>

        {/* Status Dropdown */}
        <div className="formGroup">
          <label className="label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Effort Input */}
        <div className="formGroup">
          <label className="label">Effort (days)</label>
          <input
            type="number"
            value={effort}
            onChange={(e) => setEffort(e.target.value)}
            placeholder="Estimated days"
            min="0"
            className="input"
          />
        </div>

        {/* Due Date Input */}
        <div className="formGroup">
          <label className="label">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submitButton">
          Add Issue
        </button>
      </form>
    </div>
  );
}

export default App;
