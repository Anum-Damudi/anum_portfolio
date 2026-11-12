// Runner Preset and Physics Support
let currentRunnerPreset = 'normal';
let runnerPresetConfig = {
  chill: { speed: 3.5, gravity: 0.32, jumpForce: -7.0, doubleJump: true, status: 'Gentle Float • Forgiving Hitboxes' },
  normal: { speed: 5.0, gravity: 0.42, jumpForce: -7.8, doubleJump: true, status: 'Double Jump: Active (2x) • Forgiving Hitboxes' },
  turbo: { speed: 7.2, gravity: 0.52, jumpForce: -8.6, doubleJump: true, status: 'Turbo Speed (7.2x) • High Adrenaline Reflexes' }
};
let jumpsRemaining = 2;

function setRunnerPreset(preset) {
  if (!runnerPresetConfig[preset]) return;
  currentRunnerPreset = preset;
  const cfg = runnerPresetConfig[preset];
  runnerSpeed = cfg.speed;
  
  ['chill', 'normal', 'turbo'].forEach(p => {
    const btn = document.getElementById(`mode-${p}-btn`);
    if (btn) {
      if (p === preset) {
        btn.classList.add('ring-2', 'ring-peach');
      } else {
        btn.classList.remove('ring-2', 'ring-peach');
      }
    }
  });
  
  const statusEl = document.getElementById('runner-physics-status');
  if (statusEl) statusEl.textContent = cfg.status;
  if (typeof playChiptuneBeep === 'function') playChiptuneBeep();
}

// Enhanced Jump with Double Jump capability and visual pulse
const originalJumpNumiMiniGame = window.jumpNumiMiniGame;
window.jumpNumiMiniGame = function() {
  const jumpBtn = document.getElementById('runner-jump-btn');
  if (jumpBtn) {
    jumpBtn.classList.add('scale-95', 'bg-peach/20');
    setTimeout(() => jumpBtn.classList.remove('scale-95', 'bg-peach/20'), 120);
  }
  
  if (runnerOver) {
    resetOrStartRunner();
    return;
  }
  if (!runnerActive) {
    resetOrStartRunner();
    return;
  }
  
  const cfg = runnerPresetConfig[currentRunnerPreset] || runnerPresetConfig.normal;
  if (runnerFox.isGrounded) {
    jumpsRemaining = cfg.doubleJump ? 2 : 1;
  }
  
  if (jumpsRemaining > 0) {
    runnerFox.vy = cfg.jumpForce;
    runnerFox.isGrounded = false;
    jumpsRemaining--;
    if (typeof playChiptuneBeep === 'function') playChiptuneBeep();
    for (let i = 0; i < 6; i++) {
      runnerParticles.push({
        x: runnerFox.x + 6,
        y: runnerFox.y + runnerFox.h,
        vx: (Math.random() - 0.5) * 2 - 1,
        vy: -Math.random() * 2,
        life: 18,
        color: jumpsRemaining === 0 ? '#FDE48B' : '#F4A261'
      });
    }
  }
};
