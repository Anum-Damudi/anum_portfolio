// 1. RETRO-CHIC NUMI LOADER LOGIC
const loaderMessages = ["Loading Anum's little corner of the internet...", "Feeding Numi delicious onigiri...", "Breaking things (sometimes)...", "Compiling playful algorithms...", "Teaching pixels to behave..."];
let loaderProgress = 0;
let loaderInterval = null;
let messageIndex = 0;
let isLoaderDismissed = false;

function initNumiLoader() {
  const container = document.getElementById('loader-pixel-blocks');
  const pctEl = document.getElementById('loader-percentage');
  const statusEl = document.getElementById('loader-status-label');
  const typeEl = document.getElementById('loader-typewriter-text');
  const overlay = document.getElementById('numi-loading-screen');
  if (!container || !overlay) return;
  
  isLoaderDismissed = false;
  overlay.classList.remove('opacity-0', 'pointer-events-none', 'hidden');
  overlay.style.display = 'flex';
  overlay.style.opacity = '1';
  loaderProgress = 0;
  container.innerHTML = '';
  
  const blockCount = 20;
  for (let i = 0; i < blockCount; i++) {
    const b = document.createElement('div');
    b.id = `loader-block-${i}`;
    b.className = 'flex-1 h-full rounded-sm bg-charcoal/10 transition-colors duration-100';
    container.appendChild(b);
  }

  const blockColors = ['#88A788', '#FDE48B', '#F9B497', '#CBB4D9'];
  let typewriterCycle = 0;

  clearInterval(loaderInterval);
  loaderInterval = setInterval(() => {
    loaderProgress += Math.floor(Math.random() * 4) + 2;
    if (loaderProgress > 100) loaderProgress = 100;
    if (pctEl) pctEl.textContent = `${loaderProgress}%`;
    
    const activeBlocks = Math.floor((loaderProgress / 100) * blockCount);
    for (let i = 0; i < activeBlocks; i++) {
      const b = document.getElementById(`loader-block-${i}`);
      if (b && !b.dataset.active) {
        b.dataset.active = 'true';
        b.style.backgroundColor = blockColors[i % blockColors.length];
      }
    }

    typewriterCycle++;
    if (typewriterCycle % 18 === 0) {
      messageIndex = (messageIndex + 1) % loaderMessages.length;
      if (typeEl) typeEl.textContent = loaderMessages[messageIndex];
    }

    if (loaderProgress >= 50 && statusEl) statusEl.textContent = 'SYSTEMS ONLINE';
    if (loaderProgress >= 85 && statusEl) statusEl.textContent = 'FOX EXCITED';

    if (loaderProgress >= 100) {
      clearInterval(loaderInterval);
      finishNumiLoader();
    }
  }, 45);
}

function finishNumiLoader() {
  if (isLoaderDismissed) return;
  isLoaderDismissed = true;
  clearInterval(loaderInterval);
  const foxAvatar = document.getElementById('loader-fox-avatar');
  if (foxAvatar) {
    foxAvatar.style.transform = 'translateY(-16px) scale(1.15)';
  }
  setTimeout(() => {
    const overlay = document.getElementById('numi-loading-screen');
    if (overlay) {
      overlay.classList.add('opacity-0');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.classList.add('hidden');
      }, 500);
    }
  }, 250);
}

function skipNumiLoader() {
  finishNumiLoader();
}

function replayNumiLoader() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  initNumiLoader();
}

window.addEventListener('keydown', (e) => {
  if (!isLoaderDismissed && (e.key === 'Escape' || e.code === 'Space' || e.key === 'Enter')) {
    skipNumiLoader();
  }
});
window.addEventListener('DOMContentLoaded', () => {
  initNumiLoader();
});

