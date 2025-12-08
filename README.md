# ✈️ Flight and Passenger Management System - Prototype

## Overview

This is a **fully functional prototype** of a Flight and Passenger Management System built with Node.js/Express backend and HTML/JavaScript frontend. It demonstrates the core architecture and workflows described in the Software Design Document.

### Key Features

- ✅ **Flight Search**: Find flights by origin, destination, and date
- ✅ **Booking System**: Create bookings with passenger information
- ✅ **Payment Processing**: Mock payment gateway (for demonstration)
- ✅ **Check-in**: Digital check-in with boarding pass generation
- ✅ **Booking Management**: View, modify, and cancel bookings
- ✅ **Refund Processing**: Cancel bookings and initiate refunds
- ✅ **Customer Support**: Submit support tickets

## Project Structure

```
flight-management-system/
├── server.js                 # Backend API (Express)
├── public/
│   └── index.html           # Frontend UI (HTML/CSS/JavaScript)
├── package.json             # Node.js dependencies
└── README.md               # This file
```

## Prerequisites

- **Node.js** (LTS version or later) - [Download here](https://nodejs.org)
- **npm** (comes with Node.js)
- **VS Code** (recommended)
- **A modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation & Setup

### Step 1: Install Node.js Dependencies

Open the terminal in VS Code and run:

```bash
npm install
```

This will install:
- `express` - Web framework
- `body-parser` - JSON parsing middleware
- `cors` - Cross-Origin Resource Sharing
- `uuid` - Unique identifier generation

### Step 2: Start the Server

Run the following command in the terminal:

```bash
npm start
```

Or directly:

```bash
node server.js
```

You should see:
```
========================================
✈️  Flight Management System Running
========================================
🌐 Open browser: http://localhost:3000

📌 Test Case Walkthrough:
   1. Search: NYC -> LON on 2025-10-15
   2. Book: Fill passenger details
   3. Pay: Use card number 1234-5678-9012-3456
   4. Check-in: Use PNR + Passport to check in
   5. Cancel: Test refund flow
   6. Support: Submit support tickets

Press Ctrl+C to stop the server
```

### Step 3: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## Test Walkthrough

### 1. Flight Search

1. Click on **"🔍 Book Flight"** tab
2. Leave default values:
   - Origin: `NYC`
   - Destination: `LON`
   - Date: `2025-10-15`
3. Click **"🔍 Search Flights"**
4. You should see 2 available flights
5. Click **"Select Flight"** on any flight

### 2. Create Booking

1. Enter passenger details:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Passport: `A123456789`
2. Click **"✓ Proceed to Payment"**

### 3. Process Payment

1. Card number is pre-filled: `1234-5678-9012-3456`
2. Click **"💰 Pay & Confirm"**
3. System generates a **PNR** (Booking Reference)
4. **Copy the PNR** - you'll need it for check-in!
5. Click **"Proceed to Check-In →"**

### 4. Check-in and Get Boarding Pass

1. Click **"📝 Check-In / Manage"** tab
2. Paste the PNR you copied
3. Enter the same passport number: `A123456789`
4. Click **"🔍 Find Booking"**
5. You should see the booking status: **CONFIRMED**
6. Click **"✓ Check In Now"**
7. Your **Boarding Pass** will appear with:
   - Passenger Name
   - Flight Number
   - Seat Number
   - Gate
   - Boarding Time
   - QR Code Simulation

### 5. Test Cancellation & Refund

1. Go back to **"📝 Check-In / Manage"**
2. Enter a PNR from a previous booking that hasn't been checked in
3. Click **"🔍 Find Booking"**
4. Click **"✗ Cancel & Refund"**
5. Confirm the cancellation
6. Status will change to **CANCELLED**

### 6. Customer Support

1. Click **"🆘 Support"** tab
2. Optionally enter a PNR
3. Select an issue type (e.g., "Refund Request")
4. Enter details in the text area
5. Click **"📤 Submit Support Ticket"**
6. A ticket ID will be generated

## Available Test Flights

The system includes these mock flights:

| Flight ID | Origin | Destination | Date | Time | Price | Seats |
|-----------|--------|-------------|------|------|-------|-------|
| FL001 | NYC | LON | 2025-10-15 | 10:00 | $500 | 150 |
| FL002 | NYC | PAR | 2025-10-15 | 14:00 | $450 | 120 |
| FL003 | LON | NYC | 2025-10-20 | 09:00 | $520 | 150 |
| FL004 | PAR | NYC | 2025-10-20 | 11:00 | $480 | 120 |

## API Endpoints

### Backend API Reference

All API endpoints are prefixed with `/api/`

#### 1. Search Flights
```
GET /api/flights?origin=NYC&destination=LON&date=2025-10-15
```
Returns available flights matching the criteria.

#### 2. Create Booking
```
POST /api/booking
Content-Type: application/json

{
  "flightId": "FL001",
  "passengerName": "John Doe",
  "email": "john@example.com",
  "passport": "A123456789"
}
```
Returns booking object with PNR.

#### 3. Process Payment
```
POST /api/payment
Content-Type: application/json

{
  "pnr": "PNR123456",
  "cardNumber": "1234-5678-9012-3456"
}
```
Confirms payment and issues ticket.

#### 4. Get Booking Details
```
GET /api/booking/:pnr
```
Returns full booking information.

#### 5. Check-in
```
POST /api/checkin
Content-Type: application/json

{
  "pnr": "PNR123456",
  "passport": "A123456789"
}
```
Generates boarding pass.

#### 6. Cancel Booking
```
POST /api/cancel
Content-Type: application/json

{
  "pnr": "PNR123456"
}
```
Cancels booking and initiates refund.

#### 7. Submit Support Ticket
```
POST /api/support
Content-Type: application/json

{
  "pnr": "PNR123456",
  "issueType": "Refund",
  "details": "Issue description"
}
```
Creates support ticket.

## Architecture Overview

### Backend (server.js)

The backend implements:

1. **SearchService** - Flight search logic
2. **BookingService** - Booking creation and management
3. **PaymentService** - Payment processing (mocked)
4. **InventoryService** - Flight seat management
5. **CheckinService** - Digital check-in
6. **SupportService** - Support ticket management
7. **RefundService** - Refund processing

### Frontend (index.html)

The frontend implements:

1. **Flight Search UI** - Search and select flights
2. **Booking Form** - Collect passenger information
3. **Payment Form** - Process payment (mocked)
4. **Check-in Interface** - View and manage bookings
5. **Boarding Pass Display** - QR code simulation
6. **Support Form** - Submit support tickets

### Data Storage

- **In-memory database**: All data is stored in memory during runtime
- **Data persistence**: Data is cleared when the server restarts
- **Mock data**: Pre-populated with sample flights

## Important Notes

⚠️ **This is a PROTOTYPE, not production-ready software:**

- ❌ No persistent database (data resets on restart)
- ❌ No real payment processing (mocked only)
- ❌ No email notifications (logged to console)
- ❌ No authentication/authorization
- ❌ No input validation or error handling for production use
- ❌ No scaling or load balancing
- ❌ No security measures (HTTPS, encryption, etc.)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify `server.js`:

```javascript
const PORT = 3001;  // Change to a different port
```

### Module Not Found

Run:
```bash
npm install
```

### CORS Errors

The backend already has CORS enabled, so this shouldn't be an issue.

### Frontend Not Loading

- Check if the server is running (look for the "✈️ Flight Management System Running" message)
- Try accessing `http://localhost:3000` directly
- Check browser console for errors (F12 → Console tab)

## Extending the System

To add new features:

1. **Add new API endpoints** in `server.js`
2. **Add new UI sections** in `index.html`
3. **Connect frontend to backend** using `fetch()` API
4. **Test thoroughly** before deployment

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- Lightweight and responsive
- No external dependencies for frontend (pure HTML/CSS/JS)
- Fast API responses from in-memory database
- Optimized for localhost testing

## Support

For issues or questions:

1. Check the browser console (F12)
2. Check the server terminal output
3. Verify all dependencies are installed (`npm install`)
4. Restart the server

## License

This prototype is for educational and demonstration purposes.

---

**Happy Flying!** ✈️
