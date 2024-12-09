export const exportSensorData = (data) => {
    const formattedData = Object.entries(data).reduce((acc, [type, values]) => {
        acc[type] = values.map(item => ({
            ...item,
            timestamp: new Date(item.time).toISOString()
        }));
        return acc;
    }, {});

    return formattedData;
};

export const filterDataByDateRange = (data, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return Object.entries(data).reduce((acc, [type, values]) => {
        acc[type] = values.filter(item => {
            const itemDate = new Date(item.time);
            return itemDate >= start && itemDate <= end;
        });
        return acc;
    }, {});
};

export const checkThresholds = (value, type, thresholds) => {
    if (!thresholds[type]) return false;
    const { min, max } = thresholds[type];
    return value < min || value > max;
}; 