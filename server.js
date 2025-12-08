const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// --- MOCK DATABASE (In-Memory) ---
// Simulates FlightRepository, BookingRepository, etc.

const flights = [
    { flightId: "FL001", origin: "NYC", destination: "LON", date: "2025-10-15", time: "10:00", price: 500, seats: 150 },
    { flightId: "FL002", origin: "NYC", destination: "PAR", date: "2025-10-15", time: "14:00", price: 450, seats: 120 },
    { flightId: "FL003", origin: "LON", destination: "NYC", date: "2025-10-20", time: "09:00", price: 520, seats: 150 },
    { flightId: "FL004", origin: "PAR", destination: "NYC", date: "2025-10-20", time: "11:00", price: 480, seats: 120 },
];

let bookings = []; // Stores PNRs
let supportTickets = [];

// --- CONTROLLERS & SERVICES ---

// 1. SEARCH CONTROLLER
app.get('/api/flights', (req, res) => {
    const { origin, destination, date } = req.query;
    console.log(`[SearchService] Searching: ${origin} -> ${destination} on ${date}`);
    
    const results = flights.filter(f => 
        f.origin.toLowerCase() === origin.toLowerCase() && 
        f.destination.toLowerCase() === destination.toLowerCase() &&
        f.date === date
    );
    res.json(results);
});

// 2. BOOKING CONTROLLER
app.post('/api/booking', (req, res) => {
    const { flightId, passengerName, email, passport } = req.body;
    
    const flight = flights.find(f => f.flightId === flightId);
    if (!flight || flight.seats <= 0) {
        return res.status(400).json({ message: "Flight unavailable" });
    }

    // Generate PNR
    const pnr = "PNR" + Math.floor(100000 + Math.random() * 900000);
    const bookingId = uuidv4();

    const newBooking = {
        bookingId,
        pnr,
        flightId,
        passenger: { passengerName, email, passport },
        status: "PENDING_PAYMENT", // Enum: BookingStatus
        totalPrice: flight.price,
        flightDetails: flight,
        ticketIssued: false,
        checkedIn: false
    };

    bookings.push(newBooking);
    console.log(`[BookingService] Created Booking ${bookingId} with PNR ${pnr}`);
    
    // Simulate Inventory Service reducing seats
    flight.seats -= 1;

    res.json(newBooking);
});

// 3. PAYMENT CONTROLLER (Simulates PaymentGateway & PaymentService)
app.post('/api/payment', (req, res) => {
    const { pnr, cardNumber } = req.body;
    const booking = bookings.find(b => b.pnr === pnr);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Mock Validation
    if (cardNumber.length < 10) return res.status(400).json({ message: "Invalid Card" });

    // Update Status
    booking.status = "CONFIRMED";
    booking.ticketIssued = true;
    
    // Simulate NotificationService
    console.log(`[NotificationService] Sending Email to ${booking.passenger.email}: Ticket Confirmed for ${pnr}`);

    res.json({ message: "Payment Successful", status: "CONFIRMED", ticketId: uuidv4() });
});

// 4. CHECK-IN CONTROLLER
app.post('/api/checkin', (req, res) => {
    const { pnr, passport } = req.body;
    const booking = bookings.find(b => b.pnr === pnr);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "CONFIRMED") return res.status(400).json({ message: "Booking not confirmed" });
    if (booking.passenger.passport !== passport) return res.status(403).json({ message: "Identity mismatch" });

    booking.checkedIn = true;
    const seatNumber = "12A"; // Mock SeatAssignmentService
    const boardingPass = {
        passenger: booking.passenger.passengerName,
        flight: booking.flightId,
        seat: seatNumber,
        gate: "B4",
        boardingTime: "09:30",
        qrCode: "dummy-qr-code-string"
    };

    console.log(`[CheckInController] Check-in successful for ${pnr}`);
    res.json({ message: "Check-in Successful", boardingPass });
});

// 5. SUPPORT CONTROLLER
app.post('/api/support', (req, res) => {
    const { pnr, issueType, details } = req.body;
    const ticketId = "TKT" + Date.now();
    
    supportTickets.push({ ticketId, pnr, issueType, details, status: "OPEN" });
    
    console.log(`[SupportService] Created ticket ${ticketId} for PNR ${pnr}`);
    res.json({ message: "Support ticket created", ticketId });
});

// 6. GET BOOKING DETAILS (For managing booking/Cancellation)
app.get('/api/booking/:pnr', (req, res) => {
    const booking = bookings.find(b => b.pnr === req.params.pnr);
    if(booking) res.json(booking);
    else res.status(404).json({message: "Not Found"});
});

// 7. CANCELLATION & REFUND
app.post('/api/cancel', (req, res) => {
    const { pnr } = req.body;
    const booking = bookings.find(b => b.pnr === pnr);
    
    if(!booking) return res.status(404).json({message: "Not Found"});

    booking.status = "CANCELLED";
    booking.ticketIssued = false;
    
    // Simulate RefundService
    console.log(`[RefundService] Initiating refund of $${booking.totalPrice} for ${pnr}`);
    
    res.json({ message: "Booking Cancelled. Refund Initiated.", status: "CANCELLED" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`✈️  Flight Management System Running`);
    console.log(`========================================`);
    console.log(`🌐 Open browser: http://localhost:${PORT}`);
    console.log(`\n📌 Test Case Walkthrough:`);
    console.log(`   1. Search: NYC -> LON on 2025-10-15`);
    console.log(`   2. Book: Fill passenger details`);
    console.log(`   3. Pay: Use card number 1234-5678-9012-3456`);
    console.log(`   4. Check-in: Use PNR + Passport to check in`);
    console.log(`   5. Cancel: Test refund flow`);
    console.log(`   6. Support: Submit support tickets\n`);
    console.log(`Press Ctrl+C to stop the server\n`);
});
