# 💬 ChatterBox: Secure Messaging Portal

**ChatterBox** is a high-performance, React-based messaging workspace built for secure and immersive communication. It features a custom-engineered voice messaging engine, real-time audio visualization, and a glassmorphism UI designed for modern professional environments.

## 🚀 Core Communication Features

### 🎙️ Advanced Voice Messaging Engine

- **Hardware-Accelerated Recording**: Utilizes the `MediaRecorder` API to capture crisp audio blobs directly from the browser.
- **Live Web-Audio Visualization**: Employs an `AnalyserNode` to generate dynamic frequency data, creating a real-time waveform effect during recording.
- **Interactive Playback**: Features WhatsApp-style geometric Play/Pause controls with a waveform progress tracker that fills in real-time.
- **Intelligent Timers**: Synchronizes `currentAudioTime` with the HTML5 Audio engine for precision playback counters.

### 📱 Smart Messaging Engine

- **Context-Aware Replies**: Implements automated typing indicators and simulated responses to create a living chat environment.
- **High-Fidelity Media Handling**: Optimized support for image previews and file attachments with dedicated download components.
- **Read Receipt Synchronization**: Real-time status tracking with visual transitions from Sent (`✓`) to Read (`✓✓`).

### 🔐 Security & Access

- **OTP Gateway Simulation**: A secure entry portal requiring 6-digit verification before granting workspace access.
- **State-Driven Privacy**: All messaging data is gated by an `isUnlocked` session state to prevent unauthorized viewing.

## 🎨 UI/UX Design

- **Glassmorphic Aesthetic**: Deep-dark theme utilizing `backdrop-blur-3xl` and pulsed glow nodes for a premium feel.
- **Adaptive Themes**: A global theme engine that toggles between "Sun" (Light) and "Moon" (Dark) modes with unified contrast ratios.

## 📂 Project Structure

```text
chatterbox-portal/
├── public/              # Static assets (logos, notification sounds)
├── src/
│   ├── assets/          # Project images and global icons
│   ├── components/      # Modular UI components (Planned)
│   │   ├── Auth/        # Biometric & OTP Login logic
│   │   ├── Chat/        # Message bubbles and voice note UI
│   │   └── Expenses/    # Budgeting and payment features
│   ├── App.jsx          # Main application logic & state management
│   ├── index.css        # Tailwind directives and global styles
│   └── main.jsx         # React DOM entry point
├── .gitignore           # Standard excludes (node_modules, .env)
├── index.html           # Main HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🛠️ Tech Stack

    Framework: React 18+ (Vite)

    Styling: Tailwind CSS

    Media APIs: MediaDevices API, MediaRecorder API, Web Audio API

    UI Geometry: Custom CSS-based icons for zero-latency playback controls

## 📝 Recent Stability Fixes

    Resolved: Fixed variable redeclaration conflict for formatTime in the global scope.

    Optimized: Implemented null-safety fallbacks (|| 0) for audio progress calculations to prevent UI crashes.

    Synchronized: Unified audioPlayerRef with React state for seamless playback monitoring.

## 🚧 Upcoming Communication Roadmap

    [ ] Group Management: Full participant control and Admin role assignments.

    [ ] Status/Stories: 24-hour disappearing media updates.

    [ ] Message Threading: Direct replies to specific messages for improved context.

    [ ] Live Call UI: Modern interface for P2P Voice and Video communication.
