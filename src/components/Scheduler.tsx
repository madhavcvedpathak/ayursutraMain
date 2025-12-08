import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, Cpu, Zap, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { therapies } from '../data/therapies';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ResourceManager } from '../services/ResourceManager';
import { NotificationService } from '../services/NotificationService';

export const Scheduler = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [selectedTherapy, setSelectedTherapy] = useState(therapies[0].id);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    // Auto-Allocation State
    const [allocatedRoom, setAllocatedRoom] = useState<{ roomId: string, roomName: string } | null>(null);
    const [allocatedTherapist, setAllocatedTherapist] = useState<{ name: string, specialization: string } | null>(null);

    const handleBooking = async () => {
        if (!currentUser) {
            alert("Please login to book an appointment.");
            navigate('/login');
            return;
        }

        if (!selectedDate) {
            alert('Please select a preferred date.');
            return;
        }

        setIsBooking(true);
        try {
            // 1. Intelligent Resource Allocation
            const room = await ResourceManager.autoAllocateRoom(selectedDate);
            const therapist = ResourceManager.autoAllocateTherapist(selectedTherapy);

            if (!room) {
                alert("No rooms available for the selected date. Please try another day.");
                setIsBooking(false);
                return;
            }

            setAllocatedRoom(room);
            setAllocatedTherapist(therapist);

            // 2. Persist to Database with Resources
            const appointmentRef = await addDoc(collection(db, 'appointments'), {
                patientId: currentUser.uid,
                patientEmail: currentUser.email,
                therapyId: selectedTherapy,
                date: selectedDate,
                roomId: room.roomId,
                roomName: room.roomName,
                therapistId: therapist.id,
                therapistName: therapist.name,
                status: 'Scheduled',
                createdAt: new Date().toISOString()
            });

            // 3. Trigger Automated Notifications
            await NotificationService.scheduleNotifications({
                id: appointmentRef.id,
                therapyId: selectedTherapy,
                date: selectedDate
            });

            setBookingComplete(true);
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("Failed to book booking. Please try again.");
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
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Vidhi (Strategy)</span>
                            <div style={{ fontWeight: 600 }}>{selectedTherapy}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Muhurat (Date)</span>
                            <div style={{ fontWeight: 600 }}>{format(new Date(selectedDate), 'MMMM do, yyyy')}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Kuti (Room)</span>
                            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{allocatedRoom?.roomName}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Vaidya (Expert)</span>
                            <div style={{ fontWeight: 600 }}>{allocatedTherapist?.name}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#e3f2fd', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <Bell size={24} color="#1976d2" />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, color: '#1565c0' }}>Automated Alerts Armed</div>
                        <div style={{ fontSize: '0.85rem', color: '#555' }}>
                            <b>Purvakarma</b> and <b>Paschatkarma</b> instructions have been scheduled via SMS/Email for your procedure timings.
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { setBookingComplete(false); setAllocatedRoom(null); }}
                    className="btn-primary"
                >
                    Book Another Session
                </button>
            </div>
        );
    }

    return (
        <div className="premium-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CalendarIcon size={24} color="var(--color-primary)" />
                Schedule Panchakarma Session
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#444' }}>Select Therapy</label>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#444' }}>Preferred Start Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #4caf50', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <Cpu size={24} color="#4caf50" style={{ marginTop: '2px' }} />
                    <div>
                        <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: '0.25rem' }}>AI Resource Allocation Active</div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
                            Our system will automatically assign the best available <b>Kuti (Room)</b> and <b>Vaidya (Expert)</b> for your session based on real-time center occupancy.
                        </p>
                    </div>
                </div>

                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        <Clock size={18} />
                        Estimated Duration
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {therapies.find(t => t.id === selectedTherapy)?.duration} • Includes consultation and post-therapy observation.
                    </p>
                </div>

                <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', opacity: isBooking ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {isBooking ? 'Optimizing Schedule...' : <>Confirm & Auto-Allocate <Zap size={18} fill="white" /></>}
                </button>
            </div>
        </div>
    );
};
