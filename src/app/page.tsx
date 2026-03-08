import { Metadata } from 'next';
import GameClient from '@/components/GameClient';

export const metadata: Metadata = {
  title: 'Color Match Rush - Whop Game',
  description: 'Addictive color matching game. Test your speed and reflexes!',
};

export default function Home() {
  return <GameClient />;
}
