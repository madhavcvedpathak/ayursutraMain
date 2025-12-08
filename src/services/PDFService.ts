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
    }
};
