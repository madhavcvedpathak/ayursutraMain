import { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, Bell, MapPin, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { therapies } from '../data/therapies';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ResourceManager } from '../services/ResourceManager';
import { NotificationService } from '../services/NotificationService';
import { PDFService } from '../services/PDFService';
import { calculateDistance, getUserLocation } from '../utils/geo';

interface Center {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    distance?: number;
}

export const Scheduler = () => {
    const { currentUser } = useAuth();

    // Booking Flow State
    const [step, setStep] = useState(1); // 1: Therapy/Date -> 2: Center -> 3: Confirmation
    const [selectedTherapy, setSelectedTherapy] = useState(therapies[0].id);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
    const [centers, setCenters] = useState<Center[]>([]);

    // Processing State
    const [isLoadingCenters, setIsLoadingCenters] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    // Auto-Allocation State
    const [allocatedRoom, setAllocatedRoom] = useState<{ roomId: string, roomName: string } | null>(null);
    const [allocatedTherapist, setAllocatedTherapist] = useState<{ name: string, specialization: string } | null>(null);
    const [lastAppointmentId, setLastAppointmentId] = useState<string>('');

    // Fetch Centers and Calculate Distance when entering Step 2
    const handleFindCenters = async () => {
        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }
        setIsLoadingCenters(true);
        setStep(2);

        try {
            // 1. Get User Location (Mock fallback if denied)
            let userLoc = { lat: 28.6139, lng: 77.2090 }; // Default Delhi
            try {
                userLoc = await getUserLocation();
            } catch (e) {
                console.warn("Location denied, using default");
            }

            // 2. Fetch Centers from DB
            const snapshot = await getDocs(collection(db, 'centers'));
            const centerList: Center[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Center));

            // 3. Calculate Distance & Sort
            const centersWithDist = centerList.map(c => ({
                ...c,
                distance: calculateDistance(userLoc.lat, userLoc.lng, c.lat, c.lng)
            })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setCenters(centersWithDist);

        } catch (error) {
            console.error(error);
            alert("Failed to load centers.");
        } finally {
            setIsLoadingCenters(false);
        }
    };

    const handleFinalBooking = async () => {
        if (!currentUser || !selectedCenter) return;

        setIsBooking(true);
        try {
            // 1. Intelligent Resource Allocation
            const room = await ResourceManager.autoAllocateRoom(selectedDate);
            const therapist = ResourceManager.autoAllocateTherapist(selectedTherapy);

            if (!room) {
                alert("No rooms available at this center for the selected date.");
                setIsBooking(false);
                return;
            }

            setAllocatedRoom(room);
            setAllocatedTherapist(therapist);

            // 2. Persist to Firestore
            const appointmentRef = await addDoc(collection(db, 'appointments'), {
                patientId: currentUser.uid,
                patientEmail: currentUser.email,
                therapyId: selectedTherapy,
                date: selectedDate,
                centerId: selectedCenter.id,
                centerName: selectedCenter.name,
                roomId: room.roomId,
                roomName: room.roomName,
                therapistId: therapist.id,
                therapistName: therapist.name,
                status: 'Scheduled',
                createdAt: new Date().toISOString()
            });

            setLastAppointmentId(appointmentRef.id);

            // 3. Trigger Notifications
            await NotificationService.scheduleNotifications({
                id: appointmentRef.id,
                therapyId: selectedTherapy,
                date: selectedDate
            });

            setBookingComplete(true);
        } catch (error) {
            console.error("Booking failed", error);
            alert("Booking failed. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    if (bookingComplete) {
        return (
            <div className="premium-card" style={{ padding: '3rem', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1rem' }}>Booking Confirmed</h3>

                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', margin: '2rem 0', border: '1px solid #eee' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Center</span>
                            <div style={{ fontWeight: 600 }}>{selectedCenter?.name}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Vidhi</span>
                            <div style={{ fontWeight: 600 }}>{selectedTherapy}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</span>
                            <div style={{ fontWeight: 600 }}>{format(new Date(selectedDate), 'MMMM do, yyyy')}</div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Kuti (Room)</span>
                            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{allocatedRoom?.roomName}</div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Vaidya</span>
                            <div style={{ fontWeight: 600 }}>{allocatedTherapist?.name}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#e3f2fd', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <Bell size={24} color="#1976d2" />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, color: '#1565c0' }}>Alerts Armed</div>
                        <div style={{ fontSize: '0.85rem', color: '#555' }}>Instructions dispatched via SMS.</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => { setBookingComplete(false); setStep(1); }}>
                        Book Another
                    </button>
                    <button
                        onClick={() => PDFService.generateBookingReceipt({
                            id: lastAppointmentId,
                            therapyId: selectedTherapy,
                            date: selectedDate,
                            centerName: selectedCenter?.name,
                            roomName: allocatedRoom?.roomName,
                            therapistName: allocatedTherapist?.name
                        })}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '25px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                    >
                        Download PDF Receipt
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="premium-card" style={{ padding: '2rem' }}>
            {step === 1 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CalendarIcon size={24} color="var(--color-primary)" />
                        Step 1: Select Therapy & Date
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Therapy</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={selectedTherapy}
                                    onChange={(e) => setSelectedTherapy(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: 'white', appearance: 'none' }}
                                >
                                    {therapies.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.duration})</option>
                                    ))}
                                </select>
                                <Zap size={16} style={{ position: 'absolute', right: '15px', top: '15px', color: '#999' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Preferred Start Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
                            />
                        </div>

                        <button
                            onClick={handleFindCenters}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            Next: Find Nearest Center <MapPin size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={24} color="var(--color-primary)" />
                        Step 2: Select Center
                    </h3>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Showing centers nearest to your detected location.</p>

                    {isLoadingCenters ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Locating nearest Ayursutra centers...</div>
                    ) : centers.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
                            {centers.map(center => (
                                <div
                                    key={center.id}
                                    onClick={() => setSelectedCenter(center)}
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: selectedCenter?.id === center.id ? '2px solid var(--color-primary)' : '1px solid #eee',
                                        background: selectedCenter?.id === center.id ? 'var(--color-primary-light)' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{center.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{center.address}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{center.distance} km</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>away</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
                            No centers found. Please try again or register a new one.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setStep(1)}
                            style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleFinalBooking}
                            disabled={!selectedCenter || isBooking}
                            className="btn-primary"
                            style={{ flex: 2, padding: '1rem', fontSize: '1.05rem', opacity: (!selectedCenter || isBooking) ? 0.7 : 1 }}
                        >
                            {isBooking ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
