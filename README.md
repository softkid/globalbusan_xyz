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

3. Set up environment variables:
   - Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   - Update `.env` with your credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. Set up Google OAuth:
   - See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions
   - **Important**: Add `http://localhost:5173` to Authorized JavaScript origins in Google Cloud Console
   - Add `http://localhost:5173` to Authorized redirect URIs

5. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy the project URL and anon key
   - Update `.env` with your Supabase credentials

6. Set up the database:
   - Run the SQL schema in your Supabase SQL editor:
   ```bash
   cat supabase-schema.sql
   ```
   - Copy and paste the contents into your Supabase SQL editor

7. Start development server:
```bash
npm run dev
```

8. Open [http://localhost:5173](http://localhost:5173) in your browser

## Google OAuth Setup

**Important**: Before using Google login, you must configure Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Select your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `http://localhost:5173` (for development)
   - `https://your-production-domain.com` (for production)
5. Add to **Authorized redirect URIs**:
   - `http://localhost:5173` (for development)
   - `https://your-production-domain.com` (for production)
6. Save and wait 5-10 minutes for changes to propagate

See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed step-by-step instructions.

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
