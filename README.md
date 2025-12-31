# GeoKracht - Brutalist Strength Tracker

GeoKracht is a high-performance, minimalist workout tracker built with a "Neobrutalist" design philosophy. It focuses on the 5 core compound lifts (Workout A/B structure) and gamifies your progress.


## ⚡ Features

### 🏋️‍♂️ Core Workout Loop
- **A/B Split System**: Guided workouts focusing on compound movements.
- **Smart Timer**: Auto-advances exercises when your rest timer ends.
- **Micro-Load Tracking**: Precise weight and rep logging.
- **Snack Workouts**: Quick 5-10 minute sessions for busy days.

### 🎮 Gamification System
- **Player Card**: Visual dashboard showing your Rank and Stats.
- **XP & Leveling**: Earn XP for every workout and kilogram lifted.
- **Ranks**: Progress from **Iron Rat** all the way to **Vibranium Legend**.
- **Retroactive Stats**: Your past history counts towards your level immediately.

### 📅 History & Analysis
- **Monthly Calendar**: Visual heat map of your training consistency.
- **Volume Tracking**: See total tonnage moved per workout.
- **Streak Counter**: Keeps you motivated to maintain weekly consistency.

### 🎨 Brutalist UI
- **High Contrast**: Bold borders, vivid colors (Lime, Cyan, Pink), and distinct typography.
- **Zero Fluff**: No hidden menus or complex navigation. Everything is one click away.

---

## 🛠️ Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS (Custom Brutalist Design System)
- **Backend**: Supabase (Auth, Database, Realtime)
- **Icons**: Lucide React
- **Dates**: date-fns

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- A Supabase project (for backend)

### 1. Clone & Install
```bash
git clone https://github.com/Toeron/GeoKracht.git
cd GeoKracht
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 📱 PWA Support
GeoKracht is PWA-ready. You can install it on your mobile device as a standalone app for the best experience.

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add Amazing Feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
