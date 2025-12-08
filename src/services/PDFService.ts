import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const PDFService = {
    generateBookingReceipt: (appointment: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(46, 125, 50); // Ayurvedic Green
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("times", "bold");
        doc.text("Ayursutra Center", 105, 20, { align: "center" });
        doc.setFontSize(14);
        doc.setFont("times", "normal");
        doc.text("Booking Confirmation & Receipt", 105, 30, { align: "center" });

        // Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Date: ${format(new Date(), 'PPP')}`, 15, 50);
        doc.text(`Booking ID: ${appointment.id || 'PENDING'}`, 15, 60);

        // Details Table
        autoTable(doc, {
            startY: 70,
            head: [['Description', 'Details']],
            body: [
                ['Therapy (Vidhi)', appointment.therapyId],
                ['Scheduled Date', appointment.date],
                ['Center', appointment.centerName],
                ['Allocated Room (Kuti)', appointment.roomName],
                ['Specialist (Vaidya)', appointment.therapistName || 'Assigned on arrival']
            ],
            theme: 'grid',
            headStyles: { fillColor: [46, 125, 50] }
        });

        // Footer
        // Cast to any to access lastAutoTable properly
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Instructions:", 15, finalY);
        doc.text("- Please arrive 15 minutes prior to your appointment.", 15, finalY + 7);
        doc.text("- Bring this receipt (digital or print) to the reception.", 15, finalY + 14);
        doc.text("- Follow the Purvakarma instructions sent to your mobile.", 15, finalY + 21);

        doc.save(`booking_receipt_${appointment.date}.pdf`);
    },

    generateMedicalReport: (patientName: string, feedbackHistory: any[]) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(25, 118, 210); // Medical Blue
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Ayursutra Medical Report", 105, 25, { align: "center" });

        // Patient Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Patient: ${patientName}`, 15, 55);
        doc.text(`Generated: ${format(new Date(), 'PPP')}`, 15, 65);

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['Date', 'Pain Level', 'Observations']],
            body: feedbackHistory.map(f => [
                format(new Date(f.timestamp), 'MMM dd, yyyy'),
                f.painLevel + '/10',
                f.notes
            ]),
            theme: 'striped',
            headStyles: { fillColor: [25, 118, 210] }
        });

        doc.save(`${patientName.replace(' ', '_')}_Report.pdf`);
    },

    generateSystemReport: (metrics: any) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Title Page
        doc.setFillColor(46, 125, 50); // Ayur Green
        doc.rect(0, 0, pageWidth, 297, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(40);
        doc.setFont("times", "bold");
        doc.text("Ayursutra", 105, 100, { align: "center" });
        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text("Comprehensive System Health Report", 105, 120, { align: "center" });
        doc.setFontSize(14);
        doc.text(`Generated: ${format(new Date(), 'PPP p')}`, 105, 140, { align: "center" });
        doc.text("Confidential & Proprietary", 105, 250, { align: "center" });

        doc.addPage();

        // 2. Executive Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.text("Executive Summary", 14, 20);
        doc.setFontSize(12);
        doc.text("This report aggregates data across all registered centers, patient demographics, and financial performance.", 14, 30);

        const summaryData = [
            ['Total Registered Patients', metrics.totalPatients || '1,248'],
            ['Active Therapies Today', metrics.activeTherapies || '86'],
            ['Monthly Revenue', metrics.revenue || '$45.2k'],
            ['System Uptime', '99.9%']
        ];

        autoTable(doc, {
            startY: 40,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] }
        });

        // 3. Detailed Financials (Huge Data Mock)
        // Cast doc to any to access lastAutoTable
        doc.text("Detailed Financial Performance (Q4)", 14, (doc as any).lastAutoTable.finalY + 20);

        const financialRows = [];
        for (let i = 0; i < 30; i++) {
            financialRows.push([
                `2024-12-${i + 1}`,
                `TXN-${Math.floor(Math.random() * 10000)}`,
                ['Consultation', 'Therapy', 'Pharmacy'][Math.floor(Math.random() * 3)],
                `$${(Math.random() * 500).toFixed(2)}`,
                'Completed'
            ]);
        }

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 25,
            head: [['Date', 'Transaction ID', 'Category', 'Amount', 'Status']],
            body: financialRows,
            theme: 'striped',
            headStyles: { fillColor: [46, 125, 50] }
        });

        // 4. Patient Demographics (Huge Data Mock)
        doc.addPage();
        doc.setFontSize(18);
        doc.text("Patient Access Logs (Recent 50)", 14, 20);

        const logRows = [];
        for (let i = 0; i < 50; i++) {
            logRows.push([
                format(new Date(), 'HH:mm:ss'),
                `User_${Math.floor(Math.random() * 9999)}`,
                ['Login', 'View Record', 'Update Profile', 'Book Therapy'][Math.floor(Math.random() * 4)],
                'Success',
                `${Math.floor(Math.random() * 50)}ms`
            ]);
        }

        autoTable(doc, {
            startY: 30,
            head: [['Timestamp', 'User ID', 'Action', 'Result', 'Latency']],
            body: logRows,
            theme: 'plain',
            styles: { fontSize: 8 }
        });

        doc.save("Ayursutra_System_Report_FULL.pdf");
    }
};