// 2. ENHANCED SKILL CONSTELLATION INTERACTIVE ENGINE
const constellationNodes = [
  // Core CS & Systems
  { name: 'Data Structures', cat: 'core', desc: 'Trees, Graphs, Hash Maps, Heaps, Algorithmic efficiency', x: 0.16, y: 0.35, color: '#88A788', r: 8 },
  { name: 'Algorithms', cat: 'core', desc: 'Divide & conquer, Dynamic programming, Graph search', x: 0.28, y: 0.24, color: '#88A788', r: 7 },
  { name: 'OOP & Java', cat: 'core', desc: 'Design patterns, Inheritance, Polymorphism, Clean code', x: 0.22, y: 0.58, color: '#88A788', r: 8 },
  { name: 'Operating Systems', cat: 'core', desc: 'Processes, Concurrency, Memory management, Virtual memory', x: 0.12, y: 0.72, color: '#88A788', r: 6 },
  { name: 'Computer Networks', cat: 'core', desc: 'TCP/IP stack, Sockets, HTTP/HTTPS, DNS pipelines', x: 0.35, y: 0.68, color: '#88A788', r: 6 },
  
  // Frontend & UI
  { name: 'HTML5 & CSS3', cat: 'frontend', desc: 'Semantic layouts, Responsive design, Modern styling', x: 0.44, y: 0.28, color: '#FDE48B', r: 7 },
  { name: 'JavaScript', cat: 'frontend', desc: 'ESNext, Async/Await, DOM mechanics, Event loop', x: 0.55, y: 0.22, color: '#FDE48B', r: 8 },
  { name: 'TypeScript', cat: 'frontend', desc: 'Strict typing, Generics, Interfaces, Production resilience', x: 0.65, y: 0.33, color: '#FDE48B', r: 8 },
  { name: 'React', cat: 'frontend', desc: 'Component architectures, Hooks, State orchestrations', x: 0.48, y: 0.44, color: '#FDE48B', r: 9 },
  { name: 'Tailwind CSS', cat: 'frontend', desc: 'Utility-first tokens, Pixel precision, Dark theme design', x: 0.38, y: 0.48, color: '#FDE48B', r: 7 },
  
  // Backend & Cloud
  { name: 'Node.js & Express', cat: 'backend', desc: 'REST API architectures, Middleware, Asynchronous I/O', x: 0.62, y: 0.52, color: '#F9B497', r: 8 },
  { name: 'Python', cat: 'backend', desc: 'Data wrangling, Automation, Computer Vision pipelines', x: 0.72, y: 0.46, color: '#F9B497', r: 8 },
  { name: 'PostgreSQL & SQL', cat: 'backend', desc: 'Relational schema design, Indexing, Transactions', x: 0.78, y: 0.62, color: '#F9B497', r: 7 },
  { name: 'REST APIs', cat: 'backend', desc: 'CRUD endpoints, Error validation, JSON schemas', x: 0.60, y: 0.74, color: '#F9B497', r: 7 },
  
  // Creative Tech
  { name: 'Computer Vision', cat: 'creative', desc: 'Facial detection, Biometric embeddings, Image matrix ops', x: 0.84, y: 0.30, color: '#CBB4D9', r: 8 },
  { name: 'OpenCV', cat: 'creative', desc: 'Image transforms, Color space analysis, Contour tracking', x: 0.90, y: 0.48, color: '#CBB4D9', r: 7 },
  { name: 'DeepFace', cat: 'creative', desc: 'Deep metric learning, Verification models & Anti-spoofing', x: 0.86, y: 0.72, color: '#CBB4D9', r: 7 },
  { name: 'Framer Motion', cat: 'creative', desc: 'Micro-interactions, Gestures, Spring physics, Orchestration', x: 0.46, y: 0.68, color: '#CBB4D9', r: 7 }
];

let activeCategory = 'all';
function filterConstellation(cat) {
  activeCategory = cat;
  const categories = ['all', 'core', 'frontend', 'backend', 'creative'];
  categories.forEach(c => {
    const btn = document.getElementById(`btn-filter-${c}`);
    if (btn) {
      if (c === cat) {
        btn.classList.add('ring-2', 'ring-peach');
      } else {
        btn.classList.remove('ring-2', 'ring-peach');
      }
    }
  });
}

