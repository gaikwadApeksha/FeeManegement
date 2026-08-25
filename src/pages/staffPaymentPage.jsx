import { useState, useEffect } from "react";
import { ToWords } from "to-words";
import axios from "axios";
import "./staffPaymentPage.css";
import { Navigate, useNavigate } from "react-router-dom";

function staffPaymentPage() {
  const logoUrl = `${window.location.origin}/logo.webp.png`;
  const signUrl = `${window.location.origin}/sign.png`;
  const API_URL = import.meta.env.VITE_API_URL;
  // const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);

  // ============================================================
  // LOAD STUDENTS
  // ============================================================

  const loadStudents = async () => {
    try {
      if (branchNames.length === 0) {
        setStudents([]);
        return;
      }

      const studentRequests = branchNames.map((branch) =>
        axios.get(
          `${API_URL}/api/students/branch/${encodeURIComponent(branch)}`,
        ),
      );

      const daycareRequests = branchNames.map((branch) =>
        axios.get(
          `${API_URL}/api/daycare/branch/${encodeURIComponent(branch)}`,
        ),
      );

      const [studentResponses, daycareResponses] = await Promise.all([
        Promise.all(studentRequests),
        Promise.all(daycareRequests),
      ]);

      const preschoolStudents = studentResponses.flatMap((response) =>
        response.data.map((student) => ({
          ...student,
          studentType: "Preschool",
        })),
      );

      const daycareStudents = daycareResponses.flatMap((response) =>
        response.data.map((student) => ({
          ...student,
          studentType: "Daycare",
          className: "Daycare",
        })),
      );

      setStudents([...preschoolStudents, ...daycareStudents]);
    } catch (error) {
      console.error("Error loading staff students:", error);
    }
  };

  // ============================================================
  // LOAD PAYMENTS
  // ============================================================

  useEffect(() => {
    // loadPayments();
    loadStudents(); //changes
  }, []);

  //**************load payment ******************** */
  // const loadPayments = async () => {
  //   try {
  //     // const [studentResponse, daycareResponse] = await Promise.all([
  //     //   axios.get("http://localhost:8080/api/students/all"),
  //     //   axios.get("http://localhost:8080/api/daycare/all"),
  //     // ]);
  //     const response = await axios.get("http://localhost:8080/payments");
  //     console.log("Payments from backend:", response.data);

  //     setPayments(response.data || []);

  //     console.log("Payments from backend");
  //     console.log(response.data);

  //     setPayments(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const generateReceiptNo = () => {
    return (
      "MK-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-6)
    );
  };

  const [formData, setFormData] = useState({
    receiptNo: generateReceiptNo(),
    admissionNo: "",
    studentName: "",
    parentName: "",
    employeeId: "",
    branch: "",
    className: "",
    session: "2026-2027",
    feeType: [],
    installment: "",
    amount: "",
    fine: "",
    totalAmount: "",
    paymentMode: "",
    transactionId: "",
    chequeNo: "",
    bankName: "",
    remark: "",
    date: new Date().toISOString().split("T")[0],
  });

  //changes daycare

  const handleFeeTypeChange = (e) => {
    const { value, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      feeType: checked
        ? [...previous.feeType, value]
        : previous.feeType.filter((item) => item !== value),
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStudentChange = (e) => {
    const studentName = e.target.value;

    // First update the typed name
    setFormData((previous) => ({
      ...previous,
      studentName: studentName,
    }));

    // Find matching student
    const selectedStudent = students.find(
      (student) =>
        student.studentName?.toLowerCase().trim() ===
        studentName.toLowerCase().trim(),
    );

    if (selectedStudent) {
      setFormData((previous) => ({
        ...previous,
        studentName: selectedStudent.studentName,
        admissionNo: selectedStudent.admissionNo,
        parentName: selectedStudent.parentName || "",
        employeeId: selectedStudent.employeeId || "",
        branch: selectedStudent.branch,
        className:
          selectedStudent.studentType === "Daycare"
            ? "Daycare"
            : selectedStudent.className,

        session: selectedStudent.session || "2026-2027",
      }));
    } else {
      // Don't show wrong information while typing
      setFormData((previous) => ({
        ...previous,
        admissionNo: "",
        branch: "",
        className: "",
        parentName: "",
        employeeId: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let finalFeeType = formData.feeType;
    let finalFeeType = [...formData.feeType];

    // Daycare
    if (formData.className === "Daycare") {
      finalFeeType = ["Daycare"];
    }

    // Activity
    else if (formData.className === "Activity") {
      finalFeeType = ["Activity"];
    }

    // Full Payment
    else if (formData.installment === "Full Payment") {
      finalFeeType = [
        "Registration Fee",
        "Admission Fee",
        "Student Kit",
        "Annual Fee",
        "Tuition Fee",
      ];
    }

    const amount = Number(formData.amount || 0);
    const fine = Number(formData.fine || 0);

    // IMPORTANT
    const totalAmount = amount + fine;

    const paymentData = {
      ...formData,

      amount: amount,
      fine: fine,
      totalAmount: totalAmount,

      // Convert array into a single string
      // feeType: formData.feeType.join(", "),
      feeType: finalFeeType.join(", "),

      // Send paymentDate because your entity uses paymentDate
      paymentDate: formData.date,
    };
    console.log("PAYMENT DATA BEING SENT:", paymentData);

    try {
      console.log("Sending Data:", paymentData);

      const response = await axios.post(`${API_URL}/payments`, paymentData);
      // await axios.post(`${API_URL}/payments`, paymentData);
      console.log("SAVED PAYMENT:", response.data);
      // setPayments("Payment Saved: ", response.data);
      alert("Payments saved successfully");
      // loadPayments();

      setFormData({
        receiptNo: generateReceiptNo(),
        admissionNo: "",
        studentName: "",
        parentName: "",
        employeeId: "",
        branch: branchNames[0] || " ",
        className: "",
        session: "2026-2027",
        feeType: [],
        installment: "",

        amount: "",
        fine: "",
        totalAmount: " ",
        paymentMode: "",
        transactionId: "",

        chequeNo: "",
        bankName: "",
        remark: "",

        date: new Date().toISOString().split("T")[0],
      });
      // await loadPayments();
    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);
      alert("Unable to save payments");
    }
  };
  const printReceipt = (payment) => {
    // let description = payment.feeType;

    let description = [];

    if (payment.className === "Daycare") {
      description = ["Daycare"];
    }
    //activities
    else if (payment.className === "Activity") {
      description = ["Activity"];
    } else if (payment.installment === "Full Payment") {
      description = [
        "Registration Fee",
        "Admission Fee",
        "Student Kit",
        "Annual Fee",
        "Tuition Fee",
      ];
    } else {
      description = payment.feeType ? payment.feeType.split(",") : [];
    }

    const descriptionHtml = description.join("<br>");
    const totalPaid = Number(payment.amount) + Number(payment.fine || 0);

    const receiptWindow = window.open("", "_blank");

    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: true,
        ignoreZeroCurrency: false,
      },
    });

    const amountInWords = payment.amount
      ? toWords.convert(Number(totalPaid))
      : "";

    console.log(payment.amount);
    console.log(payment);
    console.log(description);
    alert("Reached here");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt</title>
          <style>
          @page{
          size:A4 portrait;
    margin:8mm;
          }
           @media print{
            body {
              font-family: Arial, sans-serif;
              background: #f4f4f4;
              padding: 20px;
            }
            .receipt {
              width: 500px;
              margin: auto;
              background: white;
              padding: 10px;
              border-radius: 12px;
              box-shadow: 0 0 15px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;

              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header h2 {
              
              color:#ff7900;
              margin: 0;
            }
            .receipt-title {
              text-align: center;
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #1e293b;
              // color:#E07117;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 16px;
            }
            .row span:first-child {
              font-weight: bold;
              color: #374151;
            }
            .amount {
              font-size: 20px;
              font-weight: bold;
              color: #16a34a;
            }
            .footer {
              margin-top: 30px;
              text-align: right;
              font-weight: bold;
            }

              .logo {
          width: 90px;
          height: auto;
        }
            .signature-section {
          margin-top: 40px;
          text-align: right;
        }

        .signature-box {
          width: 180px;
          height: 80px;
          border-bottom: 1px solid #000;
          margin-left: auto;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signature-box img {
          max-width: 100%;
          max-height: 90%;
          object-fit: contain;
        }

        .signature-text {
          font-weight: bold;
        }}
          </style>
        </head>
        <body>
              <div class="receipt">

<!-- Header -->

<table width="100%" border="1" cellspacing="0" cellpadding="7">
<tr>
<td width="20%" align="center">
<img src="${logoUrl}" width="90">
</td>
<td align="center">
<h2>Millennium Kidss Nagpur</h2>
Plot No.4,near Trimurty Nagar,beside Bharat Gas office, Surve Nagar, Nagpur - 440022 Maharastra.
<br>
Mobile : 8600031558
<h3>FEES RECEIPT</h3>
</td>
</tr>
</table>


<!-- Student Details -->
<table width="100%" border="1" cellspacing="0" cellpadding="6">
<tr>
<td><b>Receipt No</b></td>
<td>${payment.receiptNo}</td>
<td><b>Date</b></td>
<td>${payment.paymentDate}</td>
</tr>
<tr>
<td><b>Admission No</b></td>
<td>${payment.admissionNo}</td>
<td><b>Session</b></td>
<td>${payment.session}</td>
</tr>
<tr>
<td><b>Student Name</b></td>
<td>${payment.studentName}</td>
<td><b>Class</b></td>
<td>${payment.className}</td>
</tr>
<tr>

<td><b>Branch</b></td>
<td>${payment.branch}</td>
<td><b>Installment</b></td>
<td>${payment.installment}</td>

</tr>

</table>

<!-- Fee Table -->
<table width="100%" border="1" cellspacing="0" cellpadding="6">
<tr>

<th>Description</th>
<th>Due</th>
<th>Fine</th>
<th>Paid</th>
</tr>
<tr>

<td>${descriptionHtml}</td>
<td>${payment.amount}</td>
<td>${payment.fine}</td>
<td>${totalPaid}</td>
</tr>
</table>


<!-- Payment Details -->
<h3>PAYMENT INFORMATION</h3>
<table width="100%" border="1" cellspacing="0" cellpadding="6">
<tr>
<td><b>Payment Mode</b></td>
<td>${payment.paymentMode}</td>
<td><b>Bank</b></td>
<td>${payment.bankName}</td>
</tr>
<tr>
<td><b>Transaction ID</b></td>
<td>${payment.transactionId}</td>

</tr>
<tr>
<td><b>Cheque No</b></td>
<td>${payment.chequeNo}</td>
<td></td>
<td></td>
</tr>
</table>

<!-- Total -->

<table width="100%" border="1" cellspacing="0" cellpadding="8">
<tr>
<td ><b>Total Paid :</b></td>
<td width="180"><b>₹ ${totalPaid}</b></td>
</tr>

<tr>
<td><b>Amount in Words</b></td>
<td colspan="3">
${amountInWords}

</td>
</tr>
</table>
<tr>

<table width="100">
<tr>
<td>
<img src="${signUrl}" width="120">
<br>
Authorized Signature
</td>

</tr>
</table>
<center>
This is a computer-generated receipt.

</center>

</div>   </body>
      </html>
    `);

    receiptWindow.document.close();
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  const navigate = useNavigate();

  const staffUser = JSON.parse(localStorage.getItem("staffUser") || "null");

  const staffName = staffUser?.name || "";

  const staffBranches = staffUser?.branches || [];

  const branchNames = staffBranches.map((branch) => branch.branchName);

  return (
    // *********************add Fee section*******************

    <div className="staff-payment-page">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src="/logo.webp.png" alt="School Logo" className="school-logo" />
        </div>
        <div>
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

        <div className="staff-info">
          <h3>Payment Section</h3>
          <p>
            <strong>Staff:</strong> {staffName}
          </p>
          <p>
            <strong>Branch:</strong>{" "}
            {branchNames.join(", ") || "No branch assigned"}
          </p>
        </div>

        <button
          onClick={() => navigate("/staffdashboard")}
          style={{
            background: "white",
            color: "#1E40AF",
            border: "none",
            padding: "9px 18px",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          🏠 Home
        </button>
        {/* </div> */}
      </header>

      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-4 shadow-sm">
          <h4>Student Information</h4>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Receipt No</label>
              <input
                className="form-control"
                name="receiptNo"
                value={formData.receiptNo}
                readOnly
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Admission No</label>
              <input
                type="text"
                className="form-control"
                name="admissionNo"
                value={formData.admissionNo}
                // onChange={handleChange}
                readOnly
                placeholder="Automatically filled"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Session</label>
              <input
                className="form-control"
                name="session"
                value={formData.session}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Student Name</label>
              <input
                type="text"
                className="form-control"
                name="studentName"
                value={formData.studentName}
                onChange={handleStudentChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Parent Name</label>
              <input
                type="text"
                className="form-control"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Enter parent name"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Employee Id</label>
              <input
                type="text"
                className="form-control"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Enter employee id"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Branch</label>
              <select
                className="form-select"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={branchNames.length === 0}
              >
                {branchNames.length > 0 ? (
                  branchNames.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))
                ) : (
                  <option value="">No branch available</option>
                )}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>Class</label>
              <select
                className="form-select"
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                <option value="">select class</option>
                <option>Playgroup</option>
                <option>Nursury</option>
                <option>KG-I</option>
                <option>KG-II</option>
                <option>Daycare</option>
                <option>Activity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4 shadow-sm">
          <h4>Fees Details</h4>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Installment</label>
              <select
                className="form-select"
                name="installment"
                value={formData.installment}
                onChange={handleChange}
              >
                <option value="">Select Installment</option>
                <option>Full Payment</option>
                <option>First</option>
                <option>Second</option>
                <option>Third</option>
                <option>Regular</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Amount</label>
              <input
                type="text"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label>Fine</label>
              <input
                type="text"
                className="form-control"
                name="fine"
                value={formData.fine}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <h5>Fee Type</h5>
              <div className="form-check">
                <input
                  type="checkbox"
                  value="Registration Fee"
                  checked={formData.feeType.includes("Registration Fee")}
                  onChange={handleFeeTypeChange}
                  className="form-check-input"
                />

                <label className="form-check-label">Registration Fee</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Admission Fee"
                  checked={formData.feeType.includes("Admission Fee")}
                  onChange={handleFeeTypeChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Admission Fee</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Student Kit"
                  checked={formData.feeType.includes("Student Kit")}
                  onChange={handleFeeTypeChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Student Kit</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Annual Fee"
                  checked={formData.feeType.includes("Annual Fee")}
                  onChange={handleFeeTypeChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Annual Fee</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Tuition Fee"
                  checked={formData.feeType.includes("Tuition Fee")}
                  onChange={handleFeeTypeChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Tuition Fee</label>
              </div>
            </div>
          </div>
        </div>
        {/* ****************Payment information****************** */}
        <div className="card p-4 mb-4 shadow-sm">
          <h4>Payment Information</h4>

          <div className="row">
            <div className="col-md-4">
              <label>Payment Mode</label>

              <select
                className="form-select"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>Online</option>
                <option>Cheque</option>
              </select>
            </div>

            <div className="col-md-4">
              <label>Date</label>

              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {(formData.paymentMode === "UPI" ||
            formData.paymentMode === "Online") && (
            <div className="row mt-3">
              <div className="col-md-4">
                <label>Transaction ID</label>

                <input
                  className="form-control"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label>Bank Name</label>

                <input
                  className="form-control"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {formData.paymentMode === "Cheque" && (
            <div className="row mt-3">
              <div className="col-md-4">
                <label>Cheque Number</label>

                <input
                  className="form-control"
                  name="chequeNo"
                  value={formData.chequeNo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label>Bank Name</label>

                <input
                  className="form-control"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-12 mt-3">
          <label className="form-label fw-semibold">Remarks</label>

          <textarea
            className="form-control"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            rows="3"
            placeholder="Enter payment remarks..."
          />
        </div>

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-outline-success me-3"
            // onClick={handleSubmit}
          >
            Save Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default staffPaymentPage;
