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

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation
1. Clone the repository:
```bash
git clone https://github.com/softkid/globalbusan_xyz.git
cd globalbusan_xyz
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy the project URL and anon key
   - Create a `.env` file in the root directory:
   ```bash
   cp env.example .env
   ```
   - Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up the database:
   - Run the SQL schema in your Supabase SQL editor:
   ```bash
   cat supabase-schema.sql
   ```
   - Copy and paste the contents into your Supabase SQL editor

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

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
