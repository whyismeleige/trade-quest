import confetti from 'canvas-confetti';

export const celebrateAchievement = (rarity: string) => {
  const isLegendary = rarity === 'legendary';
  
  // 1. Instant Initial Burst
  confetti({
    particleCount: isLegendary ? 150 : 80,
    spread: isLegendary ? 100 : 70,
    origin: { y: 0.6 },
    colors: isLegendary ? ['#FFD700', '#FFA500', '#FFFFFF'] : undefined, // Gold/Silver for Legendary
    zIndex: 9999,
  });

  // 2. Continuous Side Cannons
  const duration = isLegendary ? 5000 : 2000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) return;

    const particleCount = isLegendary ? 4 : 2;

    // Left Cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: isLegendary ? ['#FFD700', '#FFA500'] : undefined,
      zIndex: 9999,
    });

    // Right Cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: isLegendary ? ['#FFD700', '#FFA500'] : undefined,
      zIndex: 9999,
    });

    requestAnimationFrame(frame);
  };

  frame();
};