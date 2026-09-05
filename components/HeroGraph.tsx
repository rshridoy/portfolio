"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A live service topology: layered nodes, curved edges that draw themselves in
 * on load, and data pulses travelling them afterwards, in front of a faint
 * starfield that gives the scene depth. The one orchestrated moment on the
 * page — everything else here stays still.
 */

type Node = { pos: THREE.Vector3; layer: number; hot: number };
type Edge = { a: number; b: number; delay: number; ctrl: THREE.Vector3 };

/** How long, in seconds after its delay, an edge takes to fully draw in. */
const REVEAL_SPAN = 0.9;
/** Bezier samples per edge — enough to read as a curve, cheap to build. */
const CURVE_SEGMENTS = 10;

/** Deterministic RNG so the graph is the same shape on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function bezierPoint(p0: THREE.Vector3, c: THREE.Vector3, p1: THREE.Vector3, t: number, out: THREE.Vector3) {
  const mt = 1 - t;
  const a = mt * mt;
  const b = 2 * mt * t;
  const d = t * t;
  out.x = a * p0.x + b * c.x + d * p1.x;
  out.y = a * p0.y + b * c.y + d * p1.y;
  out.z = a * p0.z + b * c.z + d * p1.z;
  return out;
}

function buildGraph() {
  const rand = rng(20250905);
  const layers = [2, 4, 5, 4, 3];
  const nodes: Node[] = [];
  const byLayer: number[][] = [];

  layers.forEach((count, li) => {
    const ids: number[] = [];
    for (let j = 0; j < count; j++) {
      const x = (li - (layers.length - 1) / 2) * 2.35;
      const y = (j - (count - 1) / 2) * 1.62 + (rand() - 0.5) * 0.45;
      const z = (rand() - 0.5) * 1.7;
      ids.push(nodes.length);
      // A handful of nodes run hot; they read as the active services.
      nodes.push({ pos: new THREE.Vector3(x, y, z), layer: li, hot: rand() > 0.78 ? 1 : 0 });
    }
    byLayer.push(ids);
  });

  const raw: { a: number; b: number; delay: number }[] = [];
  for (let li = 0; li < byLayer.length - 1; li++) {
    for (const a of byLayer[li]) {
      const next = byLayer[li + 1];
      const fanout = 1 + (rand() > 0.45 ? 1 : 0);
      const picked = new Set<number>();
      for (let k = 0; k < fanout; k++) {
        const b = next[Math.floor(rand() * next.length)];
        if (picked.has(b)) continue;
        picked.add(b);
        raw.push({ a, b, delay: li * 0.22 + rand() * 0.18 });
      }
    }
    // One skip connection per layer keeps it from reading as a neural net.
    if (li < byLayer.length - 2 && rand() > 0.4) {
      const a = byLayer[li][Math.floor(rand() * byLayer[li].length)];
      const b = byLayer[li + 2][Math.floor(rand() * byLayer[li + 2].length)];
      raw.push({ a, b, delay: li * 0.22 + 0.3 });
    }
  }

  // A gentle bow on each edge, offset in the screen plane, so the graph reads
  // as circuitry rather than a wireframe mesh.
  const up = new THREE.Vector3(0, 0, 1);
  const edges: Edge[] = raw.map((e) => {
    const a = nodes[e.a].pos;
    const b = nodes[e.b].pos;
    const dir = b.clone().sub(a);
    const dist = dir.length();
    dir.normalize();
    const perp = new THREE.Vector3(-dir.y, dir.x, dir.z * 0.2).normalize();
    const bend = (rand() - 0.5) * dist * 0.55;
    const ctrl = a.clone().add(b).multiplyScalar(0.5).addScaledVector(perp, bend).addScaledVector(up, (rand() - 0.5) * 0.3);
    return { ...e, ctrl };
  });

  return { nodes, edges };
}

export default function HeroGraph() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { nodes, edges } = buildGraph();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the hero stays a plain, readable text block.
    }
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const group = new THREE.Group();
    scene.add(group);

    const PAPER = new THREE.Color("#e8edf2");
    const SIGNAL = new THREE.Color("#ffb627");
    const SIGNAL_COOL = new THREE.Color("#5fc9e8");

    // ---- Backdrop: a faint, slow-parallax field of depth cues -------------
    const STAR_COUNT = 160;
    const starRand = rng(4090);
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starPhase = new Float32Array(STAR_COUNT);
    const starSize = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos.set(
        [(starRand() - 0.5) * 46, (starRand() - 0.5) * 30, -14 - starRand() * 16],
        i * 3,
      );
      starPhase[i] = starRand() * Math.PI * 2;
      starSize[i] = 3 + starRand() * 5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(starPhase, 1));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPaper: { value: PAPER } },
      vertexShader: /* glsl */ `
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        varying float vTwinkle;
        void main() {
          vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.6 + aPhase));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (9.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uPaper;
        varying float vTwinkle;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(uPaper, smoothstep(0.5, 0.0, d) * vTwinkle * 0.22);
        }
      `,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ---- Nodes -------------------------------------------------------------
    const nPos = new Float32Array(nodes.length * 3);
    const nDelay = new Float32Array(nodes.length);
    const nSize = new Float32Array(nodes.length);
    const nHot = new Float32Array(nodes.length);
    nodes.forEach((n, i) => {
      nPos.set([n.pos.x, n.pos.y, n.pos.z], i * 3);
      nDelay[i] = n.layer * 0.2;
      nSize[i] = n.hot ? 22 : 13;
      nHot[i] = n.hot;
    });

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
    nodeGeo.setAttribute("aDelay", new THREE.BufferAttribute(nDelay, 1));
    nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(nSize, 1));
    nodeGeo.setAttribute("aHot", new THREE.BufferAttribute(nHot, 1));

    const nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPaper: { value: PAPER },
        uSignal: { value: SIGNAL },
        uScale: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute float aDelay;
        attribute float aSize;
        attribute float aHot;
        uniform float uTime;
        uniform float uScale;
        varying float vHot;
        varying float vAppear;
        void main() {
          vHot = aHot;
          vAppear = smoothstep(aDelay, aDelay + 0.55, uTime);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // Hot nodes breathe slowly once they are up.
          float pulse = 1.0 + aHot * 0.14 * sin(uTime * 1.9 + position.x * 2.0);
          gl_PointSize = aSize * uScale * vAppear * pulse * (9.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uPaper;
        uniform vec3 uSignal;
        varying float vHot;
        varying float vAppear;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.06, d);
          float halo = smoothstep(0.5, 0.0, d) * 0.35;
          vec3 c = mix(uPaper, uSignal, vHot);
          gl_FragColor = vec4(c, (core * 0.95 + halo) * vAppear);
        }
      `,
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // A soft, larger halo behind hot nodes reads as a glow without a real
    // bloom pass — a second, bigger, dimmer point drawn under the crisp one.
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
    glowGeo.setAttribute("aDelay", new THREE.BufferAttribute(nDelay, 1));
    glowGeo.setAttribute("aHot", new THREE.BufferAttribute(nHot, 1));
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uSignal: { value: SIGNAL }, uScale: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute float aDelay;
        attribute float aHot;
        uniform float uTime;
        uniform float uScale;
        varying float vHot;
        varying float vAppear;
        void main() {
          vHot = aHot;
          vAppear = smoothstep(aDelay, aDelay + 0.55, uTime);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aHot * 64.0 * uScale * vAppear * (9.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uSignal;
        varying float vHot;
        varying float vAppear;
        void main() {
          if (vHot < 0.5) discard;
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uSignal, glow * glow * 0.22 * vAppear);
        }
      `,
    });
    group.add(new THREE.Points(glowGeo, glowMat));

    // ---- Edges: curved, and drawn in along their own length ----------------
    const pairs = edges.length * CURVE_SEGMENTS;
    const ePos = new Float32Array(pairs * 2 * 3);
    const eT = new Float32Array(pairs * 2);
    const eDelay = new Float32Array(pairs * 2);
    const p0 = new THREE.Vector3();
    const p1 = new THREE.Vector3();
    edges.forEach((e, i) => {
      const a = nodes[e.a].pos;
      const b = nodes[e.b].pos;
      for (let s = 0; s < CURVE_SEGMENTS; s++) {
        const t0 = s / CURVE_SEGMENTS;
        const t1 = (s + 1) / CURVE_SEGMENTS;
        bezierPoint(a, e.ctrl, b, t0, p0);
        bezierPoint(a, e.ctrl, b, t1, p1);
        const tMid = (t0 + t1) / 2;
        const o = (i * CURVE_SEGMENTS + s) * 2 * 3;
        const vi = (i * CURVE_SEGMENTS + s) * 2;
        ePos.set([p0.x, p0.y, p0.z, p1.x, p1.y, p1.z], o);
        eT[vi] = tMid;
        eT[vi + 1] = tMid;
        eDelay[vi] = e.delay;
        eDelay[vi + 1] = e.delay;
      }
    });

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
    edgeGeo.setAttribute("aT", new THREE.BufferAttribute(eT, 1));
    edgeGeo.setAttribute("aDelay", new THREE.BufferAttribute(eDelay, 1));

    const edgeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uLine: { value: new THREE.Color("#5b9bd4") } },
      vertexShader: /* glsl */ `
        attribute float aT;
        attribute float aDelay;
        uniform float uTime;
        varying float vAlpha;
        void main() {
          // A soft "drawing" front sweeps along the curve from t=0 to t=1.
          float front = (uTime - aDelay) / ${REVEAL_SPAN.toFixed(3)};
          vAlpha = smoothstep(aT - 0.07, aT, front);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uLine;
        varying float vAlpha;
        void main() { gl_FragColor = vec4(uLine, vAlpha * 0.62); }
      `,
    });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ---- Pulses travelling the curved edges --------------------------------
    const PULSES = reduced ? 0 : 30;
    const pPos = new Float32Array(Math.max(PULSES, 1) * 3);
    const pFade = new Float32Array(Math.max(PULSES, 1));
    const pTone = new Float32Array(Math.max(PULSES, 1));
    const rand = rng(77);
    const pulses = Array.from({ length: PULSES }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.14 + rand() * 0.24,
      tone: rand() > 0.62 ? 1 : 0,
    }));
    pulses.forEach((p, i) => (pTone[i] = p.tone));

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pulseGeo.setAttribute("aFade", new THREE.BufferAttribute(pFade, 1));
    pulseGeo.setAttribute("aTone", new THREE.BufferAttribute(pTone, 1));
    const pulseMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uSignal: { value: SIGNAL }, uCool: { value: SIGNAL_COOL }, uScale: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute float aFade;
        attribute float aTone;
        uniform float uScale;
        varying float vFade;
        varying float vTone;
        void main() {
          vFade = aFade;
          vTone = aTone;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 10.0 * uScale * (9.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uSignal;
        uniform vec3 uCool;
        varying float vFade;
        varying float vTone;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          vec3 c = mix(uSignal, uCool, vTone);
          gl_FragColor = vec4(c, smoothstep(0.5, 0.0, d) * vFade);
        }
      `,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    pulsePoints.visible = PULSES > 0;
    group.add(pulsePoints);

    // ---- Framing, pointer parallax, loop ----------------------------------
    let width = 0;
    let height = 0;

    const resize = () => {
      const r = el.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;

      const narrow = width < 900;
      // Wide screens: hold the graph clear of the headline on the left.
      // Narrow screens: centre it and let the scrim carry legibility.
      group.position.x = narrow ? 0 : 4.6;
      const fit = narrow ? 13.0 : 9.8;
      camera.position.z = fit * Math.max(1, 1.3 / camera.aspect);
      camera.updateProjectionMatrix();
      const scale = Math.min(width / 1200, 1.15);
      nodeMat.uniforms.uScale.value = Math.max(0.62, scale);
      glowMat.uniforms.uScale.value = Math.max(0.62, scale);
      pulseMat.uniforms.uScale.value = Math.max(0.62, scale);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    // A light scroll parallax: the whole hero layer drifts and softens as the
    // page scrolls past it, so the transition into the first section feels
    // directed rather than the canvas just vanishing.
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      el.style.transform = `translateY(${progress * 34}px) scale(${1 + progress * 0.045})`;
      el.style.opacity = String(1 - progress * 0.55);
    };
    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Only run while the hero is actually on screen and the tab is visible.
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(el);

    const clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      const t = clock.getElapsedTime();
      nodeMat.uniforms.uTime.value = t;
      glowMat.uniforms.uTime.value = t;
      edgeMat.uniforms.uTime.value = t;
      starMat.uniforms.uTime.value = t;

      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      group.rotation.y = pointer.x * 0.16 + (reduced ? 0 : Math.sin(t * 0.13) * 0.05);
      group.rotation.x = -pointer.y * 0.09;
      // A slow, barely-there float keeps the finished graph from looking inert.
      group.position.y = reduced ? 0 : Math.sin(t * 0.22) * 0.12;
      starField.rotation.y = pointer.x * 0.035;
      starField.rotation.x = -pointer.y * 0.02;

      if (PULSES > 0) {
        // Pulses hold until the edge they ride has finished drawing.
        for (let i = 0; i < pulses.length; i++) {
          const p = pulses[i];
          const e = edges[p.edge];
          const drawn = THREE.MathUtils.smoothstep(t, e.delay, e.delay + REVEAL_SPAN);
          p.t += p.speed * 0.016 * drawn;
          if (p.t > 1) {
            p.t = 0;
            p.edge = Math.floor(Math.random() * edges.length);
          }
          const edge = edges[p.edge];
          bezierPoint(nodes[edge.a].pos, edge.ctrl, nodes[edge.b].pos, p.t, p0);
          pPos[i * 3] = p0.x;
          pPos[i * 3 + 1] = p0.y;
          pPos[i * 3 + 2] = p0.z;
          // Fade in and out at the ends so pulses do not pop at the nodes.
          pFade[i] = Math.sin(Math.PI * p.t) * drawn;
        }
        pulseGeo.attributes.position.needsUpdate = true;
        pulseGeo.attributes.aFade.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;
      render();
    };

    if (reduced) {
      // Show the finished graph, then stop.
      clock.elapsedTime = 4;
      nodeMat.uniforms.uTime.value = 4;
      glowMat.uniforms.uTime.value = 4;
      edgeMat.uniforms.uTime.value = 4;
      starMat.uniforms.uTime.value = 4;
      renderer.render(scene, camera);
      const still = () => {
        resize();
        renderer.render(scene, camera);
      };
      ro.disconnect();
      const ro2 = new ResizeObserver(still);
      ro2.observe(el);
      return () => {
        ro2.disconnect();
        io.disconnect();
        renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      starGeo.dispose();
      nodeGeo.dispose();
      glowGeo.dispose();
      edgeGeo.dispose();
      pulseGeo.dispose();
      starMat.dispose();
      nodeMat.dispose();
      glowMat.dispose();
      edgeMat.dispose();
      pulseMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={holder} aria-hidden="true" style={{ position: "absolute", inset: 0, willChange: "transform" }} />;
}
