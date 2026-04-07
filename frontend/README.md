# Jabalpur Stays - Frontend

A modern React frontend application for the Jabalpur Stays hotel booking platform, built with TypeScript, Vite, and shadcn/ui components.

## Features

- React 18 with TypeScript
- Vite bundler for fast development
- Shadcn/ui component library
- Responsive design
- React Router for navigation
- TanStack Query for data fetching
- Tailwind CSS for styling
- Proper alias path configuration (`@/` for `src/`)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:8080](http://localhost:8080)

## Building for Production

To create a production build:

```bash
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_KEY=your_api_key
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── assets/         # Static assets
└── App.tsx         # Main application component
```

## Dependencies

- `react`, `react-dom` - Core React functionality
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Data fetching and caching
- `tailwindcss` - Styling framework
- `shadcn/ui` - Component library