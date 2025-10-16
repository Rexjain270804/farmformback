# Farmer Form Backend

This is the backend application for the Farmer Form project built with Node.js, Express, and MongoDB.

## Features

- User registration and management
- **Multi-crop registration support** - Farmers can register multiple crops with detailed information
- MongoDB database integration
- Razorpay payment integration (₹300 registration fee)
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
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
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

- `POST /api/create-order` - Create a registration with payment order (supports multi-crop data)
- `POST /api/verify-payment` - Verify Razorpay payment and update registration status
- `GET /health` - Health check endpoint
- `GET /api/test` - Test API connectivity

### Multi-Crop Data Structure

Each registration can include multiple crops with the following fields:
- `cropName` (required) - e.g., Rice, Wheat, Tomato
- `cropType` (required) - Cereal, Pulse, Vegetable, Fruit, etc.
- `variety` (optional) - Specific variety of the crop
- `areaAllocated` (required) - Land area for the crop
- `sowingDate` (required) - Date when crop was sown
- `expectedHarvestDate` (optional) - Expected harvest date
- `irrigationMethod` (optional) - Drip, Sprinkler, Flood, Rainfed, Mixed
- `expectedYield` (optional) - Expected crop yield

See [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) for detailed documentation.

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Payment Gateway**: Razorpay
- **CORS**: Enabled for cross-origin requests

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.