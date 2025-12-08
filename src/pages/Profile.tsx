import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Mail, Phone, MapPin, Save, Shield } from 'lucide-react';

export const Profile = () => {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState({
        displayName: '',
        phoneNumber: '',
        address: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfileData({ ...docSnap.data() } as any);
                } else {
                    // Fallback to auth data
                    setProfileData(prev => ({ ...prev, displayName: currentUser.displayName || '' }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!currentUser) return;
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                displayName: profileData.displayName,
                phoneNumber: profileData.phoneNumber,
                address: profileData.address
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
            <div className="premium-card animate-fade-in" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem' }}>
                        {profileData.displayName?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '2rem' }}>My Profile</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginTop: '0.25rem' }}>
                            <Shield size={16} />
                            <span style={{ textTransform: 'capitalize' }}>{profileData.role || 'User'}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#555' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                            <input
                                type="text"
                                value={profileData.displayName}
                                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#555' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                            <input
                                type="email"
                                value={currentUser?.email || ''}
                                disabled
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#f5f5f5', color: '#888' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#555' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                            <input
                                type="tel"
                                value={profileData.phoneNumber}
                                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                placeholder="+91 98765 43210"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#555' }}>Address</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
                            <textarea
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                placeholder="Your full address..."
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            className="btn-primary hover-lift"
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.1rem' }}
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
