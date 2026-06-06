# VowCanvas 💌

> *Your love story, beautifully framed.*

VowCanvas is a premium web application that allows users to create stunning, personalized, cinematic websites for their partners. Whether for an anniversary, Valentine's Day, or "just because", users can upload photos, write letters, add memories, and share a single magical link that renders an immersive love-letter experience.

---

## ✨ Features

- **Cinematic Animations**: High-performance scroll animations, parallax galleries, and staggered reveals powered by GSAP and Framer Motion.
- **Interactive Surprise**: A unique microphone-detected "candle blowing" experience that triggers an explosion of confetti.
- **Custom Soundtrack**: Built-in audio player that softly loops romantic music (e.g., Lana Del Rey) during the experience.
- **Zero-Database Sharing**: User-generated content is compressed and encoded directly into the shareable URL, requiring no persistent storage and ensuring complete privacy.
- **Premium UI/UX**: Designed with deep, rich aesthetics, glassmorphism, dynamic glowing gradients, and elegant typography (Cormorant Garamond & Outfit).
- **E2E Tested**: Automated UI flow and cross-browser testing using Playwright Java.

---

## 🛠️ Tech Stack

### Frontend (React + Vite)
- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS v3
- **Animations**: GSAP (GreenSock), Framer Motion, React Spring
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **WebGL/Canvas**: OGL (via React Bits components)
- **Icons**: Lucide React

### Backend (Spring Boot)
- **Framework**: Java 17 + Spring Boot 3.4
- **API**: RESTful controllers for stateless operations (e.g., Image Proxying, Link Generation).
- **Security**: Built-in Rate Limiting via Interceptors.
- **Testing**: JUnit 5 + Microsoft Playwright for E2E Tests.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Java Development Kit (JDK)](https://adoptium.net/) (v17+)
- [Maven](https://maven.apache.org/) (v3.8+)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in any required variables. *(Note: The application is designed to run locally without external API keys by default).*

### 1. Start the Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```
The backend API will start on `http://localhost:8081`.

### 2. Start the Frontend (Vite)

Open a new terminal window:
```bash
# From the project root
npm install
npm run dev
```
The frontend will start on `http://localhost:5173` (or the next available port).

---

## 🧪 Running E2E Tests

This project uses **Playwright for Java** to run end-to-end tests against the frontend.

Make sure the Vite frontend is running, then execute:
```bash
cd backend
mvn test -Dtest=LovecraftE2ETest
```
*Note: On the first run, Playwright will automatically download the required headless browsers (Chromium, Firefox, WebKit).*

---

## 🐳 Deployment (Render)

A multi-stage `Dockerfile` is provided in the `backend/` directory, optimized for deployment on platforms like Render, Railway, or Fly.io.

**To deploy the backend to Render:**
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Choose the **Docker** environment.
5. Render will automatically detect the `Dockerfile` and build/deploy the Spring Boot application.

---

## 🔒 Security & Credentials

- **API Keys & Secrets**: All sensitive keys, database URLs, and JWT secrets should be placed inside the `.env` file.
- **GitIgnore**: The `.env` file is excluded from version control via `.gitignore` to prevent accidental credential leaks. Never commit your production `.env` file to GitHub!

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <i>Crafted with love and code.</i>
</p>
