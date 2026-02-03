// --- Personalization (edit these) ---
const NAME = "Your Friend"; // change name
const WISH = `Wishing you a day filled with smiles, surprises, and happiness!
May this year bring you success, peace, and everything you dream of ✨
Always stay amazing — Happy Birthday! 🎉`;

// --- Elements ---
const personName = document.getElementById("personName");
const giftBox = document.getElementById("giftBox");
const messageBox = document.getElementById("message");
const typingEl = document.getElementById("typing");
const shareBtn = document.getElementById("shareBtn");
const replayBtn = document.getElementById("replayBtn");
const todayEl = document.getElementById("today");

personName.textContent = NAME;
todayEl.textContent = new Date().toDateString();

// --- Typewriter effect ---
let typingTimer = null;
function typeText(text, speed = 28) {
  clearInterval(typingTimer);
  typingEl.textContent = "";
  let i = 0;
  typingTimer = setInterval(() => {
    typingEl.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(typingTimer);
  }, speed);
}

// --- Confetti (simple canvas confetti) ---
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let confetti = [];
function burstConfetti(count = 150) {
  confetti = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: -10,
    r: 4 + Math.random() * 4,
    s: 2 + Math.random() * 5,
    a: Math.random() * Math.PI * 2,
    c: ["#ff6b6b","#ffd166","#4dd4ff","#b37bff","#7CFFB2","#ffffff"][Math.floor(Math.random()*6)]
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  confetti.forEach(p => {
    p.y += p.s;
    p.x += Math.sin(p.a) * 0.8;
    p.a += 0.03;
    ctx.beginPath();
    ctx.fillStyle = p.c;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  confetti = confetti.filter(p => p.y < H + 20);
  requestAnimationFrame(draw);
}
draw();

// --- Open gift action ---
let opened = false;
function openGift() {
  if (opened) return;
  opened = true;

  giftBox.classList.add("open");
  messageBox.classList.remove("hidden");

  burstConfetti();
  typeText(WISH, 24);
}

giftBox.addEventListener("click", openGift);
giftBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openGift();
});

// --- Share button ---
shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "Birthday Surprise 🎂",
    text: `A birthday wish for ${NAME} 🎉`,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      shareBtn.textContent = "Link copied ✅";
      setTimeout(() => (shareBtn.textContent = "Share this wish 🔗"), 1500);
    }
  } catch {
    // ignore
  }
});

// --- Replay ---
replayBtn.addEventListener("click", () => {
  opened = false;
  giftBox.classList.remove("open");
  messageBox.classList.add("hidden");
  typingEl.textContent = "";
  confetti = [];
});
