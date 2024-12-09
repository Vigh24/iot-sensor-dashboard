import { 
    LineChart, 
    Line, 
    AreaChart, 
    Area, 
    BarChart, 
    Bar,
    PieChart,
    Pie,
    ComposedChart,
    Scatter,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell,
    Brush,
    ReferenceArea
} from 'recharts';
import ZoomableChart from '../components/ZoomableChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const renderChart = (type, data, config = {}, darkMode = false) => {
    const { smoothing = 0 } = config;

    // Common chart components
    const commonComponents = [
        <CartesianGrid 
            strokeDasharray="3 3" 
            key="grid"
            stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
        />,
        <XAxis 
            dataKey="time" 
            key="x-axis"
            tick={{ fontSize: 12, fill: darkMode ? '#fff' : '#666' }}
            tickMargin={10}
            stroke={darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
            height={50}
        />,
        <YAxis 
            key="y-axis"
            tick={{ fontSize: 12, fill: darkMode ? '#fff' : '#666' }}
            tickMargin={10}
            stroke={darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
        />,
        <Tooltip 
            key="tooltip"
            contentStyle={{ 
                backgroundColor: darkMode ? '#333' : 'rgba(255,255,255,0.9)',
                border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
                borderRadius: '4px',
                color: darkMode ? '#fff' : '#333'
            }}
        />,
        <Legend 
            key="legend"
            wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '12px',
                color: darkMode ? '#fff' : '#333'
            }}
        />,
        <Brush
            key="brush"
            dataKey="time"
            height={30}
            stroke={darkMode ? '#90caf9' : '#8884d8'}
            fill={darkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(136, 132, 216, 0.1)'}
            travellerWidth={10}
            y={250}
            startIndex={Math.max(0, data.length - 10)}
            padding={{ top: 15 }}
            style={{
                '.recharts-brush-texts': {
                    fill: darkMode ? '#fff' : '#666',
                },
                '.recharts-brush-slide': {
                    fill: darkMode ? 'rgba(144, 202, 249, 0.2)' : 'rgba(136, 132, 216, 0.2)',
                    stroke: darkMode ? '#90caf9' : '#8884d8',
                }
            }}
        />
    ];

    const chartProps = {
        width: '100%',
        height: 400,
        data: data,
        margin: { top: 10, right: 30, left: 10, bottom: 60 },
        style: {
            backgroundColor: darkMode ? 'transparent' : 'transparent'
        }
    };

    switch (type) {
        case 'area':
            return (
                <ZoomableChart ChartComponent={AreaChart} data={data}>
                    {commonComponents}
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        name="Value"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={750}
                        animationEasing="ease-out"
                    />
                </ZoomableChart>
            );

        case 'bar':
            return (
                <ZoomableChart ChartComponent={BarChart} data={data}>
                    {commonComponents}
                    <Bar 
                        dataKey="value" 
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                        name="Value"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={750}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                            />
                        ))}
                    </Bar>
                </ZoomableChart>
            );

        case 'line':
        default:
            return (
                <ZoomableChart ChartComponent={LineChart} data={data}>
                    {commonComponents}
                    <Line 
                        type={smoothing > 0 ? "monotone" : "linear"}
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Value"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={750}
                        animationEasing="ease-out"
                    />
                </ZoomableChart>
            );
    }
};

export const processData = (data, timeRange, smoothing) => {
    // Filter by time range
    const now = Date.now();
    const filtered = data.filter(item => {
        const itemTime = new Date(item.timestamp).getTime();
        return now - itemTime <= timeRange * 60 * 1000;
    });

    // Apply smoothing if needed
    if (smoothing > 0) {
        return applySmoothing(filtered, smoothing);
    }

    return filtered;
};

const applySmoothing = (data, factor) => {
    const smoothingWindow = Math.max(2, Math.floor(data.length * (factor / 100)));
    return data.map((point, index) => {
        const start = Math.max(0, index - smoothingWindow);
        const end = Math.min(data.length, index + smoothingWindow + 1);
        const values = data.slice(start, end).map(p => p.value);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return { ...point, value: avg };
    });
}; 