import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import "./staffStudent.css";

function StaffStudents() {
  // =====================================================
  // STAFF LOGIN INFORMATION
  // =====================================================

  const staffUser = JSON.parse(localStorage.getItem("staffUser") || "null");

  const staffName = staffUser?.name || "";
  const staffBranches = staffUser?.branches || [];

  const branchNames = staffBranches.map((branch) => branch.branchName);

  // =====================================================
  // STATE
  // =====================================================

  const [selectedBranch, setSelectedBranch] = useState(
    staffBranches[0]?.branchName || "",
  );

  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentName: "",
    className: "",
    branch: staffBranches[0] || "",
    admissionDate: "",
    session: "2026-2027",
    parentName: "",
    mobileNo: "",
    alternateNum: "",
    totalFees: "",
  });

  // =====================================================
  // LOAD STUDENTS BY BRANCH
  // =====================================================

  const navigate = useNavigate();
  // const handleHome = () => {
  //   navigate("/staff/dashboard");
  // };
  const loadStudents = async () => {
    if (!selectedBranch) {
      setStudents([]);
      return;
    }

    setLoading(true);

    try {
      console.log("Loading students for branch:", selectedBranch);

      const response = await fetch(
        `http://localhost:8080/api/students/branch/${encodeURIComponent(
          selectedBranch,
        )}`,
      );

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Backend error:", response.status, responseText);

        throw new Error(`Server returned ${response.status}`);
      }

      const data = responseText ? JSON.parse(responseText) : [];

      console.log("Students received:", data);

      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);

      setStudents([]);

      alert(
        "Unable to load students. Please check whether Spring Boot is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN BRANCH CHANGES
  // =====================================================

  useEffect(() => {
    loadStudents();
  }, [selectedBranch]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CHANGE BRANCH
  // =====================================================

  const handleBranchChange = (e) => {
    const branch = e.target.value;

    setSelectedBranch(branch);

    setFormData((previous) => ({
      ...previous,
      branch: branch,
    }));
  };

  // =====================================================
  // ADD STUDENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBranch) {
      alert("No branch is assigned to this staff member.");
      return;
    }

    try {
      console.log("Adding student...");
      console.log("Selected branch:", selectedBranch);
      console.log("Form data:", formData);

      const response = await fetch("http://localhost:8080/api/students/save", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          branch: selectedBranch,
        }),
      });

      // Read response ONLY ONCE
      const responseText = await response.text();

      console.log("Save response:", response.status, responseText);

      if (!response.ok) {
        alert(`Unable to add student.\n\nServer response:\n${responseText}`);

        return;
      }

      alert(`Student added successfully to ${selectedBranch} branch!`);

      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        studentName: "",
        className: "",
        branch: selectedBranch,
        admissionDate: "",
        session: "2026-2027",
        parentName: "",
        mobileNo: "",
        alternateNum: "",
        totalFees: "",
      });

      setShowForm(false);

      // =================================================
      // REFRESH STUDENT LIST
      // =================================================

      await loadStudents();
    } catch (error) {
      console.error("Error adding student:", error);

      alert(
        "Unable to connect to Spring Boot server.\n\nPlease make sure Spring Boot is running on port 8080.",
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="staff-student-page">
      <div className="main-content">
        {/* Header */}
        <header className="student-header">
          <div className="student-logo-box">
            <img
              src="/logo.webp.png"
              alt="School Logo"
              className="school-logo"
            />
          </div>
          <div className="student-header-info">
            <h2 className="school-name">
              <span style={{ color: "#FF0000" }}>M</span>
              <span style={{ color: "#FF7F00" }}>i</span>
              <span style={{ color: "#FFD700" }}>l</span>
              <span style={{ color: "#32CD32" }}>l</span>
              <span style={{ color: "#00BFFF" }}>e</span>
              <span style={{ color: "#8A2BE2" }}>n</span>
              <span style={{ color: "#FF1493" }}>n</span>
              <span style={{ color: "#FF4500" }}>i</span>
              <span style={{ color: "#1E90FF" }}>u</span>
              <span style={{ color: "#32CD32" }}>m</span>
              <span style={{ color: "#FF0000" }}> K</span>
              <span style={{ color: "#FF7F00" }}>i</span>
              <span style={{ color: "#FFD700" }}>d</span>
              <span style={{ color: "#32CD32" }}>s</span>
              <span style={{ color: "#00BFFF" }}>s</span>
              <span style={{ color: "#FF1493" }}> N</span>
              <span style={{ color: "#FF4500" }}>a</span>
              <span style={{ color: "#1E90FF" }}>g</span>
              <span style={{ color: "#32CD32" }}>p</span>
              <span style={{ color: "#8A2BE2" }}>u</span>
              <span style={{ color: "#FF1493" }}>r</span>
            </h2>

            <p className="school-subtitle">
              Plot No 4, near Trimurti Nagar, beside Bharat Gas Office, Surve
              Nagar, Nagpur, Maharashtra <br />
              📞 8600031558{" "}
            </p>
          </div>

          <button
            onClick={() => navigate("/staffdashboard")}
            className="home-btn"
          >
            🏠 Home
          </button>
          {/* </div> */}
        </header>
        {/* </div> */}
      </div>
      {/* ================================================
          HEADER
      ================================================= */}
      <div className="student-page-title">
        <div className="title-box">
          <h2 className="fw-bold mb-1">Students section</h2>

          <p className="text-muted mb-0">{staffName} | Staff</p>
        </div>

        <button
          className="add-student-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Student"}
        </button>
      </div>
      {/* ================================================
          BRANCH SELECTOR
      ================================================= */}
      {/* <div className="card shadow-sm border-0 mb-4"> */}
      <div className="branch-card">
        <div className="branch-grid">
          <div>
            <label className="branch-label">Select Branch</label>

            <select
              className="branch-select"
              value={selectedBranch}
              onChange={handleBranchChange}
              disabled={staffBranches.length === 0}
            >
              {staffBranches.length > 0 ? (
                staffBranches.map((branch) => (
                  <option key={branch.id} value={branch.branchName}>
                    {branch.branchName}
                  </option>
                ))
              ) : (
                <option value="">No branch assigned</option>
              )}
            </select>
          </div>

          <div className="viewing-box">
            <strong>Viewing:</strong> {selectedBranch || "No branch selected"}
            <br />
            <small>
              You can view and add students only for your assigned branch.
            </small>
          </div>
        </div>
      </div>

      {/* ================================================
          ADD STUDENT FORM
      ================================================= */}

      {showForm && (
        <div className="student-form-card">
          <h3 className="student-form-title">Add New Student</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* STUDENT NAME */}
              <div className="form-group">
                <label>Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  className="form-control-custom"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </div>

              {/* BRANCH */}
              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  className="form-control-custom"
                  value={selectedBranch}
                  readOnly
                />
              </div>

              {/* CLASS */}
              <div className="form-group">
                <label>Class</label>
                <select
                  name="className"
                  className="form-select-custom"
                  value={formData.className}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="Playgroup">Playgroup</option>
                  <option value="Nursery">Nursery</option>
                  <option value="KG-I">KG-I</option>
                  <option value="KG-II">KG-II</option>
                </select>
              </div>

              {/* ADMISSION DATE */}
              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  className="form-control-custom"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SESSION */}
              <div className="form-group">
                <label>Session</label>
                <select
                  name="session"
                  className="form-select-custom"
                  value={formData.session}
                  onChange={handleChange}
                >
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                  <option value="2028-2029">2028-2029</option>
                  <option value="2029-2030">2029-2030</option>
                </select>
              </div>

              {/* PARENT NAME */}
              <div className="form-group">
                <label>Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  className="form-control-custom"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent name"
                  required
                />
              </div>

              {/* MOBILE */}
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNo"
                  className="form-control-custom"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              {/* ALTERNATE NUMBER */}
              <div className="form-group">
                <label>Alternate Number</label>
                <input
                  type="tel"
                  name="alternateNum"
                  className="form-control-custom"
                  value={formData.alternateNum}
                  onChange={handleChange}
                  placeholder="Enter alternate number"
                />
              </div>

              {/* TOTAL FEES */}
              <div className="form-group">
                <label>Total Fees</label>
                <input
                  type="number"
                  name="totalFees"
                  className="form-control-custom"
                  value={formData.totalFees}
                  onChange={handleChange}
                  placeholder="Enter total fees"
                  required
                />
              </div>
            </div>
            {/* FORM BUTTONS */}

            <div className="form-buttons">
              <button type="submit" className="save-btn">
                ✓ Save Student
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ================================================
          STUDENT LIST
      ================================================= */}

      <div className="student-table-card">
        <div className="student-table-header">
          <h5>{selectedBranch || "Branch"} Students</h5>

          <span>Total: {students.length}</span>
        </div>

        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Admission No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Branch</th>
                <th>Parent Name</th>
                <th>Mobile</th>
                <th>Session</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    Loading students...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={student.studentId || student.admissionNo || index}>
                    <td>{index + 1}</td>
                    <td>{student.admissionNo}</td>
                    <td>{student.studentName}</td>
                    <td>{student.className}</td>
                    <td>{student.branch}</td>
                    <td>{student.parentName}</td>
                    <td>{student.mobileNo}</td>
                    <td>{student.session}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-row">
                    No students found in <strong>{selectedBranch}</strong>{" "}
                    branch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffStudents;
