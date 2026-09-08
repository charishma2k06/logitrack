# LogiTrack - Logistics Management System

LogiTrack is a modern, full-stack Logistics Management System that helps logistics companies manage customers, shipments, orders, drivers, vehicles, deliveries, and operational activities from a centralized web application.

## Technologies Used

- **Frontend:** React.js, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `backend/.env`:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Run the seed script to populate sample data:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Credentials

The backend seed script creates the following demo accounts (Password for all: `password123`):

- **Admin Account**: `admin@logitrack.com`
- **Manager Account**: `manager@logitrack.com`
- **Driver Account**: `driver1@logitrack.com`
- **Customer Account**: `customer1@logitrack.com`

You can use the tracking number `SHP-1234` in the Tracking page to view a sample simulated shipment.

## Resume Bullet Points

- Built a full-stack logistics management system with React.js, Node.js, Express, and MongoDB, enabling role-based access for admins, managers, drivers, and customers to manage shipments and workflows.
- Implemented real-time tracking dashboards featuring dynamic state-based routing and intuitive visual timelines to monitor "Pending" to "Delivered" shipments securely via JWT authentication.
- Designed scalable RESTful APIs with efficient MongoDB aggregations to track inventory, orders, and vehicle assignments, optimizing frontend data rendering for responsive modern UI components utilizing Tailwind CSS.
