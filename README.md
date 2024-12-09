# IoT Sensor Dashboard

A real-time dashboard for monitoring IoT sensor data with advanced visualization features.

## Features

- Real-time sensor data monitoring
- Multiple visualization options (Line, Bar, Area charts)
- Dark/Light theme support
- Data export capabilities (CSV, Excel, PDF)
- Interactive charts with zoom and pan functionality
- Customizable refresh intervals
- Notification system with sound alerts
- Temperature unit conversion (Celsius, Fahrenheit, Kelvin)
- Responsive design

## Tech Stack

- **Frontend:**
  - React
  - Material-UI
  - Recharts
  - XLSX for data export
  
- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - WebSocket for real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/iot-sensor-dashboard.git
cd iot-sensor-dashboard
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment files:

Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iot-dashboard
```

4. Start the development servers:

In the backend directory:
```bash
npm run dev
```

In the frontend directory:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

### Backend Configuration
- Port: 5000 (default)
- Database: MongoDB
- WebSocket enabled for real-time updates

### Frontend Configuration
- Port: 3000 (default)
- Proxy configured to backend
- Responsive design breakpoints customizable

## Usage

1. Start the backend server
2. Start the frontend development server
3. Access the dashboard at `http://localhost:3000`
4. Use the interface to:
   - View real-time sensor data
   - Export data in various formats
   - Customize chart views
   - Set up notifications
   - Configure display settings

## Development

### Project Structure
```
iot-sensor-dashboard/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── utils/
│       └── App.js
└── README.md
```

### Available Scripts

Backend:
- `npm run dev`: Start development server
- `npm start`: Start production server
- `npm test`: Run tests

Frontend:
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- Recharts for the charting library
- Create React App for the project setup 