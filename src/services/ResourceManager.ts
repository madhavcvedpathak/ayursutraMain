import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define our resources
export const THERAPY_ROOMS = [
    { id: 'R1', name: 'Dhanvantari Hall A', type: 'General', capacity: 1 },
    { id: 'R2', name: 'Dhanvantari Hall B', type: 'General', capacity: 1 },
    { id: 'R3', name: 'Sushruta Suite', type: 'Premium', capacity: 1 },
    { id: 'R4', name: 'Charaka Chamber', type: 'Premium', capacity: 1 },
];

export const THERAPISTS = [
    { id: 'T1', name: 'Dr. Aarav', specialization: 'Vamana' },
    { id: 'T2', name: 'Therapist Maya', specialization: 'Virechana' },
    { id: 'T3', name: 'Therapist Rohan', specialization: 'Basti' },
];

export const ResourceManager = {
    // Check if a specific room is free at a given date
    checkRoomAvailability: async (roomId: string, date: string): Promise<boolean> => {
        const q = query(
            collection(db, 'appointments'),
            where('roomId', '==', roomId),
            where('date', '==', date)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty;
    },

    // Find the first available room for a therapy on a date
    autoAllocateRoom: async (date: string): Promise<{ roomId: string; roomName: string } | null> => {
        // In a real app, we'd check against hours/slots. Here we check daily density.
        // For simplicity in this demo, we check if a room has < 3 appointments that day.

        for (const room of THERAPY_ROOMS) {
            const q = query(
                collection(db, 'appointments'),
                where('roomId', '==', room.id),
                where('date', '==', date)
            );
            const snapshot = await getDocs(q);

            // Assume max 3 slots per day per room
            if (snapshot.size < 3) {
                return { roomId: room.id, roomName: room.name };
            }
        }
        return null; // No rooms available
    },

    // Find a therapist
    autoAllocateTherapist: (therapyType: string) => {
        // Simple mock allocation logic
        const therapist = THERAPISTS.find(t => therapyType.includes(t.specialization)) || THERAPISTS[0];
        return therapist;
    },

    getCenterOccupancy: async (date: string) => {
        const q = query(collection(db, 'appointments'), where('date', '==', date));
        const snapshot = await getDocs(q);
        const bookedCount = snapshot.size;
        const totalCapacity = THERAPY_ROOMS.length * 3; // 3 slots per room
        return Math.min(Math.round((bookedCount / totalCapacity) * 100), 100);
    }
};
