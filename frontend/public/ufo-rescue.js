// ufo-rescue.js - Animated Pixel Cats & UFO Space Rescue Simulator (Vite Public Asset)
(function() {
  // SVG Pixel Cat (Orange Tabby with animations)
  const catSvg = `
    <svg width="24" height="24" viewBox="0 0 16 16" style="display:block; image-rendering:pixelated;">
      <!-- Tail with CSS wagging animation -->
      <g class="cat-tail" style="transform-origin: 12px 10px; animation: cat-tail-wag 1.2s ease-in-out infinite alternate;">
        <rect x="12" y="6" width="1" height="4" fill="#F97316" />
        <rect x="11" y="5" width="1" height="1" fill="#F97316" />
        <rect x="12" y="4" width="1" height="1" fill="#FFA5A5" /> <!-- Tip of tail -->
      </g>
      <!-- Body with breathing animation -->
      <g class="cat-body" style="transform-origin: 8px 12px; animation: cat-breath 2s ease-in-out infinite;">
        <!-- Torso -->
        <rect x="4" y="9" width="8" height="4" fill="#F97316" />
        <!-- White chest fluff -->
        <rect x="4" y="10" width="3" height="2" fill="#F8FAFC" />
      </g>
      <!-- Head with blinking eyes -->
      <g class="cat-head" style="transform-origin: 8px 8px;">
        <!-- Ears -->
        <rect x="3" y="3" width="2" height="2" fill="#F97316" />
        <rect x="11" y="3" width="2" height="2" fill="#F97316" />
        <rect x="4" y="4" width="1" height="1" fill="#FFA5A5" />
        <rect x="11" y="4" width="1" height="1" fill="#FFA5A5" />
        <!-- Face -->
        <rect x="3" y="5" width="10" height="5" fill="#F97316" />
        <!-- Eyes with blink animation -->
        <g class="cat-eyes" style="animation: cat-blink 4s infinite;">
          <rect x="5" y="6" width="1" height="2" fill="#000" />
          <rect x="10" y="6" width="1" height="2" fill="#000" />
          <rect x="5" y="7" width="1" height="1" fill="#10B981" /> <!-- Emerald eyes -->
          <rect x="10" y="7" width="1" height="1" fill="#10B981" />
        </g>
        <!-- Snout -->
        <rect x="7" y="8" width="2" height="1" fill="#FFA5A5" />
      </g>
      <!-- Legs (animate via class) -->
      <g class="cat-legs">
        <rect x="5" y="13" width="1" height="2" fill="#EA580C" class="leg-l" style="transform-origin: 5px 13px;" />
        <rect x="9" y="13" width="1" height="2" fill="#EA580C" class="leg-r" style="transform-origin: 9px 13px;" />
      </g>
    </svg>
  `;

  // SVG UFO Spacecraft
  const ufoSvg = `
    <svg width="60" height="40" viewBox="0 0 24 16" style="display:block; image-rendering:pixelated; animation: ufo-bob 1.5s ease-in-out infinite alternate; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
      <!-- Cockpit Dome -->
      <path d="M8 6C8 3 16 3 16 6" fill="#60A5FA" opacity="0.85" />
      <rect x="11" y="4" width="2" height="1" fill="#FFF" opacity="0.6" />
      <!-- Saucer Body -->
      <path d="M2 9C2 7.5 7 6 12 6C17 6 22 7.5 22 9C22 10.5 17 12 12 12C7 12 2 10.5 2 9Z" fill="#64748B" />
      <path d="M4 9C4 8 8 7 12 7C16 7 20 8 20 9C20 10 16 11 12 11C8 11 4 10 4 9Z" fill="#475569" />
      <!-- Blinking Lights -->
      <circle cx="5" cy="9" r="0.75" fill="#EF4444" style="animation: ufo-light-blink 0.6s infinite;" />
      <circle cx="8" cy="9.8" r="0.75" fill="#F59E0B" style="animation: ufo-light-blink 0.6s infinite 0.15s;" />
      <circle cx="12" cy="10.2" r="0.75" fill="#10B981" style="animation: ufo-light-blink 0.6s infinite 0.3s;" />
      <circle cx="16" cy="9.8" r="0.75" fill="#3B82F6" style="animation: ufo-light-blink 0.6s infinite 0.45s;" />
      <circle cx="19" cy="9" r="0.75" fill="#8B5CF6" style="animation: ufo-light-blink 0.6s infinite 0.6s;" />
      <!-- Hatch Door -->
      <rect x="10" y="11" width="4" height="1" fill="#1E293B" />
    </svg>
  `;

  // Inject Styles
  const style = document.createElement('style');
  style.textContent = `
    .pixel-cat-container {
      position: absolute;
      z-index: 40;
      cursor: pointer;
      transition: transform 0.2s ease;
      transform-origin: bottom center;
    }
    .pixel-cat-container:hover {
      filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.6));
    }
    .pixel-cat-container.walking .leg-l {
      animation: leg-swing 0.2s infinite alternate;
    }
    .pixel-cat-container.walking .leg-r {
      animation: leg-swing 0.2s infinite alternate-reverse;
    }
    .tractor-beam-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9997;
      pointer-events: none;
    }
    .ufo-spacecraft {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      transform-origin: center center;
    }
    
    /* Keyframe Animations */
    @keyframes cat-tail-wag {
      0% { transform: rotate(-10deg); }
      100% { transform: rotate(15deg); }
    }
    @keyframes cat-breath {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(1.05); }
    }
    @keyframes cat-blink {
      0%, 90%, 94%, 100% { transform: scaleY(1); }
      92% { transform: scaleY(0); }
    }
    @keyframes leg-swing {
      0% { transform: rotate(-15deg); }
      100% { transform: rotate(15deg); }
    }
    @keyframes ufo-bob {
      0% { transform: translateY(0); }
      100% { transform: translateY(-4px); }
    }
    @keyframes ufo-light-blink {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  let cats = [];
  let isTicking = false;

  // Spawns cats on targets
  function spawnCats() {
    // Clear active cats from DOM
    document.querySelectorAll('.pixel-cat-container').forEach(c => c.remove());
    cats = [];

    // Target UI elements
    const targets = Array.from(document.querySelectorAll('.glass-panel, .stat-card, .nav, .footer, .feature-card, .damage-card, #main-nav'));
    if (targets.length === 0) return;

    // Pick up to 5 elements randomly
    const selected = targets.sort(() => 0.5 - Math.random()).slice(0, 5);

    selected.forEach((el) => {
      const catDiv = document.createElement('div');
      catDiv.className = 'pixel-cat-container';
      catDiv.innerHTML = catSvg;

      // Make parent relative if static
      const position = window.getComputedStyle(el).position;
      if (position === 'static') {
        el.style.position = 'relative';
      }

      // Initial alignment sitting on the top edge
      catDiv.style.top = '-21px';
      const initialPct = Math.random() * 50 + 20; // 20% to 70% width
      catDiv.style.left = `${initialPct}%`;

      const catObj = {
        element: catDiv,
        parent: el,
        x: initialPct,
        dir: Math.random() > 0.5 ? 1 : -1,
        state: 'idle', // idle, walking, stretching, falling, beamed_up
        stateTimer: Math.floor(Math.random() * 100) + 50,
      };

      catDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerUFOCatch(catObj);
      });

      el.appendChild(catDiv);
      cats.push(catObj);
    });

    if (!isTicking) {
      isTicking = true;
      tick();
    }
  }

  // State machine loop for walking / idling
  function tick() {
    let activePacingCats = false;

    cats.forEach((cat) => {
      if (cat.state === 'falling' || cat.state === 'beamed_up') return;
      activePacingCats = true;

      cat.stateTimer--;
      if (cat.stateTimer <= 0) {
        // Switch state
        const rand = Math.random();
        if (rand < 0.6) {
          cat.state = 'walking';
          cat.stateTimer = Math.floor(Math.random() * 150) + 80;
        } else if (rand < 0.9) {
          cat.state = 'idle';
          cat.stateTimer = Math.floor(Math.random() * 100) + 50;
        } else {
          cat.state = 'stretching';
          cat.stateTimer = 40;
        }
      }

      if (cat.state === 'walking') {
        cat.element.classList.add('walking');
        // Pacing step
        cat.x += cat.dir * 0.25;

        // Turn boundaries
        if (cat.x >= 85) {
          cat.dir = -1;
        } else if (cat.x <= 10) {
          cat.dir = 1;
        }

        // Apply walk coordinate & flip facing direction
        cat.element.style.left = `${cat.x}%`;
        cat.element.style.transform = cat.dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
      } else if (cat.state === 'idle') {
        cat.element.classList.remove('walking');
        cat.element.style.transform = cat.dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
      } else if (cat.state === 'stretching') {
        cat.element.classList.remove('walking');
        // Arch back transform
        cat.element.style.transform = `scaleY(1.2) scaleX(${cat.dir})`;
      }
    });

    if (activePacingCats) {
      requestAnimationFrame(tick);
    } else {
      isTicking = false;
    }
  }

  // UFO Catch Physics
  function triggerUFOCatch(cat) {
    cat.state = 'falling';
    const catDiv = cat.element;
    catDiv.style.pointerEvents = 'none';

    // Move cat to body (fixed coords)
    const rect = catDiv.getBoundingClientRect();
    document.body.appendChild(catDiv);
    catDiv.style.position = 'fixed';
    catDiv.style.left = `${rect.left}px`;
    catDiv.style.top = `${rect.top}px`;

    let catX = rect.left;
    let catY = rect.top;
    let catVy = 0.4;
    const g = 0.28;
    let catRot = 0;

    // Create UFO Element
    const ufoDiv = document.createElement('div');
    ufoDiv.className = 'ufo-spacecraft';
    ufoDiv.innerHTML = ufoSvg;
    document.body.appendChild(ufoDiv);

    // Create Tractor Beam Element
    const beamSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    beamSvg.setAttribute('class', 'tractor-beam-container');
    beamSvg.innerHTML = `
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.6"/>
          <stop offset="30%" stop-color="#10B981" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <polygon id="beamPolygon" points="0,0 0,0 0,0 0,0" fill="url(#beamGrad)" style="display:none; transition: opacity 0.2s;" />
    `;
    document.body.appendChild(beamSvg);
    const beamPolygon = beamSvg.querySelector('#beamPolygon');

    // UFO State variables
    let ufoX = catX - 18; // Center saucer over cat (saucer is 60px wide, cat is 24px wide)
    let ufoY = -80;
    let ufoState = 'fly_in'; // fly_in, hover_beam, ingest, escape
    let beamOpacity = 0.8;
    let zipSpeed = 3;
    let hoverTime = 0;

    function frame() {
      const screenH = window.innerHeight;
      const ufoCenterX = ufoX + 30;
      const ufoBottomY = ufoY + 36;

      // 1. UFO Flight Logic
      if (ufoState === 'fly_in') {
        const targetUfoY = Math.max(40, Math.min(catY - 120, screenH * 0.35));
        ufoY += (targetUfoY - ufoY) * 0.12;
        ufoDiv.style.top = `${ufoY}px`;
        ufoDiv.style.left = `${ufoX}px`;

        if (Math.abs(ufoY - targetUfoY) < 4) {
          ufoState = 'hover_beam';
          beamPolygon.style.display = 'block';
        }
      } 
      else if (ufoState === 'hover_beam') {
        hoverTime++;
        // Bobbing effect
        const bobY = ufoY + Math.sin(hoverTime * 0.1) * 2;
        ufoDiv.style.top = `${bobY}px`;
        ufoDiv.style.left = `${ufoX}px`;

        // Render Tractor Beam
        const ufoBottomBobY = bobY + 35;
        beamPolygon.setAttribute('points', `
          ${ufoCenterX - 8},${ufoBottomBobY}
          ${ufoCenterX + 8},${ufoBottomBobY}
          ${ufoCenterX + 65},${screenH}
          ${ufoCenterX - 65},${screenH}
        `);
        // Pulse opacity
        beamPolygon.style.opacity = beamOpacity + Math.sin(hoverTime * 0.25) * 0.12;
      } 
      else if (ufoState === 'ingest') {
        // Tractor beam fades
        beamOpacity -= 0.12;
        if (beamOpacity <= 0) {
          beamPolygon.style.display = 'none';
          ufoState = 'escape';
        } else {
          beamPolygon.style.opacity = beamOpacity;
        }
      } 
      else if (ufoState === 'escape') {
        // Zip away vertically and horizontally
        ufoX += zipSpeed;
        ufoY -= zipSpeed * 0.6;
        zipSpeed += 1.5;
        ufoDiv.style.left = `${ufoX}px`;
        ufoDiv.style.top = `${ufoY}px`;
        // Tilt forward
        ufoDiv.style.transform = 'rotate(12deg) scale(0.9)';
      }

      // 2. Cat Rescue Physics
      if (cat.state === 'falling') {
        catVy += g;
        catY += catVy;
        catRot += 6;
        catDiv.style.top = `${catY}px`;
        catDiv.style.transform = `rotate(${catRot}deg)`;

        // Catch check: once the cat falls into the beam height zone
        if (ufoState === 'hover_beam' && catY >= ufoBottomY) {
          cat.state = 'beamed_up';
          catVy = 0;
        }

        // Catch-envelope check to prevent falling off screen
        if (catY > screenH * 0.55 && ufoState === 'fly_in') {
          // Accelerate UFO down to catch
          ufoY += 10;
        }
      } 
      else if (cat.state === 'beamed_up') {
        // Drag cat to center axis of tractor beam
        catX += (ufoCenterX - 12 - catX) * 0.15;
        // Float cat upward
        catY -= 1.8;
        catRot += 1.5; // slow float spin

        catDiv.style.left = `${catX}px`;
        catDiv.style.top = `${catY}px`;
        catDiv.style.transform = `rotate(${catRot}deg) scale(0.85)`;

        // Ingested by spaceship
        if (catY <= ufoBottomY + 6) {
          cat.state = 'ingested';
          catDiv.remove();
          ufoState = 'ingest';
        }
      }

      // Cleanup when UFO leaves screen
      if (ufoState === 'escape' && (ufoX > window.innerWidth + 120 || ufoY < -100)) {
        ufoDiv.remove();
        beamSvg.remove();
        
        // Remove from global cats array
        cats = cats.filter(c => c !== cat);

        // Respawn new cat
        setTimeout(spawnCats, 2500);
      } else {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  // Init
  function init() {
    spawnCats();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // SPA Route Watcher
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      setTimeout(spawnCats, 1500);
    }
  }, 1000);

  // Global manual trigger
  window.triggerUFOSpawn = spawnCats;
})();
