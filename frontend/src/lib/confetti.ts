// frontend/src/lib/confetti.ts (CREATE THIS)
import confetti from 'canvas-confetti';

export const celebrateAchievement = (rarity: string) => {
  const duration = rarity === 'legendary' ? 5000 : 3000;
  const animationEnd = Date.now() + duration;
  
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
  
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    
    confetti({
      particleCount: rarity === 'legendary' ? 5 : 2,
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

// Use in achievement unlock handler