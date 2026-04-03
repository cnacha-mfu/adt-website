'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    const container = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 500);
    camera.position.set(0, 0, 55);

    // ── Particles ─────────────────────────────────────────────────────────────
    const COUNT = isMobile ? 600 : 1400;
    const posArr    = new Float32Array(COUNT * 3);
    const colArr    = new Float32Array(COUNT * 3);
    const sizeArr   = new Float32Array(COUNT);
    const phaseArr  = new Float32Array(COUNT);
    const speedArr  = new Float32Array(COUNT * 3);
    const originArr = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const r     = Math.pow(Math.random(), 0.35) * 68;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.52;
      const z = r * Math.cos(phi) - 8;
      posArr[i*3] = originArr[i*3] = x;
      posArr[i*3+1] = originArr[i*3+1] = y;
      posArr[i*3+2] = originArr[i*3+2] = z;
      speedArr[i*3]   = (Math.random() - 0.5) * 0.007;
      speedArr[i*3+1] = (Math.random() - 0.5) * 0.005;
      speedArr[i*3+2] = (Math.random() - 0.5) * 0.003;
      phaseArr[i]     = Math.random() * Math.PI * 2;
      sizeArr[i]      = 0.7 + Math.random() * 2.8;
      const c = Math.random();
      if (c < 0.50) {
        colArr[i*3] = 0.047; colArr[i*3+1] = 0.784; colArr[i*3+2] = 0.831;
      } else if (c < 0.70) {
        colArr[i*3] = 0.13; colArr[i*3+1] = 0.92; colArr[i*3+2] = 1.0;
      } else if (c < 0.87) {
        const v = 0.60 + Math.random() * 0.40;
        colArr[i*3] = v * 0.82; colArr[i*3+1] = v; colArr[i*3+2] = v;
      } else {
        colArr[i*3] = 0.957; colArr[i*3+1] = 0.651; colArr[i*3+2] = 0.137;
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    pGeo.setAttribute('aColor',   new THREE.BufferAttribute(colArr, 3));
    pGeo.setAttribute('aSize',    new THREE.BufferAttribute(sizeArr, 1));

    // ── Theme detection ────────────────────────────────────────────────────────
    let isLight = document.documentElement.classList.contains('light');

    const pMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        attribute vec3  aColor;
        attribute float aSize;
        varying vec3    vColor;
        varying float   vNdcX;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (270.0 / -mv.z);
          vec4 clip = projectionMatrix * mv;
          vNdcX = clip.x / clip.w;
          gl_Position = clip;
        }
      `,
      fragmentShader: `
        varying vec3  vColor;
        varying float vNdcX;
        void main() {
          vec2  uv = gl_PointCoord - 0.5;
          float d  = dot(uv, uv) * 4.0;
          if (d > 1.0) discard;
          float core = 1.0 - smoothstep(0.0, 0.25, length(uv));
          float halo = (1.0 - sqrt(d)) * 0.55;
          float fade = smoothstep(-0.85, 0.05, vNdcX);
          gl_FragColor = vec4(vColor, (core * 0.90 + halo) * 0.60 * fade);
        }
      `,
      transparent: true,
      blending:    isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Geometry anchor ───────────────────────────────────────────────────────
    const GX = 14, GY = 0, GZ = 2;

    // ── 1. Digital Globe (wireframe sphere = global network) ──────────────────
    const globeGeo   = new THREE.SphereGeometry(14, 20, 14);
    const globeEdges = new THREE.EdgesGeometry(globeGeo);
    const globeMat   = new THREE.LineBasicMaterial({
      color: 0x0CC8D4, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const globe = new THREE.LineSegments(globeEdges, globeMat);
    globe.position.set(GX, GY, GZ);
    scene.add(globe);

    // ── 2. Network graph (nodes + edges = data network / neural net) ──────────
    const NODE_COUNT = isMobile ? 14 : 26;
    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 17 + Math.random() * 7;
      nodePositions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.65,
        r * Math.cos(phi)
      ));
    }

    const edgeVerts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 14) {
          edgeVerts.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
                         nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const netEdgeGeo = new THREE.BufferGeometry();
    netEdgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeVerts), 3));
    const netEdgeMat = new THREE.LineBasicMaterial({
      color: 0x0CC8D4, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const networkEdges = new THREE.LineSegments(netEdgeGeo, netEdgeMat);
    networkEdges.position.set(GX, GY, GZ);
    scene.add(networkEdges);

    const nodePosF32 = new Float32Array(NODE_COUNT * 3);
    nodePositions.forEach((p, i) => {
      nodePosF32[i*3] = p.x; nodePosF32[i*3+1] = p.y; nodePosF32[i*3+2] = p.z;
    });
    const netNodeGeo = new THREE.BufferGeometry();
    netNodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosF32, 3));
    const netNodeMat = new THREE.PointsMaterial({
      color: 0x22EBF8, size: 0.55, transparent: true, opacity: 0.90,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const networkNodes = new THREE.Points(netNodeGeo, netNodeMat);
    networkNodes.position.set(GX, GY, GZ);
    scene.add(networkNodes);

    // ── 3. Orbit rings (data transfer paths) ─────────────────────────────────
    const ring1Geo = new THREE.TorusGeometry(14.5, 0.06, 8, 140);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x0CC8D4, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.position.set(GX, GY, GZ);
    ring1.rotation.x = Math.PI * 0.35;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(11.5, 0.05, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xF5A623, transparent: true, opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(GX, GY, GZ);
    ring2.rotation.x = Math.PI * 0.6;
    ring2.rotation.z = Math.PI * 0.2;
    scene.add(ring2);

    // ── 4. Data packets (orbiting dots on rings) ──────────────────────────────
    const makePacket = (color: number, radius: number) => {
      const g = new THREE.SphereGeometry(radius, 8, 8);
      const m = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Mesh(g, m);
    };
    const packet1 = makePacket(0xF5A623, 0.35);
    const packet2 = makePacket(0x22EBF8, 0.25);
    const packet3 = makePacket(0x0CC8D4, 0.20);
    scene.add(packet1, packet2, packet3);

    // ── 5. Hex rings (CPU / chip aesthetic) ───────────────────────────────────
    // TorusGeometry with radialSegments=6 produces a hexagonal cross-section ring
    const hexOuterGeo = new THREE.TorusGeometry(5.5, 0.09, 6, 6);
    const hexOuterMat = new THREE.MeshBasicMaterial({
      color: 0xF5A623, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const hexOuter = new THREE.Mesh(hexOuterGeo, hexOuterMat);
    hexOuter.position.set(GX, GY, GZ);
    scene.add(hexOuter);

    const hexInnerGeo = new THREE.TorusGeometry(3.0, 0.07, 6, 6);
    const hexInnerMat = new THREE.MeshBasicMaterial({
      color: 0x0CC8D4, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const hexInner = new THREE.Mesh(hexInnerGeo, hexInnerMat);
    hexInner.position.set(GX, GY, GZ);
    scene.add(hexInner);

    // ── Theme change → swap blending on all materials ─────────────────────────
    const allLineMats   = [globeMat, netEdgeMat, ring1Mat];
    const allMeshMats   = [ring2Mat, hexOuterMat, hexInnerMat];
    const allPacketMats = [packet1, packet2, packet3].map(p => p.material as THREE.MeshBasicMaterial);

    const applyTheme = (light: boolean) => {
      isLight = light;
      const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      pMat.blending = blend; pMat.needsUpdate = true;
      netNodeMat.blending = blend; netNodeMat.needsUpdate = true;
      allLineMats.forEach(m  => { m.blending = blend; m.needsUpdate = true; });
      allMeshMats.forEach(m  => { m.blending = blend; m.needsUpdate = true; });
      allPacketMats.forEach(m => { m.blending = blend; m.needsUpdate = true; });
    };

    const themeObserver = new MutationObserver(() =>
      applyTheme(document.documentElement.classList.contains('light'))
    );
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // ── Scroll tracking (read per-frame for velocity delta) ───────────────────
    let prevScrollY = window.scrollY;
    let scrollVY    = 0;   // smoothed scroll velocity — drives particle flow

    // ── Mouse & resize ────────────────────────────────────────────────────────
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMouse = (e: MouseEvent) => {
      tmx =  (e.clientX / window.innerWidth  - 0.5) * 2;
      tmy = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize',    onResize);

    // ── Render loop ───────────────────────────────────────────────────────────
    let frame = 0;
    let rafId: number;
    const posAttr = pGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.004;

      mx += (tmx - mx) * 0.045;
      my += (tmy - my) * 0.045;

      // Scroll velocity: read per-frame, smooth + decay so flow fades when idle
      const curScrollY   = window.scrollY;
      const scrollDelta  = curScrollY - prevScrollY;
      prevScrollY        = curScrollY;
      scrollVY           = scrollVY * 0.82 + scrollDelta * 0.55;  // smooth + dampen

      // Scroll progress drives rotation boost, camera pull-back, scene fade
      const scrollProgress = Math.min(curScrollY / (window.innerHeight * 0.8), 1.0);
      const scrollBoost = 1 + scrollProgress * 3.0;
      const targetCamZ  = 55 + scrollProgress * 10;

      // ── Drift particles  (scrollVY pushes them up or down with scroll)
      const scrollFlow = -scrollVY * 0.22;   // negative = down when scrolling down
      for (let i = 0; i < COUNT; i++) {
        const p = phaseArr[i];
        posAttr.array[i*3]   += speedArr[i*3]   + Math.sin(t + p) * 0.007;
        posAttr.array[i*3+1] += speedArr[i*3+1] + Math.cos(t * 0.7 + p) * 0.005 + scrollFlow;
        posAttr.array[i*3+2] += speedArr[i*3+2];
        const dx = posAttr.array[i*3]   - originArr[i*3];
        const dy = posAttr.array[i*3+1] - originArr[i*3+1];
        const dz = posAttr.array[i*3+2] - originArr[i*3+2];
        if (dx*dx + dy*dy + dz*dz > 1600) {   // wider threshold so flow looks continuous
          posAttr.array[i*3]   = originArr[i*3];
          posAttr.array[i*3+1] = originArr[i*3+1];
          posAttr.array[i*3+2] = originArr[i*3+2];
        }
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = t * 0.022 + mx * 0.10;
      particles.rotation.x = my * 0.06;

      // Geometry fades out as user scrolls past the hero (gone by 50% scroll)
      const geoFade   = Math.max(0, 1 - scrollProgress * 2.0);
      // Boost geometry opacity in light mode so lines stay visible on pale bg
      const lightBoost = isLight ? 3.5 : 1.0;

      // ── Globe (slow, dignified — like a server globe)
      globe.rotation.y = t * 0.09 * scrollBoost + mx * 0.22;
      globe.rotation.x = t * 0.04               + my * 0.12;
      globeMat.opacity  = (0.11 + Math.sin(t * 1.5) * 0.05) * geoFade * lightBoost;

      // ── Network graph (slightly faster, follows globe)
      networkEdges.rotation.y = t * 0.07 * scrollBoost + mx * 0.25;
      networkEdges.rotation.x = t * 0.03               + my * 0.14;
      networkNodes.rotation.copy(networkEdges.rotation);
      netEdgeMat.opacity  = (0.12 + Math.sin(t * 2.0) * 0.07) * geoFade * lightBoost;
      netNodeMat.opacity  = (0.85 + Math.sin(t * 1.8) * 0.10) * geoFade;

      // ── Orbit rings (spin faster as user scrolls)
      ring1.rotation.y  =  t * 0.28 * scrollBoost + mx * 0.18;
      ring1.rotation.z  =  t * 0.14;
      ring1Mat.opacity  = (0.08 + Math.sin(t * 1.6) * 0.05) * geoFade * lightBoost;

      ring2.rotation.y  = -t * 0.22 * scrollBoost + mx * 0.12;
      ring2.rotation.z  =  t * 0.10;
      ring2Mat.opacity  = (0.05 + Math.cos(t * 2.4) * 0.04) * geoFade * lightBoost;

      // ── Data packets orbiting rings
      const a1 = t * 1.8 * scrollBoost;
      packet1.position.set(
        GX + Math.cos(a1 + ring1.rotation.y) * 14.5,
        Math.sin(a1) * 14.5 * Math.cos(Math.PI * 0.35),
        GZ + Math.sin(a1 + ring1.rotation.y) * 14.5 * 0.3
      );
      (packet1.material as THREE.MeshBasicMaterial).opacity = 0.9 * geoFade;

      const a2 = t * 2.6 * scrollBoost + Math.PI;
      packet2.position.set(
        GX + Math.cos(a2) * 11.5,
        Math.sin(a2) * 11.5 * 0.5,
        GZ + Math.cos(a2 + 1.2) * 11.5 * 0.4
      );
      (packet2.material as THREE.MeshBasicMaterial).opacity = 0.85 * geoFade;

      const a3 = -t * 3.8 * scrollBoost + Math.PI * 0.5;
      packet3.position.set(
        GX + Math.cos(a3) * 9.8,
        Math.sin(a3 * 0.8) * 6.0,
        GZ + Math.sin(a3) * 9.8 * 0.5
      );
      (packet3.material as THREE.MeshBasicMaterial).opacity = 0.80 * geoFade;

      // ── Hex rings (chip — counter-rotate each other, scroll spins them up)
      hexOuter.rotation.y  =  t * 0.16 * scrollBoost + mx * 0.14;
      hexOuter.rotation.x  =  t * 0.08               + my * 0.10;
      hexOuterMat.opacity   = (0.18 + Math.sin(t * 2.5) * 0.10) * geoFade * lightBoost;

      hexInner.rotation.y  = -t * 0.28 * scrollBoost + mx * 0.20;
      hexInner.rotation.x  =  t * 0.12               + my * 0.15;
      hexInnerMat.opacity   = (0.22 + Math.cos(t * 3.2) * 0.14) * geoFade * lightBoost;

      // ── Camera: mouse parallax + scroll zoom-out
      camera.position.x += (mx * 7              - camera.position.x) * 0.028;
      camera.position.y += (my * 4              - camera.position.y) * 0.028;
      camera.position.z += (targetCamZ          - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize',    onResize);
      themeObserver.disconnect();
      pGeo.dispose();       pMat.dispose();
      globeGeo.dispose();   globeEdges.dispose();
      netEdgeGeo.dispose(); netNodeGeo.dispose();
      ring1Geo.dispose();   ring2Geo.dispose();
      hexOuterGeo.dispose(); hexInnerGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}
