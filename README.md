# PULSE — Your Life Operating System

A gamified habit tracking platform that turns daily responsibilities into missions. Track progress across 5 life categories, earn stars, unlock achievements, and level up your life.

![PULSE Preview](preview.png)

## Features

### Core
- **25 Daily Missions** — 5 categories × 5 habits
- **Star System** — Hit 3+ missions in a category to earn its star (5 max/day)
- **Weekly Sprints** — 7-day cycles with Week X of 52 tracking
- **Rolling Average** — Your true score across time

### Gamification
- **Streaks** — Consecutive days of earning at least 1 star
- **Levels & XP** — Progress system with achievement bonuses
- **PokeDex** — Collect badges for milestones

### Coming Soon
- **Calendar Integration** — Google Calendar sync
- **Head-to-Head** — Weekly challenges with friends
- **Teams** — Cooperative bonuses

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google + Email/Password)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/pulse-app.git
cd pulse-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings > API** and copy your credentials

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase Dashboard: **Auth > Providers > Google** — enable and add credentials

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pulse-app)

### Manual Deploy

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Post-Deploy

1. Add your Vercel domain to Supabase:
   - **Auth > URL Configuration** — Add site URL
   - **Auth > Providers > Google** — Add redirect URL

## Project Structure

```
pulse-app/
├── app/
│   ├── auth/           # Login/signup pages
│   ├── dashboard/      # Main app (protected)
│   ├── pokedex/        # Achievements page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/
│   ├── missions/       # CategoryCard, MissionItem
│   ├── stats/          # StatsBar
│   └── ui/             # Header, BottomNav, etc.
├── lib/
│   ├── supabase/       # Client & server utilities
│   ├── store.ts        # Zustand state management
│   └── types.ts        # TypeScript interfaces
├── public/
│   └── manifest.json   # PWA config
├── supabase/
│   └── schema.sql      # Database schema
└── middleware.ts       # Auth protection
```

## Database Schema

### Core Tables
- `profiles` — User data, streaks, levels
- `categories` — M1-M5 mission categories
- `missions` — Individual habits within categories
- `sprints` — Weekly tracking periods
- `completions` — Daily mission check-offs
- `daily_scores` — Aggregated daily stats

### Gamification Tables
- `achievements` — Badge definitions
- `user_achievements` — Unlocked badges
- `teams` — Team/group data
- `challenges` — Head-to-head competitions

## Customization

### Add New Categories

```sql
INSERT INTO categories (user_id, code, name, color, icon, question, sort_order)
VALUES ('user-uuid', 'M6', 'Learning', '#9B59B6', '📚', 'What did you learn today?', 6);
```

### Modify Default Missions

Edit the `initialize_default_missions` function in `supabase/schema.sql`

### Change Star Threshold

In `lib/store.ts`, modify the `calculateDailyStars` function:
```typescript
// Currently: 3+ missions = 1 star
return categories.filter(cat => getCategoryProgress(cat.id, date) >= 3).length
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

## License

MIT — use it, modify it, make it yours.

---

**Built for the relentless.** 🔥
