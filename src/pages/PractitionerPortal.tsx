import { useState, useEffect } from 'react';
import { Calendar, Clipboard, LayoutDashboard, MapPin, MessageCircle, Send } from 'lucide-react';
import { MonthlyTreatmentChart, TreatmentDistributionChart } from '../components/ReportCharts';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { NotificationService } from '../services/NotificationService';
import { ResourceManager, THERAPY_ROOMS } from '../services/ResourceManager';

export const PractitionerPortal = () => {
    const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'schedule' | 'analytics' | 'center'>('center');
    const [dailyFeedback, setDailyFeedback] = useState<any[]>([]);
    const [occupancy, setOccupancy] = useState(0);
    const [smsStatus, setSmsStatus] = useState<string>('');
    const [appointments, setAppointments] = useState<any[]>([]);

    // Fetch Feedback & Occupancy
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const q = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                const feedbackData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDailyFeedback(feedbackData);
            } catch (err) {
                console.error("Error loading feedback", err);
            }
        };

        const fetchOccupancy = async () => {
            const occ = await ResourceManager.getCenterOccupancy(new Date().toISOString().split('T')[0]);
            setOccupancy(occ);
        };

        fetchFeedback();
        fetchOccupancy();
    }, []);

    // Real-time Appointments
    useEffect(() => {
        const q = query(collection(db, 'appointments'), orderBy('date', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot: any) => {
            const appts = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                patient: doc.data().patientName || 'Unknown Patient',
                therapy: doc.data().therapyId || 'Consultation',
                time: doc.data().date ? new Date(doc.data().date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
                room: doc.data().roomName || 'Waiting Area' // Fix: Map roomName from DB to 'room' used in UI
            }));
            setAppointments(appts);
        });
        return () => unsubscribe();
    }, []);

    const handleSendSMS = async (type: 'pre' | 'post') => {
        if (!selectedPatient) return;
        setSmsStatus('Sending SMS...');

        const message = type === 'pre'
            ? NotificationService.generatePreProcedureMessage('Vamana', 'Tomorrow')
            : NotificationService.generatePostProcedureMessage('Vamana');

        const result = await NotificationService.sendSMS('+919876543210', message);

        if (result.success) {
            setSmsStatus('SMS Sent! ID: ' + result.sid);
            setTimeout(() => setSmsStatus(''), 3000);
        } else {
             setSmsStatus('SMS Failed. Check Console.');
        }
    };

    const handleCallPatient = async () => {
        if (!selectedPatient) return;
        setSmsStatus('Initiating Call...'); // Reusing status state for simplicity

        // Short message for TTS (Text-to-Speech)
        const voiceMsg = "Namaste. This is a reminder from Ayursutra Center. Your Vamana therapy is scheduled for tomorrow. Please remember to drink warm water and sleep early. Do not eat heavy food tonight. We look forward to seeing you. Thank you.";

        const result = await NotificationService.makeBotCall('+919876543210', voiceMsg);

        if (result.success) {
            setSmsStatus('Call Ringing! SID: ' + result.sid);
            setTimeout(() => setSmsStatus(''), 5000);
        } else {
            setSmsStatus('Call Failed. Check Console.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* ... (Header) ... */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>Practitioner Command Center</h2>

                <div style={{ display: 'flex', gap: '0.5rem', background: '#fff', padding: '0.25rem', borderRadius: '8px', border: '1px solid #eee' }}>
                    <button
                        onClick={() => setActiveTab('center')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: activeTab === 'center' ? 'var(--color-primary-light)' : 'transparent', color: activeTab === 'center' ? 'white' : 'inherit', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        <MapPin size={18} /> Center
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: activeTab === 'schedule' ? 'var(--color-primary-light)' : 'transparent', color: activeTab === 'schedule' ? 'white' : 'inherit', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        <Clipboard size={18} /> Clinical
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: activeTab === 'analytics' ? 'var(--color-primary-light)' : 'transparent', color: activeTab === 'analytics' ? 'white' : 'inherit', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        <LayoutDashboard size={18} /> Reports
                    </button>
                </div>
            </div>

            {/* CENTER VIEW TAB */}
            {activeTab === 'center' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                        {/* Map / Grid */}
                        <div className="premium-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h3>Live Room Status</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#e0e0e0', borderRadius: '50%' }}></div> Available</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#ffa726', borderRadius: '50%' }}></div> In Use</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                {THERAPY_ROOMS.map(room => (
                                    <div key={room.id} style={{
                                        padding: '2rem',
                                        borderRadius: '12px',
                                        background: appointments.some(a => a.room === room.name && a.status === 'In Progress') ? '#fff3e0' : '#f5f5f5',
                                        border: appointments.some(a => a.room === room.name && a.status === 'In Progress') ? '1px solid #ffb74d' : '1px solid transparent',
                                        position: 'relative'
                                    }}>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{room.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{room.type} Suite • Cap: {room.capacity}</div>
                                        {appointments.find(a => a.room === room.name && a.status === 'In Progress') && (
                                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef6c00', fontSize: '0.9rem', fontWeight: 500 }}>
                                                <div style={{ width: '8px', height: '8px', background: '#ef6c00', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                                Session In Progress
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* KPI Side Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="premium-card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-primary) 0%, #2e4c34 100%)', color: 'white' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 700 }}>{occupancy}%</div>
                                <div style={{ opacity: 0.9 }}>Current Occupancy</div>
                            </div>
                            <div className="premium-card" style={{ padding: '1.5rem' }}>
                                <h4>Alerts</h4>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
                                    <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eee' }}>• Dhanvantari A needs cleaning in 10m.</div>
                                    <div>• Sushruta Suite setup required for Nasya.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                        <div className="premium-card" style={{ padding: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem' }}>Monthly Treatment Trends</h4>
                            <MonthlyTreatmentChart />
                        </div>
                        <div className="premium-card" style={{ padding: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem' }}>Therapy Distribution</h4>
                            <TreatmentDistributionChart />
                        </div>
                        <div className="premium-card" style={{ padding: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem' }}>Recent Feedback (Live)</h4>
                            <div style={{ height: '200px', overflowY: 'auto' }}>
                                {dailyFeedback.map((fb: any, i) => (
                                    <div key={i} style={{ padding: '0.75rem', marginBottom: '0.5rem', background: '#f5f5f5', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <b>Rating: {fb.painLevel}/10</b>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem' }}>{fb.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CLINICAL (SCHEDULE) TAB */}
            {activeTab === 'schedule' && (
                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                    {/* Left Col: Schedule */}
                    <div className="premium-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Today's Queue</h3>
                            <Calendar size={20} color="var(--color-primary)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {appointments.map(apt => (
                                <div
                                    key={apt.id}
                                    onClick={() => setSelectedPatient(apt.id)}
                                    style={{
                                        padding: '1rem',
                                        background: selectedPatient === apt.id ? 'var(--color-primary)' : '#f8f9fa',
                                        color: selectedPatient === apt.id ? 'white' : 'inherit',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{apt.patient}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{apt.therapy} • {apt.time}</div>
                                </div>
                            ))}
                            {appointments.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>No patients scheduled.</div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Details & SMS Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {selectedPatient ? (
                            <div className="premium-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <h3>{appointments.find(a => a.id === selectedPatient)?.patient}</h3>
                                    <div style={{ background: '#e3f2fd', color: '#1565c0', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                                        {appointments.find(a => a.id === selectedPatient)?.status}
                                    </div>
                                </div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageCircle size={18} /> Automated Notifications
                                </h4>
                                <div style={{ background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <button
                                            onClick={() => handleSendSMS('pre')}
                                            style={{
                                                flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-primary)',
                                                background: 'white', color: 'var(--color-primary)', display: 'flex', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer'
                                            }}
                                        >
                                            <Send size={16} /> Send Pre-Op SMS
                                        </button>
                                        <button
                                            onClick={() => handleSendSMS('post')}
                                            style={{
                                                flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-primary)',
                                                background: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer'
                                            }}
                                        >
                                            <Send size={16} /> Send Recovery SMS
                                        </button>
                                        {/* VOICE CALL BUTTON */}
                                        <button
                                            onClick={handleCallPatient}
                                            style={{
                                                flex: 1, padding: '0.75rem', borderRadius: '6px', border: 'none',
                                                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)', color: 'white', display: 'flex', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer',
                                                boxShadow: '0 4px 10px rgba(21, 101, 192, 0.2)'
                                            }}
                                        >
                                            <MessageCircle size={16} /> Auto-Call Bot
                                        </button>
                                    </div>
                                    {smsStatus && (
                                        <div style={{ fontSize: '0.9rem', color: smsStatus.includes('Sent') || smsStatus.includes('Ringing') ? 'green' : '#666', textAlign: 'center', fontWeight: 600 }}>
                                            {smsStatus}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#999', textAlign: 'center', padding: '3rem' }}>Select a patient to view notification controls.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
