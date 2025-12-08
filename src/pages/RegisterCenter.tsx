import { useState } from 'react';
import { MapPin, Navigation, Save, Building } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getUserLocation } from '../utils/geo';
import { useNavigate } from 'react-router-dom';

export const RegisterCenter = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        capacity: 10,
        phone: '',
        lat: 0,
        lng: 0,
        description: ''
    });

    const handleDetectLocation = async () => {
        setLocationStatus('Detecting...');
        try {
            const loc = await getUserLocation();
            setFormData(prev => ({ ...prev, lat: loc.lat, lng: loc.lng }));
            setLocationStatus('Coordinates Captured!');
        } catch (error) {
            console.error(error);
            setLocationStatus('Detection Failed. Enter manually.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await addDoc(collection(db, 'centers'), {
                ...formData,
                createdAt: new Date().toISOString()
            });
            alert('Center Registered Successfully!');
            navigate('/admin');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error registering center.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '4rem 2rem', background: 'linear-gradient(180deg, #f3f4f6 0%, #fff 100%)', minHeight: '100vh' }}>
            <div className="premium-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '0', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-primary)', padding: '2rem', color: 'white', textAlign: 'center' }}>
                    <Building size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Register New Center</h2>
                    <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Expand the Ayursutra Network</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Center Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Ayursutra Bliss Rishikesh"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Room Capacity</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Address</label>
                        <textarea
                            required
                            placeholder="Street, City, State, Zip"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '80px', fontFamily: 'inherit' }}
                        />
                    </div>

                    {/* GPS Section */}
                    <div style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={18} color="var(--color-primary)" /> Geographic Coordinates
                            </label>
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                style={{
                                    background: 'var(--color-secondary)', color: 'white', border: 'none',
                                    padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
                                }}
                            >
                                <Navigation size={14} /> Detect My Location
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Latitude"
                                    step="any"
                                    value={formData.lat}
                                    onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    step="any"
                                    value={formData.lng}
                                    onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', background: 'white' }}
                                />
                            </div>
                        </div>
                        {locationStatus && <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: locationStatus.includes('Failed') ? 'red' : 'green' }}>{locationStatus}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    >
                        {isLoading ? 'Registering...' : <><Save size={20} /> Register Center</>}
                    </button>
                </form>
            </div>
        </div>
    );
};
