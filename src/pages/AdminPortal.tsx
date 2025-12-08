import { Users, DollarSign, Activity, Settings as SettingsIcon } from 'lucide-react';

export const AdminPortal = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>Administrator Console</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" style={{ background: '#333' }}>Download Reports</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Total Patients', value: '1,248', icon: Users, color: '#1565c0', bg: '#e3f2fd' },
                    { label: 'Active Therapies', value: '86', icon: Activity, color: '#2e7d32', bg: '#e8f5e9' },
                    { label: 'Revenue (Monthly)', value: '$45.2k', icon: DollarSign, color: '#ef6c00', bg: '#fff3e0' },
                    { label: 'System Health', value: '98%', icon: SettingsIcon, color: '#6a1b9a', bg: '#f3e5f5' },
                ].map((kpi, i) => (
                    <div key={i} className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <kpi.icon color={kpi.color} size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>{kpi.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>{kpi.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="premium-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Therapy Utilization</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                        {/* Mock Bar Chart */}
                        {[65, 45, 80, 55, 30].map((h, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '40px', height: `${h}%`, background: 'var(--color-primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>{['Vamana', 'Vire', 'Basti', 'Nasya', 'Rakta'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="premium-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { msg: "New practitioner registration pending approval", time: "2h ago", type: "info" },
                            { msg: "High volume of Basti bookings for next week", time: "5h ago", type: "warning" },
                            { msg: "System maintenance scheduled for Sunday", time: "1d ago", type: "info" },
                        ].map((alert, i) => (
                            <div key={i} style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', borderLeft: `3px solid ${alert.type === 'warning' ? '#ff9800' : '#2196f3'}` }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{alert.msg}</p>
                                <span style={{ fontSize: '0.75rem', color: '#999' }}>{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
