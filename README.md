# 🎮 Color Match Rush - Whop Game

A viral-ready, addictive color matching game built for the Whop platform using Next.js and the Whop SDK.

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 🎯 Game Features

- **Fast-paced gameplay**: 30-second rounds
- **Combo system**: Build streaks for bonus points
- **Local leaderboard**: Track top 10 scores
- **Beautiful UI**: Neon cyberpunk aesthetic
- **Mobile responsive**: Play anywhere
- **Zero downloads**: Runs in browser

## 🏗️ Built With

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Whop SDK** - Whop platform integration
- **Vercel** - Free hosting

## 📦 Project Structure

```
src/
├── app/
│   ├── page.tsx         # Main game page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Styles
├── components/
│   └── GameClient.tsx   # Game logic
└── lib/
    └── whop.ts          # Whop API client
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

**Quick Deploy to Vercel:**

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 🔐 Environment Variables

Create a `.env.local` file:

```env
WHOP_API_KEY=your_api_key_here
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
```

## 🎨 Customization

### Change Colors
Edit `src/app/globals.css`:
```css
:root {
  --neon-pink: #FF0080;
  --neon-cyan: #00F0FF;
  --neon-yellow: #FFFF00;
}
```

### Adjust Difficulty
Edit `src/components/GameClient.tsx`:
```typescript
setTimeLeft(45);  // Change starting time
```

## 📝 License

MIT

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss changes.

## 🆘 Support

- Whop Docs: https://docs.whop.com
- Vercel Docs: https://vercel.com/docs
- Issues: Open a GitHub issue

---

Made with 💜 for the Whop platform
