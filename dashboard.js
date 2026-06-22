// inCodeVision Dashboard Console Core Script

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initClock();
  initSystemLogs();
  initTechStats();
});

/* ==========================================================================
   1. Interactive Particles Engine (Canvas)
   ========================================================================== */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'background-particles';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));
  const maxDistance = 120;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.3)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid dot overlay faintly on background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.12;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animate();
}

/* ==========================================================================
   2. Live Clock & Session Uptime Counter
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('live-clock');
  const uptimeEl = document.getElementById('session-uptime');
  
  if (!clockEl || !uptimeEl) return;

  const startTime = Date.now();

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    clockEl.textContent = timeStr;

    const uptimeMs = Date.now() - startTime;
    const secs = Math.floor(uptimeMs / 1000) % 60;
    const mins = Math.floor(uptimeMs / 60000) % 60;
    const hrs = Math.floor(uptimeMs / 3600000);

    const pad = n => String(n).padStart(2, '0');
    uptimeEl.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  setInterval(update, 1000);
  update();
}

/* ==========================================================================
   3. Simulated System Log Console
   ========================================================================== */
function initSystemLogs() {
  const logContainer = document.getElementById('sys-logs');
  if (!logContainer) return;

  const templates = [
    'Connection to server node stable.',
    'Port 5500 heartbeat checked.',
    'System cache optimization verified: 100% parsed.',
    'Parsing modules in Task-01: Landing Page.',
    'Parsing logic in Task-02: Calculator (Local DB loaded).',
    'Updating weather cache via Open-Meteo REST service.',
    'Scanning portfolio assets for Task-04.',
    'Diagnostic report: All modules are fully responsive.',
    'Environment variables verified.',
    'Secure SSL Tunnel established on Vercel deployment.',
    'Refreshed local styling token configuration.'
  ];

  function addLog(text, type = 'info') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    p.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-tag">[${type.toUpperCase()}]</span> ${text}`;
    
    logContainer.appendChild(p);
    
    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Prune excess lines
    while (logContainer.children.length > 25) {
      logContainer.removeChild(logContainer.firstChild);
    }
  }

  // Initial logs
  setTimeout(() => addLog('inCodeVision Command Deck Initializing...', 'sys'), 200);
  setTimeout(() => addLog('Checking workspace dependencies...', 'info'), 800);
  setTimeout(() => addLog('All 4 tasks identified and responsive.', 'success'), 1400);

  // Dynamic random logs
  setInterval(() => {
    const text = templates[Math.floor(Math.random() * templates.length)];
    const roll = Math.random();
    const type = roll > 0.85 ? 'warning' : roll > 0.7 ? 'success' : 'info';
    addLog(text, type);
  }, 7000);
}

/* ==========================================================================
   4. Interactive Tech Stats Animation & Hover Effects
   ========================================================================== */
function initTechStats() {
  const cards = document.querySelectorAll('.portal-card');

  // Magnetic/Interactive mouse movement for cards
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
