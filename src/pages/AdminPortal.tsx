import { Users, DollarSign, Activity, Settings as SettingsIcon, MapPin, Package, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { PDFService } from '../services/PDFService';
import { InventoryService, InventoryItem } from '../services/InventoryService';
import { InventoryPieChart, RevenueTrendChart } from '../components/ReportCharts';
import { therapies } from '../data/therapies';

export const AdminPortal = () => {
    const [smsLogs, setSmsLogs] = useState<any[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Fetch SMS Logs
                const logs = await getDocs(query(collection(db, 'sms_logs'), orderBy('timestamp', 'desc'), limit(5)));
                setSmsLogs(logs.docs.map(doc => doc.data()));

                // 2. Fetch Inventory
                let invItems = await InventoryService.getAllItems();
                if (invItems.length === 0) {
                    await InventoryService.seedInitialInventory(); // Auto-seed if empty
                    invItems = await InventoryService.getAllItems();
                }
                setInventory(invItems);

                // 3. Fetch Appointments for Revenue
                const appts = await getDocs(query(collection(db, 'appointments')));
                let revenue = 0;
                let patientCount = 0;
                const dailyRevenue: Record<string, number> = {};

                appts.forEach(doc => {
                    const data = doc.data();
                    const therapy = therapies.find(t => t.id === data.therapyId);
                    const price = therapy?.price || 2000; // Fallback price
                    revenue += price;
                    patientCount++;

                    // Group by Date for Chart
                    const date = data.date ? data.date.split('T')[0] : 'Unknown';
                    if (dailyRevenue[date]) dailyRevenue[date] += price;
                    else dailyRevenue[date] = price;
                });

                setTotalRevenue(revenue);
                setTotalPatients(patientCount);

                // Format for Chart (Sorted)
                const chartData = Object.keys(dailyRevenue)
                    .sort()
                    .map(date => ({ date, amount: dailyRevenue[date] }));
                setRevenueData(chartData);

            } catch (e) {
                console.error("Error loading Admin Data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleRestock = async (id: string) => {
        await InventoryService.restock(id, 500); // Simple +500 restock action
        const updated = await InventoryService.getAllItems();
        setInventory(updated);
    };

    const inventoryChartData = inventory.map(i => ({
        name: i.name,
        value: i.stockLevel
    }));

    return (
        <div className="app-shell" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="eyebrow">Administration</span>
                    <h2 className="text-3xl font-semibold">Administrator Console</h2>
                </div>
                <div className="flex gap-4">
                    <Link to="/register-center" className="btn outline flex items-center gap-2">
                        <MapPin size={18} /> Add Center
                    </Link>
                    <button
                        onClick={() => PDFService.generateSystemReport({
                            totalPatients: totalPatients.toString(),
                            activeTherapies: '5',
                            revenue: `₹${totalRevenue.toLocaleString()}`
                        })}
                        className="btn primary"
                    >
                        Download Reports
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Patients', value: totalPatients, icon: Users, color: 'text-brand-ocean', bg: 'bg-brand-sage' },
                    { label: 'Active Therapies', value: '5', icon: Activity, color: 'text-brand-teal', bg: 'bg-[#e8f5e9]' },
                    { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Inventory Items', value: inventory.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
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
                {/* Revenue Chart */}
                <div className="premium-card lg:col-span-2">
                    <h3 className="mb-6 text-xl font-semibold">Revenue Trends (₹)</h3>
                    {revenueData.length > 0 ? (
                        <RevenueTrendChart data={revenueData} />
                    ) : (
                        <div className="flex h-[300px] items-center justify-center text-gray-400">
                            No revenue data yet. Book some appointments!
                        </div>
                    )}
                </div>

                {/* Inventory Panel */}
                <div className="premium-card">
                    <h3 className="mb-6 text-xl font-semibold flex items-center gap-2">
                        <Package size={20} /> Inventory Status
                    </h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="mb-4">
                        {inventory.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b p-3 hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="font-semibold text-sm">{item.name}</div>
                                    <div className={`text-xs ${item.stockLevel < item.lowStockThreshold ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                        {item.stockLevel} {item.unit} {item.stockLevel < item.lowStockThreshold && '(LOW)'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRestock(item.id)}
                                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-full transition-colors"
                                    title="Restock +500"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div>
                        {/* Small Chart */}
                        <InventoryPieChart data={inventoryChartData} />
                    </div>
                </div>
            </div>

            {/* Logs & Alerts Row */}
            <div className="grid gap-8 lg:grid-cols-2 mt-8">
                <div className="premium-card">
                    <h3 className="mb-6 text-xl font-semibold">Recent SMS Dispatches</h3>
                    <div className="space-y-4">
                        {smsLogs.length > 0 ? smsLogs.map((log, i) => (
                            <div key={i} className="rounded-xl border-l-4 border-green-500 bg-green-50 p-4">
                                <p className="mb-1 text-sm font-medium text-brand-deep">To: {log.phoneNumber}</p>
                                <p className="text-xs text-brand-muted truncate">{log.message}</p>
                                <span className="text-[10px] uppercase tracking-wide text-green-700">Sent • {new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                        )) : (
                            <div className="text-sm text-gray-400 italic">No recent SMS logs found.</div>
                        )}
                    </div>
                </div>

                <div className="premium-card">
                    <h3 className="mb-6 text-xl font-semibold">System Alerts</h3>
                    <div className="space-y-4">
                        {[
                            { msg: "Inventory: Mahanarayan Taila is below threshold", time: "1h ago", type: "warning" },
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
