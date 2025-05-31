# FUO Online Voting System - Frontend

React-based frontend for the Federal University Otuoke Online Voting System with CNN-based facial recognition.

## Features

- 🔐 **Secure Authentication** - JWT-based login with facial verification
- 👤 **CNN Facial Recognition** - Real-time facial recognition using webcam
- 🗳️ **Interactive Voting** - Modern voting interface with real-time feedback
- 📊 **Results Dashboard** - Live election results and analytics
- 👨‍💼 **Admin Panel** - Complete election management system
- 📱 **Responsive Design** - Optimized for desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **React Webcam** - Camera integration for facial recognition
- **Chart.js** - Data visualization for results

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── CandidateCard.jsx
│   │   ├── ElectionCard.jsx
│   │   ├── FaceRecognition.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ElectionContext.jsx
│   ├── pages/             # Page components
│   │   ├── AdminDashboard.jsx
│   │   ├── ElectionDetail.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegistrationPage.jsx
│   │   ├── ResultsPage.jsx
│   │   └── VotingDashboard.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite configuration
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FUO Online Voting System
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Components

### Authentication
- **LoginPage** - User login with facial verification
- **RegistrationPage** - Multi-step registration with face capture
- **FaceRecognition** - CNN-based facial recognition component

### Voting
- **VotingDashboard** - Main voting interface
- **ElectionDetail** - Detailed election view with candidates
- **CandidateCard** - Individual candidate information

### Administration
- **AdminDashboard** - Administrative overview and statistics
- **AdminElections** - Election management interface
- **AdminElectionForm** - Create/edit election form
- **AdminOfficeForm** - Create/edit office positions
- **AdminCandidateForm** - Add/edit candidates

### Results
- **ResultsPage** - Real-time election results with charts
- **VotingConfirmation** - Vote confirmation and receipt

## Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=FUO Online Voting System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_FACE_RECOGNITION=true
VITE_ENABLE_REAL_TIME_RESULTS=true

# Development
VITE_DEBUG_MODE=true
```

## API Integration

The frontend communicates with the Flask backend through RESTful APIs:

### Authentication Flow
1. User enters credentials
2. Backend validates and returns JWT token
3. Facial recognition verification (if enabled)
4. Token stored in localStorage for subsequent requests

### Voting Flow
1. User selects candidates for each office
2. Facial verification before final submission
3. Votes encrypted and sent to backend
4. Confirmation receipt displayed

### Real-time Updates
- Election results update automatically
- Voting progress tracked in real-time
- Admin dashboard shows live statistics

## Facial Recognition Integration

The frontend integrates with the CNN-based facial recognition system:

```jsx
// Example usage in FaceRecognition component
const captureAndVerify = async () => {
  const imageData = webcamRef.current.getScreenshot();
  
  try {
    const response = await faceAPI.verifyFace(imageData);
    if (response.data.success && response.data.is_match) {
      onVerificationSuccess();
    } else {
      setError('Face verification failed');
    }
  } catch (error) {
    setError('Verification error occurred');
  }
};
```

## Styling and Theming

The application uses Tailwind CSS with a custom theme:

- **Primary Colors**: Blue shades for FUO branding
- **Secondary Colors**: Yellow/Gold for accents
- **Typography**: Inter font family
- **Components**: Custom styled components with consistent spacing

## Security Features

- JWT token management with automatic refresh
- Protected routes requiring authentication
- Facial recognition for sensitive operations
- Input validation and sanitization
- HTTPS enforcement in production

## Performance Optimizations

- Code splitting with React.lazy()
- Image optimization and lazy loading
- Efficient state management with React Context
- Memoization of expensive computations
- Bundle size optimization with Vite

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment
```bash
docker build -t fuo-voting-frontend .
docker run -p 5173:5173 fuo-voting-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.