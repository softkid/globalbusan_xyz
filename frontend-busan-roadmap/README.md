# Busan Maritime Capital & Digital Hub 2.0 Roadmap

This is a modern web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Hono**, designed to be deployed on **Cloudflare Pages**.

## Features
- **Time Machine Slider**: Navigate through the 4-year policy roadmap (2026-2030).
- **Interactive Map**: Visual progress of Busan's 16 districts.
- **KPI Dashboard**: Real-time visualization of key performance indicators.
- **Risk Monitor**: Environmental risk analysis and mitigation strategies.
- **Auto-Play**: Automatic animation of the roadmap progression.

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Hono (Cloudflare Workers ready)
- **Deployment**: Cloudflare Pages / Workers

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build & Deploy
```bash
npm run build
npm run deploy
```

## Project Structure
- `src/components`: UI components (Map, Timeline, Cards, etc.)
- `src/data`: Roadmap data and types
- `src/App.tsx`: Main application logic
- `src/server.ts`: Hono API server
- `docs/`: Original policy reports and reference documents
