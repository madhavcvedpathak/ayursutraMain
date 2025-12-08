import { useState, useEffect } from 'react';
import { Scheduler } from '../components/Scheduler';
import { Activity, Droplet, Sun, MessageSquare, Check, FileText, AlertTriangle, Phone } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { PDFService } from '../services/PDFService';

export const PatientPortal = () => {
    const { currentUser } = useAuth();
    const [feedback, setFeedback] = useState('');
    const [painLevel, setPainLevel] = useState(2);
    const [sent, setSent] = useState(false);
    const [bookedTherapy, setBookedTherapy] = useState<{ id: string, name: string, date: string, status: string } | null>(null);
    const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);

    // Safety Protocol State
    const [showSafetyModal, setShowSafetyModal] = useState(false);
    const [reactionType, setReactionType] = useState('nausea');

    // Fetch booked therapy and feedback history
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;

            // 1. Appointments
            const qAppt = query(collection(db, 'appointments'), where('patientId', '==', currentUser.uid));
            const apptSnapshot = await getDocs(qAppt);
            if (!apptSnapshot.empty) {
                const data = apptSnapshot.docs[0].data();
                setBookedTherapy({ id: apptSnapshot.docs[0].id, name: data.therapyId || 'Consultation', date: data.date, status: data.status });
            }

            // 2. Feedback History
            try {
                const qFeedback = query(collection(db, 'feedback'), where('patientId', '==', currentUser.uid));
                const feedbackSnapshot = await getDocs(qFeedback);
                const history = feedbackSnapshot.docs.map(doc => doc.data());
                setFeedbackHistory(history);
            } catch (e) {
                console.warn("Could not fetch feedback history", e);
            }
        };
        fetchData();
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

    const handleAdverseReaction = async (action: 'consult' | 'cancel') => {
        if (!currentUser || !bookedTherapy) return;

        try {
            const status = action === 'cancel' ? 'Cancelled (Medical)' : 'Flagged (Reaction)';

            // Update Appointment Status
            await updateDoc(doc(db, 'appointments', bookedTherapy.id), {
                status: status,
                adverseReaction: reactionType,
                lastUpdated: new Date().toISOString()
            });

            // Log Incident
            await addDoc(collection(db, 'incidents'), {
                patientId: currentUser.uid,
                appointmentId: bookedTherapy.id,
                type: reactionType,
                action: action,
                timestamp: new Date().toISOString()
            });

            alert(action === 'cancel'
                ? "Therapy cancelled. A doctor will start a follow-up call shortly."
                : "Request sent! A Vaidya is reviewing your file and will call you.");

            setShowSafetyModal(false);
            setBookedTherapy({ ...bookedTherapy, status });

        } catch (error) {
            console.error("Error reporting reaction", error);
            alert("Failed to send alert. Please call the center directly.");
        }
    }

    const isTherapyComplete = bookedTherapy && new Date() > new Date(bookedTherapy.date);

    return (
        <div className="app-shell" style={{ maxWidth: '1200px' }}>
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <span className="eyebrow">Patient Dashboard</span>
                    <h2 className="text-3xl font-semibold text-brand-deep">Namaste, {currentUser?.displayName || currentUser?.email?.split('@')[0]}</h2>
                </div>
                {bookedTherapy && bookedTherapy.status !== 'Cancelled (Medical)' && (
                    <button
                        onClick={() => setShowSafetyModal(true)}
                        className="btn outline flex items-center gap-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                        <AlertTriangle size={18} /> Report Adverse Reaction
                    </button>
                )}
            </div>

            {/* Safety Modal */}
            {showSafetyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
                        <div className="mb-4 flex items-center gap-3 text-red-600">
                            <AlertTriangle size={32} />
                            <h3 className="text-xl font-bold">Safety Protocol</h3>
                        </div>
                        <p className="mb-4 text-brand-deep">Please select what you are experiencing:</p>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                            {['Nausea / Vomiting', 'Skin Rash / Itching', 'Dizziness', 'Excessive Fatigue'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setReactionType(s)}
                                    className={`rounded-lg border p-3 text-sm font-medium transition ${reactionType === s ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-200'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={() => handleAdverseReaction('consult')} className="btn primary w-full flex items-center justify-center gap-2">
                                <Phone size={18} /> Request Immediate Consult
                            </button>
                            <button onClick={() => handleAdverseReaction('cancel')} className="btn outline w-full border-red-200 text-red-600 hover:bg-red-50">
                                Stop/Cancel Therapy
                            </button>
                            <button onClick={() => setShowSafetyModal(false)} className="text-xs text-brand-muted underline mt-2 text-center">
                                I mistakenly clicked this
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                <div className="flex flex-col gap-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {[
                            { label: 'Next Session', value: bookedTherapy ? `${bookedTherapy.name}` : 'Not Scheduled', icon: Activity, color: 'text-blue-700', bg: 'bg-blue-50' },
                            { label: 'Status', value: bookedTherapy?.status || 'Active', icon: Droplet, color: 'text-orange-700', bg: 'bg-orange-50' },
                            { label: 'Dosha', value: 'Kapha', icon: Sun, color: 'text-green-700', bg: 'bg-green-50' },
                        ].map((stat, i) => (
                            <div key={i} className="premium-card flex flex-col gap-2">
                                <div className={`w-fit rounded-full p-2 ${stat.bg}`}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <div>
                                    <div className="text-xs text-brand-muted">{stat.label}</div>
                                    <div className="font-semibold text-brand-deep truncate" title={stat.value}>{stat.value}</div>
                                </div>
                            </div>
                        ))}
                        <div
                            className="premium-card flex flex-col gap-2 cursor-pointer border-brand-primary/20 hover:bg-brand-sage/20"
                            onClick={() => PDFService.generateMedicalReport(currentUser?.displayName || 'Patient', feedbackHistory)}
                        >
                            <div className="w-fit rounded-full bg-pink-50 p-2">
                                <FileText size={20} className="text-pink-700" />
                            </div>
                            <div>
                                <div className="text-xs text-brand-muted">Medical Report</div>
                                <div className="font-semibold text-brand-ocean">Download PDF</div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-8">
                        <h3 className="mb-4 text-xl font-semibold text-brand-primary">Your Recovery Journey</h3>
                        <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-brand-teal to-brand-ocean transition-all duration-1000"
                                style={{ width: bookedTherapy ? (bookedTherapy.status.includes('Cancelled') ? '0%' : '30%') : '5%' }}
                            ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-medium text-brand-muted uppercase tracking-wide">
                            <span className="text-brand-ocean">Consultation</span>
                            <span>Preparation</span>
                            <span>Main Therapy</span>
                            <span>Recovery</span>
                        </div>
                    </div>

                    <Scheduler />
                </div>

                <div className="flex flex-col gap-8">
                    <div className="premium-card border-l-4 border-l-brand-teal bg-brand-sage/10 p-6">
                        <h4 className="mb-2 font-serif text-lg font-semibold">Pre-Procedure Precautions</h4>
                        <ul className="list-disc space-y-2 pl-4 text-sm text-brand-deep/80">
                            <li>Consume only light, fluid diet tonight.</li>
                            <li>Drink warm water mixed with ginger.</li>
                            <li>Sleep by 10 PM.</li>
                        </ul>
                    </div>

                    {/* Feedback Form - Only Show if Therapy Completed or Active */}
                    {isTherapyComplete && (
                        <div className="premium-card">
                            <div className="mb-4 flex items-center gap-2 text-brand-ocean">
                                <MessageSquare size={20} />
                                <h4 className="font-serif text-lg font-bold">Post-Therapy Check</h4>
                            </div>

                            {sent ? (
                                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
                                    <Check size={16} /> Feedback received.
                                </div>
                            ) : (
                                <form onSubmit={handleFeedback} className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase text-brand-muted">Comfort Level (1-10)</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={painLevel}
                                            onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                            className="w-full accent-brand-ocean"
                                        />
                                        <div className="flex justify-between text-xs text-brand-muted">
                                            <span>Poor</span>
                                            <span>Excellent</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase text-brand-muted">Notes</label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Describe any symptoms..."
                                            className="min-h-[100px] w-full resize-none"
                                        />
                                    </div>
                                    <button type="submit" className="btn primary w-full">Submit Report</button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
