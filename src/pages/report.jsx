import { useEffect, useState } from "react";
import "./report.css";

function report() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Load payments from backend
  const loadPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payments`);

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      console.log("Payments from backend:", data);

      setPayments(data);
    } catch (error) {
      console.error("Error loading payments:", error);
      alert("Unable to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Calculate total collection
  const totalCollection = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0) + Number(payment.fine || 0),
    0,
  );

  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    return (
      payment.studentName?.toLowerCase().includes(search) ||
      payment.branch?.toLowerCase().includes(search) ||
      payment.className?.toLowerCase().includes(search) ||
      payment.admissionNo?.toLowerCase().includes(search) ||
      payment.receiptNo?.toLowerCase().includes(search) ||
      payment.paymentMode?.toLowerCase().includes(search) ||
      payment.paymentDate?.toLowerCase().includes(search)
    );
  });
  const getReceiptDescription = (payment) => {
    if (payment.className === "Daycare") {
      return ["Daycare"];
    }

    if (payment.className === "Activity") {
      return ["Activity"];
    }

    if (payment.installment === "Full Payment") {
      return [
        "Registration Fee",
        "Admission Fee",
        "Student Kit",
        "Annual Fee",
        "Tuition Fee",
      ];
    }

    return payment.feeType
      ? payment.feeType
          .split(",")
          .map((fee) => fee.trim())
          .filter(Boolean)
      : [];
  };
  return (
    <div className="container-fluid py-4 payment-report">
      {/* Page Heading */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Payment History Report</h2>
        <p className="text-muted">View all payment transactions</p>
      </div>

      {/* Summary Card */}
      <div className="card border-0 shadow-lg mb-4 summary-card">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-1">Total Collection</h5>

            <h3 className="text-success fw-bold mb-0">
              ₹{totalCollection.toLocaleString("en-IN")}
            </h3>
          </div>

          <div className="text-end">
            <h6 className="text-muted mb-1">Total Transactions</h6>

            <h4 className="fw-bold mb-0">{payments.length}</h4>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-4 report-search">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="input-group input-group-lg flex-nowrap shadow-sm">
            <span className="input-group-text bg-primary text-white border-primary">
              🔍
            </span>

            <input
              type="text"
              className="form-control border-primary"
              placeholder="Search student, branch, class, admission no or receipt no..."
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

      {/* Payment History Table */}
      <div className="card border-0 shadow-lg report-table-card">
        <div className="report-table-header">
          <h5 className="mb-0 fw-bold">All Payment Transactions</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Sr.No</th>
                  <th>Receipt No.</th>
                  <th>Admission No.</th>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>Class</th>
                  <th>Amount</th>
                  <th>Fee Type</th>
                  <th>Installment</th>
                  <th>Payment Mode</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      Loading payment history...
                    </td>
                  </tr>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.paymentId}>
                      {/* Sr No */}
                      <td>{index + 1}</td>

                      {/* Receipt */}
                      <td>
                        {" "}
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
                          {payment.receiptNo}
                        </span>
                      </td>

                      {/* Admission No */}
                      <td>{payment.admissionNo}</td>

                      {/* Student */}
                      <td className="student-name">{payment.studentName}</td>

                      {/* Branch */}
                      <td>{payment.branch}</td>

                      {/* Class */}
                      <td>{payment.className}</td>

                      {/* Amount */}
                      <td className="amount">
                        ₹
                        {(
                          Number(payment.amount || 0) +
                          Number(payment.fine || 0)
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* Fee Type */}
                      {/* <td>{payment.feeType}</td> */}
                      <td className="fee-type">
                        {getReceiptDescription(payment).join(", ")}
                      </td>

                      {/* Installment */}
                      <td>{payment.installment}</td>

                      {/* Payment Mode */}
                      <td>{payment.paymentMode}</td>

                      {/* Date */}
                      <td>{payment.paymentDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4 text-muted">
                      No payment history available
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

export default report;
