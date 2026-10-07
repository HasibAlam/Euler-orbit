gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("orbitCanvas");
const ctx = canvas.getContext("2d");
const orbitComponent = document.getElementById("orbitComponent");

let width = 0;
let height = 0;
let centerX = 0;
let centerY = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

const state = {
  orbitReveal: 0,
  planetReveal: 0,
  stepReveal: 0,
  zoom: 1,
  cameraShiftX: 0,
  cameraShiftY: 0,
  sceneYaw: 0,
  scenePitch: -0.22,
  timeSpeed: 0.2
};

const stars = [];
let time = 0;

const planets = [
  {
    name: "Inner-I",
    a: 90,
    b: 70,
    speed: 1.45,
    size: 4.5,
    inclination: 1.05,
    node: 0.3,
    phase: 0.4,
    color: "#ffd27a",
    glow: "rgba(255, 184, 122, 0.7)"
  },
  {
    name: "Inner-II",
    a: 125,
    b: 92,
    speed: 1.1,
    size: 5.5,
    inclination: 0.72,
    node: 1.05,
    phase: 1.7,
    color: "#ffba70",
    glow: "rgba(255, 186, 112, 0.65)"
  },
  {
    name: "Azure",
    a: 180,
    b: 130,
    speed: 0.78,
    size: 7,
    inclination: 0.95,
    node: 2.4,
    phase: 0.9,
    color: "#53a6ff",
    glow: "rgba(83, 166, 255, 0.68)"
  },
  {
    name: "Pearl",
    a: 235,
    b: 175,
    speed: 0.58,
    size: 6.3,
    inclination: 1.18,
    node: 3.1,
    phase: 2.2,
    color: "#fff2d9",
    glow: "rgba(255, 242, 217, 0.58)"
  },
  {
    name: "Outer",
    a: 315,
    b: 235,
    speed: 0.34,
    size: 8.6,
    inclination: 0.82,
    node: 4.2,
    phase: 5.1,
    color: "#d4c1ff",
    glow: "rgba(212, 193, 255, 0.55)"
  }
];

function resizeCanvas() {
  width = orbitComponent.clientWidth;
  height = orbitComponent.clientHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  centerX = width * 0.58;
  centerY = height * 0.52;

  createStars();
}

function createStars() {
  stars.length = 0;
  const count = Math.floor((width * height) / 3600);

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.25,
      alpha: Math.random() * 0.75 + 0.1,
      drift: Math.random() * 0.25 + 0.03
    });
  }
}

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c
  };
}

function rotateY(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c
  };
}

function rotateZ(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x * c - p.y * s,
    y: p.x * s + p.y * c,
    z: p.z
  };
}

function orbitTo3D(planet, angle) {
  let p = {
    x: Math.cos(angle) * planet.a,
    y: Math.sin(angle) * planet.b,
    z: 0
  };

  // Orbit plane rotation
  p = rotateX(p, planet.inclination);
  p = rotateZ(p, planet.node);

  // Global scene motion
  p = rotateY(p, state.sceneYaw);
  p = rotateX(p, state.scenePitch);

  return p;
}

function projectPoint(p) {
  const depth = 900;
  const scale = depth / (depth + p.z);

  return {
    x: centerX + state.cameraShiftX + p.x * scale * state.zoom,
    y: centerY + state.cameraShiftY + p.y * scale * state.zoom,
    scale,
    z: p.z
  };
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    Math.max(width, height) * 0.9
  );

  bg.addColorStop(0, "rgba(255, 170, 60, 0.08)");
  bg.addColorStop(0.35, "rgba(15, 12, 32, 0.45)");
  bg.addColorStop(0.8, "rgba(4, 7, 18, 0.95)");
  bg.addColorStop(1, "rgba(2, 4, 10, 1)");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    const twinkle = 0.72 + Math.sin(time * star.drift * 8 + star.x) * 0.28;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.alpha * twinkle})`;
    ctx.arc(
      star.x + Math.cos(time * star.drift) * 2,
      star.y + Math.sin(time * star.drift) * 2,
      star.size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawSun() {
  const pulse = 1 + Math.sin(time * 1.8) * 0.03;

  const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 170);
  glow.addColorStop(0, "rgba(255, 241, 180, 0.95)");
  glow.addColorStop(0.15, "rgba(255, 190, 70, 0.45)");
  glow.addColorStop(0.5, "rgba(255, 140, 40, 0.15)");
  glow.addColorStop(1, "rgba(255, 140, 40, 0)");

  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(centerX, centerY, 170 * pulse * state.planetReveal, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(
    centerX - 8,
    centerY - 8,
    0,
    centerX,
    centerY,
    34
  );
  core.addColorStop(0, "#fff9de");
  core.addColorStop(0.45, "#ffcf5a");
  core.addColorStop(1, "#e7751a");

  ctx.beginPath();
  ctx.fillStyle = core;
  ctx.arc(centerX, centerY, 28 * pulse * Math.max(state.planetReveal, 0.2), 0, Math.PI * 2);
  ctx.fill();
}

function drawOrbit(planet, index) {
  const reveal = gsap.utils.clamp(0, 1, state.orbitReveal * 1.35 - index * 0.12);
  if (reveal <= 0) return;

  const samples = 180;
  const maxSegments = Math.floor(samples * reveal);

  for (let i = 0; i < maxSegments; i++) {
    const a1 = (i / samples) * Math.PI * 2;
    const a2 = ((i + 1) / samples) * Math.PI * 2;

    const p1 = projectPoint(orbitTo3D(planet, a1));
    const p2 = projectPoint(orbitTo3D(planet, a2));

    const avgZ = (p1.z + p2.z) * 0.5;
    const depthAlpha = avgZ < 0 ? 0.24 : 0.1;
    const alpha = depthAlpha * reveal;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(230, 220, 200, ${alpha})`;
    ctx.lineWidth = avgZ < 0 ? 1.35 : 0.75;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

