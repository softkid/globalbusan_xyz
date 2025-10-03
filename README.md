# Global BUSAN

A transparent, blockchain-powered donation platform that connects international entrepreneurs with Korea's business ecosystem to transform Busan into a global business hub.

## Features

- **Equity Structure**: Real-time donation tracking and stakeholder visualization
- **Project Reports**: Quarterly fund usage reports and project progress
- **Roadmap**: 5-stage project timeline with milestones
- **Transparency**: Blockchain-verified donation tracking
- **Mobile-First**: Responsive design optimized for all devices

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Icons**: React Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Cloudflare Workers
1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
wrangler deploy
```

The `wrangler.jsonc` file is already configured for deployment.

## Project Structure

- `src/components/` - React components
- `src/index.css` - Global styles and utilities
- `doc/` - Project documentation and PRD

## License

© 2025 Global BUSAN. All rights reserved.
