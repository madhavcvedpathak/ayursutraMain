export interface Notification {
    id: string;
    patientId: string;
    type: 'Purvakarma Alert' | 'Paschatkarma Alert' | 'Booking Confirmation';
    message: string;
    status: 'Scheduled' | 'Sent' | 'Failed';
    scheduledTime: string;
}

export const NotificationService = {
    // Mocking an SMS Gateway (Twilio)
    sendSMS: async (phoneNumber: string, message: string): Promise<{ success: boolean; sid?: string }> => {
        console.log(`[Twilio Auto-Dispatch] Sending to ${phoneNumber}: ${message}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, sid: 'SM' + Math.random().toString(36).substr(2, 9) });
            }, 500);
        });
    },

    // Automated Scheduling Logic
    scheduleNotifications: async (appointment: any) => {
        console.log(`[System] Scheduling automated alerts for appointment ID: ${appointment.id}`);

        // 1. Pre-Procedure (Purvakarma) -> 12 hours before
        const preMsg = NotificationService.generatePreProcedureMessage(appointment.therapyId, appointment.date);
        console.log(`[Scheduler] Queued Purvakarma Alert: "${preMsg}"`);

        // 2. Post-Procedure (Paschatkarma) -> 4 hours after
        const postMsg = NotificationService.generatePostProcedureMessage(appointment.therapyId);
        console.log(`[Scheduler] Queued Paschatkarma Alert: "${postMsg}"`);

        return true;
    },

    generatePreProcedureMessage: (therapyName: string, date: string) => {
        return `Namaste. Your ${therapyName} (Shodhan) is scheduled for ${date}. Start 'Snehapana' (Oleation) as prescribed. Avoid heavy meals. - Ayursutra Center`;
    },

    generatePostProcedureMessage: (therapyName: string) => {
        return `Pranams. Post-${therapyName}, strictly follow 'Samsarjana Krama' (Graduated Diet). Avoid cold water & wind. Rest well to restore Agni. - Ayursutra Center`;
    }
};
