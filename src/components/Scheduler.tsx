import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, Bell, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { therapies } from '../data/therapies';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ResourceManager } from '../services/ResourceManager';
import { NotificationService } from '../services/NotificationService';
import { PDFService } from '../services/PDFService';
import { calculateDistance, getUserLocation } from '../utils/geo';
import { Calendar } from './Calendar';

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
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
    const [centers, setCenters] = useState<Center[]>([]);

    // Patient Details State
    const [patientPhone, setPatientPhone] = useState('');

    // Processing State
    const [isLoadingCenters, setIsLoadingCenters] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    // Auto-Allocation State
    const [allocatedRoom, setAllocatedRoom] = useState<{ roomId: string, roomName: string } | null>(null);
    const [allocatedTherapist, setAllocatedTherapist] = useState<{ name: string, specialization: string } | null>(null);
    const [lastAppointmentId, setLastAppointmentId] = useState<string>('');

    // Fetch User Phone on Mount
    useEffect(() => {
        const fetchUserPhone = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setPatientPhone(docSnap.data().phoneNumber || '');
                    }
                } catch (e) {
                    console.error("Error fetching phone", e);
                }
            }
        };
        fetchUserPhone();
    }, [currentUser]);

    // Fetch Centers and Calculate Distance when entering Step 2
    const handleFindCenters = async () => {
        if (!selectedDate) {
            alert('Please select a preferred date for your therapy.');
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
        if (!currentUser || !selectedCenter || !selectedDate) return;

        if (!patientPhone || patientPhone.length < 10) {
            alert("Please provide a valid phone number for appointment updates.");
            return;
        }

        setIsBooking(true);
        try {
            const dateStr = selectedDate.toISOString();
            // 1. Intelligent Resource Allocation
            const room = await ResourceManager.autoAllocateRoom(dateStr);
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
                patientPhone: patientPhone,
                therapyId: selectedTherapy,
                date: dateStr,
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
                date: dateStr,
                patientPhone: patientPhone,
                patientName: currentUser.displayName || 'Patient'
            });

            setBookingComplete(true);
        } catch (error) {
            console.error("Booking failed", error);
            alert("Booking failed. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    if (bookingComplete && selectedDate) {
        return (
            <div className="premium-card" style={{ padding: '3rem', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1rem' }}>Booking Confirmed</h3>

                <p className="text-gray-600 mb-6">
                    A confirmation SMS has been sent to <strong>{patientPhone}</strong>.
                </p>

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
                            <div style={{ fontWeight: 600 }}>{format(selectedDate, 'MMMM do, yyyy')}</div>
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
                    <button className="btn-primary" onClick={() => { setBookingComplete(false); setStep(1); setSelectedDate(null); }}>
                        Book Another
                    </button>
                    <button
                        onClick={() => PDFService.generateBookingReceipt({
                            id: lastAppointmentId,
                            therapyId: selectedTherapy,
                            date: selectedDate.toISOString(),
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
        <div className="premium-card">
            {step === 1 && (
                <div className="animate-fade-in space-y-8 p-6">
                    <h3 className="flex items-center gap-3 font-serif text-2xl text-brand-deep">
                        <CalendarIcon className="text-brand-ocean" size={28} />
                        Step 1: Select Therapy & Date
                    </h3>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Therapy Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Select Therapy</label>
                            <div className="grid gap-3">
                                {therapies.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => setSelectedTherapy(t.id)}
                                        className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedTherapy === t.id ? 'border-brand-ocean bg-brand-ocean/5 ring-1 ring-brand-ocean' : 'border-brand-deep/10 hover:border-brand-ocean/50'}`}
                                    >
                                        <div className="font-semibold text-brand-deep">{t.name}</div>
                                        <div className="text-xs text-brand-muted">{t.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Preferred Start Date</label>
                            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                            <button
                                onClick={handleFindCenters}
                                disabled={!selectedDate}
                                className="btn primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Find Nearest Center <MapPin size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div style={{ animation: 'fadeIn 0.3s', padding: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={24} color="var(--color-primary)" />
                        Step 2: Select Center & Confirm
                    </h3>

                    {/* PHONE INPUT SECTION */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-semibold text-brand-deep mb-2">Confirm Phone for SMS Alerts</label>
                        <input
                            type="tel"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            placeholder="+91 99999 99999"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">We will send booking confirmation and pre-procedure instructions here.</p>
                    </div>

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
                            disabled={!selectedCenter || isBooking || !patientPhone}
                            className="btn primary"
                            style={{ flex: 2, padding: '1rem', fontSize: '1.05rem', opacity: (!selectedCenter || isBooking || !patientPhone) ? 0.7 : 1 }}
                        >
                            {isBooking ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
