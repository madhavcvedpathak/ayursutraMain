import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#5c7c51', '#c4a484', '#d4af37', '#2c3e2d'];

export const MonthlyTreatmentChart = () => {
    const data = [
        { name: 'Jan', sessions: 65 },
        { name: 'Feb', sessions: 59 },
        { name: 'Mar', sessions: 80 },
        { name: 'Apr', sessions: 81 },
        { name: 'May', sessions: 96 },
        { name: 'Jun', sessions: 110 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="sessions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const TreatmentDistributionChart = () => {
    const data = [
        { name: 'Vamana', value: 400 },
        { name: 'Virechana', value: 300 },
        { name: 'Basti', value: 300 },
        { name: 'Nasya', value: 200 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const GenderDemographicsChart = () => {
    const data = [
        { name: 'Jan', Male: 40, Female: 24 },
        { name: 'Feb', Male: 30, Female: 13 },
        { name: 'Mar', Male: 20, Female: 58 },
        { name: 'Apr', Male: 27, Female: 39 },
        { name: 'May', Male: 18, Female: 48 },
        { name: 'Jun', Male: 23, Female: 38 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend />
                <Bar dataKey="Male" stackId="a" fill="var(--color-secondary)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Female" stackId="a" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const PatientProgressLineChart = () => {
    const data = [
        { day: 'Day 1', score: 30 },
        { day: 'Day 2', score: 45 },
        { day: 'Day 3', score: 50 },
        { day: 'Day 4', score: 70 },
        { day: 'Day 5', score: 65 }, // Detox dip
        { day: 'Day 6', score: 85 },
        { day: 'Day 7', score: 90 },
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export const InventoryPieChart = ({ data }: { data: any[] }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const RevenueTrendChart = ({ data }: { data: any[] }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="amount" stroke="#d4af37" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};
