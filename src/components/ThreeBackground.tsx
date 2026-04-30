'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type ColorKey = 'teal' | 'tealBright' | 'gold';

// Abstract IT shapes — wireframe geometric primitives orbiting the globe
const SHAPE_DEFS: ReadonlyArray<{ type: 'box' | 'octahedron' | 'icosahedron' | 'tetrahedron'; size: number; color: ColorKey }> = [
  { type: 'box',         size: 1.6, color: 'teal' },
  { type: 'octahedron',  size: 1.3, color: 'tealBright' },
  { type: 'icosahedron', size: 1.1, color: 'gold' },
  { type: 'box',         size: 0.9, color: 'tealBright' },
  { type: 'tetrahedron', size: 1.4, color: 'teal' },
  { type: 'octahedron',  size: 0.8, color: 'gold' },
  { type: 'icosahedron', size: 1.5, color: 'teal' },
  { type: 'box',         size: 1.2, color: 'gold' },
  { type: 'tetrahedron', size: 1.0, color: 'tealBright' },
  { type: 'icosahedron', size: 0.9, color: 'gold' },
  { type: 'octahedron',  size: 1.4, color: 'teal' },
  { type: 'box',         size: 1.1, color: 'tealBright' },
  { type: 'tetrahedron', size: 1.3, color: 'teal' },
  { type: 'icosahedron', size: 1.0, color: 'gold' },
  { type: 'octahedron',  size: 1.2, color: 'tealBright' },
  { type: 'box',         size: 0.8, color: 'teal' },
  { type: 'tetrahedron', size: 1.5, color: 'gold' },
  { type: 'icosahedron', size: 1.3, color: 'tealBright' },
];

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    const container = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 768;

    // ── Theme palette (dark teal/gold ⇄ light blue/gold) ──────────────────────
    let isLight = document.documentElement.classList.contains('light');
    const palette = (light: boolean): Record<ColorKey, number> => ({
      teal:       light ? 0x1E88E5 : 0x0CC8D4,
      tealBright: light ? 0x42A5F5 : 0x22EBF8,
      gold:       light ? 0xD29108 : 0xF5A623,
    });
    // Per-vertex particle colors (RGB 0..1) for each theme
    const COL: Record<ColorKey, { dark: [number, number, number]; light: [number, number, number] }> = {
      teal:       { dark: [0.047, 0.784, 0.831], light: [0.118, 0.533, 0.898] },
      tealBright: { dark: [0.13,  0.92,  1.0  ], light: [0.259, 0.647, 0.961] },
      gold:       { dark: [0.957, 0.651, 0.137], light: [0.824, 0.569, 0.031] },
    };

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
    const posArr      = new Float32Array(COUNT * 3);
    const colArrDark  = new Float32Array(COUNT * 3);
    const colArrLight = new Float32Array(COUNT * 3);
    const sizeArr     = new Float32Array(COUNT);
    const phaseArr    = new Float32Array(COUNT);
    const speedArr    = new Float32Array(COUNT * 3);
    const originArr   = new Float32Array(COUNT * 3);

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
      const setCol = (dark: [number, number, number], light: [number, number, number]) => {
        colArrDark[i*3]    = dark[0];  colArrDark[i*3+1]  = dark[1];  colArrDark[i*3+2]  = dark[2];
        colArrLight[i*3]   = light[0]; colArrLight[i*3+1] = light[1]; colArrLight[i*3+2] = light[2];
      };
      if (c < 0.50) {
        setCol(COL.teal.dark, COL.teal.light);
      } else if (c < 0.70) {
        setCol(COL.tealBright.dark, COL.tealBright.light);
      } else if (c < 0.87) {
        const v = 0.60 + Math.random() * 0.40;
        const grey: [number, number, number] = [v * 0.82, v, v];
        setCol(grey, grey);
      } else {
        setCol(COL.gold.dark, COL.gold.light);
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    pGeo.setAttribute('aColor',   new THREE.BufferAttribute(new Float32Array(isLight ? colArrLight : colArrDark), 3));
    pGeo.setAttribute('aSize',    new THREE.BufferAttribute(sizeArr, 1));

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
      blending:   isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Geometry anchor ───────────────────────────────────────────────────────
    const GX = 14, GY = 0, GZ = 2;

    const pal = palette(isLight);

    // ── 1. Digital Globe (wireframe sphere) ───────────────────────────────────
    const globeGeo   = new THREE.SphereGeometry(14, 20, 14);
    const globeEdges = new THREE.EdgesGeometry(globeGeo);
    const globeMat   = new THREE.LineBasicMaterial({
      color: pal.teal, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const globe = new THREE.LineSegments(globeEdges, globeMat);
    globe.position.set(GX, GY, GZ);
    scene.add(globe);

    // ── 2. Abstract IT shape constellation ────────────────────────────────────
    // Wireframe geometric primitives (boxes, octahedra, icosahedra, tetrahedra)
    // with circuit-board connection lines — evokes data structures, 3D rendering,
    // network topology, and computational geometry
    const abstractGroup = new THREE.Group();
    abstractGroup.position.set(GX, GY, GZ);
    scene.add(abstractGroup);

    const ACTIVE_SHAPES = isMobile ? SHAPE_DEFS.slice(0, 10) : SHAPE_DEFS;
    const shapeMeshes:  THREE.LineSegments[] = [];
    const shapeEdgeGeos: THREE.EdgesGeometry[] = [];
    const shapeMats:    THREE.LineBasicMaterial[] = [];
    const shapeColorKeys: ColorKey[] = [];
    const shapeSpinX:   number[] = [];
    const shapeSpinY:   number[] = [];
    const shapeSpinZ:   number[] = [];
    const shapePhases:  number[] = [];
    const localPositions: THREE.Vector3[] = [];

    ACTIVE_SHAPES.forEach((def, i) => {
      // Distribute at varying radii so shapes cluster around (not just on) the globe
      const r     = 14 + Math.random() * 14;
      const theta = (i / ACTIVE_SHAPES.length) * Math.PI * 2 + Math.random() * 0.8;
      const phi   = Math.acos(2 * Math.random() - 1);
      const pos   = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.65,
        r * Math.cos(phi)
      );
      localPositions.push(pos);

      let srcGeo: THREE.BufferGeometry;
      switch (def.type) {
        case 'box':         srcGeo = new THREE.BoxGeometry(def.size, def.size, def.size); break;
        case 'octahedron':  srcGeo = new THREE.OctahedronGeometry(def.size); break;
        case 'icosahedron': srcGeo = new THREE.IcosahedronGeometry(def.size, 0); break;
        default:            srcGeo = new THREE.TetrahedronGeometry(def.size); break;
      }
      const edges = new THREE.EdgesGeometry(srcGeo);
      srcGeo.dispose();

      const mat  = new THREE.LineBasicMaterial({
        color: pal[def.color], transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.LineSegments(edges, mat);
      mesh.position.copy(pos);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      abstractGroup.add(mesh);

      shapeMeshes.push(mesh);
      shapeEdgeGeos.push(edges);
      shapeMats.push(mat);
      shapeColorKeys.push(def.color);
      shapeSpinX.push((Math.random() - 0.5) * 0.012);
      shapeSpinY.push((Math.random() - 0.5) * 0.016);
      shapeSpinZ.push((Math.random() - 0.5) * 0.010);
      shapePhases.push(Math.random() * Math.PI * 2);
    });

    // Circuit-board connections between nearby shapes
    const netVerts: number[] = [];
    for (let i = 0; i < localPositions.length; i++) {
      for (let j = i + 1; j < localPositions.length; j++) {
        if (localPositions[i].distanceTo(localPositions[j]) < 15) {
          const a = localPositions[i], b = localPositions[j];
          netVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const netGeo = new THREE.BufferGeometry();
    netGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(netVerts), 3));
    const netMat = new THREE.LineBasicMaterial({
      color: pal.teal, transparent: true, opacity: 0.10,
      blending: THREE.AdditiveBlending,
    });
    abstractGroup.add(new THREE.LineSegments(netGeo, netMat));

    // ── 3. Orbit rings ────────────────────────────────────────────────────────
    const makeRing = (radius: number, color: number, tiltX: number, tiltZ: number, baseOp: number) => {
      const geo  = new THREE.TorusGeometry(radius, 0.06, 8, Math.round(radius * 10));
      const mat  = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: baseOp, blending: THREE.AdditiveBlending });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(GX, GY, GZ);
      mesh.rotation.x = tiltX;
      mesh.rotation.z = tiltZ;
      scene.add(mesh);
      return { mesh, geo, mat };
    };

    const ring1 = makeRing(14.5, pal.teal,       Math.PI * 0.35, 0,            0.10);
    const ring2 = makeRing(11.5, pal.gold,       Math.PI * 0.60, Math.PI * 0.2, 0.08);
    const ring3 = makeRing(17.5, pal.tealBright, Math.PI * 0.18, Math.PI * 0.1, 0.06);

    // ── 4. Data packets orbiting the rings ────────────────────────────────────
    const makePacket = (color: number, radius: number) => {
      const g    = new THREE.SphereGeometry(radius, 8, 8);
      const m    = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
      const mesh = new THREE.Mesh(g, m);
      scene.add(mesh);
      return mesh;
    };
    const packet1 = makePacket(pal.gold,       0.35);
    const packet2 = makePacket(pal.tealBright, 0.25);
    const packet3 = makePacket(pal.teal,       0.20);

    // ── 5. Hex rings (CPU / chip aesthetic) ───────────────────────────────────
    const hexOuter = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.09, 6, 6),
      new THREE.MeshBasicMaterial({ color: pal.gold, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending })
    );
    hexOuter.position.set(GX, GY, GZ);
    scene.add(hexOuter);

    const hexInner = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.07, 6, 6),
      new THREE.MeshBasicMaterial({ color: pal.teal, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending })
    );
    hexInner.position.set(GX, GY, GZ);
    scene.add(hexInner);

    const hexOuterMat = hexOuter.material as THREE.MeshBasicMaterial;
    const hexInnerMat = hexInner.material as THREE.MeshBasicMaterial;

    // ── Theme switching ───────────────────────────────────────────────────────
    const themeMats: THREE.Material[] = [
      pMat, globeMat, netMat,
      ring1.mat, ring2.mat, ring3.mat,
      hexOuterMat, hexInnerMat,
      ...shapeMats,
      ...[packet1, packet2, packet3].map(p => p.material as THREE.MeshBasicMaterial),
    ];

    const applyTheme = (light: boolean) => {
      isLight = light;
      const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      themeMats.forEach(m => { (m as THREE.ShaderMaterial | THREE.LineBasicMaterial | THREE.MeshBasicMaterial).blending = blend; m.needsUpdate = true; });

      // Recolor materials per theme
      const p = palette(light);
      globeMat.color.setHex(p.teal);
      netMat.color.setHex(p.teal);
      ring1.mat.color.setHex(p.teal);
      ring2.mat.color.setHex(p.gold);
      ring3.mat.color.setHex(p.tealBright);
      hexOuterMat.color.setHex(p.gold);
      hexInnerMat.color.setHex(p.teal);
      (packet1.material as THREE.MeshBasicMaterial).color.setHex(p.gold);
      (packet2.material as THREE.MeshBasicMaterial).color.setHex(p.tealBright);
      (packet3.material as THREE.MeshBasicMaterial).color.setHex(p.teal);
      shapeMats.forEach((m, i) => m.color.setHex(p[shapeColorKeys[i]]));

      // Swap pre-baked particle colors
      const colorAttr = pGeo.attributes.aColor as THREE.BufferAttribute;
      (colorAttr.array as Float32Array).set(light ? colArrLight : colArrDark);
      colorAttr.needsUpdate = true;
    };

    const themeObserver = new MutationObserver(() =>
      applyTheme(document.documentElement.classList.contains('light'))
    );
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // ── Scroll / mouse ────────────────────────────────────────────────────────
    let prevScrollY = window.scrollY, scrollVY = 0;
    let mx = 0, my = 0, tmx = 0, tmy = 0;

    const onMouse  = (e: MouseEvent) => {
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
    let frame = 0, rafId: number;
    const posAttr = pGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.004;

      mx += (tmx - mx) * 0.045;
      my += (tmy - my) * 0.045;

      const curScrollY  = window.scrollY;
      scrollVY          = scrollVY * 0.82 + (curScrollY - prevScrollY) * 0.55;
      prevScrollY       = curScrollY;

      const scrollProgress = Math.min(curScrollY / (window.innerHeight * 0.8), 1.0);
      const scrollBoost    = Math.max(0.15, 1 - scrollProgress * 0.85);
      const targetCamZ     = 55 + scrollProgress * 10;
      const geoFade        = Math.max(0, 1 - scrollProgress * 2.0);
      const lightBoost     = isLight ? 3.5 : 1.0;

      // Particle drift
      const scrollFlow = -scrollVY * 0.22;
      for (let i = 0; i < COUNT; i++) {
        const ph = phaseArr[i];
        posAttr.array[i*3]   += speedArr[i*3]   + Math.sin(t + ph) * 0.007;
        posAttr.array[i*3+1] += speedArr[i*3+1] + Math.cos(t * 0.7 + ph) * 0.005 + scrollFlow;
        posAttr.array[i*3+2] += speedArr[i*3+2];
        const dx = posAttr.array[i*3]   - originArr[i*3];
        const dy = posAttr.array[i*3+1] - originArr[i*3+1];
        const dz = posAttr.array[i*3+2] - originArr[i*3+2];
        if (dx*dx + dy*dy + dz*dz > 1600) {
          posAttr.array[i*3]   = originArr[i*3];
          posAttr.array[i*3+1] = originArr[i*3+1];
          posAttr.array[i*3+2] = originArr[i*3+2];
        }
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = t * 0.022 + mx * 0.10;
      particles.rotation.x = my * 0.06;

      // Globe
      globe.rotation.y = t * 0.09 * scrollBoost + mx * 0.22;
      globe.rotation.x = t * 0.04               + my * 0.12;
      globeMat.opacity  = (0.11 + Math.sin(t * 1.5) * 0.05) * geoFade * lightBoost;

      // Abstract shape group — slow rotation
      abstractGroup.rotation.y = t * 0.07 * scrollBoost + mx * 0.25;
      abstractGroup.rotation.x = t * 0.03               + my * 0.14;
      netMat.opacity = (0.08 + Math.sin(t * 2.0) * 0.04) * geoFade * lightBoost;

      // Each shape self-rotates + breathes (subtle scale pulse)
      shapeMeshes.forEach((mesh, i) => {
        mesh.rotation.x += shapeSpinX[i];
        mesh.rotation.y += shapeSpinY[i];
        mesh.rotation.z += shapeSpinZ[i];
        const pulse = 1.0 + Math.sin(t * 0.9 + shapePhases[i]) * 0.07;
        mesh.scale.setScalar(pulse);
        shapeMats[i].opacity = (0.42 + Math.sin(t * 1.4 + shapePhases[i]) * 0.18) * geoFade * lightBoost;
      });

      // Orbit rings
      ring1.mesh.rotation.y  =  t * 0.28 * scrollBoost + mx * 0.18;
      ring1.mesh.rotation.z  =  t * 0.14;
      ring1.mat.opacity       = (0.08 + Math.sin(t * 1.6) * 0.05) * geoFade * lightBoost;

      ring2.mesh.rotation.y  = -t * 0.22 * scrollBoost + mx * 0.12;
      ring2.mesh.rotation.z  =  t * 0.10;
      ring2.mat.opacity       = (0.05 + Math.cos(t * 2.4) * 0.04) * geoFade * lightBoost;

      ring3.mesh.rotation.y  =  t * 0.15 * scrollBoost + mx * 0.08;
      ring3.mesh.rotation.z  = -t * 0.07;
      ring3.mat.opacity       = (0.04 + Math.sin(t * 1.9) * 0.03) * geoFade * lightBoost;

      // Data packets
      const a1 = t * 1.8 * scrollBoost;
      packet1.position.set(
        GX + Math.cos(a1 + ring1.mesh.rotation.y) * 14.5,
        GY + Math.sin(a1) * 14.5 * Math.cos(Math.PI * 0.35),
        GZ + Math.sin(a1 + ring1.mesh.rotation.y) * 14.5 * 0.3
      );
      (packet1.material as THREE.MeshBasicMaterial).opacity = 0.9 * geoFade;

      const a2 = t * 2.6 * scrollBoost + Math.PI;
      packet2.position.set(
        GX + Math.cos(a2) * 11.5,
        GY + Math.sin(a2) * 11.5 * 0.5,
        GZ + Math.cos(a2 + 1.2) * 11.5 * 0.4
      );
      (packet2.material as THREE.MeshBasicMaterial).opacity = 0.85 * geoFade;

      const a3 = -t * 3.8 * scrollBoost + Math.PI * 0.5;
      packet3.position.set(
        GX + Math.cos(a3) * 17.5,
        GY + Math.sin(a3 * 0.8) * 6.0,
        GZ + Math.sin(a3) * 17.5 * 0.5
      );
      (packet3.material as THREE.MeshBasicMaterial).opacity = 0.80 * geoFade;

      // Hex rings
      hexOuter.rotation.y  =  t * 0.16 * scrollBoost + mx * 0.14;
      hexOuter.rotation.x  =  t * 0.08               + my * 0.10;
      hexOuterMat.opacity   = (0.18 + Math.sin(t * 2.5) * 0.10) * geoFade * lightBoost;
      hexInner.rotation.y  = -t * 0.28 * scrollBoost + mx * 0.20;
      hexInner.rotation.x  =  t * 0.12               + my * 0.15;
      hexInnerMat.opacity   = (0.22 + Math.cos(t * 3.2) * 0.14) * geoFade * lightBoost;

      // Camera
      camera.position.x += (mx * 7     - camera.position.x) * 0.028;
      camera.position.y += (my * 4     - camera.position.y) * 0.028;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
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
      globeGeo.dispose();   globeEdges.dispose();   globeMat.dispose();
      shapeEdgeGeos.forEach(g => g.dispose());
      shapeMats.forEach(m => m.dispose());
      netGeo.dispose();     netMat.dispose();
      ring1.geo.dispose();  ring1.mat.dispose();
      ring2.geo.dispose();  ring2.mat.dispose();
      ring3.geo.dispose();  ring3.mat.dispose();
      [packet1, packet2, packet3, hexOuter, hexInner].forEach(m => {
        m.geometry.dispose();
        (m.material as THREE.MeshBasicMaterial).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}