function getPlanetScreenPosition(planet) {
  const orbitAngle = time * planet.speed * state.timeSpeed + planet.phase;
  const p3 = orbitTo3D(planet, orbitAngle);
  const p2 = projectPoint(p3);

  return {
    ...p2,
    orbitAngle
  };
}

function drawPlanetTrail(planet, reveal) {
  const points = [];
  const trailCount = 44;

  for (let i = 0; i < trailCount; i++) {
    const angle = time * planet.speed * state.timeSpeed + planet.phase - i * 0.05;
    const p = projectPoint(orbitTo3D(planet, angle));
    points.push(p);
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const alpha = (1 - i / trailCount) * 0.22 * reveal;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 215, 150, ${alpha})`;
    ctx.lineWidth = (1 - i / trailCount) * 2;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

function drawEulerStepMarkers() {
  const planet = planets[2];
  const reveal = state.stepReveal;
  if (reveal <= 0) return;

  const steps = 28;

  for (let i = 0; i < steps; i++) {
    const local = gsap.utils.clamp(0, 1, reveal * steps - i);
    if (local <= 0) continue;

    const angle = planet.phase + i * 0.16 + time * 0.03;
    const p = projectPoint(orbitTo3D(planet, angle));

    ctx.beginPath();
    ctx.fillStyle = `rgba(216, 182, 109, ${0.75 * local})`;
    ctx.arc(p.x, p.y, 2.3 * p.scale * local, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlanets() {
  const projectedPlanets = planets.map((planet, index) => {
    const reveal = gsap.utils.clamp(0, 1, state.planetReveal * 1.45 - index * 0.12);
    const pos = getPlanetScreenPosition(planet);
    return { planet, reveal, ...pos };
  });

  // back to front rendering
  projectedPlanets.sort((a, b) => a.z - b.z);

  for (const item of projectedPlanets) {
    if (item.reveal <= 0) continue;

    drawPlanetTrail(item.planet, item.reveal);

    const glowRadius = item.planet.size * item.scale * 6 * item.reveal;
    const bodyRadius = item.planet.size * item.scale * item.reveal;

    const glow = ctx.createRadialGradient(
      item.x,
      item.y,
      0,
      item.x,
      item.y,
      glowRadius
    );
    glow.addColorStop(0, item.planet.glow);
    glow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.fillStyle = glow;
    ctx.arc(item.x, item.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    const body = ctx.createRadialGradient(
      item.x - bodyRadius * 0.35,
      item.y - bodyRadius * 0.35,
      0,
      item.x,
      item.y,
      bodyRadius * 1.4
    );
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.35, item.planet.color);
    body.addColorStop(1, "#111111");

    ctx.beginPath();
    ctx.fillStyle = body;
    ctx.arc(item.x, item.y, bodyRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function render() {
  time += 0.016;

  drawBackground();
  drawSun();

  planets.forEach(drawOrbit);
  drawEulerStepMarkers();
  drawPlanets();

  requestAnimationFrame(render);
}

function setupScrollAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
  trigger: ".orbit-component",
  start: "top top",
  end: "+=2200",
  pin: true,
  scrub: 0.75
}
  });

  tl
    .to(state, {
      orbitReveal: 0.55,
      planetReveal: 0.25,
      zoom: 1.05,
      sceneYaw: 0.15,
      timeSpeed: 0.45,
      duration: 1
    })
    .to(state, {
      orbitReveal: 1,
      planetReveal: 0.7,
      zoom: 1.15,
      sceneYaw: 0.6,
      cameraShiftX: -25,
      timeSpeed: 0.8,
      duration: 1.1
    })
    .to(state, {
      planetReveal: 1,
      zoom: 1.28,
      sceneYaw: 1.05,
      cameraShiftX: -55,
      cameraShiftY: -8,
      timeSpeed: 1.15,
      duration: 1.35
    })
    .to(state, {
      stepReveal: 1,
      zoom: 1.18,
      sceneYaw: 1.45,
      cameraShiftX: -22,
      timeSpeed: 1.25,
      duration: 1
    })
    .to(".step-label", {
      opacity: 1,
      y: -10,
      duration: 0.5
    }, "<")
    .call(() => {
  setupVerseCarousel();
})
    .to(state, {
      zoom: 1.02,
      sceneYaw: 1.8,
      cameraShiftX: 0,
      cameraShiftY: 0,
      timeSpeed: 0.95,
      duration: 1
    });
}
function setupVerseCarousel() {
  const verses = document.querySelectorAll(".verse-card");

  if (!verses.length) return;

  let current = 0;

  verses.forEach(v => {
    v.classList.remove("active", "exit");
  });

  verses[0].classList.add("active");

  function rotateVerse() {

    const oldVerse = verses[current];

    oldVerse.classList.remove("active");
    oldVerse.classList.add("exit");

    setTimeout(() => {

      oldVerse.classList.remove("exit");

      current = (current + 1) % verses.length;

      // CRITICAL: remove active from every verse first
      verses.forEach(v => {
        v.classList.remove("active", "exit");
      });

      verses[current].classList.add("active");

      setTimeout(rotateVerse, 5000);

    }, 1000);
  }

  setTimeout(rotateVerse, 5000);
}
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
setupScrollAnimation();
render();