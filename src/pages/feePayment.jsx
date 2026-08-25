import { useState, useEffect } from "react";
import { ToWords } from "to-words";
import axios from "axios";
import "./staffPaymentPage.css";
import html2pdf from "html2pdf.js";

function FeePayment() {
  const API_URL = import.meta.env.VITE_API_URL;

  const logoUrl = `${window.location.origin}/logo.webp.png`;
  const signUrl = `${window.location.origin}/sign.png`;

  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [paidPayments, setPaidPayments] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [paidFees, setPaidFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const generateReceiptNo = () => {
    return (
      "MK-" + new Date().getFullYear() + "-" + String(Date.now()).slice(-6)
    );
  };

  const getToday = () => new Date().toLocaleDateString("en-CA");

  // ============================================================
  // LOAD STUDENTS
  // ============================================================

  const loadStudents = async () => {
    try {
      const [studentResponse, daycareResponse] = await Promise.all([
        axios.get(`${API_URL}/api/students/all`),
        axios.get(`${API_URL}/api/daycare/all`),
      ]);

      console.log("STUDENTS FROM BACKEND:", studentResponse.data);

      const preschoolStudents = (studentResponse.data || []).map((student) => ({
        ...student,
        studentType: "Preschool",
      }));

      const daycareStudents = (daycareResponse.data || []).map((student) => ({
        ...student,
        studentType: "Daycare",
        className: "Daycare",
      }));

      setStudents([...preschoolStudents, ...daycareStudents]);
    } catch (error) {
      console.error("Error loading students:", error);
      setStudents([]);
    }
  };

  // ============================================================
  // LOAD PAYMENTS
  // ============================================================

  const loadPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments`);

      console.log("Payments from backend:", response.data);
      setPayments(response.data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments([]);
    }
  };

  useEffect(() => {
    loadPayments();
    loadStudents();
  }, []);

  // ============================================================
  // FORM DATA
  // ============================================================

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
    paymentMode: "",
    transactionId: "",
    chequeNo: "",
    bankName: "",
    remark: "",
    date: getToday(),
  });

  // ============================================================
  // SEARCH
  // ============================================================

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
      payment.paymentDate?.toLowerCase().includes(search) ||
      payment.employeeId?.toLowerCase().includes(search)
    );
  });

  // ============================================================
  // STUDENT CHANGE
  // ============================================================

  const handleStudentChange = (e) => {
    const value = e.target.value;

    const student = students.find(
      (s) => s.studentName?.toLowerCase().trim() === value.toLowerCase().trim(),
    );

    if (!student) {
      setFormData((prev) => ({
        ...prev,
        studentName: value,
        admissionNo: "",
        parentName: "",
        admissionNo: "",
        className: "",
        branch: "",
        session: "2026-2027",
      }));

      setPaidPayments([]);
      setPaidFees([]);
      setSelectedFees([]);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      studentName: student.studentName || value,
      admissionNo: student.admissionNo || "",
      // Parent + Employee
      parentName: student.parentName || "",
      employeeId: student.employeeId || "",
      className:
        student.studentType === "Daycare" ? "Daycare" : student.className || "",
      branch: student.branch || "",
      session: student.session || "2026-2027",
    }));

    const studentPayments = payments.filter(
      (payment) =>
        payment.admissionNo?.toLowerCase().trim() ===
        student.admissionNo?.toLowerCase().trim(),
    );

    setPaidPayments(studentPayments);

    const previouslyPaidFees = studentPayments.flatMap((payment) =>
      payment.feeType
        ? payment.feeType
            .split(",")
            .map((fee) => fee.trim())
            .filter(Boolean)
        : [],
    );

    setPaidFees(previouslyPaidFees);
    setSelectedFees([]);
  };

  // ============================================================
  // HANDLE FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT PAYMENT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentName.trim()) {
      alert("Please select or enter student name.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.paymentMode) {
      alert("Please select payment mode.");
      return;
    }

    const amount = Number(formData.amount || 0);
    const fine = Number(formData.fine || 0);
    const totalAmount = amount + fine;

    const className = (formData.className || "").trim().toLowerCase();

    let finalFeeType = "";

    if (className === "daycare") {
      finalFeeType = "Daycare";
    } else if (className === "activity") {
      finalFeeType = "Activity";
    } else if (formData.installment === "Full Payment") {
      finalFeeType =
        "Registration Fee, Admission Fee, Student Kit, Annual Fee, Tuition Fee";
    } else {
      finalFeeType = Array.isArray(formData.feeType)
        ? formData.feeType.join(", ")
        : formData.feeType || "";
    }
    if (!finalFeeType) {
      alert("Please select at least one fee type.");
      return;
    }

    // ------------------------------------------------------------
    // PAYMENT DATA
    // ------------------------------------------------------------
    const paymentData = {
      receiptNo: formData.receiptNo,
      admissionNo: formData.admissionNo,
      studentName: formData.studentName,
      parentName: formData.parentName,
      employeeId: formData.employeeId || "",
      branch: formData.branch,
      className: formData.className,
      session: formData.session,
      feeType: finalFeeType,
      installment: formData.installment,
      amount: amount,
      fine: fine,
      totalAmount: totalAmount,

      // description: description,

      paymentMode: formData.paymentMode,
      transactionId:
        formData.paymentMode === "UPI" || formData.paymentMode === "Online"
          ? formData.transactionId || ""
          : "",
      chequeNo:
        formData.paymentMode === "Cheque" ? formData.chequeNo || "" : "",
      bankName:
        formData.paymentMode === "UPI" ||
        formData.paymentMode === "Online" ||
        formData.paymentMode === "Cheque"
          ? formData.bankName || ""
          : "",
      remark: formData.remark || "",
      paymentDate: formData.date,
    };

    try {
      console.log("Sending Data:", paymentData);

      await axios.post(`${API_URL}/payments`, paymentData);

      const response = await axios.get("http://localhost:8080/payments");
      setPayments(response.data || []);

      alert("Payment saved successfully.");

      setFormData({
        receiptNo: generateReceiptNo(),
        admissionNo: "",
        studentName: "",
        branch: "",
        className: "",
        session: "2026-2027",
        feeType: [],
        installment: "",
        amount: "",
        fine: "",
        paymentMode: "",
        transactionId: "",
        chequeNo: "",
        bankName: "",
        remark: "",
        date: getToday(),
      });

      setSelectedFees([]);
      setPaidFees([]);
      setPaidPayments([]);
    } catch (error) {
      console.error("Payment save error:", error);
      console.error("Response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Unable to save payment. Please check the backend.",
      );
    }
  };

  // ============================================================
  // GET RECEIPT DESCRIPTION
  // ============================================================

  const getReceiptDescription = (payment) => {
    const className = (payment.className || "").trim().toLowerCase();

    if (className === "Daycare") {
      return ["Daycare"];
    }

    if (className === "Activity") {
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
    if (!payment.feeType) {
      return [];
    }

    return payment.feeType
      .split(",")
      .map((fee) => fee.trim())
      .filter(Boolean);
  };

  // ============================================================
  // CREATE RECEIPT CONTENT
  // IMPORTANT:
  // This returns ONLY the inner receipt content.
  // It is used with receiptElement.innerHTML for html2pdf.
  // ============================================================

  const createReceiptHtml = (payment) => {
    const description = getReceiptDescription(payment);
    const descriptionHtml =
      description.length > 0 ? description.join("<br />") : "-";

    const amount = Number(payment.amount || 0);
    const fine = Number(payment.fine || 0);
    const totalPaid = amount + fine;

    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: true,
        ignoreZeroCurrency: false,
      },
    });

    let amountInWords = "";

    try {
      amountInWords = totalPaid > 0 ? toWords.convert(totalPaid) : "";
    } catch (error) {
      console.error("Amount to words error:", error);
      amountInWords = "";
    }

    const safeReceiptNo = payment.receiptNo || "-";
    const safeDate = payment.paymentDate || payment.date || "-";
    const safeAdmissionNo = payment.admissionNo || "-";
    const safeSession = payment.session || "-";
    const safeStudentName = payment.studentName || "-";
    const safeParentName = payment.parentName || "-";
    const safeEmployeeId = payment.employeeId || "-";
    const safeClassName = payment.className || "-";
    const safeBranch = payment.branch || "-";
    const safeInstallment = payment.installment || "-";
    const safePaymentMode = payment.paymentMode || "-";
    const safeBankName = payment.bankName || "-";
    const safeTransactionId = payment.transactionId || "-";
    const safeChequeNo = payment.chequeNo || "-";
    const safeRemark = payment.remark || "-";

    return `
      <style>
        .mk-receipt {
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          box-sizing: border-box;
          background: #ffffff;
          color: #000000;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          line-height: 1.25;
          padding: 7px;
        }

        .mk-receipt *,
        .mk-receipt *::before,
        .mk-receipt *::after {
          box-sizing: border-box;
        }

        .mk-receipt table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .mk-receipt td,
        .mk-receipt th {
          border: 1px solid #000000;
          padding: 5px;
          vertical-align: middle;
          word-break: break-word;
        }

        .mk-receipt .header-table td {
          height: 82px;
        }

        .mk-receipt .logo-cell {
          width: 20%;
          text-align: center;
        }

        .mk-receipt .logo {
          width: 65px;
          max-width: 100%;
          height: auto;
          display: inline-block;
        }

        .mk-receipt .school-cell {
          width: 80%;
          text-align: center;
        }

        .mk-receipt .school-name {
          margin: 0;
          color: #f47b20;
          font-size: 18px;
          font-weight: 700;
        }

        .mk-receipt .address {
          margin-top: 5px;
          font-size: 9px;
        }

        .mk-receipt .mobile {
          margin-top: 3px;
          font-size: 9px;
        }

        .mk-receipt .receipt-heading {
          margin: 8px 0 0;
          font-size: 11px;
        }

        .mk-receipt .details-table {
          margin-top: 0;
        }

        .mk-receipt .label {
          width: 20%;
          font-weight: 700;
        }

        .mk-receipt .value {
          width: 30%;
        }

        .mk-receipt .fee-table {
          margin-top: 0;
        }

        .mk-receipt .fee-table th {
          text-align: center;
          font-weight: 700;
        }

        .mk-receipt .right {
          text-align: right;
        }

        .mk-receipt .section-title {
          margin: 14px 0 6px;
          padding: 7px;
          background: #f3f3f3;
          border: 1px solid #000;
          font-size: 11px;
          font-weight: 700;
        }

        .mk-receipt .total {
          font-size: 12px;
        }

        .mk-receipt .signature-area {
          margin-top: 15px;
          text-align: right;
          min-height: 60px;
        }

        .mk-receipt .signature {
          width: 90px;
          height: auto;
          display: inline-block;
        }

        .mk-receipt .signature-text {
          display: block;
          margin-top: 3px;
          font-weight: 700;
        }

        .mk-receipt .footer {
          text-align: center;
          margin-top: 18px;
          font-size: 10px;
        }

        .mk-receipt .nowrap {
          white-space: nowrap;
        }

        @media print {
          .mk-receipt {
            max-width: none;
            width: 100%;
            padding: 0;
          }
        }
      </style>

      <div class="mk-receipt">
        <!-- HEADER -->
        <table class="header-table">
          <tr>
            <td class="logo-cell">
              <img
                class="logo"
                src="${logoUrl}"
                alt="Millennium Kidss Logo"
              />
            </td>

            <td class="school-cell">
              <h2 class="school-name">Millennium Kidss Nagpur</h2>

              <div class="address">
                Plot No. 4, Near Trimurty Nagar,
                Beside Bharat Gas Office,
                Surve Nagar, Nagpur - 440022, Maharashtra
              </div>

              <div class="mobile">Mobile: 8600031558</div>

              <h3 class="receipt-heading">FEE RECEIPT</h3>
            </td>
          </tr>
        </table>

        <!-- STUDENT DETAILS -->
        <table class="details-table">
          <tr>
            <td class="label">Receipt No</td>
            <td class="value">${safeReceiptNo}</td>

            <td class="label">Date</td>
            <td class="value">${safeDate}</td>
          </tr>

          <tr>
            <td class="label">Admission No</td>
            <td class="value">${safeAdmissionNo}</td>

            <td class="label">Session</td>
            <td class="value">${safeSession}</td>
          </tr>

          <tr>
            <td class="label">Student Name</td>
            <td class="value">${safeStudentName}</td>

            <td class="label">Class</td>
            <td class="value">${safeClassName}</td>
          </tr>

          <tr>
            <td class="label">Parent Name</td>
            <td class="value">${safeParentName}</td>

            <td class="label">Employee Id</td>
            <td class="value">${safeEmployeeId}</td>
          </tr>

          <tr>
            <td class="label">Branch</td>
            <td class="value">${safeBranch}</td>

            <td class="label">Installment</td>
            <td class="value">${safeInstallment}</td>
          </tr>
        </table>

        <!-- FEE TABLE -->
        <table class="fee-table">
          <tr>
            <th>Description</th>
            <th width="20%">Total Fees</th>
            <th width="15%">Fine / Extra Charge</th>
            <th width="20%">Paid</th>
          </tr>

          <tr>
            <td>${descriptionHtml}</td>

            <td class="right">
              ₹ ${amount.toLocaleString("en-IN")}
            </td>

            <td class="right">
              ₹ ${fine.toLocaleString("en-IN")}
            </td>

            <td class="right">
              <b>₹ ${totalPaid.toLocaleString("en-IN")}</b>
            </td>
          </tr>
        </table>

        <!-- PAYMENT INFORMATION -->
        <div class="section-title">PAYMENT INFORMATION</div>

        <table>
          <tr>
            <td class="label">Payment Mode</td>
            <td class="value">${safePaymentMode}</td>

            <td class="label">Bank Name</td>
            <td class="value">${safeBankName}</td>
          </tr>

          <tr>
            <td class="label">Transaction ID</td>
            <td class="value">${safeTransactionId}</td>

            <td class="label">Cheque No</td>
            <td class="value">${safeChequeNo}</td>
          </tr>
        </table>

        <!-- TOTAL -->
        <table>
          <tr>
            <td width="35%"><b>Total Paid:</b></td>
            <td>
              <b class="total">
                ₹ ${totalPaid.toLocaleString("en-IN")}
              </b>
            </td>
          </tr>

          <tr>
            <td><b>Amount in Words</b></td>
            <td>${amountInWords}</td>
          </tr>

          <tr>
            <td><b>Remarks</b></td>
            <td>${safeRemark}</td>
          </tr>
        </table>

        <!-- SIGNATURE -->
        <div class="signature-area">
          <img
            class="signature"
            src="${signUrl}"
            alt="Authorized Signature"
          />
          <span class="signature-text">Authorized Signature</span>
        </div>

        <div class="footer">
          This is a computer-generated receipt.
        </div>
      </div>
    `;
  };

  // ============================================================
  // WAIT FOR RECEIPT IMAGES
  // ============================================================

  const waitForImages = async (container) => {
    const images = Array.from(container.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            const done = () => {
              img.removeEventListener("load", done);
              img.removeEventListener("error", done);
              resolve();
            };

            img.addEventListener("load", done);
            img.addEventListener("error", done);

            // Prevent one broken image from hanging PDF generation.
            setTimeout(done, 3000);
          }),
      ),
    );
  };

  // ============================================================
  // WHATSAPP RECEIPT
  // ============================================================

  const sendReceiptWhatsApp = async (payment) => {
    let receiptElement = null;
    let pdfUrl = null;

    try {
      console.log("Generating WhatsApp receipt for:", payment);
      receiptElement = document.createElement("div");
      receiptElement.innerHTML = createReceiptHtml(payment);

      Object.assign(receiptElement.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "559px",
        minHeight: "794px",
        padding: "0",
        margin: "0",
        background: "#ffffff",
        zIndex: "2147483647",
        overflow: "visible",
      });

      document.body.appendChild(receiptElement);

      // Wait until logo/signature have either loaded or failed.
      await waitForImages(receiptElement);

      // Wait for fonts/layout and one browser paint cycle.
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );

      const receipt = receiptElement.querySelector(".mk-receipt");
      if (!receipt) {
        throw new Error("Receipt content was not created.");
      }

      // html2pdf works more reliably when the source element has a real
      // rendered height and is inside the viewport.
      const pdfBlob = await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `Fee_Receipt_${payment.receiptNo || "Receipt"}.pdf`,
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: true,
            imageTimeout: 10000,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 559,
            windowHeight: Math.max(794, receipt.scrollHeight),
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
          jsPDF: {
            unit: "mm",
            format: "a5",
            orientation: "portrait",
          },
        })
        .from(receipt)
        .outputPdf("blob");

      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error("PDF blob is empty.");
      }

      console.log("PDF generated successfully. Size:", pdfBlob.size, "bytes");

      // Remove receipt after successful PDF generation.
      if (receiptElement && document.body.contains(receiptElement)) {
        document.body.removeChild(receiptElement);
        receiptElement = null;
      }

      // Download PDF.
      pdfUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = `Fee_Receipt_${
        payment.receiptNo || "Receipt"
      }.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      // Open WhatsApp with receipt information.
      // A browser cannot automatically attach a local PDF to WhatsApp.
      const totalPaid = Number(payment.amount || 0) + Number(payment.fine || 0);

      const message = `Dear Parents,\n\nPlease find the fee receipt for ${
        payment.studentName || "your child"
      }.\n\nReceipt No: ${payment.receiptNo || "-"}\nAmount Paid: ₹${totalPaid.toLocaleString(
        "en-IN",
      )}\n\nThe receipt PDF has been downloaded on this device.\n\nThank You.\nMillennium Kidss`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      }, 10000);
    } catch (error) {
      console.error("WhatsApp receipt error:", error);
      console.error("Receipt error message:", error?.message);
      console.error("Receipt error stack:", error?.stack);

      if (receiptElement && document.body.contains(receiptElement)) {
        document.body.removeChild(receiptElement);
      }

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      alert(
        `Unable to generate receipt PDF.\n\n${
          error?.message || "Unknown error"
        }`,
      );
    }
  };

  // ============================================================
  // PRINT RECEIPT
  // ============================================================

  const printReceipt = (payment) => {
    const receiptWindow = window.open("", "_blank");

    if (!receiptWindow) {
      alert("Please allow pop-ups to print the receipt.");
      return;
    }

    const receiptContent = createReceiptHtml(payment);

    // createReceiptHtml() is inner content.
    // For printing, we wrap it inside a valid HTML document.
    const receiptDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Fee Receipt - ${payment.receiptNo || ""}</title>

          <style>
            @page {
              size: A5 portrait;
              margin: 8mm;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
            }
          </style>
        </head>

        <body>
          ${receiptContent}
        </body>
      </html>
    `;

    receiptWindow.document.open();
    receiptWindow.document.write(receiptDocument);
    receiptWindow.document.close();

    const printImages = Array.from(
      receiptWindow.document.querySelectorAll("img"),
    );

    const printWhenReady = () => {
      receiptWindow.focus();
      receiptWindow.print();
    };

    if (printImages.length === 0) {
      setTimeout(printWhenReady, 500);
      return;
    }

    let loaded = 0;

    const imageDone = () => {
      loaded += 1;

      if (loaded === printImages.length) {
        setTimeout(printWhenReady, 500);
      }
    };

    printImages.forEach((img) => {
      if (img.complete) {
        imageDone();
      } else {
        img.onload = imageDone;
        img.onerror = imageDone;
      }
    });

    // Fallback in case an image never fires load/error.
    setTimeout(printWhenReady, 3000);
  };

  // ============================================================
  // FEE CHANGE
  // ============================================================

  const handleFeeChange = (e) => {
    const { value, checked } = e.target;

    setSelectedFees((previous) => {
      if (checked) {
        return previous.includes(value) ? previous : [...previous, value];
      }

      return previous.filter((fee) => fee !== value);
    });

    setFormData((prev) => {
      const currentFees = Array.isArray(prev.feeType) ? prev.feeType : [];

      return {
        ...prev,
        feeType: checked
          ? currentFees.includes(value)
            ? currentFees
            : [...currentFees, value]
          : currentFees.filter((fee) => fee !== value),
      };
    });
  };

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="staff-payment-page">
      {/* =====================================================
          ADD PAYMENT FORM
      ====================================================== */}

      <form onSubmit={handleSubmit}>
        {/* STUDENT INFORMATION */}

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
                list="student-name-list"
                required
              />

              <datalist id="student-name-list">
                {students.map((student, index) => (
                  <option
                    key={`${student.admissionNo || student.studentId || index}`}
                    value={student.studentName || ""}
                  />
                ))}
              </datalist>
            </div>
            <div className="col-md-6 mb-3">
              <label>Parent Name</label>
              <input
                type="text"
                className="form-control"
                name="parentName"
                value={formData.parentName}
                onChange={handleStudentChange}
                placeholder="Enter Parent name "
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Employee Id</label>
              <input
                type="text"
                className="form-control"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleStudentChange}
                placeholder="Enter Parent Id "
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Branch</label>

              <select
                className="form-select"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                <option>Khamla</option>
                <option>Narendra Nagar</option>
                <option>Nandanvan</option>
                <option>Manewada</option>
                <option>Medical</option>
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
                <option value="">Select Class</option>
                <option>Playgroup</option>
                <option>Nursery</option>
                <option>KG-I</option>
                <option>KG-II</option>
                <option>Daycare</option>
                <option>Activity</option>
              </select>
            </div>
          </div>
        </div>

        {/* FEES DETAILS */}

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
                min="0"
                step="0.01"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Fine / Extra Charge</label>

              <input
                type="text"
                min="0"
                step="0.01"
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
                  checked={selectedFees.includes("Registration Fee")}
                  onChange={handleFeeChange}
                  className="form-check-input"
                  disabled={paidFees.includes("Registration Fee")}
                />

                <label className="form-check-label">Registration Fee</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Admission Fee"
                  checked={selectedFees.includes("Admission Fee")}
                  onChange={handleFeeChange}
                  className="form-check-input"
                  disabled={paidFees.includes("Admission Fee")}
                />

                <label className="form-check-label">Admission Fee</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Student Kit"
                  checked={selectedFees.includes("Student Kit")}
                  onChange={handleFeeChange}
                  className="form-check-input"
                  disabled={paidFees.includes("Student Kit")}
                />

                <label className="form-check-label">Student Kit</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Annual Fee"
                  checked={selectedFees.includes("Annual Fee")}
                  onChange={handleFeeChange}
                  className="form-check-input"
                  disabled={paidFees.includes("Annual Fee")}
                />

                <label className="form-check-label">Annual Fee</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="Tuition Fee"
                  checked={selectedFees.includes("Tuition Fee")}
                  onChange={handleFeeChange}
                  className="form-check-input"
                  disabled={paidFees.includes("Tuition Fee")}
                />

                <label className="form-check-label">Tuition Fee</label>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT INFORMATION */}

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
                required
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

        {/* REMARKS */}

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

        {/* SAVE */}

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-outline-success me-3">
            Save Payment
          </button>
        </div>
      </form>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="row justify-content-center mb-4 mt-4">
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

      {/* =====================================================
          TRANSACTION TABLE
      ====================================================== */}

      <div className="card border-0 shadow-lg">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0 fw-bold">Transaction Details</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Sr.No</th>
                  <th>Student</th>
                  <th>Parent Name</th>
                  <th>Employee Id</th>
                  <th>Branch</th>
                  <th>Class</th>
                  <th>Total Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th className="text-center">Receipt</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.paymentId || payment.receiptNo || index}>
                      <td>{index + 1}</td>

                      <td className="fw-semibold">{payment.studentName}</td>

                      <td>{payment.parentName}</td>

                      <td>{payment.employeeId}</td>

                      <td>{payment.branch}</td>

                      <td>{payment.className}</td>

                      <td className="text-success fw-bold">
                        ₹
                        {(
                          Number(payment.amount || 0) +
                          Number(payment.fine || 0)
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>{payment.paymentMode}</td>

                      <td>{payment.paymentDate}</td>

                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3"
                            onClick={() => printReceipt(payment)}
                          >
                            <i className="fa-solid fa-print me-1"></i>
                            Receipt
                          </button>

                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3"
                            onClick={() => sendReceiptWhatsApp(payment)}
                          >
                            <i className="fa-brands fa-whatsapp me-1"></i>
                            WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No transaction records available
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

export default FeePayment;
