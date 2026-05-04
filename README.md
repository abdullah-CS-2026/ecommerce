# ElectroMart - Modern E-commerce Platform

A full-featured modern E-commerce website with a clean and professional UI.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Lucide React (Icons)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

## Features Included
- **Home Page**: Hero section, featured products, promotional banners.
- **Product Listing**: Grid layout, sidebar with complex filtering (Search, Category, Price, Rating, Sort).
- **Product Detail**: Large image, variants, specifications, reviews, Add to Cart / Buy Now.
- **Cart**: Dynamic calculations (Subtotal, Tax, Shipping), quantity adjustments.
- **Additional Pages**: About Us, Contact Us, Categories, Privacy Policy, Terms and Conditions.
- **Backend APIs**: RESTful endpoints for Products and Cart, including CSV Import/Export.

## How to Run

### 1. Start the Backend
Make sure MongoDB is running locally on port 27017.
```bash
cd backend
npm install
node seed.js  # Optional: Seed the database with mock products
node server.js
```
The backend server will run on `http://localhost:5000`.

### 2. Start the Frontend
Open a new terminal.
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## CSV Import/Export
The backend supports CSV import/export for products using `csv-parser` and `json2csv`.
- **Export**: `GET /api/products/export`
- **Import**: `POST /api/products/import` (Form Data with `file` key containing the CSV)
