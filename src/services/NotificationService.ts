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

            console.error("[NotificationService] Connection to SMS Server failed", e);
            // Log this client-side failure too if possible, or just alert
            return { success: false };
        }
    },

    // Twilio Voice Call Integration
    makeBotCall: async (phoneNumber: string, message: string): Promise<{ success: boolean; sid?: string }> => {
        console.log(`[NotificationService] Requesting Voice Call to ${phoneNumber}...`);

        // Use relative path for Vercel
        const apiUrl = (import.meta as any).env.VITE_API_URL_VOICE || '/api/make-call';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: phoneNumber,
                    message: message.substring(0, 500) // Truncate for TwiML limits if needed
                })
            });

            const data = await response.json();

            // Log attempt
            await addDoc(collection(db, 'call_logs'), {
                phoneNumber,
                message,
                status: data.success ? 'Initiated' : 'Failed',
                provider: 'Twilio-Voice',
                timestamp: new Date().toISOString(),
                sid: data.sid || null,
                error: data.error || null
            });

            if (!response.ok) throw new Error(data.error || `HTTP Error ${response.status}`);

            if (data.success) {
                console.log(`[NotificationService] Call Initiated! SID: ${data.sid}`);
                return { success: true, sid: data.sid };
            } else {
                console.error(`[NotificationService] Call Failed: ${data.error}`);
                return { success: false };
            }

        } catch (e: any) {
            console.error("[NotificationService] Connection to Voice Server failed", e);
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
        return `🌟 BOOKING CONFIRMED 🌟
Your appointment for ${therapyName} (Shodhan Therapy) is confirmed at Ayursutra Center on ${date}.

🛑 IMPORTANT PRE-CARE (Purvakarma):
To ensure the maximum benefit and safety of your detox, strictly adhere to the following:

1. DIET (Ahara):
   - Eat only when hungry.
   - Consume warm, liquid/semi-solid meals (e.g., Khichdi, warm soups).
   - STRICTLY AVOID: Curd, pickles, fried items, cold drinks, sweets, and heavy greasy food.
   - Stop eating by 7:30 PM the night before.

2. LIFESTYLE (Vihara):
   - Drink lukewarm water throughout the day.
   - Avoid sleeping during the day (Divaswapna).
   - Protect yourself from cold breezes and direct sun.
   - Maintain sexual abstinence (Brahmacharya) 2 days prior.

3. SNEHAPANA (Internal Oleation):
   - If you have been prescribed medicated ghee, take it exactly at 6:00 AM on empty stomach with warm water.
   - Do not eat anything until you feel genuine hunger.

4. MENTAL STATE:
   - Keep your mind calm and stress-free. Anxiety can affect the detox process.

⚠️ REPORTING: If you have fever, menstruation, or extreme fatigue, please call us to reschedule.

Please arrive 20 minutes early for vitals check. 
📍 Location: Ayursutra Center
📞 Helpline: +91-9876543210
🙏 Namaste.`;
    },

    generatePostProcedureMessage: (therapyName: string) => {
        return `⛔ POST-THERAPY CARE (Paschatkarma) - CRITICAL ⛔

Your ${therapyName} procedure was successful. Your body's digestive fire (Agni) is currently very low, like a covered ember. You must nurse it back to strength slowly.

🗓️ 3-DAY RECOVERY PLAN (Samsarjana Krama):

DAY 1 (Today):
- Meal 1 (Evening): Drink only the thin upper water of rice gruel (Manda). No solid rice.
- Fluids: Sip LUKEWARM ginger water only. NO cold water.

DAY 2 (Tomorrow):
- Morning: Diluted rice gruel (Peja).
- Evening: Thicker rice gruel with a pinch of rocksalt and ghee (Vilepi).

DAY 3 (Day After):
- Morning: Plain cooked rice with fluid (Odana).
- Evening: Rice with mild green gram soup (Yusha).

🚫 STRICT PROHIBITIONS (For 7 Days):
- No cold water showers (Hot water only).
- No AC or Fan draft directly on body.
- No Travel, long sitting, or loud speaking.
- No Day sleeping.
- No Sexual activity or heavy exercise.

✅ DO'S:
- Rest in a calm, dimly lit room.
- Wear warm, comfortable cotton clothes.
- Listen to soothing music or mantra chanting.

If you experience dizziness, heavy bleeding, or severe weakness, contact us IMMEDIATELY.

Heal Well.
- Dr. Madhav, Ayursutra Center`;
    }
};
