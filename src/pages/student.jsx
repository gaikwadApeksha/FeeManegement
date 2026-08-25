import { useState, useEffect } from "react";
import { saveStudent, getAllStudents } from "../api/studentApi";
import "./student.css";
import axios from "axios";

export default function Student() {
  // ************search bar***************

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [students, setStudents] = useState([]);
  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      student.studentName?.toLowerCase().includes(search) ||
      student.branch?.toLowerCase().includes(search) ||
      student.className?.toLowerCase().includes(search)
    );
  });

  // search bar end

  const loadStudents = async () => {
    const response = await getAllStudents();
    setStudents(response.data);
  };
  const [formData, setFormData] = useState({
    studentName: "",
    className: "",
    branch: "",
    admissionDate: "",
    session: "",
    parentName: "",
    mobileNo: "",
    alternateNum: "",
    totalFees: "",
    paidFees: " ",
    remainingFees: " ",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await saveStudent(formData);

      // alert("Student Added Successfully");
      if (editingId) {
        await axios.put(
          `http://localhost:8080/api/students/update/${editingId}`,
          formData,
        );

        alert("Student Updated Successfully");
      } else {
        await saveStudent(formData);

        alert("Student Added Successfully");
      }

      loadStudents();
      setEditingId(null);

      setFormData({
        studentName: "",
        className: "",
        branch: "",
        admissionDate: "",
        session: "",
        parentName: "",
        mobileNo: "",
        alternateNum: "",
        totalFees: "",
        paidFees: "",
        remainingFees: "",
      });
    } catch (error) {
      console.log(error);
    }
    // setStudents([...students, formData]);
  };
  // Edit Option
  const handleEdit = (student) => {
    setEditingId(student.studentId);
    setFormData({
      studentName: student.studentName || "",
      className: student.className || "",
      branch: student.branch || "",
      admissionDate: student.admissionDate || "",
      session: student.session || "",
      parentName: student.parentName || "",
      mobileNo: student.mobileNo || "",
      alternateNum: student.alternateNum || "",
      totalFees: student.totalFees || "",
      // paidFees: student.paidFees || "",
      // remainingFees: student.remainingFees || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // Edit Option End?

  // ***************delete option***************
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/students/delete/${studentId}`,
      );

      alert("Student deleted successfully");

      loadStudents();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete student");
    }
  };
  // ***************delete option end***************
  return (
    <div className="student-page">
      {/* <h1 className="mb-4 text-danger">Add Student</h1> */}
      <div className="student-form-card">
        {/* <h5 className="mb-3">Add Student</h5> */}

        <div className="student-form-title">
          <h5>👨‍🎓 Add New Student</h5>
        </div>
        <form onSubmit={handleSubmit}>
          {/* ***********name********** */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                name="studentName"
                placeholder="Enter Student Name"
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>

            {/* ************branch*************** */}
            <div className="col-md-4 mb-3">
              <select
                className="form-select"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                <option value="Khamla">Khamla</option>
                <option value="Manewada">Manewada</option>
                <option value="Medical">Medical</option>
                <option value="Narendra Nagar">Narendra Nagar</option>
                <option value="Nandanvan">Nandanvan</option>
              </select>
            </div>

            {/* ************class***************** */}
            <div className="col-md-4 mb-3">
              <select
                className="form-select"
                name="className"
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
            {/* **************date************* */}
            <div className="col-md-4 mb-3">
              <input
                type="date"
                className="form-control"
                name="admissionDate"
                placeholder="select date"
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </div>

            {/* ***********session****************** */}
            <div className="col-md-4 mb-3">
              <select
                className="form-select"
                name="session"
                value={formData.session}
                onChange={handleChange}
                required
              >
                <option value="">Session </option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
                <option value="2028-29">2028-29</option>
                <option value="2029-30">2029-30</option>
              </select>
            </div>

            {/* *********parent name************** */}
            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                name="parentName"
                placeholder="Parent Name"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </div>
            {/* ******************mobile number*************** */}
            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                name="mobileNo"
                placeholder="Phone Number"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* ******************alternate number**************** */}

            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                name="alternateNum"
                placeholder="Alternate Number"
                value={formData.alternateNum}
                onChange={handleChange}
                required
              />
            </div>

            {/* *****************total fees************************* */}
            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                name="totalFees"
                placeholder="Total Fees"
                value={formData.totalFees}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3 d-flex align-items-end">
              <button type="submit" className="student-submit-btn w-100">
                {editingId ? "Update Student" : "Add Student"}
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* searcg button  */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">🔍</span>

            <input
              type="text"
              className="form-control"
              placeholder="Search by student name, branch or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      {/* searcg button  */}
      <div className="student-list-card">
        <h5 className="mb-3">Student List</h5>
        <div className="table-responsive">
          <div className="student-list-header">
            <table className="table student-table">
              <thead className="table-dark">
                <tr>
                  <th>Sr.no</th>
                  <th>Admission No</th>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Class</th>
                  <th>Date of Admission</th>
                  <th>Sesssion</th>
                  <th>Parent Name</th>
                  <th>Phone</th>
                  <th>Alternate Number</th>
                  <th>Total Fees</th>
                  <th>Paid Fees</th>
                  <th>Remaining Fees</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.studentId}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="admission-number">
                          {student.admissionNo}
                        </span>
                      </td>
                      <td className="student-name">{student.studentName}</td>
                      <td>{student.branch}</td>
                      <td>{student.className}</td>
                      <td>{student.admissionDate}</td>
                      <td>{student.session}</td>
                      <td>{student.parentName}</td>
                      <td>{student.mobileNo}</td>
                      <td>{student.alternateNum}</td>
                      <td>{student.totalFees}</td>
                      <td>{student.paidFees}</td>

                      <td>{student.remainingFees}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(student.studentId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No students added yet
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
