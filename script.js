// ===================== CONFIG =====================

// views (must match your HTML ids: view-home, view-gift, view-special)
const views = ["home", "gift", "special"];

// gallery images (file names in assets/)
const GALLERY_IMAGES = [
  "photo1.jpg",
  "photo2.jpg",
  "photo3.jpg",
  "photo4.jpg",
  "photo5.jpg",
  "photo6.jpg"
];

const GIFT_TEXT = "My little gift for you 💚";

// flight image
const FLIGHT_IMAGE = "flight.jpg";

// countdown target (Feb 14, 10am Melbourne time)
const COUNTDOWN_DATE = new Date("2026-02-14T10:00:00+11:00");

// background music
const SONG_FILE = "oursong.mp3";

// ===================== MUSIC =====================

let bgMusic = null;
if (SONG_FILE) {
  bgMusic = new Audio(`assets/${SONG_FILE}`);
  bgMusic.loop = true;
  bgMusic.volume = 0.5;
}

// ===================== EFFECTS =====================

function launchConfetti() {
  const count = 120;
  const colors = ["#ff4d6d", "#ff85a1", "#ffd1dc", "#ffffff", "#ffc6ff", "#ffb703"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";

    // spread across the screen (NOT one line)
    const left = Math.random() * 100;
    piece.style.left = left + "vw";

    // random size
    const w = 6 + Math.random() * 8;
    const h = 10 + Math.random() * 14;
    piece.style.width = w + "px";
    piece.style.height = h + "px";

    // random colour + delay + duration (so it feels like a burst)
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.15) + "s";
    piece.style.animationDuration = (2.2 + Math.random() * 1.6) + "s";

    // random rotation start
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(piece);

    // cleanup
    setTimeout(() => piece.remove(), 5000);
  }
}

function heartExplosion() {
  const wrap = document.createElement("div");
  wrap.className = "burstWrap";
  document.body.appendChild(wrap);

  const hearts = 22;

  for (let i = 0; i < hearts; i++) {
    const h = document.createElement("div");
    h.className = "burstHeart";
    h.textContent = "💝";

    const x = (Math.random() - 0.5) * 600;
    const y = (Math.random() - 0.8) * 600;

    h.style.left = "50%";
    h.style.top = "50%";
    h.style.setProperty("--x", `${x}px`);
    h.style.setProperty("--y", `${y}px`);

    wrap.appendChild(h);
  }

  setTimeout(() => wrap.remove(), 1300);
}

// ===================== NAVIGATION =====================

function showView(name) {
  for (const v of views) {
    const el = document.getElementById(`view-${v}`);
    if (!el) continue;
    el.classList.toggle("hidden", v !== name);
  }

  if (name === "gift") {
    const grid = document.getElementById("galleryGrid");
    if (grid) delete grid.dataset.rendered; // reset lock
    renderGallery();
  }

  if (name === "special") {
    renderFlight();
    startCountdown();
    heartExplosion();
    launchConfetti();
  }
}

function go(name) {
  showView(name);
}

function wireNav() {
  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => go(btn.dataset.go));
  });
}

// ===================== GALLERY =====================

function renderGallery() {
  const giftTextEl = document.getElementById("giftText");
  if (giftTextEl) giftTextEl.textContent = GIFT_TEXT;

  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  // 🔒 hard lock (prevents duplicates)
  if (grid.dataset.rendered === "true") return;
  grid.dataset.rendered = "true";

  grid.innerHTML = "";

  if (!GALLERY_IMAGES.length) {
    grid.innerHTML = `<p class="sub" style="grid-column:1/-1;">Photos coming soon 💞</p>`;
    return;
  }

  const captions = [
    "Us ❤️",
    "First Date 🥰",
    "Outdoor Adventure 🌸",
    "Shopping Vibes 🛍️",
    "Our first child 🐵",
    "Official in front of Cousins 😭"
  ];

  GALLERY_IMAGES.forEach((file, i) => {
    const card = document.createElement("div");
    card.className = "polaroid";

    const rot = (Math.random() * 10 - 5).toFixed(2);
    card.style.setProperty("--r", `${rot}deg`);
    card.classList.add(Math.random() > 0.5 ? "tape-a" : "tape-b");

    const img = document.createElement("img");
    img.src = `assets/${file}`;
    img.alt = captions[i] || "Photo";

    const cap = document.createElement("div");
    cap.className = "polaroid-cap";
    cap.textContent = captions[i] || "💗";

    card.appendChild(img);
    card.appendChild(cap);
    grid.appendChild(card);
  });
}

// ===================== FLIGHT =====================

function renderFlight() {
  const img = document.getElementById("flightImg");
  if (!img) return;
  img.src = `assets/${FLIGHT_IMAGE}`;
  img.style.display = "block";
}

// ===================== COUNTDOWN =====================

function startCountdown() {
  const elD = document.getElementById("d");
  const elH = document.getElementById("h");
  const elM = document.getElementById("m");
  const elS = document.getElementById("s");

  const label = document.getElementById("countdownLabel");

  // If these are missing, nothing will update
  if (!elD || !elH || !elM || !elS) {
    console.warn("Countdown elements not found. Need ids: d, h, m, s");
    return;
  }

  if (label) label.textContent = "Feb 14th 10:00 AM Melbourne, Australia 🇦🇺";

  const now = new Date();
  const year = now.getFullYear();

  // Feb 14, 10:00am Melbourne is AEDT (UTC+11) in February
  // That equals Feb 13, 23:00:00 UTC
  const targetThisYear = Date.parse(`${year}-02-13T23:00:00Z`);
  const targetNextYear = Date.parse(`${year + 1}-02-13T23:00:00Z`);
  const target = Date.now() > targetThisYear ? targetNextYear : targetThisYear;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    let diff = target - Date.now();

    if (diff <= 0) {
      elD.textContent = "0";
      elH.textContent = "00";
      elM.textContent = "00";
      elS.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    elD.textContent = String(days);
    elH.textContent = pad(hours);
    elM.textContent = pad(mins);
    elS.textContent = pad(secs);
  }

  tick();
  clearInterval(window.__countdownInterval);
  window.__countdownInterval = setInterval(tick, 1000);
}

// ===================== INIT =====================

function init() {
  wireNav();
  go("home");

  // unlock music on first interaction
  document.addEventListener("click", () => {
    if (bgMusic) bgMusic.play().catch(() => {});
  }, { once: true });

  const yesBtn = document.getElementById("yesBtn");
  if (yesBtn) {
    yesBtn.addEventListener("click", () => {
      if (bgMusic) bgMusic.play().catch(() => {});
      launchConfetti();
      go("gift");
    });
  }

    const noBtn = document.getElementById("noBtn");
  if (noBtn) {
    let noClicks = 0;

    const dodge = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const x = Math.floor(Math.random() * 260) - 130;
      const y = Math.floor(Math.random() * 180) - 90;

      noBtn.style.transform = `translate(${x}px, ${y}px)`;
    };

    // Trackpad / mouse hover
    noBtn.addEventListener("mouseenter", dodge);

    // Click / tap
    noBtn.addEventListener("pointerdown", dodge);

    // If it still gets clicked somehow
    noBtn.addEventListener("click", (e) => {
      noClicks++;
      dodge(e);

      if (noClicks >= 3) noBtn.textContent = "Nope 😌";
      if (noClicks >= 6) noBtn.textContent = "Stop trying 😂";
    });
  }
}

init();