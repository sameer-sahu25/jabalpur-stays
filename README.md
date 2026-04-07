# Jabalpur Stays - Luxury Hotel Booking Platform

A full-stack hotel management and booking application built with React, Express, and PostgreSQL.

## 🏨 Project Overview

Jabalpur Stays is a modern hotel booking platform that allows users to browse hotels, view rooms, check offers, and make reservations. The application features a beautiful UI with smooth animations, authentication, and a robust backend API.

## ✨ Features

### Frontend
- 🏠 **Home Page** - Hero carousel, featured rooms, offers, and testimonials
- 🏨 **Hotels Listing** - Browse available hotels with details
- 🛏️ **Room Management** - View room types, amenities, and pricing
- 📅 **Booking System** - Complete reservation workflow
- 💰 **Offers & Deals** - Special promotions and discounts
- 🗺️ **Attractions** - Local points of interest
- 👤 **Authentication** - Login/Register with JWT
- 📱 **Responsive Design** - Mobile-first approach
- ✨ **Smooth Animations** - Glow effects, parallax, magnetic buttons
- 🧪 **Testing** - Comprehensive test suite with Vitest

### Backend
- 🔐 **JWT Authentication** - Secure user authentication
- 🏨 **Hotel Management** - CRUD operations for hotels
- 🛏️ **Room Management** - Room types and availability
- 📅 **Booking System** - Reservation management
- 💰 **Offers Management** - Promotional offers
- 🗄️ **PostgreSQL Database** - Reliable data storage
- 📊 **Drizzle ORM** - Type-safe database queries
- 🛡️ **Error Handling** - Global error middleware
- ✅ **Validation** - Zod schema validation
- 🌐 **RESTful API** - Clean API architecture

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **React Query** - Data fetching
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Zod** - Schema validation
- **Vitest** - Testing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **Neon Database** - Serverless PostgreSQL
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Validation
- **Helmet** - Security headers
- **Morgan** - HTTP logging

## 📁 Project Structure

```
hotel manegment/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── db/            # Database schema
│   │   ├── middleware/    # Auth & error handling
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # DB scripts & seeds
│   │   ├── utils/         # Helper utilities
│   │   ├── .env           # Environment variables
│   │   └── index.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/     # Authentication components
│   │   │   └── ui/       # shadcn UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities & API client
│   │   ├── pages/        # Page components
│   │   └── test/         # Test files
│   ├── .env              # Environment variables
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "hotel manegment"
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Backend `.env` (backend/src/.env):
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   PORT=5001
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=1000d
   NODE_ENV=development
   ```

   Frontend `.env` (frontend/.env):
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_API_KEY=your_api_key
   VITE_APP_TITLE=Jabalpur Stays
   VITE_APP_DESCRIPTION=Luxury Hotel Booking Platform
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Run the Application**

   Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

   Start frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001/api

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Hotels
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room details

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details

### Offers
- `GET /api/offers` - List all offers
- `GET /api/offers/:id` - Get offer details

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test              # Run tests
npm run test:watch    # Watch mode
```

### Backend Tests
```bash
cd backend
npm test
```

## 🏗️ Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm run build
npm start
```

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation with Zod
- Error handling middleware

## 🎨 UI Features

- Smooth page transitions
- Glow effects and animations
- Parallax scrolling
- Magnetic buttons
- Responsive design
- Dark mode support
- Beautiful carousel
- Interactive booking forms

## 📊 Database Schema

The application uses the following main tables:
- **users** - User accounts and authentication
- **hotels** - Hotel information and details
- **rooms** - Room types and availability
- **bookings** - Reservation records
- **offers** - Promotional offers
- **attractions** - Local attractions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Development

For detailed information about the GlowEffect component, see [GlowEffect Guide](frontend/src/components/GlowEffect_Guide.md).

## 🆘 Support

For support, please open an issue in the repository.

---

Built with ❤️ using React, Express, and PostgreSQL
