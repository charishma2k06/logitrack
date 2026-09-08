const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS - allow all origins for demo/portfolio deployment
app.use(cors());

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tracking', trackingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

// TEMPORARY: One-time seed route - will be removed after use
app.get('/api/seed-now', async (req, res) => {
    try {
        const User = require('./models/User');
        const Shipment = require('./models/Shipment');
        const Vehicle = require('./models/Vehicle');
        const Order = require('./models/Order');

        await User.deleteMany();
        await Shipment.deleteMany();
        await Vehicle.deleteMany();
        await Order.deleteMany();

        const admin = await User.create({ name: 'Admin User', email: 'admin@logitrack.com', password: 'password123', role: 'Admin' });
        const manager1 = await User.create({ name: 'Manager Alpha', email: 'manager@logitrack.com', password: 'password123', role: 'Manager' });
        const drivers = await User.insertMany([
            { name: 'John Driver', email: 'driver1@logitrack.com', password: 'password123', role: 'Driver' },
            { name: 'Sarah Connor', email: 'driver2@logitrack.com', password: 'password123', role: 'Driver' },
            { name: 'Mike Wheeler', email: 'driver3@logitrack.com', password: 'password123', role: 'Driver' },
        ]);
        const customers = await User.insertMany([
            { name: 'Alice Customer', email: 'customer1@logitrack.com', password: 'password123', role: 'Customer' },
            { name: 'TechCorp Industries', email: 'techcorp@example.com', password: 'password123', role: 'Customer' },
            { name: 'Global Logistics', email: 'global@example.com', password: 'password123', role: 'Customer' },
        ]);
        const vehicles = await Vehicle.insertMany([
            { vehicleId: 'V-001', registrationNumber: 'XYZ-1234', vehicleType: 'Heavy Truck', capacity: 20000, driver: drivers[0]._id, status: 'Assigned' },
            { vehicleId: 'V-002', registrationNumber: 'ABC-9876', vehicleType: 'Van', capacity: 5000, driver: drivers[1]._id, status: 'In Transit' },
            { vehicleId: 'V-003', registrationNumber: 'NYX-1122', vehicleType: 'Van', capacity: 4500, driver: drivers[2]._id, status: 'Assigned' },
        ]);
        const statuses = ['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'];
        const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];
        const shipmentsData = [];
        for (let i = 1; i <= 15; i++) {
            const rCustomer = customers[Math.floor(Math.random() * customers.length)];
            const rDriver = drivers[Math.floor(Math.random() * drivers.length)]._id;
            const rVehicle = vehicles[Math.floor(Math.random() * vehicles.length)]._id;
            let origin = cities[Math.floor(Math.random() * cities.length)];
            let dest = cities[Math.floor(Math.random() * cities.length)];
            while (origin === dest) dest = cities[Math.floor(Math.random() * cities.length)];
            shipmentsData.push({
                shipmentId: i === 1 ? 'SHP-1001' : `SHP-${1000 + i}`,
                customer: rCustomer._id, origin, destination: dest,
                shipmentType: ['Express', 'Standard', 'Freight'][Math.floor(Math.random() * 3)],
                packageDescription: 'Corporate goods',
                weight: Math.floor(Math.random() * 1000) + 10,
                quantity: Math.floor(Math.random() * 50) + 1,
                driver: rDriver, vehicle: rVehicle,
                expectedDeliveryDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000),
                status: i === 1 ? 'In Transit' : statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)
            });
        }
        const shipments = await Shipment.insertMany(shipmentsData);
        await Order.insertMany(shipments.map((s, i) => ({
            orderId: `ORD-${5000 + i}`, customer: s.customer, shipment: s._id,
            amount: Math.floor(Math.random() * 5000) + 50,
            paymentStatus: Math.random() > 0.2 ? 'Completed' : 'Pending',
            orderStatus: s.status === 'Delivered' ? 'Completed' : 'Processing'
        })));

        res.json({ success: true, message: '✅ Database seeded! Users: admin@logitrack.com, manager@logitrack.com, driver1@logitrack.com, customer1@logitrack.com — all with password: password123' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to LogiTrack API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
