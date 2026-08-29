import { useEffect, useState } from "react";

function dashBoard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [daycareStudents, setDaycareStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  // const displayName = adminUser.username || adminUser.name || "Admin";
  const displayName = adminUser.name || adminUser.username || "Admin";
  // ===============================
  // LOAD DASHBOARD DATA
  // ===============================

  const loadDashboardData = async () => {
    try {
      // Students
      const studentsResponse = await fetch(`${API_URL}/api/students/all`);

      const studentsData = await studentsResponse.json();

      // Payments
      const paymentsResponse = await fetch(`${API_URL}/payments`);

      const paymentsData = await paymentsResponse.json();

      // Daycare
      const daycareResponse = await fetch(`${API_URL}/api/daycare/all`);

      const daycareData = await daycareResponse.json();

      console.log("Students:", studentsData);
      console.log("Payments:", paymentsData);
      console.log("Daycare:", daycareData);

      setStudents(studentsData);
      setPayments(
        Array.isArray(paymentsData) ? paymentsData : paymentsData.data || [],
      );
      setDaycareStudents(daycareData);

      setLoading(false);
    } catch (error) {
      console.error("Dashboard data loading error:", error);

      setLoading(false);
    }
  };

  // ===============================
  // LOAD DATA WHEN PAGE OPENS
  // ===============================

  useEffect(() => {
    loadDashboardData();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    // Clear interval when leaving page
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // TOTAL COLLECTION
  // ===============================

  const totalCollection = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0) + Number(payment.fine || 0),
    0,
  );

  // ===============================
  // PENDING FEES
  // ===============================

  const pendingFees = students.reduce(
    (total, student) => total + Number(student.remainingFees || 0),
    0,
  );

  // ===============================
  // TODAY'S COLLECTION
  // ===============================

  const today = new Date().toLocaleDateString("en-CA");

  const todaysCollection = payments.reduce((total, payment) => {
    if (payment.paymentDate === today) {
      return total + Number(payment.amount || 0) + Number(payment.fine || 0);
    }

    return total;
  }, 0);

  // ===============================
  // FORMAT RUPEES
  // ===============================

  const formatRupees = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <div className="container-fluid py-4">
      {/* =========================
          DASHBOARD TITLE
      ========================= */}

      <div className="mb-4">
        <h3 className="fw-bold">Welcome, {displayName} 👋</h3>

        <p className="text-muted">Millennium Kidss Fee Management System.</p>
      </div>

      {/* =========================
          DASHBOARD CARDS
      ========================= */}

      <div className="row g-4">
        {/* TOTAL STUDENTS */}
        <div className="col-md-3">
          <div className="card p-3 text-center border border-info shadow-sm">
            <span className="p-2 fs-3">
              <i className="fa-solid fa-user-graduate"></i>
            </span>

            <h5 className="mt-2">Total Students</h5>

            <h3 className="fw-bold">{loading ? "..." : students.length}</h3>
          </div>
        </div>

        {/* TOTAL COLLECTION */}
        <div className="col-md-3">
          <div className="card p-3 text-center border border-success shadow-sm">
            <span className="p-2 fs-3">
              <i className="fa-solid fa-wallet"></i>
            </span>

            <h5>Total Collection</h5>

            <h3 className="text-success fw-bold">
              ₹{formatRupees(totalCollection)}
            </h3>
          </div>
        </div>

        {/* PENDING FEES */}
        <div className="col-md-3">
          <div className="card p-3 text-center border border-danger shadow-sm">
            <span className="p-2 fs-3">
              <i className="fa-solid fa-hourglass-half"></i>
            </span>

            <h5>Pending Fees</h5>

            <h3 className="text-danger fw-bold">
              ₹{formatRupees(pendingFees)}
            </h3>
          </div>
        </div>

        {/* TODAY'S COLLECTION */}
        <div className="col-md-3">
          <div className="card p-3 text-center border border-warning shadow-sm">
            <span className="p-2 fs-3">
              <i className="fa-solid fa-calendar-check"></i>
            </span>

            <h5>Today's Collection</h5>

            <h3 className="text-warning fw-bold">
              ₹{formatRupees(todaysCollection)}
            </h3>
          </div>
        </div>

        {/* DAYCARE */}
        <div className="col-md-3">
          <div className="card p-3 text-center border border-primary shadow-sm">
            <span className="p-2 fs-3">
              <i className="fa-solid fa-users"></i>
            </span>

            <h5>Daycare Students</h5>

            <h3 className="text-primary fw-bold">
              {loading ? "..." : daycareStudents.length}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dashBoard;
