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
    // Twilio Backend Integration (Vercel Compatible)
    sendSMS: async (phoneNumber: string, message: string): Promise<{ success: boolean; sid?: string }> => {
        console.log(`[NotificationService] Requesting SMS to ${phoneNumber} via API...`);

        // Use relative path '/api/send-sms' which works automatically on Vercel
        // OR fallback to localhost if VITE_API_URL is set (for local dev)
        const apiUrl = (import.meta as any).env.VITE_API_URL || '/api/send-sms';

        try {
            const response = await fetch(apiUrl, {
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

            if (!response.ok) {
                throw new Error(data.error || `HTTP Error ${response.status}`);
            }

            if (data.success) {
                console.log(`[NotificationService] SMS Dispatch Success! SID: ${data.sid}`);
                return { success: true, sid: data.sid };
            } else {
                console.error(`[NotificationService] SMS Dispatch Failed: ${data.error}`);
                return { success: false };
            }

        } catch (e: any) {
            console.error("[NotificationService] Connection to SMS Server failed", e);
            // Log this client-side failure too if possible, or just alert
            return { success: false };
        }
    },

    // Automated Scheduling Logic
    scheduleNotifications: async (appointment: { id: string, therapyId: string, date: string, patientPhone?: string, patientName?: string }) => {
        console.log(`[System] Scheduling automated alerts for appointment ID: ${appointment.id}`);

        // Default phone if missing
        const phone = appointment.patientPhone;
        if (!phone || phone.length < 5) {
            console.error('[NotificationService] Skipping SMS. No valid phone number provided.');
            return false;
        }
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
        return `✅ Booking Successful! Your ${therapyName} is confirmed for ${date} at Ayursutra Center.

PRE-CARE (Purvakarma):
1. Hydration: Drink warm water throughout the day.
2. Diet: Eat light, warm, fresh meals (Sattvic diet). Avoid fried/processed food.
3. Snehapana: Start medicated ghee intake if prescribed.
4. Rest: Ensure 8 hours of sleep.

Please arrive 15 mins early. 🙏`;
    },

    generatePostProcedureMessage: (therapyName: string) => {
        return `🌿 Post-${therapyName} Care (Paschatkarma):

1. Diet: Follow 'Samsarjana Krama' (Graduated Diet) strictly - start with rice water (Peja).
2. Lifestyle: Avoid cold wind, AC, and intense physical exertion for 3 days.
3. Rest: Complete rest is essential to restore Agni (digestive fire).
4. Hydration: Sip warm ginger water.

We wish you a healing recovery. - Ayursutra`;
    }
};
