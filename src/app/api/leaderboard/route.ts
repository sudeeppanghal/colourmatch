import { NextRequest, NextResponse } from 'next/server';

// In-memory leaderboard storage (for demo purposes)
// For production, use a database like PostgreSQL, MongoDB, or Vercel KV
let globalLeaderboard: Array<{ score: number; date: string; player: string }> = [];

export async function GET() {
  // Return top 10 scores
  const topScores = globalLeaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  return NextResponse.json({ leaderboard: topScores });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, player = 'Anonymous' } = body;

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      );
    }

    // Add new score
    const newEntry = {
      score,
      player: player.substring(0, 20), // Limit player name length
      date: new Date().toLocaleDateString(),
    };

    globalLeaderboard.push(newEntry);

    // Keep only top 100 to prevent memory issues
    globalLeaderboard = globalLeaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    // Return updated top 10
    const topScores = globalLeaderboard.slice(0, 10);

    return NextResponse.json({ 
      success: true, 
      leaderboard: topScores,
      rank: globalLeaderboard.findIndex(entry => 
        entry.score === score && entry.date === newEntry.date
      ) + 1
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}
