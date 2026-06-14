import { jsPDF } from "jspdf";

const DEDUCTION_LABELS = {
	tax: "Income Tax (TDS)",
	pf: "Provident Fund (EPF)",
	insurance: "Health Insurance",
	absence: "Absence Salary Cut",
};

const EARNINGS = (b) => [
	{ label: "Basic Pay",    val: b.basic },
	{ label: "HRA",          val: b.hra },
	{ label: "Bonuses",      val: b.bonuses },
	{ label: "Allowances",   val: b.allowances },
];

/**
 * Generates and downloads a PDF payslip.
 * @param {object} item      - History record { month }
 * @param {object} breakdown - Salary breakdown object
 */
export const generatePayslipPDF = (item, breakdown) => {
	const doc = new jsPDF();
	let y = 20;

	// Header
	doc.setFontSize(22);
	doc.text("OFFICIAL PAYSLIP", 105, y, { align: "center" });
	y += 15;

	doc.setFontSize(14);
	doc.text(`Period: ${item.month}`, 20, y);
	doc.text("Status: Paid", 150, y);
	y += 10;
	doc.line(20, y, 190, y);
	y += 10;

	// Attendance
	doc.setFontSize(10);
	doc.setFont("helvetica", "bold");
	doc.text(`Days Present: ${breakdown.attendance?.present || 0}`, 20, y);
	doc.text(`Days Absent (Unpaid): ${breakdown.attendance?.absent || 0}`, 70, y);
	y += 10;
	doc.line(20, y, 190, y);
	y += 15;

	// Earnings
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text("EARNINGS", 20, y);
	doc.setFont("helvetica", "normal");
	y += 10;

	EARNINGS(breakdown).forEach(({ label, val }) => {
		doc.text(label, 30, y);
		doc.text(`INR ${val.toLocaleString()}`, 150, y);
		y += 8;
	});

	y += 5;

	// Deductions
	doc.setFont("helvetica", "bold");
	doc.text("DEDUCTIONS", 20, y);
	doc.setFont("helvetica", "normal");
	y += 10;

	Object.entries(breakdown.deductions || {}).forEach(([key, val]) => {
		if (val > 0) {
			doc.text(DEDUCTION_LABELS[key] || key.toUpperCase(), 30, y);
			doc.text(`- INR ${val.toLocaleString()}`, 150, y);
			y += 8;
		}
	});

	// Net Pay
	y += 10;
	doc.line(20, y, 190, y);
	y += 15;

	doc.setFontSize(16);
	doc.setFont("helvetica", "bold");
	doc.text("NET TAKE-HOME:", 20, y);
	doc.text(`INR ${breakdown.netPay.toLocaleString()}`, 150, y);

	doc.save(`Payslip_${item.month.replace(" ", "_")}.pdf`);
};