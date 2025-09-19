# Workshop DNA Generator

A sophisticated collaborative workshop application that transforms workshop creativity into AI-ready instructions for agentic development systems.

## Features

### 🔄 4-Phase Workshop Flow
- **Problem Framing**: Define problem statements, success criteria, constraints, and stakeholders
- **Idea Blitz**: Generate and evaluate solution concepts with voting and rating
- **Project Context**: Set timeline, technology stack, resources, and dependencies
- **DNA Export**: Generate AI-consumable output in JSON, Markdown, or YAML formats

### 🎨 Modern UI/UX
- Material Design 3 system with comprehensive design tokens
- Dark/Light theme support with automatic system preference detection
- Responsive design that works on desktop and mobile
- Accessible interface with WCAG 2.1 AA compliance

### 💾 State Management
- Automatic localStorage persistence with real-time saving
- Custom React hooks for workshop state management
- Phase progression based on completion criteria
- Comprehensive completeness scoring

### 📊 Smart Progress Tracking
- Real-time completeness scoring across all phases
- Visual progress indicators in sidebar navigation
- Validation feedback and quality gates
- Export readiness assessment

## Technology Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Vite 5.4.20** for fast development and building
- **React Router 6.30.1** for client-side routing
- **Lucide React** for consistent iconography
- **Material Design 3** design system

### Build & Development
- **TypeScript 5.3.3** with strict type checking
- **ESLint & Prettier** for code quality
- **Vite HMR** for instant development feedback
- **Tree shaking** and code splitting for optimal bundles

## Getting Started

### Prerequisites
- Node.js 18+ with npm
- Modern web browser

### Installation
```bash
# Clone or navigate to the project directory
cd workshop-dna-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The application will be available at `http://localhost:5173` (or next available port).

## Project Structure

```
workshop-dna-generator/
├── src/
│   ├── components/          # React components
│   │   ├── Button/          # Material Design 3 button
│   │   ├── ProblemFraming/  # Phase 1 component
│   │   ├── IdeaBlitz/      # Phase 2 component
│   │   ├── ProjectContext/ # Phase 3 component
│   │   └── ExportPanel/    # Phase 4 component
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Application layouts
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Root component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles & design tokens
├── public/                 # Static assets
├── dist/                   # Production build output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Usage

### Creating a Workshop
1. **Problem Framing**: Start by defining your problem statement, success criteria, constraints, and key stakeholders
2. **Idea Generation**: Add solution concepts and rate them for feasibility and impact
3. **Project Planning**: Set timeline with milestones and select your technology stack
4. **Export DNA**: Generate AI-ready instructions in your preferred format

### Data Persistence
- Workshop data is automatically saved to browser localStorage
- Changes are debounced and saved every second
- Data persists across browser sessions
- Manual export creates downloadable files

### Theme Switching
- Toggle between light and dark themes using the header button
- Themes are automatically applied based on system preferences
- Theme preference is persisted across sessions

## Export Formats

### JSON
Structured data format ideal for API consumption and programmatic processing.

### Markdown
Human-readable documentation format perfect for sharing and collaboration.

### YAML
Configuration-friendly format suitable for deployment pipelines and infrastructure as code.

## Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance
- Initial bundle size: ~200KB gzipped
- Code splitting for optimal loading
- Automatic tree shaking eliminates unused code
- Material Design 3 animations with hardware acceleration

## Contributing
This project follows the technical specification and data models defined in the accompanying DNA documentation files.

## License
ISC License