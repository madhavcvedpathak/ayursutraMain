import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save extra user details including Role to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name,
                email,
                phoneNumber,
                role,
                createdAt: new Date().toISOString()
            });

            // Redirect based on role
            if (role === 'admin') navigate('/admin');
            else if (role === 'practitioner') navigate('/practitioner');
            else navigate('/portal');

        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="premium-card" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>Create Account</h2>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                            <input
                                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Phone Number *</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }}>📞</div>
                            <input
                                type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required
                                placeholder="+91 98765 43210"
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>I am a...</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{
                                flex: 1, padding: '1rem', border: role === 'patient' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                                background: role === 'patient' ? 'var(--color-primary-light)' : 'white', color: role === 'patient' ? 'white' : 'inherit'
                            }}>
                                <input type="radio" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} style={{ display: 'none' }} />
                                Patient
                            </label>
                            <label style={{
                                flex: 1, padding: '1rem', border: role === 'practitioner' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                                background: role === 'practitioner' ? 'var(--color-primary-light)' : 'white', color: role === 'practitioner' ? 'white' : 'inherit'
                            }}>
                                <input type="radio" value="practitioner" checked={role === 'practitioner'} onChange={() => setRole('practitioner')} style={{ display: 'none' }} />
                                Doctor
                            </label>
                            <label style={{
                                flex: 1, padding: '1rem', border: role === 'admin' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                                background: role === 'admin' ? 'var(--color-primary-light)' : 'white', color: role === 'admin' ? 'white' : 'inherit'
                            }}>
                                <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} style={{ display: 'none' }} />
                                Admin
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
