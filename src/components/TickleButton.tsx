'use client';

import { useState, useRef, useEffect } from 'react';

interface TickleButtonProps {
  targetUserId: string;
  targetUsername: string;
  initialTickleCount: number;
  cooldownRemaining: number | null;
}

interface FloatingEmoji {
  id: string;
  x: number;
  y: number;
}

export function TickleButton({
  targetUserId,
  targetUsername,
  initialTickleCount,
  cooldownRemaining,
}: TickleButtonProps) {
  const [tickleCount, setTickleCount] = useState(initialTickleCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [cooldown, setCooldown] = useState(cooldownRemaining);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle cooldown countdown
  useEffect(() => {
    if (!cooldown || cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleTickle = async () => {
    if (cooldown) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tickle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: targetUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to tickle');
        return;
      }

      // Update count optimistically
      setTickleCount(data.count);

      // Add floating emoji
      const emoji: FloatingEmoji = {
        id: Math.random().toString(),
        x: Math.random() * 60 - 30,
        y: 0,
      };
      setFloatingEmojis((prev) => [...prev, emoji]);

      // Remove emoji after animation
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== emoji.id));
      }, 1000);

      // Animate button
      if (buttonRef.current) {
        buttonRef.current.classList.remove('animate-tickle-shake');
        void buttonRef.current.offsetWidth; // Trigger reflow
        buttonRef.current.classList.add('animate-tickle-shake');
      }

      // Set cooldown
      setCooldown(24);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleTickle}
        disabled={isLoading || !!cooldown}
        className={`px-6 py-3 rounded-lg font-bold text-white transition-all relative overflow-hidden ${
          cooldown
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-fb-blue hover:opacity-90 active:scale-95 cursor-pointer'
        }`}
      >
        <span className="flex items-center gap-2">
          {cooldown ? (
            <>
              <span>⏱️ {cooldown}h</span>
            </>
          ) : (
            <>
              <span>Tickle {targetUsername} 🤣</span>
            </>
          )}
        </span>
      </button>

      {/* Floating emojis */}
      {floatingEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute pointer-events-none animate-float-up text-2xl"
          style={{
            left: `calc(50% + ${emoji.x}px)`,
            top: '50%',
          }}
        >
          🤣
        </div>
      ))}

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}

      {/* Cooldown message */}
      {cooldown && (
        <div className="text-gray-600 text-sm mt-2 text-center">
          Already tickled! Try again in {cooldown} hours.
        </div>
      )}

      {/* Success message */}
      {!error && !isLoading && !cooldown && (
        <div className="text-gray-600 text-sm mt-2 text-center">
          Total tickles received: <span className="font-bold text-fb-blue">{tickleCount}</span>
        </div>
      )}
    </div>
  );
}
