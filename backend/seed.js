const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Shipment = require('./models/Shipment');
const Vehicle = require('./models/Vehicle');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Shipment.deleteMany();
        await Vehicle.deleteMany();
        await Order.deleteMany();

        // -----------------------------------------
        // 1. Create System Users (Admins & Managers)
        // -----------------------------------------
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@logitrack.com',
            password: 'password123',
            role: 'Admin'
        });

        const manager1 = await User.create({ name: 'Manager Alpha', email: 'manager@logitrack.com', password: 'password123', role: 'Manager' });
        const manager2 = await User.create({ name: 'Manager Bravo', email: 'manager2@logitrack.com', password: 'password123', role: 'Manager' });

        // -----------------------------------------
        // 2. Create Drivers
        // -----------------------------------------
        const drivers = await User.create([
            { name: 'John Driver', email: 'driver1@logitrack.com', password: 'password123', role: 'Driver' },
            { name: 'Sarah Connor', email: 'driver2@logitrack.com', password: 'password123', role: 'Driver' },
            { name: 'Mike Wheeler', email: 'driver3@logitrack.com', password: 'password123', role: 'Driver' },
            { name: 'Luke Hobbs', email: 'driver4@logitrack.com', password: 'password123', role: 'Driver' },
            { name: 'Brian OConner', email: 'driver5@logitrack.com', password: 'password123', role: 'Driver' },
        ]);

        // -----------------------------------------
        // 3. Create Customers
        // -----------------------------------------
        const customers = await User.create([
            { name: 'Alice Customer', email: 'customer1@logitrack.com', password: 'password123', role: 'Customer' },
            { name: 'TechCorp Industries', email: 'techcorp@example.com', password: 'password123', role: 'Customer' },
            { name: 'Global Logistics', email: 'global@example.com', password: 'password123', role: 'Customer' },
            { name: 'Retail Giant Ltd', email: 'retail@example.com', password: 'password123', role: 'Customer' },
            { name: 'Startup Inc.', email: 'startup@example.com', password: 'password123', role: 'Customer' },
        ]);

        // -----------------------------------------
        // 4. Create Vehicles
        // -----------------------------------------
        const vehiclesData = [
            { vehicleId: 'V-001', registrationNumber: 'XYZ-1234', vehicleType: 'Heavy Truck', capacity: 20000, driver: drivers[0]._id, status: 'Assigned' },
            { vehicleId: 'V-002', registrationNumber: 'ABC-9876', vehicleType: 'Van', capacity: 5000, driver: drivers[1]._id, status: 'In Transit' },
            { vehicleId: 'V-003', registrationNumber: 'NYX-1122', vehicleType: 'Van', capacity: 4500, driver: drivers[2]._id, status: 'Assigned' },
            { vehicleId: 'V-004', registrationNumber: 'SFX-9988', vehicleType: 'Pickup', capacity: 2000, driver: drivers[3]._id, status: 'Available' },
            { vehicleId: 'V-005', registrationNumber: 'TEX-5544', vehicleType: 'Heavy Truck', capacity: 25000, driver: drivers[4]._id, status: 'Maintenance' },
        ];
        const vehicles = await Vehicle.insertMany(vehiclesData);

        // -----------------------------------------
        // 5. Create Shipments 
        // -----------------------------------------
        // Generating multiple diverse shipments to make dashboard look populated
        const statuses = ['Pending', 'Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];
        const types = ['Express', 'Standard', 'Freight'];
        const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'];

        const shipmentsData = [];
        for (let i = 1; i <= 25; i++) {
            // Randomly assign fields
            const rCustomer = customers[Math.floor(Math.random() * customers.length)];
            const rDriver = Math.random() > 0.3 ? drivers[Math.floor(Math.random() * drivers.length)]._id : null;
            const rVehicle = rDriver ? vehicles[drivers.findIndex(d => d._id === rDriver)]?._id : null;

            let origin = cities[Math.floor(Math.random() * cities.length)];
            let dest = cities[Math.floor(Math.random() * cities.length)];
            while (origin === dest) dest = cities[Math.floor(Math.random() * cities.length)];

            // Ensure tracking "SHP-1001" exists specifically for the instructions
            const sId = i === 1 ? 'SHP-1001' : `SHP-${1000 + i}`;

            shipmentsData.push({
                shipmentId: sId,
                customer: rCustomer._id,
                origin: origin,
                destination: dest,
                shipmentType: types[Math.floor(Math.random() * types.length)],
                packageDescription: 'Miscellaneous corporate goods',
                weight: Math.floor(Math.random() * 1000) + 10,
                quantity: Math.floor(Math.random() * 50) + 1,
                driver: rDriver,
                vehicle: rVehicle,
                expectedDeliveryDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000), // Next 10 days
                status: i === 1 ? 'In Transit' : statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) // Past 15 days
            });
        }

        const shipments = await Shipment.insertMany(shipmentsData);

        // -----------------------------------------
        // 6. Create Orders
        // -----------------------------------------
        const ordersData = shipments.map((shipment, index) => ({
            orderId: `ORD-${5000 + index}`,
            customer: shipment.customer,
            shipment: shipment._id,
            amount: Math.floor(Math.random() * 5000) + 50,
            paymentStatus: Math.random() > 0.2 ? 'Completed' : 'Pending',
            orderStatus: shipment.status === 'Delivered' ? 'Completed' : 'Processing'
        }));

        await Order.insertMany(ordersData);

        console.log('Sample Realistic Data Successfully Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedData();
