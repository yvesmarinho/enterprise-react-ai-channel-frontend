# Enterprise React AI Channel Frontend

A modern React frontend application for real-time AI communication using LiveKit technology. This application enables seamless video conferencing with AI agents, providing enterprise-grade features for interactive AI conversations.

## 🚀 Features

- **Real-time Video/Audio Communication** - High-quality LiveKit integration
- **AI Agent Integration** - Bidirectional communication with AI agents
- **Modern UI/UX** - Material-UI components with responsive design
- **User Authentication** - Secure login/logout with JWT tokens
- **Session Management** - Track and manage AI conversation sessions
- **Device Management** - Audio/video device selection and testing
- **Screen Sharing** - Share screen during AI sessions
- **Chat Integration** - Text-based communication alongside video
- **Settings Panel** - Comprehensive user preferences
- **TypeScript Support** - Full type safety and better development experience

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Real-time Communication**: LiveKit SDK
- **Routing**: React Router
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A LiveKit server instance
- Backend API server with AI agent integration
- WebSocket server for AI communication

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd enterprise-react-ai-channel-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration:**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_LIVEKIT_URL=wss://your-livekit-server.com
   VITE_API_BASE_URL=https://your-api-server.com
   VITE_WEBSOCKET_URL=wss://your-websocket-server.com
   VITE_AI_AGENT_API_KEY=your-ai-agent-api-key
   VITE_APP_NAME=Enterprise AI Channel
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components
├── pages/               # Page components
│   ├── Auth/            # Login/Register pages
│   ├── Dashboard/       # Main dashboard
│   ├── AIChannel/       # AI communication interface
│   └── Settings/        # User settings
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useLiveKit.ts    # LiveKit integration hook
│   ├── useAIAgent.ts    # AI agent communication hook
│   └── redux.ts         # Redux hooks
├── services/            # API and external services
│   ├── api.ts           # HTTP API client
│   └── livekit.ts       # LiveKit service
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices
│   └── index.ts         # Store setup
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🎯 Usage

### Authentication
1. Navigate to the login page
2. Enter your credentials or register a new account
3. Access granted to the main dashboard

### Starting an AI Session
1. From the dashboard, click "Quick Start" for instant session
2. Or use "Create/Join Room" for specific room names
3. Configure your audio/video settings
4. Click "Join Call" to connect to the LiveKit room
5. Start communicating with the AI agent

### Chat with AI Agent
- Use the text chat interface alongside video
- Type messages and press Enter to send
- AI responses appear in real-time
- Voice activation coming soon

### Settings Configuration
- Configure audio/video devices
- Test device functionality
- Adjust default media settings
- View connection endpoints

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

Run tests in watch mode:
```bash
npm run test:watch
# or
yarn test:watch
```

## 🔨 Building for Production

1. **Build the application:**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

The built files will be in the `dist/` directory.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_LIVEKIT_URL` | LiveKit server WebSocket URL | `ws://localhost:7880` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |
| `VITE_WEBSOCKET_URL` | AI agent WebSocket URL | `ws://localhost:3001` |
| `VITE_AI_AGENT_API_KEY` | API key for AI agent | `demo-key` |
| `VITE_APP_NAME` | Application name | `Enterprise AI Channel` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

### LiveKit Configuration

The application uses the following LiveKit options:
- Adaptive streaming enabled
- Dynacast for optimal bandwidth usage
- HD video quality (720p) by default
- Audio/video simulcast layers

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image:**
   ```bash
   docker build -t enterprise-ai-frontend .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 enterprise-ai-frontend
   ```

### Static Hosting

Deploy the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 🔐 Security Considerations

- All API calls use JWT authentication
- HTTPS required for production deployments
- LiveKit tokens are short-lived and server-generated
- Input validation and sanitization implemented
- CORS properly configured

## 🐛 Troubleshooting

### Common Issues

1. **LiveKit Connection Failed**
   - Verify VITE_LIVEKIT_URL is correct
   - Check if LiveKit server is running
   - Ensure proper WebSocket support

2. **AI Agent Not Responding**
   - Verify VITE_WEBSOCKET_URL configuration
   - Check AI agent service status
   - Verify API key validity

3. **Camera/Microphone Not Working**
   - Grant browser permissions
   - Check device availability
   - Test devices in settings page

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

## 📚 API Documentation

### Required Backend Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

#### LiveKit Integration
- `POST /api/livekit/token` - Get access token
- `GET /api/livekit/rooms/:name` - Get room info
- `POST /api/livekit/rooms` - Create room

#### AI Agent
- `POST /api/ai-agent/message` - Send message to AI
- `GET /api/ai-agent/conversations/:id` - Get conversation history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🚧 Roadmap

- [ ] Voice activation for AI agent
- [ ] Multiple AI agents support
- [ ] Recording and playback
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Integration with more AI providers
- [ ] Advanced user roles and permissions
- [ ] Custom AI agent configurations

---

**Built with ❤️ for enterprise AI communication**