function setupInteractiveConstellation() {
  const canvas = document.getElementById('skills-canvas');
  const tooltip = document.getElementById('constellation-tooltip');
  const tooltipName = document.getElementById('tooltip-name');
  const tooltipCat = document.getElementById('tooltip-cat');
  const tooltipDetail = document.getElementById('tooltip-detail');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  window.addEventListener('resize', () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
  });

  let mouse = { x: -999, y: -999 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
    if (tooltip) tooltip.style.opacity = '0';
  });

  let time = 0;
  function draw() {
    time += 0.02;
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.classList.contains('dark');

    const points = constellationNodes.map(n => {
      let px = n.x * width + Math.sin(time + n.x * 10) * 4;
      let py = n.y * height + Math.cos(time + n.y * 10) * 4;
      
      // Gentle magnetic attraction to cursor
      const dx = mouse.x - px;
      const dy = mouse.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130 && dist > 0) {
        const force = (130 - dist) / 130;
        px += (dx / dist) * force * 14;
        py += (dy / dist) * force * 14;
      }
      return { ...n, px, py };
    });

    // Connect links within same or neighboring categories
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        const dx = p1.px - p2.px;
        const dy = p1.py - p2.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const isRelevant = activeCategory === 'all' || p1.cat === activeCategory || p2.cat === activeCategory;
        if (dist < 145 && isRelevant) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(37, 42, 39, 0.12)';
          ctx.stroke();
        }
      }
    }

    // Render nodes & detect hover
    let hoveredNode = null;
    points.forEach(p => {
      const dx = mouse.x - p.px;
      const dy = mouse.y - p.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isHovered = dist < 22;
      const isCategoryActive = activeCategory === 'all' || p.cat === activeCategory;

      if (isHovered) hoveredNode = p;

      ctx.save();
      ctx.globalAlpha = isCategoryActive ? 1 : 0.25;

      // Outer soft aura
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '44';
        ctx.fill();
      }

      // Node core
      ctx.beginPath();
      ctx.arc(p.px, p.py, isHovered ? p.r + 3 : p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#1C211E' : '#FAF9F6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node Label
      ctx.font = isHovered ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.fillStyle = isDark ? '#F3F4F3' : '#252A27';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, p.px, p.py + (isHovered ? p.r + 14 : p.r + 12));
      ctx.restore();
    });

    // Tooltip update
    if (hoveredNode && tooltip) {
      tooltip.style.left = `${hoveredNode.px}px`;
      tooltip.style.top = `${hoveredNode.py}px`;
      tooltip.style.opacity = '1';
      if (tooltipName) tooltipName.textContent = hoveredNode.name;
      if (tooltipCat) {
        tooltipCat.textContent = hoveredNode.cat.toUpperCase();
        tooltipCat.style.color = hoveredNode.color;
      }
      if (tooltipDetail) tooltipDetail.textContent = hoveredNode.desc;
    } else if (tooltip && mouse.x === -999) {
      tooltip.style.opacity = '0';
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// 3. 404 MINI-GAME SANDBOX: NUMI KITSUNE LEAP RUNNER
let runnerActive = false;
let runnerOver = false;
let runnerScore = 0;
let runnerHighScore = parseInt(localStorage.getItem('numi_leap_hi') || '0', 10);
let runnerFox = { x: 34, y: 76, vy: 0, isGrounded: true, w: 20, h: 20 };
let runnerObstacles = [];
let runnerParticles = [];
let runnerSpeed = 3.2;
let lastObstacleSpawn = 0;

function initRunnerCanvas() {
  const canvas = document.getElementById('mini-game-canvas');
  const hiEl = document.getElementById('game-high-score');
  const hiTopEl = document.getElementById('game-score-top');
  if (hiEl) hiEl.textContent = runnerHighScore;
  if (hiTopEl) hiTopEl.textContent = runnerHighScore;
  if (!canvas) return;
  
  canvas.width = canvas.parentElement.clientWidth || 360;
  canvas.height = canvas.parentElement.clientHeight || 144;
  window.addEventListener('resize', () => {
    if (canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      runnerFox.y = canvas.height - 38;
    }
  });
  runnerFox.y = canvas.height - 38;
  startRunnerLoop();
}

function resetOrStartRunner() {
  const canvas = document.getElementById('mini-game-canvas');
  const overOverlay = document.getElementById('game-over-overlay');
  const actionBtn = document.getElementById('runner-action-btn');
  if (overOverlay) overOverlay.classList.add('hidden');
  if (actionBtn) actionBtn.innerHTML = '<span>⚡ Jump [Space]</span>';
  
  runnerScore = 0;
  runnerSpeed = 3.2;
  runnerObstacles = [];
  runnerParticles = [];
  runnerFox.y = (canvas ? canvas.height : 144) - 38;
  runnerFox.vy = 0;
  runnerFox.isGrounded = true;
  runnerOver = false;
  runnerActive = true;
  const sEl = document.getElementById('game-score');
  if (sEl) sEl.textContent = '0';
  jumpNumiMiniGame();
}

function jumpNumiMiniGame() {
  if (runnerOver) {
    resetOrStartRunner();
    return;
  }
  if (!runnerActive) {
    resetOrStartRunner();
    return;
  }
  if (runnerFox.isGrounded) {
    runnerFox.vy = -7.5;
    runnerFox.isGrounded = false;
    if (typeof playChiptuneBeep === 'function') playChiptuneBeep();
    // Create jump dust particles
    for (let i = 0; i < 5; i++) {
      runnerParticles.push({
        x: runnerFox.x + 6,
        y: runnerFox.y + runnerFox.h,
        vx: (Math.random() - 0.5) * 2 - 1,
        vy: -Math.random() * 2,
        life: 18,
        color: '#F4A261'
      });
    }
  }
}

function startRunnerLoop() {
  const canvas = document.getElementById('mini-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let frame = 0;

  function loop() {
    frame++;
    const w = canvas.width;
    const h = canvas.height;
    const groundY = h - 22;
    const isDark = document.documentElement.classList.contains('dark');

    ctx.clearRect(0, 0, w, h);

    // Ground line & pixel ticks
    ctx.fillStyle = isDark ? '#2E3631' : '#CBDBCB';
    ctx.fillRect(0, groundY, w, 22);
    ctx.fillStyle = isDark ? '#1C211E' : '#88A788';
    for (let x = 0; x < w; x += 24) {
      const tickOffset = (frame * runnerSpeed * 0.5) % 24;
      ctx.fillRect(x - tickOffset, groundY + 4, 12, 2);
    }

    if (runnerActive && !runnerOver) {
      // Fox physics
      runnerFox.y += runnerFox.vy;
      runnerFox.vy += 0.42;
      if (runnerFox.y >= groundY - runnerFox.h) {
        runnerFox.y = groundY - runnerFox.h;
        runnerFox.vy = 0;
        runnerFox.isGrounded = true;
      }

      // Score increment & speedup
      if (frame % 5 === 0) {
        runnerScore += 1;
        const sEl = document.getElementById('game-score');
        if (sEl) sEl.textContent = runnerScore;
        if (runnerScore > runnerHighScore) {
          runnerHighScore = runnerScore;
          localStorage.setItem('numi_leap_hi', runnerHighScore);
          const hiEl = document.getElementById('game-high-score');
          const hiTopEl = document.getElementById('game-score-top');
          if (hiEl) hiEl.textContent = runnerHighScore;
          if (hiTopEl) hiTopEl.textContent = runnerHighScore;
        }
      }
      if (frame % 400 === 0) runnerSpeed += 0.35;

      // Obstacle spawner
      if (frame - lastObstacleSpawn > 75 + Math.random() * 55) {
        lastObstacleSpawn = frame;
        const bugTypes = [
          { label: 'BUG', color: '#E76F51', w: 14, h: 16 },
          { label: '404', color: '#F9B497', w: 18, h: 18 },
          { label: 'NULL', color: '#CBB4D9', w: 16, h: 14 }
        ];
        const chosen = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        runnerObstacles.push({
          x: w + 20,
          y: groundY - chosen.h,
          w: chosen.w,
          h: chosen.h,
          color: chosen.color,
          label: chosen.label
        });
      }
    }

    // Update and draw obstacles
    for (let i = runnerObstacles.length - 1; i >= 0; i--) {
      const obs = runnerObstacles[i];
      if (runnerActive && !runnerOver) obs.x -= runnerSpeed;

      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.fillStyle = '#252A27';
      ctx.fillRect(obs.x + 3, obs.y + 4, 3, 3);
      ctx.fillRect(obs.x + obs.w - 6, obs.y + 4, 3, 3);

      // Collision detection with AABB
      if (runnerActive && !runnerOver) {
        const margin = 4;
        if (
          runnerFox.x + margin < obs.x + obs.w &&
          runnerFox.x + runnerFox.w - margin > obs.x &&
          runnerFox.y + margin < obs.y + obs.h &&
          runnerFox.y + runnerFox.h > obs.y
        ) {
          runnerOver = true;
          const overOverlay = document.getElementById('game-over-overlay');
          if (overOverlay) overOverlay.classList.remove('hidden');
          const actionBtn = document.getElementById('runner-action-btn');
          if (actionBtn) actionBtn.innerHTML = '<span>🔄 Retry Leap</span>';
        }
      }

      if (obs.x < -40) runnerObstacles.splice(i, 1);
    }

    // Particles update
    for (let i = runnerParticles.length - 1; i >= 0; i--) {
      const p = runnerParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2.5, 2.5);
      if (p.life <= 0) runnerParticles.splice(i, 1);
    }

    // Draw Pixel Kitsune Numi Sprite
    const foxX = runnerFox.x;
    const foxY = runnerFox.y;
    const trotCycle = (!runnerFox.isGrounded) ? -3 : (Math.floor(frame / 6) % 2 === 0 ? 1 : -1);
    
    // Bushy Fox Tail
    ctx.fillStyle = '#F4A261';
    ctx.fillRect(foxX - 8, foxY + 4 + trotCycle, 8, 8);
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(foxX - 10, foxY + 5 + trotCycle, 4, 6);

    // Body (Rust orange)
    ctx.fillStyle = '#E76F51';
    ctx.fillRect(foxX, foxY + 2, 16, 14);

    // Cream chest
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(foxX + 7, foxY + 6, 8, 7);

    // Pointy Ears
    ctx.fillStyle = '#2B1E1A';
    ctx.fillRect(foxX + 1, foxY - 4, 4, 6);
    ctx.fillRect(foxX + 10, foxY - 4, 4, 6);
    ctx.fillStyle = '#F7CAD0';
    ctx.fillRect(foxX + 2, foxY - 2, 2, 3);
    ctx.fillRect(foxX + 11, foxY - 2, 2, 3);

    // Eye & Nose
    ctx.fillStyle = '#2B1E1A';
    ctx.fillRect(foxX + 9, foxY + 5, 2, 2.5);
    ctx.fillRect(foxX + 14, foxY + 7, 2, 1.5);

    // Paws
    ctx.fillStyle = '#2B1E1A';
    const pawShift = runnerFox.isGrounded && Math.floor(frame / 6) % 2 === 0 ? 2 : -2;
    ctx.fillRect(foxX + 2 + pawShift, foxY + 16, 3, 3.5);
    ctx.fillRect(foxX + 10 - pawShift, foxY + 16, 3, 3.5);

    requestAnimationFrame(loop);
  }
  loop();
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    e.preventDefault();
    jumpNumiMiniGame();
  }
});

setupInteractiveConstellation();
initRunnerCanvas();
