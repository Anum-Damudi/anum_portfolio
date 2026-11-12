// Initialize Lucide Icons
    lucide.createIcons();

    // 1. Boot Loader
    function dismissLoader() {
      const loader = document.getElementById('boot-loader');
      if (loader) {
        loader.classList.add('opacity-0');
        setTimeout(() => loader.remove(), 500);
      }
    }
    window.addEventListener('DOMContentLoaded', () => {
      const pBar = document.getElementById('boot-progress-bar');
      if (pBar) {
        setTimeout(() => pBar.style.width = '100%', 150);
      }
      setTimeout(dismissLoader, 1400);
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') dismissLoader();
    });

    // 2. Dark Mode Toggle & Kitsune Nightcap
    function toggleDarkMode() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateNightcap(isDark);
      if (window.renderSkills) window.renderSkills();
    }
    function updateNightcap(isDark) {
      const cap = document.getElementById('numi-nightcap');
      if (cap) {
        if (isDark) cap.classList.remove('hidden');
        else cap.classList.add('hidden');
      }
    }
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      updateNightcap(true);
    } else {
      updateNightcap(false);
    }

    // 3. Numi Kitsune Speech Bubbles per Section & Companion Scroll Behavior
    const sectionSpeech = {
      'hero': "Kon-kon! I'm Numi your kitsune guide!",
      'about': "Follow my fluffy tail—here's Anum's journey!",
      'projects': "Sniffing out clever builds! Check these out!",
      'skills': "A clever fox never stops learning!",
      'experiments': "Curious ideas brew in this quiet sandbox!",
      'achievements': "Shiny pixel trophies! Paws up!",
      'contact': "We reached the shrine! Send a note to Anum!"
    };

    let isNumiSleeping = localStorage.getItem('numi_sleeping') === 'true';
    function updateNumiSleepState() {
      const comp = document.getElementById('numi-companion');
      const label = document.getElementById('numi-sleep-label');
      const icon = document.getElementById('numi-sleep-icon');
      if (isNumiSleeping) {
        if (comp) comp.style.opacity = '0.35';
        if (label) label.textContent = 'Wake Fox';
        if (icon) icon.textContent = '🦊⏰';
        setNumiPose('sleepy');
      } else {
        if (comp) comp.style.opacity = '1';
        if (label) label.textContent = 'Sleep Fox';
        if (icon) icon.textContent = '🦊💤';
        setNumiPose('idle');
      }
    }

    function toggleNumiSleep() {
      isNumiSleeping = !isNumiSleeping;
      localStorage.setItem('numi_sleeping', isNumiSleeping);
      updateNumiSleepState();
    }
    updateNumiSleepState();

    let currentSection = 'hero';
    window.addEventListener('scroll', () => {
      // Scroll Progress Bar
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const pBar = document.getElementById('scroll-progress-bar');
      if (pBar) pBar.style.width = scrolled + '%';

      if (isNumiSleeping) return;

      // Section tracking
      const sections = ['hero', 'about', 'projects', 'skills', 'experiments', 'achievements', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            if (currentSection !== id) {
              currentSection = id;
              triggerNumiSpeech(sectionSpeech[id] || "Exploring!");
              setNumiPose(id === 'projects' ? 'excited' : id === 'contact' ? 'wave' : 'curious');
            }
            break;
          }
        }
      }
    });

    let speechTimeout;
    function triggerNumiSpeech(text) {
      const bubble = document.getElementById('numi-bubble');
      const bubbleText = document.getElementById('numi-bubble-text');
      if (!bubble || !bubbleText || isNumiSleeping) return;
      
      clearTimeout(speechTimeout);
      bubbleText.textContent = '';
      bubble.style.transform = 'scale(1.05)';
      setTimeout(() => bubble.style.transform = 'scale(1)', 150);

      let i = 0;
      function type() {
        if (i < text.length) {
          bubbleText.textContent += text.charAt(i);
          i++;
          speechTimeout = setTimeout(type, 20);
        }
      }
      type();
    }

    // 4. Kitsune Numi Sprite Poses & Reactions
    function setNumiPose(pose) {
      const bodyGroup = document.getElementById('numi-body-group');
      const curledGroup = document.getElementById('numi-curled-fox');
      const mouth = document.getElementById('numi-mouth');
      const eyes = document.getElementById('numi-eyes');
      const armL = document.getElementById('numi-arm-l');
      const armR = document.getElementById('numi-arm-r');
      const earL = document.getElementById('numi-ear-l');
      const earR = document.getElementById('numi-ear-r');
      const container = document.getElementById('numi-sprite-container');
      const tailGroup = document.getElementById('numi-tail-group');
      const pawRTip = document.getElementById('numi-paw-r-tip');

      if (!bodyGroup || !curledGroup || !container) return;

      // Reset
      container.style.transform = 'none';
      bodyGroup.classList.remove('hidden');
      curledGroup.classList.add('hidden');
      if (armL) armL.setAttribute('y', '16');
      if (armR) armR.setAttribute('y', '16');
      if (pawRTip) pawRTip.setAttribute('y', '18.5');
      if (earL) earL.setAttribute('transform', 'none');
      if (earR) earR.setAttribute('transform', 'none');
      if (tailGroup) tailGroup.style.transform = 'none';

      if (pose === 'sleepy') {
        bodyGroup.classList.add('hidden');
        curledGroup.classList.remove('hidden');
      } else if (pose === 'wave') {
        if (armR) armR.setAttribute('y', '10');
        if (pawRTip) pawRTip.setAttribute('y', '10');
        if (mouth) mouth.setAttribute('d', 'M14 18 Q16 21 18 18');
        container.style.transform = 'rotate(4deg)';
      } else if (pose === 'jump' || pose === 'excited') {
        container.style.transform = 'translateY(-12px) scale(1.08)';
        if (tailGroup) tailGroup.style.transform = 'rotate(-18deg) scale(1.15)';
        if (armL) armL.setAttribute('y', '13');
        if (armR) armR.setAttribute('y', '13');
        if (mouth) mouth.setAttribute('d', 'M13 18 Q16 22 19 18');
        setTimeout(() => container.style.transform = 'none', 320);
      } else if (pose === 'curious') {
        container.style.transform = 'rotate(-7deg)';
        if (earL) earL.setAttribute('transform', 'translate(-1, -1)');
        if (earR) earR.setAttribute('transform', 'translate(1, -2)');
        if (mouth) mouth.setAttribute('d', 'M15 18.5 Q16 20 17 18.5');
      } else if (pose === 'trot') {
        container.style.transform = 'translateX(-4px) translateY(-3px)';
        setTimeout(() => {
          container.style.transform = 'translateX(4px) translateY(1px)';
          setTimeout(() => container.style.transform = 'none', 140);
        }, 140);
      } else {
        // Idle
        if (eyes) {
          eyes.innerHTML = `
            <rect x="10" y="12" width="2.5" height="3.5" rx="0.5" fill="#2B1E1A"/>
            <rect x="19.5" y="12" width="2.5" height="3.5" rx="0.5" fill="#2B1E1A"/>
            <rect x="10.5" y="12.5" width="1" height="1" fill="#FFFDF9"/>
            <rect x="20" y="12.5" width="1" height="1" fill="#FFFDF9"/>
          `;
        }
        if (mouth) mouth.setAttribute('d', 'M14 19 Q15 20.5 16 19 Q17 20.5 18 19');
      }
    }

    function numiPokeReaction() {
      if (isNumiSleeping) {
        toggleNumiSleep();
        triggerNumiSpeech("Yip! My ears twitched, I'm awake now!");
        return;
      }
      setNumiPose('jump');
      playChiptuneBeep();
      const phrases = [
        "Yip! Tail wagging at max speed!",
        "Kon-kon! Ready to inspect more code?",
        "My kitsune senses detect clean architecture!",
        "Did someone say chiptunes & algorithms?"
      ];
      triggerNumiSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
    }

    // 5. Custom Cursor with Pixel Trail
    const cursor = document.getElementById('cursor');
    let lastParticleTime = 0;
    window.addEventListener('mousemove', (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }

      const now = Date.now();
      if (now - lastParticleTime > 45) {
        lastParticleTime = now;
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        const colors = ['#E76F51', '#F4A261', '#88A788', '#FDE48B'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
      }
    });

    // 6. 3D Project Card Tilt
    function handleCardTilt(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }
    function resetCardTilt(card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }

    // 7. Interactive Skill Constellation Canvas
    const canvas = document.getElementById('skills-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      function resizeCanvas() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      const skillsData = [
        { name: 'TypeScript', cat: 'frontend', x: 0.2, y: 0.35, color: '#FDE48B' },
        { name: 'React / Next', cat: 'frontend', x: 0.32, y: 0.25, color: '#FDE48B' },
        { name: 'Rust', cat: 'systems', x: 0.18, y: 0.65, color: '#88A788' },
        { name: 'C / C++', cat: 'systems', x: 0.34, y: 0.72, color: '#88A788' },
        { name: 'WebAssembly', cat: 'systems', x: 0.45, y: 0.5, color: '#88A788' },
        { name: 'Node / Go', cat: 'backend', x: 0.6, y: 0.3, color: '#F9B497' },
        { name: 'Docker / K8s', cat: 'backend', x: 0.72, y: 0.4, color: '#F9B497' },
        { name: 'PostgreSQL', cat: 'backend', x: 0.58, y: 0.68, color: '#F9B497' },
        { name: 'Web Audio API', cat: 'creative', x: 0.8, y: 0.65, color: '#CBB4D9' },
        { name: 'Canvas 2D / Shaders', cat: 'creative', x: 0.85, y: 0.32, color: '#CBB4D9' },
      ];

      let mouse = { x: -100, y: -100 };
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      canvas.addEventListener('mouseleave', () => {
        mouse.x = -100;
        mouse.y = -100;
      });

      function renderSkills() {
        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.classList.contains('dark');
        const points = skillsData.map(s => ({
          ...s,
          px: s.x * width,
          py: s.y * height
        }));

        // Draw connections
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].px - points[j].px;
            const dy = points[i].py - points[j].py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              ctx.beginPath();
              ctx.moveTo(points[i].px, points[i].py);
              ctx.lineTo(points[j].px, points[j].py);
              ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(37,42,39,0.08)';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }

        // Draw Nodes
        points.forEach(p => {
          const dx = mouse.x - p.px;
          const dy = mouse.y - p.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const isHovered = dist < 45;

          if (isHovered) {
            ctx.beginPath();
            ctx.arc(p.px, p.py, 18, 0, Math.PI * 2);
            ctx.fillStyle = p.color + '33';
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.px, p.py, isHovered ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = isDark ? '#1C211E' : '#FAF9F6';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Label
          ctx.font = isHovered ? 'bold 12px Inter' : '11px Inter';
          ctx.fillStyle = isDark ? '#F3F4F3' : '#252A27';
          ctx.textAlign = 'center';
          ctx.fillText(p.name, p.px, p.py + (isHovered ? 24 : 18));
        });

        requestAnimationFrame(renderSkills);
      }
      window.renderSkills = renderSkills;
      renderSkills();
    }

    // 8. Chiptune Audio Synth (Web Audio API)
    function playChiptuneBeep() {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.08);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (err) {
        console.log("Audio requires interaction first", err);
      }
    }

    // 9. Unlockable Badges
    function unlockBadge(el, description) {
      playChiptuneBeep();
      el.classList.add('ring-2', 'ring-peach');
      const toast = document.getElementById('badge-toast');
      if (toast) {
        toast.textContent = `★ UNLOCKED: ${description}`;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 3500);
      }
    }

    // 10. Contact Form Submit Simulation with Fox Carrier Numi
    function handleContactSubmit(e) {
      e.preventDefault();
      playChiptuneBeep();
      const status = document.getElementById('contact-status');
      if (status) {
        status.classList.remove('hidden');
      }
      setNumiPose('wave');
      triggerNumiSpeech("Kon! I've placed the envelope in my fox pouch for Anum!");
      e.target.reset();
    }

    // 11. Project Modal Data & Logic
    const projectsData = {
      byteweave: {
        title: "ByteWeave IDE",
        desc: "An in-browser compiler sandbox compiling toy C-like syntax to WebAssembly text (WAT), visualizing register allocations and the stack frames dynamically.",
        modules: "• Tree-sitter Grammar, LLVM-to-Wasm bridge, Monaco Editor",
        metric: "Sub-50ms AST render loop; 0 external runtime dependencies",
        repo: "https://github.com"
      },
      synthflora: {
        title: "SynthFlora Synthesizer",
        desc: "An ambient procedural soundscape garden where SVG plant geometries correspond to harmonic overtone frequencies calculated via the Web Audio API.",
        modules: "• Polyphonic Oscillator Bank, L-System Fractal generator, Canvas 2D",
        metric: "Real-time frequency analysis & 44.1kHz sample rate stability",
        repo: "https://github.com"
      },
      peerpulse: {
        title: "PeerPulse Mesh Sync",
        desc: "A decentralized peer-to-peer data synchronization network running entirely within browsers via WebRTC data channels.",
        modules: "• Conflict-Free Replicated Data Types (CRDTs), STUN signaling server in Go",
        metric: "Zero central database storage; 99.4% packet delivery rate",
        repo: "https://github.com"
      },
      pixelquest: {
        title: "PixelQuest 8-Bit Engine",
        desc: "The lightweight custom game framework built from scratch where Kitsune Numi's sprite trot cycles, bounding box physics, and bushy tail mechanics originated.",
        modules: "• Sprite sheet parser, AABB Collision quadtree, Custom audio sequencer",
        metric: "Maintains locked 60fps on mobile browsers",
        repo: "https://github.com"
      }
    };

    function openProjectModal(key) {
      const data = projectsData[key];
      if (!data) return;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;
      document.getElementById('modal-modules').textContent = data.modules;
      document.getElementById('modal-metric').textContent = data.metric;
      document.getElementById('modal-cta-repo').href = data.repo;
      
      const modal = document.getElementById('project-modal');
      const box = document.getElementById('modal-box');
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        box.classList.remove('scale-95');
      }, 10);
    }
    function closeProjectModal() {
      const modal = document.getElementById('project-modal');
      const box = document.getElementById('modal-box');
      modal.classList.add('opacity-0');
      box.classList.add('scale-95');
      setTimeout(() => modal.classList.add('hidden'), 200);
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeProjectModal();
    });

    // 12. 404 Numi Kitsune Leap Mini-Game
    const mCanvas = document.getElementById('mini-game-canvas');
    if (mCanvas) {
      const mCtx = mCanvas.getContext('2d');
      let numiY = 58;
      let numiVelocity = 0;
      let isJumping = false;
      let obstacleX = 288;
      let score = 0;
      let trotFrame = 0;

      function jumpNumiMiniGame() {
        if (!isJumping) {
          numiVelocity = -6.8;
          isJumping = true;
          playChiptuneBeep();
        }
      }
      window.jumpNumiMiniGame = jumpNumiMiniGame;

      function updateMiniGame() {
        trotFrame++;
        numiY += numiVelocity;
        numiVelocity += 0.36; // gravity
        if (numiY >= 58) {
          numiY = 58;
          isJumping = false;
          numiVelocity = 0;
        }

        obstacleX -= 2.4;
        if (obstacleX < -15) {
          obstacleX = 288 + Math.random() * 60;
          score += 10;
          const sEl = document.getElementById('game-score');
          if (sEl) sEl.textContent = score;
        }

        const isDark = document.documentElement.classList.contains('dark');
        mCtx.clearRect(0, 0, 288, 96);

        // Ground line
        mCtx.fillStyle = isDark ? '#2E3631' : '#CBDBCB';
        mCtx.fillRect(0, 80, 288, 16);

        // Draw Little Pixel Kitsune Numi
        const foxX = 28;
        // Tail
        const tailBob = (trotFrame % 20 < 10) ? 1 : -1;
        mCtx.fillStyle = '#F4A261';
        mCtx.fillRect(foxX - 7, numiY + 5 + tailBob, 8, 8);
        mCtx.fillStyle = '#FFFDF9';
        mCtx.fillRect(foxX - 9, numiY + 6 + tailBob, 4, 5); // White tail tip

        // Fox Body: Rust Orange
        mCtx.fillStyle = '#E76F51';
        mCtx.fillRect(foxX, numiY + 2, 16, 16);

        // Cream Chest / Muzzle
        mCtx.fillStyle = '#FFFDF9';
        mCtx.fillRect(foxX + 8, numiY + 7, 8, 7);

        // Pointy Ears with black tips
        mCtx.fillStyle = '#2B1E1A';
        mCtx.fillRect(foxX + 1, numiY - 5, 4, 7);
        mCtx.fillRect(foxX + 11, numiY - 5, 4, 7);
        mCtx.fillStyle = '#F7CAD0';
        mCtx.fillRect(foxX + 2, numiY - 3, 2, 4);
        mCtx.fillRect(foxX + 12, numiY - 3, 2, 4);

        // Eye & Nose
        mCtx.fillStyle = '#2B1E1A';
        mCtx.fillRect(foxX + 10, numiY + 5, 2, 3); // Eye
        mCtx.fillRect(foxX + 15, numiY + 8, 2, 2); // Tiny Nose

        // Running paws
        const legShift = (!isJumping && trotFrame % 12 < 6) ? 2 : -2;
        mCtx.fillStyle = '#2B1E1A';
        mCtx.fillRect(foxX + 2 + legShift, numiY + 18, 3, 4);
        mCtx.fillRect(foxX + 11 - legShift, numiY + 18, 3, 4);

        // Draw Bug Obstacle
        mCtx.fillStyle = '#88A788';
        mCtx.fillRect(obstacleX, 66, 13, 14);
        mCtx.fillStyle = '#252A27';
        mCtx.fillRect(obstacleX + 3, 68, 2, 2);
        mCtx.fillRect(obstacleX + 8, 68, 2, 2);

        requestAnimationFrame(updateMiniGame);
      }
      updateMiniGame();
    }

    // 13. Easter Egg: Konami Code & Typing "numi" triggers pixel confetti
    function triggerConfetti() {
      playChiptuneBeep();
      for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        conf.className = 'cursor-particle';
        conf.style.left = (window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8) + 'px';
        conf.style.top = (window.scrollY + Math.random() * 200) + 'px';
        const colors = ['#E76F51', '#F4A261', '#88A788', '#FDE48B', '#FFFDF9'];
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.width = (Math.random() * 8 + 4) + 'px';
        conf.style.height = (Math.random() * 8 + 4) + 'px';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 1200);
      }
      triggerNumiSpeech("KON-KON! Kitsune firework secret unlocked! 🦊✨");
      setNumiPose('jump');
    }

    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let wordBuffer = '';

    window.addEventListener('keydown', (e) => {
      // Konami Check
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerConfetti();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }

      // "numi" typing check
      wordBuffer += e.key.toLowerCase();
      if (wordBuffer.length > 10) wordBuffer = wordBuffer.slice(-10);
      if (wordBuffer.endsWith('numi')) {
        triggerConfetti();
      }
    });
