export interface Notification {
    id: string;
    patientId: string;
    type: 'Purvakarma Alert' | 'Paschatkarma Alert' | 'Booking Confirmation';
    message: string;
    status: 'Scheduled' | 'Sent' | 'Failed';
    scheduledTime: string;
}

import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface Notification {
    id: string;
    patientId: string;
    type: 'Purvakarma Alert' | 'Paschatkarma Alert' | 'Booking Confirmation';
    message: string;
    status: 'Scheduled' | 'Sent' | 'Failed';
    scheduledTime: string;
}

export const NotificationService = {
    // Twilio Backend Integration
    sendSMS: async (phoneNumber: string, message: string): Promise<{ success: boolean; sid?: string }> => {
        console.log(`[NotificationService] Requesting SMS to ${phoneNumber} via Backend...`);

        try {
            const response = await fetch('http://localhost:3001/api/send-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: phoneNumber, body: message })
            });

            const data = await response.json();

            // Log attempt to Firestore regardless of backend success for audit
            await addDoc(collection(db, 'sms_logs'), {
                phoneNumber,
                message,
                status: data.success ? 'Sent' : 'Failed',
                provider: 'Twilio-Backend',
                timestamp: new Date().toISOString(),
                sid: data.sid || null,
                error: data.error || null
            });

            if (data.success) {
                console.log(`[NotificationService] SMS Dispatch Success! SID: ${data.sid}`);
                return { success: true, sid: data.sid };
            } else {
                console.error(`[NotificationService] SMS Dispatch Failed: ${data.error}`);
                return { success: false };
            }

        } catch (e: any) {
            console.error("[NotificationService] Connection to SMS Server failed", e);
            return { success: false };
        }
    },

    // Automated Scheduling Logic
    scheduleNotifications: async (appointment: { id: string, therapyId: string, date: string, patientPhone?: string, patientName?: string }) => {
        console.log(`[System] Scheduling automated alerts for appointment ID: ${appointment.id}`);

        // Default phone if missing
        const phone = appointment.patientPhone || '+91-9876543210';
        const name = appointment.patientName || 'Patient';

        // 1. INSTANT: Booking Confirmation + Pre-Procedure Instructions
        const preInstructions = NotificationService.generatePreProcedureMessage(appointment.therapyId, appointment.date);
        const instantMsg = `Namaste ${name}. Booking Confirmed! ${preInstructions}`;

        await NotificationService.sendSMS(phone, instantMsg);
        console.log(`[Scheduler] Sent Instant Confirmation & Purvakarma Alert`);

        // 2. Post-Procedure (Paschatkarma) -> 4 hours after
        const postMsg = NotificationService.generatePostProcedureMessage(appointment.therapyId);
        // In a real system, this would be scheduled. Here we just log it as "Scheduled"
        try {
            await addDoc(collection(db, 'scheduled_notifications'), {
                appointmentId: appointment.id,
                type: 'Post-Procedure',
                message: postMsg,
                scheduledFor: new Date(new Date(appointment.date).getTime() + 4 * 60 * 60 * 1000).toISOString(),
                status: 'Pending'
            });
        } catch (e) { console.error(e) }

        return true;
    },

    generatePreProcedureMessage: (therapyName: string, date: string) => {
        return `Namaste. Your ${therapyName} (Shodhan) is scheduled for ${date}. Start 'Snehapana' (Oleation) as prescribed. Avoid heavy meals. - Ayursutra Center`;
    },

    generatePostProcedureMessage: (therapyName: string) => {
        return `Pranams. Post-${therapyName}, strictly follow 'Samsarjana Krama' (Graduated Diet). Avoid cold water & wind. Rest well to restore Agni. - Ayursutra Center`;
    }
};
