import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ========================================
// Initialize Application
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initFloatingHearts();
  initMusicToggle();
  initScrollAnimations();
  initCTAButton();
});

// ========================================
// Floating Hearts Background
// ========================================
function initFloatingHearts() {
  const container = document.getElementById("hearts-container");
  const hearts = ["❤️", "💕", "💗", "💓", "💖"];

  function createHeart() {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    // Random positioning and sizing
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${Math.random() * 20 + 15}px`;
    heart.style.animationDuration = `${Math.random() * 10 + 15}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
      if (heart.parentNode) {
        heart.remove();
      }
    }, 25000);
  }

  // Create initial hearts
  for (let i = 0; i < 8; i++) {
    setTimeout(createHeart, i * 500);
  }

  // Continuously create hearts
  setInterval(createHeart, 3000);
}

// ========================================
// Music Toggle Functionality
// ========================================
function initMusicToggle() {
  const musicToggle = document.getElementById("music-toggle");
  const audio = document.getElementById("background-music");
  const musicText = musicToggle.querySelector(".music-text");

  let isPlaying = false;

  musicToggle.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      musicToggle.classList.remove("playing");
      musicText.textContent = "Click to play music";
    } else {
      // Attempt to play audio
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            musicToggle.classList.add("playing");
            musicText.textContent = "Now playing...";
          })
          .catch((error) => {
            // Audio file not found or blocked
            console.log("Audio playback failed:", error);
            musicText.textContent = "Music unavailable";

            // Still show visual feedback
            musicToggle.classList.add("playing");
            setTimeout(() => {
              musicToggle.classList.remove("playing");
              musicText.textContent = "Click to play music";
            }, 2000);
          });
      }
    }

    isPlaying = !isPlaying;
  });
}

// ========================================
// GSAP Scroll Animations
// ========================================
function initScrollAnimations() {
  // Animate each paragraph
  const paragraphs = document.querySelectorAll(".letter-paragraph");

  paragraphs.forEach((paragraph, index) => {
    // Create scroll trigger for each paragraph
    gsap.fromTo(
      paragraph,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: paragraph,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
          // Fade out when scrolling past
          onLeave: () => {
            gsap.to(paragraph, {
              opacity: 0.3,
              duration: 0.5,
              ease: "power2.out",
            });
          },
          onEnterBack: () => {
            gsap.to(paragraph, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          },
        },
      }
    );

    // Stagger animation for highlighted words within each paragraph
    const highlights = paragraph.querySelectorAll(".highlight");

    gsap.fromTo(
      highlights,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: paragraph,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // CTA section animation
  const ctaContent = document.querySelector(".cta-content");

  gsap.fromTo(
    ctaContent,
    {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Animate Love button with a slight delay
  const loveButton = document.querySelector(".love-button");

  gsap.fromTo(
    loveButton,
    {
      scale: 0,
      rotation: -10,
    },
    {
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    }
  );
}

// ========================================
// CTA Button with Confetti
// ========================================
function initCTAButton() {
  const loveButton = document.getElementById("love-button");
  let hasClicked = false;

  loveButton.addEventListener("click", () => {
    // Add clicked class for animation
    loveButton.classList.add("clicked");

    // Fire confetti
    fireConfetti();

    // Special message after first click
    if (!hasClicked) {
      hasClicked = true;

      // Multiple confetti bursts
      setTimeout(() => fireConfetti(), 300);
      setTimeout(() => fireConfetti(), 600);

      // Change button text temporarily
      const buttonText = loveButton.querySelector(".button-text");
      const originalText = buttonText.textContent;
      buttonText.textContent = "I Love You More! 💕";

      setTimeout(() => {
        buttonText.textContent = originalText;
      }, 3000);
    }

    // Remove clicked class after animation
    setTimeout(() => {
      loveButton.classList.remove("clicked");
    }, 600);
  });
}

// ========================================
// Confetti Effect
// ========================================
function fireConfetti() {
  // Get button position for confetti origin
  const loveButton = document.getElementById("love-button");
  const rect = loveButton.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // Heart-shaped confetti colors
  const colors = ["#B22222", "#DC143C", "#FF69B4", "#FFB6C1", "#FF1493"];

  // Main burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
    colors: colors,
    shapes: ["circle", "square"],
    gravity: 0.8,
    scalar: 1.2,
  });

  // Side bursts
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: x - 0.1, y },
    colors: colors,
    gravity: 0.8,
  });

  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: x + 0.1, y },
    colors: colors,
    gravity: 0.8,
  });
}

// ========================================
// Smooth scroll for any anchor links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
