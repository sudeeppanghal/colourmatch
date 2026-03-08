'use client';

import { useState, useEffect, useRef } from 'react';

interface Color {
  name: string;
  value: string;
}

interface LeaderboardEntry {
  score: number;
  date: string;
}

const colors: Color[] = [
  { name: 'RED', value: '#FF3366' },
  { name: 'BLUE', value: '#3366FF' },
  { name: 'GREEN', value: '#33FF66' },
  { name: 'YELLOW', value: '#FFFF33' },
  { name: 'PURPLE', value: '#9933FF' },
  { name: 'ORANGE', value: '#FF9933' },
  { name: 'PINK', value: '#FF33CC' },
  { name: 'CYAN', value: '#33FFFF' }
];

export default function GameClient() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentColorName, setCurrentColorName] = useState('');
  const [currentColorValue, setCurrentColorValue] = useState('');
  const [displayColor, setDisplayColor] = useState('');
  const [options, setOptions] = useState<Color[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showCombo, setShowCombo] = useState(false);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [buttonState, setButtonState] = useState<'correct' | 'wrong' | null>(null);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load leaderboard from localStorage AND fetch global leaderboard
  useEffect(() => {
    // Local leaderboard
    const saved = localStorage.getItem('colorMatchLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }

    // Fetch global leaderboard
    fetchGlobalLeaderboard();
  }, []);

  const fetchGlobalLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      if (data.leaderboard) {
        setGlobalLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch global leaderboard:', error);
    }
  };

  // Generate background particles
  useEffect(() => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer && particlesContainer.children.length === 0) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  const generateRound = () => {
    const wordColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColorName(wordColor.name);
    setCurrentColorValue(wordColor.value);

    const displayCol = colors[Math.floor(Math.random() * colors.length)];
    setDisplayColor(displayCol.value);

    const opts = [wordColor];
    while (opts.length < 4) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      if (!opts.find(c => c.name === randomColor.name)) {
        opts.push(randomColor);
      }
    }
    opts.sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameState('playing');
    setShowCombo(false);
    generateRound();
  };

  const checkAnswer = (selectedColor: string, index: number) => {
    if (gameState !== 'playing') return;

    setSelectedButton(index);

    if (selectedColor === currentColorName) {
      setButtonState('correct');
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      if (newStreak >= 3) {
        setScore(newScore + Math.floor(newStreak / 3));
        setShowCombo(true);
      }

      setTimeout(() => {
        setButtonState(null);
        setSelectedButton(null);
        generateRound();
      }, 300);
    } else {
      setButtonState('wrong');
      setTimeLeft(Math.max(0, timeLeft - 5));
      setStreak(0);
      setShowCombo(false);

      setTimeout(() => {
        setButtonState(null);
        setSelectedButton(null);
      }, 500);
    }
  };

  const endGame = async () => {
    setGameState('over');
    
    // Save to local leaderboard
    const newEntry: LeaderboardEntry = {
      score,
      date: new Date().toLocaleDateString()
    };
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('colorMatchLeaderboard', JSON.stringify(newLeaderboard));

    // Save to global leaderboard
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, player: 'Player' }),
      });
      const data = await response.json();
      if (data.leaderboard) {
        setGlobalLeaderboard(data.leaderboard);
        if (data.rank) {
          setPlayerRank(data.rank);
        }
      }
    } catch (error) {
      console.error('Failed to save to global leaderboard:', error);
    }
  };

  const restartGame = () => {
    setGameState('start');
  };

  const getMessage = () => {
    if (score >= 30) return '🔥 LEGENDARY! You\'re a color master!';
    if (score >= 20) return '⭐ AMAZING! Great reflexes!';
    if (score >= 10) return '👍 Nice work! Keep practicing!';
    return '💪 Good try! You\'ll do better next time!';
  };

  return (
    <>
      <div className="bg-particles" id="particles"></div>
      
      <div className="container">
        <header>
          <h1>Color Match Rush</h1>
          <p className="subtitle">Beat the Clock • Test Your Speed</p>
        </header>

        <div className="game-container">
          {/* Start Screen */}
          {gameState === 'start' && (
            <div>
              <div className="instructions">
                <h3>🎮 How to Play</h3>
                <p><strong>Match the color name with the correct color!</strong></p>
                <p>⚡ You have 30 seconds</p>
                <p>🎯 Each correct answer = +1 point</p>
                <p>❌ Wrong answer = -5 seconds penalty</p>
                <p>🔥 Build combos for bonus points!</p>
              </div>
              <button className="start-btn" onClick={startGame}>
                Start Game
              </button>
              
              <div className="leaderboard">
                <h3>🏆 Your Top Scores</h3>
                {leaderboard.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                    No scores yet. Be the first!
                  </p>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div key={index} className="leaderboard-entry">
                      <span>{index + 1}. {entry.score} points</span>
                      <span style={{ opacity: 0.6 }}>{entry.date}</span>
                    </div>
                  ))
                )}
              </div>

              {globalLeaderboard.length > 0 && (
                <div className="leaderboard" style={{ marginTop: '20px' }}>
                  <h3>🌍 Global Leaderboard</h3>
                  {globalLeaderboard.map((entry, index) => (
                    <div key={index} className="leaderboard-entry">
                      <span>{index + 1}. {entry.score} points</span>
                      <span style={{ opacity: 0.6 }}>{entry.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Game Screen */}
          {gameState === 'playing' && (
            <div>
              <div className="stats">
                <div className="stat-box">
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{score}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Streak</div>
                  <div className="stat-value">{streak}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Time</div>
                  <div className="stat-value" style={{ color: timeLeft <= 5 ? '#ff0000' : '' }}>
                    {timeLeft}
                  </div>
                </div>
              </div>

              <div className="timer-bar">
                <div className="timer-fill" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
              </div>

              <div className="color-display">
                <div className={`combo ${showCombo ? 'active' : ''}`}>🔥 STREAK!</div>
                <div className="target-color" style={{ color: displayColor }}>
                  {currentColorName}
                </div>
              </div>

              <div className="options-grid">
                {options.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${
                      selectedButton === index && buttonState === 'correct' ? 'correct' : ''
                    } ${selectedButton === index && buttonState === 'wrong' ? 'wrong' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => checkAnswer(color.name, index)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'over' && (
            <div className="game-over active">
              <h2 style={{ color: 'var(--neon-pink)', marginBottom: '10px' }}>GAME OVER!</h2>
              <div className="final-score">{score}</div>
              <div className="message">{getMessage()}</div>
              {playerRank && (
                <p style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>
                  🌍 Global Rank: #{playerRank}
                </p>
              )}
              <button className="restart-btn" onClick={restartGame}>
                Play Again
              </button>
              
              <div className="leaderboard">
                <h3>🏆 Your Top Scores</h3>
                {leaderboard.map((entry, index) => (
                  <div key={index} className="leaderboard-entry">
                    <span>{index + 1}. {entry.score} points</span>
                    <span style={{ opacity: 0.6 }}>{entry.date}</span>
                  </div>
                ))}
              </div>

              {globalLeaderboard.length > 0 && (
                <div className="leaderboard" style={{ marginTop: '20px' }}>
                  <h3>🌍 Global Leaderboard</h3>
                  {globalLeaderboard.map((entry, index) => (
                    <div key={index} className="leaderboard-entry">
                      <span>{index + 1}. {entry.score} points</span>
                      <span style={{ opacity: 0.6 }}>{entry.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
