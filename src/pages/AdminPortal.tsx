import { Users, DollarSign, Activity, Settings as SettingsIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPortal = () => {
    return (
        <div className="app-shell">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="eyebrow">Administration</span>
                    <h2 className="text-3xl font-semibold">Administrator Console</h2>
                </div>
                <div className="flex gap-4">
                    <Link to="/register-center" className="btn outline flex items-center gap-2">
                        <MapPin size={18} /> Add Center
                    </Link>
                    <button className="btn primary">Download Reports</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-brand-ocean', bg: 'bg-brand-sage' },
                    { label: 'Active Therapies', value: '86', icon: Activity, color: 'text-brand-teal', bg: 'bg-[#e8f5e9]' },
                    { label: 'Revenue (Monthly)', value: '$45.2k', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'System Health', value: '98%', icon: SettingsIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((kpi, i) => (
                    <div key={i} className="premium-card flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg}`}>
                            <kpi.icon className={kpi.color} size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-brand-muted">{kpi.label}</div>
                            <div className="text-2xl font-bold text-brand-deep">{kpi.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="premium-card lg:col-span-2">
                    <h3 className="mb-6 text-xl font-semibold">Therapy Utilization</h3>
                    <div className="flex h-[300px] items-end justify-around border-b border-brand-deep/10 pb-4">
                        {/* Mock Bar Chart */}
                        {[65, 45, 80, 55, 30].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div style={{ height: `${h}%` }} className="w-10 rounded-t-md bg-brand-teal/80 transition-all hover:bg-brand-teal"></div>
                                <span className="text-xs text-brand-muted">{['Vamana', 'Vire', 'Basti', 'Nasya', 'Rakta'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="premium-card">
                    <h3 className="mb-6 text-xl font-semibold">Recent Alerts</h3>
                    <div className="space-y-4">
                        {[
                            { msg: "New practitioner registration pending approval", time: "2h ago", type: "info" },
                            { msg: "High volume of Basti bookings for next week", time: "5h ago", type: "warning" },
                            { msg: "System maintenance scheduled for Sunday", time: "1d ago", type: "info" },
                        ].map((alert, i) => (
                            <div key={i} className={`rounded-xl border-l-4 p-4 ${alert.type === 'warning' ? 'border-orange-400 bg-orange-50' : 'border-blue-400 bg-blue-50'}`}>
                                <p className="mb-2 text-sm font-medium text-brand-deep">{alert.msg}</p>
                                <span className="text-xs text-brand-muted">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
