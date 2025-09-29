# Emergency Location Management App

A sophisticated React application for managing food truck operations during location emergencies, featuring real-time routing with Mapbox integration.

## Features

- 🚨 **Emergency Location Management** - Handle blocked locations with alternative options
- 🗺️ **Interactive Maps** - Real-time routing with Mapbox GL JS
- 📊 **Route Analytics** - Distance, ETA, and revenue impact for each alternative
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ♿ **Accessibility** - Keyboard navigation and ARIA labels
- 🔄 **Real-time Updates** - Live route calculations and location switching

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Mapbox GL JS** for interactive maps
- **Mapbox Directions API** for routing

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox account and API token

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Mapbox token:**
   - Create a `.env` file in the root directory
   - Add your Mapbox token:
   ```
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```
   - Get your token from [Mapbox Account](https://account.mapbox.com/access-tokens/)

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

### Without Mapbox Token
The app works with mock data when no token is provided:
- Shows a warning banner about missing token
- Uses pre-calculated mock distances and ETAs
- All functionality remains available

### With Mapbox Token
- Real-time routing calculations
- Interactive map with traffic data
- Accurate distance and ETA measurements
- Full Mapbox GL JS features

## Project Structure

```
src/
├── components/
│   ├── BlockedCard.tsx      # Main blocked location card
│   ├── AlternativesModal.tsx # Modal with alternative locations
│   └── MapView.tsx          # Interactive map component
├── data/
│   └── mockData.ts          # Mock data and fallback routes
├── lib/
│   └── routing.ts           # Mapbox API integration
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css               # Tailwind CSS styles
```

## Key Components

### BlockedCard
- Displays blocked location status
- Shows selected alternative (if any)
- CTA button to open alternatives modal

### AlternativesModal
- Lists 3 alternative locations
- Shows revenue impact, distance, and ETA
- Interactive map with route visualization
- Selection and confirmation workflow

### MapView
- Mapbox GL JS integration
- Route visualization with markers
- Responsive design for all screen sizes
- Fallback UI when map unavailable

## API Integration

### Mapbox Directions API
- **Endpoint**: `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/`
- **Features**: Traffic-aware routing, multiple alternatives
- **Fallback**: Mock data when API unavailable

### Route Calculation
- Precomputes routes for all alternatives
- Real-time distance and duration updates
- Traffic-aware routing when available

## Responsive Design

### Desktop (lg+)
- Map on left (60%), details on right (40%)
- Full modal with side-by-side layout
- Rich interaction capabilities

### Mobile
- Stacked layout: details first, map below
- Full-width modal
- Touch-optimized interactions

## Accessibility

- **Keyboard Navigation**: Escape to close modal, tab navigation
- **Focus Management**: Focus trap in modal
- **ARIA Labels**: Screen reader support
- **High Contrast**: Accessible color schemes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

- `VITE_MAPBOX_TOKEN` - Your Mapbox API token

## Deployment

The app is designed to run on static hosts like GitHub Pages:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are set in your hosting platform

## Mock Data

The app includes realistic mock data for development:
- **Current Location**: DTLA coordinates
- **Blocked Location**: Financial District
- **Alternatives**: Arts District, Echo Park Lake, Koreatown
- **Route Data**: Pre-calculated distances and ETAs

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
