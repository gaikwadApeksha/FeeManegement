import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./staffDaycare.css";

function staffStudents() {
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
    branch: staffBranches[0]?.branchName || "",
    parentName: "",
    employeeId: "",
    mobileNo: "",
    alternateNo: "",
    fromTime: "",
    toTime: "",
    totalHours: "",
    daycareType: "",
    joiningDate: "",
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
        `http://localhost:8080/api/daycare/branch/${encodeURIComponent(
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

      // alert(
      //   "Unable to load students. Please check whether Spring Boot is running.",
      // );
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

  const calculateTotalHours = (from, to) => {
    if (!from || !to) return "";

    const fromDate = new Date(`1970-01-01T${from}:00`);
    const toDate = new Date(`1970-01-01T${to}:00`);

    // If To time is after midnight
    if (toDate < fromDate) {
      toDate.setDate(toDate.getDate() + 1);
    }

    const difference = toDate - fromDate;

    const totalMinutes = Math.floor(difference / (1000 * 60));

    // return totalMinutes / 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} Hours`;
    }

    return `${hours} Hours ${minutes} Minutes`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => {
      const updatedData = {
        ...previous,
        [name]: value,
      };

      if (name === "fromTime" || name === "toTime") {
        updatedData.totalHours = calculateTotalHours(
          name === "fromTime" ? value : previous.fromTime,
          name === "toTime" ? value : previous.toTime,
        );
      }

      return updatedData;
    });
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

      const response = await fetch("http://localhost:8080/api/daycare/save", {
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
        branch: "",
        parentName: "",
        employeeId: "",
        mobileNo: "",
        alternateNo: "",
        fromTime: "",
        toTime: "",
        daycareType: "",
        joiningDate: "",
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
    <div className="staff-daycare-page">
      <div className="main-content">
        {/* Header */}
        <header className="daycare-header">
          <div className="header-left">
            <img
              src="/logo.webp.png"
              alt="School Logo"
              className="school-logo"
            />
          </div>
          <div className="daycare-header-info">
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
            className="daycare-home-btn"
            onClick={() => navigate("/staffdashboard")}
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

      <div className="daycare-title-row">
        <div className="daycare-title-box">
          <h2 className="fw-bold mb-1">Daycare section</h2>

          <p className="text-muted mb-0"> Staff</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Student"}
        </button>
      </div>

      {/* ================================================
          BRANCH SELECTOR
      ================================================= */}

      <div className="daycare-branch-card">
        <div className="daycare-branch-grid">
          <div className="daycare-branch-select">
            {/* <div className="col-md-4"> */}
            <label className="form-label fw-semibold">Select Branch</label>

            <select
              className="form-select"
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

          <div className="daycare-viewing">
            {/* <div className="alert alert-info mb-0 mt-3 mt-md-0"> */}
            <strong>Viewing:</strong> {selectedBranch || "No branch selected"}
            <br />
            <small>
              You can view and add students only for your assigned branch.
            </small>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* ================================================
          ADD STUDENT FORM
      ================================================= */}

      {showForm && (
        <div className="daycare-form-card">
          <div className="daycare-form-header">
            <h5>Add New Student</h5>
          </div>

          <div className="daycare-form-body">
            <form onSubmit={handleSubmit}>
              <div className="daycare-form-grid">
                <div className="daycare-form-field">
                  <label>Student Name</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="daycare-form-field">
                  <label>Branch</label>
                  <input type="text" value={selectedBranch} readOnly />
                </div>

                <div className="daycare-form-field">
                  <label>Parent Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Enter parent name"
                    required
                  />
                </div>

                <div className="daycare-form-field">
                  <label>Employee Id</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>

                <div className="daycare-form-field">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div className="daycare-form-field">
                  <label>Alternate Number</label>
                  <input
                    type="tel"
                    name="alternateNo"
                    value={formData.alternateNo}
                    onChange={handleChange}
                    placeholder="Enter alternate number"
                  />
                </div>

                <div className="daycare-form-field">
                  <label>Daycare Type</label>

                  <select
                    name="daycareType"
                    value={formData.daycareType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Daycare Type</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>

                {/* TIMING SECTION */}

                {(formData.daycareType === "Full Day" ||
                  formData.daycareType === "Half Day" ||
                  formData.daycareType === "Hourly") && (
                  <div className="daycare-timing-section">
                    <div className="daycare-timing-title">
                      ⏰ Daycare Timing
                    </div>

                    <div className="daycare-timing-grid">
                      <div className="daycare-form-field">
                        <label>From Time</label>

                        <input
                          type="time"
                          name="fromTime"
                          value={formData.fromTime}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="daycare-form-field">
                        <label>To Time</label>

                        <input
                          type="time"
                          name="toTime"
                          value={formData.toTime}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="daycare-form-field daycare-total-hours">
                        <label>Total Hours</label>

                        <input
                          type="text"
                          value={formData.totalHours}
                          readOnly
                          placeholder="Automatically calculated"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="daycare-form-field">
                  <label>Joining Date</label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="daycare-form-field">
                  <label>Total Fees</label>

                  <input
                    type="number"
                    name="totalFees"
                    value={formData.totalFees}
                    onChange={handleChange}
                    placeholder="Enter total fees"
                    required
                  />
                </div>
              </div>

              <div className="daycare-form-buttons">
                <button type="submit" className="daycare-save-btn">
                  ✓ Save Student
                </button>

                <button
                  type="button"
                  className="daycare-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================
          STUDENT LIST
      ================================================= */}
      <div className="daycare-table-card">
        <div className="daycare-table-header">
          <h5>{selectedBranch || "Branch"} Students</h5>
          <span>Total: {students.length}</span>
        </div>

        <div className="daycare-table-wrapper">
          <div className="table-responsive">
            <table className="daycare-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Admission No</th>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>Parent Name</th>
                  <th>Employee Id</th>
                  <th>Mobile</th>
                  <th>Daycare Type</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="daycare-no-data">
                      Loading students...
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student.studentId || student.admissionNo || index}>
                      <td>{index + 1}</td>
                      <td>{student.admissionNo}</td>
                      <td className="student-name">{student.studentName}</td>
                      <td>{student.branch}</td>
                      <td>{student.parentName}</td>
                      <td>{student.employeeId}</td>
                      <td>{student.mobileNo}</td>
                      <td>{student.daycareType}</td>
                      <td>{student.joiningDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="daycare-no-data">
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
    </div>
  );
}

export default staffStudents;
