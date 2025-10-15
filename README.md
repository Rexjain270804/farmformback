# Farmer Form Backend

This is the backend application for the Farmer Form project built with Node.js, Express, and MongoDB.

## Features

- User registration and management
- MongoDB database integration
- Razorpay payment integration
- RESTful API endpoints
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Razorpay account for payment processing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rexjain270804/farmformback.git
   cd farmformback
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/register` - Register a new user
- `GET /api/users` - Get all users
- `POST /api/payment` - Process payment with Razorpay

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Payment Gateway**: Razorpay
- **CORS**: Enabled for cross-origin requests

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.