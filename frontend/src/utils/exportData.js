import * as XLSX from 'xlsx';

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const prepareData = (data) => {
    // Convert data to the format needed for export
    return data.map(item => ({
        timestamp: new Date(item.timestamp).toLocaleString(),
        value: item.value,
        type: item.type,
        unit: item.unit
    }));
};

export const exportToCSV = (data, filename = 'sensor-data') => {
    const csvContent = prepareData(data).map(row => 
        Object.values(row).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${formatDate(new Date())}.csv`;
    link.click();
};

export const exportToExcel = (data, filename = 'sensor-data') => {
    const ws = XLSX.utils.json_to_sheet(prepareData(data));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data');
    XLSX.writeFile(wb, `${filename}-${formatDate(new Date())}.xlsx`);
};

export const exportToPDF = async (data, filename = 'sensor-data') => {
    // For PDF export, we'll use browser's print functionality
    const printWindow = window.open('', '_blank');
    const html = `
        <html>
            <head>
                <title>${filename}</title>
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid black; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Sensor Data Export</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Value</th>
                            <th>Type</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${prepareData(data).map(row => `
                            <tr>
                                <td>${row.timestamp}</td>
                                <td>${row.value}</td>
                                <td>${row.type}</td>
                                <td>${row.unit}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
};

// Main export function that handles all formats
export const exportData = async (data, format = 'csv', filename = 'sensor-data') => {
    switch (format.toLowerCase()) {
        case 'excel':
        case 'xlsx':
            exportToExcel(data, filename);
            break;
        case 'pdf':
            await exportToPDF(data, filename);
            break;
        case 'csv':
        default:
            exportToCSV(data, filename);
            break;
    }
}; 