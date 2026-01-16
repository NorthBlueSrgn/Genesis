# Genesis Protocol 🧬

> An immersive, adaptive onboarding system that profiles individuals through psychometric testing, creativity assessment, strategic reasoning, and ethical evaluation.

![GitHub License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)

## ✨ Features

### Psychometric Testing
- **MBTI-24 Personality Assessment** - 24-question personality profiling
- **Stroop Protocol** - Inhibitory control measurement
- **Fitts Law Test** - Motor skill and precision calibration
- **Breath Hold Test** - Vitality metrics

### Cognitive Evaluation
- **Adaptive Reasoning Engine** - Progressive difficulty logic puzzles
- **Knowledge Matrix** - Adaptive knowledge testing
- **Chess Strategy Analysis** - Tactical puzzle solving

### Creative Profiling
- **Neural Divergence Protocol** - 5-prompt creativity assessment
  - Imagination, Innovation, Style, Vision, Expression
- **Focus Forest Tracking** - Real-time creative focus measurement
- **Distraction Detection** - App interruption monitoring

### Ethical Assessment
- **Spirit Calibration** - 15 moral dilemma screening
- **Ethical Framework Evaluation** - Values-based decision analysis

### Adaptive Difficulty
All tests feature progressive difficulty adjustment based on performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Genesis-Protocol.git
cd Genesis-Protocol

# Install dependencies
npm install

# Set up Firebase (if using Firebase features)
# Copy firebaseConfig.ts.example to firebaseConfig.ts
cp firebaseConfig.ts.example firebaseConfig.ts
# Update with your Firebase credentials

# Start development server
npm run start
```

### Development

```bash
# Start dev server (runs on http://localhost:5173)
npm run start

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Project Structure

```
Genesis-Protocol/
├── components/           # React components
│   ├── CommandPalette.tsx
│   ├── Navigation.tsx
│   ├── SystemLog.tsx
│   └── ui/
├── pages/               # Page components
│   └── OnboardingPage.tsx    # Main onboarding flow
├── contexts/            # React contexts
│   └── GameStateContext.tsx
├── data/               # Static data
│   ├── creativityAssessmentData.ts
│   ├── cascadeStrategyGameData.ts
│   └── ...
├── services/           # API services
├── state/              # State management
├── App.tsx             # Main app component
├── index.tsx           # React entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies
```

## 🔧 Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Lucide React, Phosphor Icons
- **Backend**: Firebase
- **Testing**: Adaptive algorithms

## 📊 Assessment Algorithms

### Adaptive Difficulty
Tests adjust difficulty based on user performance:
- Correct answer → Harder next question
- Incorrect answer → Easier next question
- Converges to user's knowledge ceiling

### Focus Metrics (Creative Protocol)
- Real-time growth tracking during timed responses
- App visibility monitoring
- Interruption detection
- Focus streak bonuses

### Scoring Systems
- **Reasoning**: Based on final difficulty level reached
- **Knowledge**: Inverted difficulty (higher difficulty = lower % would know)
- **Creativity**: Word count, focus metrics, sustained engagement
- **Ethics**: Pattern analysis across dilemma responses

## 🔐 Security & Privacy

- Firebase authentication support
- Environment variable configuration for sensitive data
- Secure Firestore rules included
- No personal data storage without consent

## 📝 Documentation

- `CREATIVITY_ASSESSMENT_INTEGRATION.md` - Creativity module docs
- `STRATEGY_TEST_IMPLEMENTATION.md` - Strategy testing guide
- `SUBSTAT_CALCULATION_SYSTEM.md` - Scoring system details
- `README_IMPLEMENTATION.md` - Implementation guide

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Sylvia Ukanga**
- GitHub: [@sylviaukanga](https://github.com/sylviaukanga)

## 🙏 Acknowledgments

- React and TypeScript communities
- Firebase for backend services
- Tailwind CSS for styling
- Icon libraries: Lucide React, Phosphor Icons

## 📞 Support

For support, open an issue on GitHub or contact through the repository.

---

**Made with ❤️ by [Your Name]**
