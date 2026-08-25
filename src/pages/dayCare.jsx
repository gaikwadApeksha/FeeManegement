import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./student.css";

export default function dayCare() {
  // const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);

  const [formData, setFormData] = useState({
    studentName: "",
    branch: "",
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

  useEffect(() => {
    loadStudents();
    loadPayments();
  }, []);

  const loadStudents = async () => {
    setLoading(true);

    try {
      console.log("Loading daycare students...");

      const response = await fetch("http://localhost:8080/api/daycare/all");

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      console.log("DAYCARE STUDENTS:", data);

      setStudents(data);
    } catch (error) {
      console.error("Error loading daycare students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================
  const loadPayments = async () => {
    try {
      const response = await fetch("http://localhost:8080/payments");

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      console.log("DAYCARE PAYMENTS:", data);

      setPayments(data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments([]);
    }
  };

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

  const handleStudentChange = (e) => {
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
  // ADD STUDENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branch) {
      alert("Please select a branch");
      return;
    }

    try {
      console.log("Adding student...");
      // console.log("Selected branch:", selectedBranch);
      console.log("Form data:", formData);

      const response = await fetch("http://localhost:8080/api/daycare/save", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      // Read response ONLY ONCE
      const responseText = await response.text();

      console.log("Save response:", response.status, responseText);

      if (!response.ok) {
        alert(`Unable to add student.\n\nServer response:\n${responseText}`);

        return;
      }

      alert(` Daycare Student added successfully !`);

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

      alert("Unable to connect to Spring Boot server.");
    }
  };

  const filteredDaycareStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    return (
      student.studentName?.toLowerCase().includes(search) ||
      student.branch?.toLowerCase().includes(search) ||
      student.parentName?.toLowerCase().includes(search) ||
      student.mobileNo?.toLowerCase().includes(search) ||
      student.daycareType?.toLowerCase().includes(search) ||
      student.employeeId?.toLowerCase().includes(search)
    );
  });

  return (
    <div>
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
                  onChange={handleStudentChange}
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div className="daycare-form-field">
                <label>Branch</label>
                <select
                  className="form-select"
                  name="branch"
                  value={formData.branch}
                  onChange={handleStudentChange}
                >
                  <option value="">select branch</option>
                  <option value="Khamla">Khamla</option>
                  <option value="Manewada">Manewada</option>
                  <option value="Nananvan">Nandanvan</option>
                  <option value="Medical">Medical</option>
                  <option value="Narendra nagar">Narendra Nagar</option>
                  <option value="Mihan">Mihan</option>
                </select>
              </div>

              <div className="daycare-form-field">
                <label>Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleStudentChange}
                  placeholder="Enter parent name"
                  required
                />
              </div>

              <div className="daycare-form-field">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleStudentChange}
                  placeholder="Enter Employee Id"
                  required
                />
              </div>

              <div className="daycare-form-field">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleStudentChange}
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
                  onChange={handleStudentChange}
                  placeholder="Enter alternate number"
                />
              </div>

              <div className="daycare-form-field">
                <label>Daycare Type</label>

                <select
                  name="daycareType"
                  value={formData.daycareType}
                  onChange={handleStudentChange}
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
                  <div className="daycare-timing-title">⏰ Daycare Timing</div>

                  <div className="daycare-timing-grid">
                    <div className="daycare-form-field">
                      <label>From Time</label>

                      <input
                        type="time"
                        name="fromTime"
                        value={formData.fromTime}
                        onChange={handleStudentChange}
                        required
                      />
                    </div>

                    <div className="daycare-form-field">
                      <label>To Time</label>

                      <input
                        type="time"
                        name="toTime"
                        value={formData.toTime}
                        onChange={handleStudentChange}
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
                  onChange={handleStudentChange}
                  required
                />
              </div>

              <div className="daycare-form-field">
                <label>Total Fees</label>

                <input
                  type="text"
                  name="totalFees"
                  value={formData.totalFees}
                  onChange={handleStudentChange}
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

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="input-group input-group-lg flex-nowrap shadow-sm">
            <span className="input-group-text bg-primary text-white border-primary">
              🔍
            </span>

            <input
              type="text"
              className="form-control border-primary"
              placeholder="Search student, branch, parent name, mobile no or daycare type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================
          STUDENT LIST
      ================================================= */}
      <div className="daycare-table-card">
        <div className="daycare-table-header">
          <h5> Daycare Students</h5>
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
                  <th>Employee ID</th>
                  <th>Mobile</th>
                  <th>Daycare Type</th>
                  <th>Date</th>
                  <th>Total Hours</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="daycare-no-data">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredDaycareStudents.length > 0 ? (
                  filteredDaycareStudents.map((student, index) => {
                    const today = new Date();

                    console.log("DAYCARE STUDENT:", {
                      name: student.studentName,
                      admissionNo: student.admissionNo,
                    });

                    console.log("ALL PAYMENTS:", payments);

                    const feePaid = payments.some((payment) => {
                      // Admission number must match
                      const sameAdmissionNo =
                        payment.admissionNo?.toLowerCase().trim() ===
                        student.admissionNo?.toLowerCase().trim();

                      if (!sameAdmissionNo) {
                        return false;
                      }

                      // Payment must be for Day Care
                      const isDaycarePayment =
                        payment.className?.toLowerCase().trim() ===
                          "day care" ||
                        payment.className?.toLowerCase().trim() === "daycare";

                      if (!isDaycarePayment) {
                        return false;
                      }

                      // Check payment month
                      const paymentDate = new Date(
                        payment.paymentDate || payment.date,
                      );

                      return (
                        paymentDate.getMonth() === today.getMonth() &&
                        paymentDate.getFullYear() === today.getFullYear()
                      );
                      // return sameMonth;
                    });

                    // const status = feePaid ? "Paid" : "Pending";

                    return (
                      <tr
                        key={student.studentId || student.admissionNo || index}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 9px",
                              borderRadius: "6px",
                              background: "#ecfdf5",
                              color: "#047857",
                              fontWeight: 700,
                              fontSize: "12px",
                            }}
                          >
                            {student.admissionNo}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "#1e3a8a",
                            fontWeight: 700,
                          }}
                        >
                          {student.studentName}
                        </td>
                        <td>{student.branch}</td>
                        <td>{student.parentName}</td>
                        <td>{student.employeeId}</td>
                        <td>{student.mobileNo}</td>
                        <td>{student.daycareType}</td>
                        <td>{student.joiningDate}</td>
                        <td>{student.totalHours}</td>
                        <td>{student.totalFees}</td>
                        <td>
                          {feePaid ? (
                            <span className="badge bg-success px-3 py-2 fs-6">
                              Paid
                            </span>
                          ) : (
                            <span className="badge bg-danger px-3 py-2 fs-6">
                              Not Paid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="daycare-no-data">
                      No Daycare students added yet branch.
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
