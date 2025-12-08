import { useState, useEffect } from 'react';
import { Scheduler } from '../components/Scheduler';
import { Activity, Droplet, Sun, MessageSquare, Check } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const PatientPortal = () => {
    const { currentUser } = useAuth();
    const [feedback, setFeedback] = useState('');
    const [painLevel, setPainLevel] = useState(2);
    const [sent, setSent] = useState(false);
    const [bookedTherapy, setBookedTherapy] = useState<{ name: string, date: string } | null>(null);

    // Fetch booked therapy (Simple implementation for demo)
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!currentUser) return;
            const q = query(collection(db, 'appointments'), where('patientId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();
                setBookedTherapy({ name: data.therapyId || 'Consultation', date: data.date });
            }
        };
        fetchAppointments();
    }, [currentUser]);

    const handleFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'feedback'), {
                patientId: currentUser.uid,
                email: currentUser.email,
                painLevel,
                notes: feedback,
                timestamp: new Date().toISOString()
            });
            setSent(true);
            setTimeout(() => setSent(false), 3000);
            setFeedback('');
            setPainLevel(2);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Namaste, {currentUser?.displayName || currentUser?.email?.split('@')[0]}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity color="#1565c0" /></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Next Session</div>
                                <div style={{ fontWeight: 600 }}>{bookedTherapy ? `${bookedTherapy.name} - ${bookedTherapy.date}` : 'Not Scheduled'}</div>
                            </div>
                        </div>
                        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Droplet color="#ef6c00" /></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Current Phase</div>
                                <div style={{ fontWeight: 600 }}>{bookedTherapy ? 'Preparation' : 'Assessment'}</div>
                            </div>
                        </div>
                        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sun color="#2e7d32" /></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Dosha Status</div>
                                <div style={{ fontWeight: 600 }}>Kapha Balancing</div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Your Recovery Journey</h3>
                        <div style={{ height: '20px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: bookedTherapy ? '30%' : '5%', height: '100%', background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)', transition: 'width 1s ease' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Consultation</span>
                            <span>Preparation</span>
                            <span>Main Therapy</span>
                            <span>Recovery</span>
                        </div>
                    </div>

                    <Scheduler />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="premium-card" style={{ padding: '1.5rem', background: '#fff8f3', borderLeft: '4px solid var(--color-accent)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Pre-Procedure Precautions</h4>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                            <li style={{ marginBottom: '0.5rem' }}>Consume only light, fluid diet tonight.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Drink warm water mixed with ginger.</li>
                            <li>Sleep by 10 PM.</li>
                        </ul>
                    </div>

                    {/* Feedback Form */}
                    <div className="premium-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <MessageSquare size={20} color="var(--color-primary)" />
                            <h4 style={{ margin: 0 }}>Daily Health Check</h4>
                        </div>

                        {sent ? (
                            <div style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
                                <Check size={16} /> Data saved to cloud.
                            </div>
                        ) : (
                            <form onSubmit={handleFeedback}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#555' }}>Comfort Level (1-10)</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={painLevel}
                                        onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
                                        <span>Poor</span>
                                        <span>Excellent</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#555' }}>Notes</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Describe any symptoms..."
                                        style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Report</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
