import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, createPortal, extend } from '@react-three/fiber';
import { Stars, Float, useFBO, shaderMaterial, useContextBridge } from '@react-three/drei';
import * as THREE from 'three';
import { useSettings, SettingsContext } from '../context/SettingsContext';
import { cursorState } from './CustomCursor';

import { THEMES, ThemeConfig, ThemeMode } from '../context/SettingsContext';

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const shaderExtensions = { derivatives: true };

// ==========================================
// TRANSITION SHADER (The "Mixer")
// ==========================================
const TransitionMaterial = shaderMaterial(
  {
    uTexCurrent: null,
    uTexNext: null,
    uProgress: 0,
    uResolution: new THREE.Vector2()
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexCurrent;
    uniform sampler2D uTexNext;
    uniform float uProgress;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec4 colorA = texture2D(uTexCurrent, vUv);
      vec4 colorB = texture2D(uTexNext, vUv);
      vec4 finalColor = mix(colorA, colorB, smoothstep(0.0, 1.0, uProgress));
      gl_FragColor = finalColor;
      gl_FragColor.a = 1.0;
    }
  `
);

extend({ TransitionMaterial });



// 1. DEFAULT ENGINE: LIQUID VOID
const LIQUID_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const LIQUID_FRAGMENT = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColorAccent;
  uniform vec3 uColorBg;
  uniform float uTurbulence;
  varying vec2 vUv;
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289_2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289_2(i); 
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  void main() {
    vec2 st = vUv * 2.0 - 1.0;
    float dist = distance(vUv, uMouse);
    float interact = 1.0 - smoothstep(0.0, 0.4, dist);
    float t = uTime * 0.2;
    vec2 q = vec2(0.);
    q.x = snoise(st + t + interact * 0.5);
    q.y = snoise(st + vec2(1.0));
    vec2 r = vec2(0.);
    r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);
    float f = snoise(st + r * (uTurbulence + interact));
    vec3 color = mix(uColorBg, uColorAccent, smoothstep(-0.2, 1.2, f));
    color += uColorAccent * interact * 0.8; // Boosted interaction highlight
    color -= 0.05 * sin(vUv.y * 100.0 + t * 5.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;
// ... (The Engines logic needs to be SLIGHTLY modified to NOT check "currentTheme.id", 
// because they live in isolated scenes now. They just run always. Cost is managed by the ORCHESTRATOR not rendering the scene.)

const LiquidEngine = ({ config }: { config: any }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const { isPaused } = useSettings();

  // NOTE: We now use the passed setup 'config' for visuals, so it doesn't shift when global theme changes.


  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorAccent: { value: new THREE.Color(config.colors.hexAccent).multiplyScalar(0.7) },
    uColorBg: { value: new THREE.Color(config.colors.hexBg) },
    uTurbulence: { value: config.physics.turbulence }
  }), [config]); // Re-create if config changes (it shouldn't for this instance)

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  // Physics State for this engine
  const physicsState = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  });

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    // Config Physics
    const { viscosity, cursorForce } = config.physics;

    if (!isPaused) {
      mat.uniforms.uTime.value += delta;

      // Calculate target normalized position (0..1)
      const targetX = cursorState.x / size.width;
      const targetY = 1.0 - (cursorState.y / size.height); // Shader UV is Y up

      // Physics Simulation
      const phys = physicsState.current;

      // Hooke's Law / Spring-like drag
      const dx = targetX - phys.x;
      const dy = targetY - phys.y;

      // Add force
      phys.vx += dx * cursorForce * 0.1;
      phys.vy += dy * cursorForce * 0.1;

      // Apply Drag (Viscosity)
      phys.vx *= viscosity;
      phys.vy *= viscosity;

      // Update Position
      phys.x += phys.vx;
      phys.y += phys.vy;

      // Pass the "fluid" mouse position
      mat.uniforms.uMouse.value.set(phys.x, phys.y);

      // Optionally could pass velocity as turbulence factor
      // mat.uniforms.uTurbulence.value = config.physics.turbulence + (Math.abs(phys.vx) + Math.abs(phys.vy)) * 5.0;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={LIQUID_VERTEX} fragmentShader={LIQUID_FRAGMENT} />
    </mesh>
  );
};

// ==========================================
// 2. CYBERPUNK
// ==========================================
const SUN_VERTEX = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SUN_FRAGMENT = `varying vec2 vUv; uniform vec3 uColorTop; uniform vec3 uColorBottom; uniform float uTime; void main() { vec3 color = mix(uColorBottom, uColorTop, pow(vUv.y, 2.0)); float blindsSpeed = 0.2; float blindsFreq = 20.0; float stripes = step(0.5, fract((vUv.y + uTime * blindsSpeed) * blindsFreq)); if (stripes < 0.1 && vUv.y < 0.6) discard; float dist = distance(vUv, vec2(0.5)); if (dist > 0.5) discard; color += vec3(0.2, 0.1, 0.0) * smoothstep(0.4, 0.0, dist); gl_FragColor = vec4(color, 1.0); }`;

const RetroSun = ({ config }: { config: any }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isPaused } = useSettings();
  const uniforms = useMemo(() => ({
    uColorTop: { value: new THREE.Color(config.colors.hexSecondary) },
    uColorBottom: { value: new THREE.Color(config.colors.hexAccent) },
    uTime: { value: 0 }
  }), [config]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (!isPaused) mat.uniforms.uTime.value += delta;
    // Static colors from config
  })
  return (<group position={[0, 15, -120]}><mesh ref={meshRef}><circleGeometry args={[30, 64]} /><shaderMaterial vertexShader={SUN_VERTEX} fragmentShader={SUN_FRAGMENT} uniforms={uniforms} transparent opacity={0.6} /></mesh><mesh position={[0, 0, -1]}><circleGeometry args={[45, 64]} /><meshBasicMaterial color={config.colors.hexAccent} transparent opacity={0.15} /></mesh></group>);
}
// 2. CYBERPUNK
const CYBER_GRID_VERTEX = `uniform float uTime; uniform vec2 uMouse; varying vec2 vUv; varying vec3 vWorldPos; void main() { vUv = uv; vec3 pos = position; vec4 worldPos = modelMatrix * vec4(pos, 1.0); vWorldPos = worldPos.xyz; float dist = distance(worldPos.xz, uMouse); float influence = 1.0 - smoothstep(0.0, 40.0, dist); float wave = sin(dist * 0.5 - uTime * 3.0) * influence * 5.0; worldPos.y += wave; gl_Position = projectionMatrix * viewMatrix * worldPos; }`;
const CYBER_GRID_FRAGMENT = `uniform float uTime; uniform vec3 uColorGrid; uniform vec3 uColorFloor; uniform vec3 uColorPulse; uniform float uSpeed; varying vec2 vUv; varying vec3 vWorldPos; void main() { vec2 gridUV = vUv * 100.0; vec2 deriv = fwidth(gridUV); vec2 grid = abs(fract(gridUV - 0.5) - 0.5) / deriv; float line = min(grid.x, grid.y); float gridPattern = 1.0 - min(line, 1.0); float pulseFreq = 0.1; float pulse = sin(vWorldPos.z * pulseFreq + uTime * uSpeed * 5.0); pulse = smoothstep(0.9, 1.0, pulse); float dist = length(vWorldPos.xz); float fogFactor = exp(-dist * 0.025); vec3 color = mix(uColorFloor, uColorGrid, gridPattern); color += uColorPulse * gridPattern * pulse * 3.0; float alpha = (gridPattern * 0.8 + 0.1) * fogFactor; gl_FragColor = vec4(color, alpha); }`;

const InteractiveCyberGrid = ({ config }: { config: any }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isPaused } = useSettings();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorGrid: { value: new THREE.Color(config.colors.hexSecondary) },
    uColorFloor: { value: new THREE.Color(config.colors.hexBg) },
    uColorPulse: { value: new THREE.Color(config.colors.hexAccent) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uSpeed: { value: config.physics.speed }
  }), [config]);

  // Physics State for CyberGrid
  const physicsState = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (!isPaused) {
      mat.uniforms.uTime.value += delta;

      const { viscosity, cursorForce } = config.physics;

      // Map cursorState (screen pixels) to approximately Grid Space (-150 to 150)
      // Screen width maps to ~300 units wide grid
      const targetX = ((cursorState.x / window.innerWidth) * 2 - 1) * 150;
      const targetY = -((cursorState.y / window.innerHeight) * 2 - 1) * 150; // Invert Y

      // Smooth "Drag" Logic
      const phys = physicsState.current;
      phys.x += (targetX - phys.x) * (1 - viscosity) * (cursorForce * 5); // Force amplifies responsiveness
      phys.y += (targetY - phys.y) * (1 - viscosity) * (cursorForce * 5);

      mat.uniforms.uMouse.value.set(phys.x, phys.y);
    }
  });
  return (<mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}><planeGeometry args={[300, 300, 64, 64]} /><shaderMaterial vertexShader={CYBER_GRID_VERTEX} fragmentShader={CYBER_GRID_FRAGMENT} uniforms={uniforms} transparent depthWrite={false} extensions={shaderExtensions as any} opacity={0.6} /></mesh>);
}

const NeonBuildings = ({ config }: { config: any }) => {
  const { isPaused } = useSettings();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 20;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const buildingsData = useMemo(() => {
    const data = []; for (let i = 0; i < count; i++) { const isLeft = i % 2 === 0; const xBase = isLeft ? -1 : 1; const x = xBase * randomRange(25, 120); const z = randomRange(-200, 50); const height = randomRange(20, 100); const width = randomRange(5, 15); const depth = randomRange(5, 15); data.push({ x, z, height, width, depth, initialZ: z }); } return data;
  }, []);
  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    const speed = config.physics.speed * 40.0;
    const chunkLength = 250; const cameraZ = 20;
    buildingsData.forEach((b, i) => {
      b.z += delta * speed; if (b.z > cameraZ + 20) b.z -= chunkLength;
      dummy.position.set(b.x, b.height / 2 - 10, b.z); dummy.scale.set(b.width, b.height, b.depth); dummy.updateMatrix(); meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (<instancedMesh ref={meshRef} args={[undefined, undefined, count]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color={config.colors.hexSecondary} wireframe={true} transparent opacity={0.2} /></instancedMesh>);
}
const CyberParticles = ({ config }: { config: any }) => {
  const { isPaused } = useSettings();
  const count = 60; const meshRef = useRef<THREE.InstancedMesh>(null); const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => new Array(count).fill(0).map(() => ({ x: randomRange(-100, 100), y: randomRange(0, 60), z: randomRange(-150, 50), speed: randomRange(0.2, 0.8) })), []);
  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    particles.forEach((p, i) => {
      p.z += p.speed * (config.physics.speed * 60.0); if (p.z > 50) p.z = -150;
      dummy.position.set(p.x, p.y, p.z); dummy.scale.set(0.15, 0.15, 0.15); dummy.updateMatrix(); meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (<instancedMesh ref={meshRef} args={[undefined, undefined, count]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color={config.colors.hexAccent} /></instancedMesh>);
}
const NeonCity = ({ config }: { config: any }) => {
  return (<><fog attach="fog" args={[config.colors.hexBg, 20, 180]} /><Stars radius={150} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} /><RetroSun config={config} /><InteractiveCyberGrid config={config} /><NeonBuildings config={config} /><CyberParticles config={config} /></>);
}

// 3. SAKURA (Organic Flow)
// ----------------------------------------------------
// Advanced Flow Field Vertex Shader
const PETAL_VERTEX = `
  precision highp float;
  
  uniform float uTime;
  uniform vec3 uMouseWorld;
  uniform float uMouseRadius;
  uniform float uCursorForce;
  
  attribute vec3 aOffset;    
  attribute float aScale;
  attribute float aSpeed;    
  attribute float aRotSpeed; 
  attribute vec3 aColor;     
  
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vDepth;

  // --- SIMPLEX NOISE 3D ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
  }

  void main() {
    vUv = uv;
    vColor = aColor;
    
    // Base position
    vec3 pos = aOffset;
    
    // Time & Speed factoring
    float t = uTime * 0.1 * aSpeed;
    
    // --- ORGANIC FLOW FIELD ---
    // Use Simplex Noise to create a "Wind Field"
    float nx = snoise(vec3(pos.x * 0.005 + t, pos.y * 0.005, pos.z * 0.005));
    float ny = snoise(vec3(pos.x * 0.005, pos.y * 0.005 + t, pos.z * 0.005));
    float nz = snoise(vec3(pos.x * 0.005, pos.y * 0.005, pos.z * 0.005 + t));
    
    // Apply continuous flow
    pos.x += nx * 50.0;
    pos.y += ny * 30.0;
    pos.z += nz * 30.0;
    
    // Infinite Vertical Loop (Waterfall effect, but organic)
    float loopH = 250.0;
    float fall = uTime * 10.0 * aSpeed;
    pos.y -= fall;
    pos.y = mod(pos.y + 125.0, loopH) - 125.0; // Wrap -125 to 125

    // --- INTERACTIVE TURBULENCE ---
    float distToMouse = distance(pos.xy, uMouseWorld.xy);
    
    // Smooth interaction sphere
    float interact = smoothstep(uMouseRadius * 1.5, 0.0, distToMouse);
    
    if (interact > 0.0) {
       // Direction from mouse to particle
       vec3 dir = normalize(pos - uMouseWorld);
       
       // Repulsion Force (Push away)
       float repel = interact * 80.0 * uCursorForce;
       pos += dir * repel;
       
       // Swirl Force (Cross product approximation for 2D rotation)
       vec3 swirl = vec3(-dir.y, dir.x, 0.0);
       pos += swirl * interact * 40.0 * uCursorForce;
       
       // Lift (Upward draft)
       pos.z += interact * 30.0 * uCursorForce;
    }
    
    // --- ROTATION & BREATHING ---
    // Rotate petals naturally
    float rot = uTime * aRotSpeed + interact * 5.0;
    vec3 axis = normalize(vec3(sin(aOffset.x), cos(aOffset.z), sin(aOffset.y * 0.5)));
    
    mat4 rotMat = rotationMatrix(axis, rot);
    
    // Breathing scale (pulsing life)
    float breathe = 1.0 + 0.1 * sin(uTime * 3.0 + aOffset.x);
    
    vec4 localPos = vec4(position * aScale * breathe, 1.0);
    localPos = rotMat * localPos;
    localPos.xyz += pos;
    
    vDepth = localPos.z;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * localPos;
  }
`;

const PETAL_FRAGMENT = `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vDepth;
  
  void main() {
    // Soft, Airy Petal Shape
    vec2 st = vUv * 2.0 - 1.0;
    float dist = length(st);
    
    // Soft circle with feathering
    float alpha = smoothstep(0.5, 0.3, dist);
    
    // Inner brightness/gradient
    vec3 color = mix(vColor, vec3(1.0), (1.0 - dist) * 0.4);
    
    // Depth fog (fade out distant particles)
    float fog = smoothstep(-150.0, 50.0, vDepth);
    
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(color, alpha * 0.8 * fog);
  }
`;

const ZenBlossom = ({ config }: { config: any }) => {
  // Balanced count for density vs performance
  const count = 12000;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Reusable Interaction Objects
  const { raycaster, plane, target, mouseVec } = useMemo(() => ({
    raycaster: new THREE.Raycaster(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    target: new THREE.Vector3(),
    mouseVec: new THREE.Vector2()
  }), []);

  // Geometry & Attributes
  const { geometry, uniforms } = useMemo(() => {
    // Use a simple Plane for the particle, handled by shader
    const geo = new THREE.PlaneGeometry(1, 1);

    const offsets = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const rotSpeeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Organic Palette: Elegant Reds & Crimsons (User Requested "Shade of Red")
    const palette = [
      new THREE.Color('#550000'), // Dark Maroon (Depth)
      new THREE.Color('#990000'), // Crimson
      new THREE.Color('#cc0000'), // Pure Red
      new THREE.Color('#ff3333'), // Bright Red
      new THREE.Color('#ff9999'), // Soft Rose Highlight
    ];

    for (let i = 0; i < count; i++) {
      // Spread across a wide volume
      offsets[i * 3 + 0] = randomRange(-200, 200); // X
      offsets[i * 3 + 1] = randomRange(-125, 125); // Y
      offsets[i * 3 + 2] = randomRange(-100, 50);  // Z

      scales[i] = randomRange(0.5, 1.2); // Varied sizes
      speeds[i] = randomRange(0.6, 1.4);
      rotSpeeds[i] = randomRange(0.5, 2.5);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1));
    geo.setAttribute('aRotSpeed', new THREE.InstancedBufferAttribute(rotSpeeds, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));

    // Large bounding sphere to prevent culling when displaced
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 500);

    const unifs = {
      uTime: { value: 0 },
      uMouseWorld: { value: new THREE.Vector3(1000, 1000, 1000) },

      // Start with a reasonable world-space radius (Camera height is ~15-20 units)
      // So a radius of 6.0 is about 1/3rd of the screen height.
      uMouseRadius: { value: 6.0 },
      uCursorForce: { value: 1.0 },
    };

    return { geometry: geo, uniforms: unifs };
  }, []);

  const { isPaused } = useSettings();

  // Animation Loop
  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;

    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += delta;

    // Update Forces from Config (Converted to World Scale)
    // Config force 0.6 -> shader force ~1.0
    mat.uniforms.uCursorForce.value = config.physics.cursorForce * 2.0;

    // --- INTERACTION LOGIC ---
    // Map cursor to Normalized Device Coordinates
    const ndcX = (cursorState.x / window.innerWidth) * 2 - 1;
    const ndcY = -(cursorState.y / window.innerHeight) * 2 + 1;

    // Raycast to invisible plane Z=0
    mouseVec.set(ndcX, ndcY);
    raycaster.setFromCamera(mouseVec, state.camera);
    const hit = raycaster.ray.intersectPlane(plane, target);

    if (hit) {
      const lerpSpeed = 0.15;

      const currentPos = mat.uniforms.uMouseWorld.value;
      currentPos.x = THREE.MathUtils.lerp(currentPos.x, target.x, lerpSpeed);
      currentPos.y = THREE.MathUtils.lerp(currentPos.y, target.y, lerpSpeed);

      // Dynamic Radius based on cursor velocity (optional flare)
      const velocity = Math.abs(cursorState.vx) + Math.abs(cursorState.vy);

      // Convert Pixel Velocity to approx World Velocity Factor
      // 1000px width ~ 30 world units => ratio 0.03
      const worldVel = velocity * 0.03;

      // Base radius from config (scaled down from pixels to world)
      // config.influenceRadius (300) -> ~9.0 world units
      const baseRadius = config.physics.influenceRadius * 0.03;

      const targetRadius = baseRadius + Math.min(worldVel, 5.0);

      mat.uniforms.uMouseRadius.value = THREE.MathUtils.lerp(
        mat.uniforms.uMouseRadius.value,
        targetRadius,
        0.1
      );
    }
  });

  return (
    <>
      {/* Background Gradient / Tint */}
      <mesh position={[0, 0, -120]}>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial color={config.colors.hexBg} />
      </mesh>

      {/* The Particles */}
      <instancedMesh ref={meshRef} args={[geometry, undefined, count]} frustumCulled={false}>
        <shaderMaterial
          vertexShader={PETAL_VERTEX}
          fragmentShader={PETAL_FRAGMENT}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending}
        />
      </instancedMesh>
    </>
  );
};

// 4. LOFI (Deep Focus)
const RainParticles = ({ config }: { config: any }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null); const dummy = useMemo(() => new THREE.Object3D(), []); const count = 250;
  const particles = useMemo(() => new Array(count).fill(0).map(() => ({ x: randomRange(-50, 50), y: randomRange(0, 100), z: randomRange(-20, 20), velocity: randomRange(0.2, 0.5), length: randomRange(0.5, 1.5) })), []);
  const { isPaused } = useSettings();
  useFrame((state) => {
    if (!meshRef.current || isPaused) return;

    // Physics parameters from theme config
    const { viscosity, cursorForce, influenceRadius } = config.physics;

    particles.forEach((p, i) => {
      // Gravity
      p.y -= p.velocity;
      if (p.y < -30) p.y = 50;

      let posX = p.x;
      let posY = p.y;

      // Calculate distance to cursor (using global tracking for speed/precision)
      // Convert cursor page coords to approx world coords for this scene setup
      // Note: This scene is roughly 100 wide units.
      // We map cursor (0..window) to world (-50..50 approx)
      const mappedCursorX = (cursorState.x / window.innerWidth) * 100 - 50;
      const mappedCursorY = -(cursorState.y / window.innerHeight) * 100 + 50; // Invert Y

      const dx = mappedCursorX - posX;
      const dy = mappedCursorY - posY;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

      // Interaction Logic (Push)
      if (dist < influenceRadius * 0.2) { // Scale radius for this scene scale
        const force = (1 - dist / (influenceRadius * 0.2)) * cursorForce * 40; // Boost force

        // Add velocity influence
        // Simplified push away
        posX -= (dx / dist) * force * 0.1;

        p.x = THREE.MathUtils.lerp(p.x, posX, 0.1);
      }

      dummy.position.set(p.x, Math.max(p.y, -30), p.z);
      dummy.scale.set(0.05, p.length, 0.05);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (<instancedMesh ref={meshRef} args={[undefined, undefined, count]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color={config.colors.hexSecondary} transparent opacity={0.4} /></instancedMesh>);
};
const BokehBackground = ({ config }: { config: any }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { isPaused } = useSettings();
  useFrame((state) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.pointer.x * 2, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.pointer.y * 2, 0.05);
    }
  });
  return (<group ref={groupRef} position={[0, 0, -40]}><Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}><mesh position={[-15, 5, 0]}><circleGeometry args={[8, 32]} /><meshBasicMaterial color={config.colors.hexBg} transparent opacity={0.3} /></mesh></Float><Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.7}><mesh position={[10, -5, -5]}><circleGeometry args={[12, 32]} /><meshBasicMaterial color={config.colors.hexAccent} transparent opacity={0.2} /></mesh></Float><Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}><mesh position={[0, 10, -2]}><circleGeometry args={[6, 32]} /><meshBasicMaterial color={config.colors.hexSecondary} transparent opacity={0.2} /></mesh></Float></group>);
};
const MidnightCruise3D = ({ config }: { config: any }) => { return (<><fog attach="fog" args={[config.colors.hexBg, 5, 60]} /><RainParticles config={config} /><BokehBackground config={config} /><ambientLight intensity={0.2} /></>); };

// 5. ROYAL (Royal Legacy)
const MandalaRing = ({ count, radius, scale, zOffset, geometry, color, speed }: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null); const dummy = useMemo(() => new THREE.Object3D(), []);
  const { isPaused } = useSettings();
  useFrame((state) => {
    if (!meshRef.current || isPaused) return;
    const distToCenter = Math.sqrt(state.pointer.x * state.pointer.x + state.pointer.y * state.pointer.y); const bloomFactor = Math.max(0, 1 - distToCenter * 1.5); const dynamicRadius = radius + (bloomFactor * 2); const dynamicRotation = state.clock.elapsedTime * speed * (1 + bloomFactor * 2);
    for (let i = 0; i < count; i++) { const angle = (i / count) * Math.PI * 2 + dynamicRotation; const x = Math.cos(angle) * dynamicRadius; const y = Math.sin(angle) * dynamicRadius; dummy.position.set(x, y, zOffset); dummy.rotation.z = angle - Math.PI / 2; dummy.rotation.x = -Math.PI / 2; const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1; dummy.scale.setScalar(scale * pulse); dummy.updateMatrix(); meshRef.current.setMatrixAt(i, dummy.matrix); }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (<instancedMesh ref={meshRef} args={[geometry, undefined, count]}><meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.2} /></instancedMesh>);
};
const GoldenMandala3D = ({ config }: { config: any }) => {
  const groupRef = useRef<THREE.Group>(null);
  const petalGeo = useMemo(() => new THREE.ConeGeometry(0.5, 1.5, 4), []); const orbGeo = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), []); const ringGeo = useMemo(() => new THREE.TorusGeometry(0.4, 0.1, 8, 24), []);
  const { isPaused } = useSettings();
  useFrame((state) => {
    if (groupRef.current && !isPaused) {
      const { viscosity, cursorForce } = config.physics;

      // Map cursor to tilt range (-0.6 to 0.6 radians)
      const targetTiltX = -((cursorState.y / window.innerHeight) * 2 - 1) * 0.6 * cursorForce * 3;
      const targetTiltY = ((cursorState.x / window.innerWidth) * 2 - 1) * 0.6 * cursorForce * 3;

      // Apply viscous interpolation (Fluid damping)
      // Using lerp with (1-viscosity) gives us the "lag" effect
      const lerpFactor = (1 - viscosity) * 0.5;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetTiltX, lerpFactor);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetTiltY, lerpFactor);
    }
  });
  return (<group ref={groupRef} scale={1.5}><pointLight position={[0, 0, 5]} intensity={2} color={config.colors.hexAccent} distance={20} /><ambientLight intensity={0.5} /><mesh position={[0, 0, 0]}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={config.colors.hexAccent} emissive={config.colors.hexSecondary} emissiveIntensity={0.5} /></mesh><MandalaRing count={8} radius={2.5} scale={1} zOffset={0} geometry={petalGeo} color={config.colors.hexSecondary} speed={0.2} /><MandalaRing count={16} radius={4} scale={0.6} zOffset={-0.5} geometry={orbGeo} color={config.colors.hexAccent} speed={-0.15} /><MandalaRing count={24} radius={6} scale={0.8} zOffset={-1} geometry={petalGeo} color={config.colors.hexSecondary} speed={0.1} /><MandalaRing count={12} radius={8} scale={1.5} zOffset={-2} geometry={ringGeo} color={config.colors.hexAccent} speed={-0.05} /></group>);
};

// RENDER ORCHESTRATOR
const RenderOrchestrator = ({ scenes }: { scenes: THREE.Scene[] }) => {
  const { currentTheme } = useSettings();
  const { gl, camera, size, viewport } = useThree(); // Added viewport

  // Warm Up Logic (Moved Inside Canvas)
  useEffect(() => {
    // Force compile all scenes
    scenes.forEach(scene => {
      try {
        // cast to any because compile is not in the default types yet for some versions
        (gl as any).compile(scene, camera);
      } catch (e) {
        console.error("Warmup failed", e);
      }
    });
  }, [gl, camera, scenes]);




  // FBOs
  const fboCurrent = useFBO(size.width, size.height, { depthBuffer: true });
  const fboNext = useFBO(size.width, size.height, { depthBuffer: true });

  // Transition State
  const transitionRef = useRef({
    activeId: currentTheme.id,
    nextId: currentTheme.id,
    progress: 0, // Start at 0 to show fboCurrent immediately
    isTransitioning: false
  });

  // Map IDs to Indices
  const themeMap: Record<string, number> = useMemo(() => ({
    'default': 0, 'cyberpunk': 1, 'sakura': 2, 'lofi': 3, 'royal': 4
  }), []);

  // Trigger Transition
  useEffect(() => {
    const tr = transitionRef.current;
    if (tr.activeId !== currentTheme.id) {
      tr.nextId = currentTheme.id;
      // tr.activeId is currently showing in fboCurrent.
      // We want to fade fboCurrent (Active) -> fboNext (Next).
      // So we start progress at 0.
      tr.progress = 0;
      tr.isTransitioning = true;
    }
  }, [currentTheme.id]);

  // DOM Sync Ref
  const bodyRef = useRef(document.body);

  // The Loop
  useFrame((state, delta) => {
    const tr = transitionRef.current;

    // 1. Update Progress
    if (tr.isTransitioning) {
      tr.progress += delta * 2.0; // 0.5s transition
      if (tr.progress >= 1) {
        tr.progress = 0; // Reset to 0 to show fboCurrent (which we make active below)
        tr.isTransitioning = false;
        tr.activeId = tr.nextId;
      }
    }

    // 2. Identify Scenes
    const activeIndex = themeMap[tr.activeId] ?? 0;
    const nextIndex = themeMap[tr.nextId] ?? 0;

    // 3. Render Active Scene -> fboCurrent
    gl.setRenderTarget(fboCurrent);
    gl.clear(); // Clear before drawing
    gl.render(scenes[activeIndex], camera);

    // 4. Render Next Scene -> fboNext (only if transitioning)
    if (tr.isTransitioning) {
      gl.setRenderTarget(fboNext);
      gl.clear(); // Clear before drawing
      gl.render(scenes[nextIndex], camera);
    }

    // 5. DOM Sync (Optimized Body Color)
    if (tr.isTransitioning) {
      const activeTheme = THEMES[tr.activeId as ThemeMode];
      const nextTheme = THEMES[tr.nextId as ThemeMode];
      if (activeTheme && nextTheme) {
        const c1 = new THREE.Color(activeTheme.colors.hexBg);
        const c2 = new THREE.Color(nextTheme.colors.hexBg);
        c1.lerp(c2, tr.progress);
        document.body.style.backgroundColor = '#' + c1.getHexString();
      }
    } else {
      const activeTheme = THEMES[tr.activeId as ThemeMode];
      if (activeTheme) {
        document.body.style.backgroundColor = activeTheme.colors.hexBg;
      }
    }

    // 6. Final Composition
    gl.setRenderTarget(null);
    // The "TransitionQuad" component below will handle the draw
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      {/* @ts-ignore: Intrinsic element not recognized by TS despite declaration */}
      <transitionMaterial
        uTexCurrent={fboCurrent.texture}
        uTexNext={fboNext.texture}
        uProgress={transitionRef.current.progress}
        uResolution={[size.width, size.height]}
      />
    </mesh>
  );
};

export const LiquidBackground = React.memo(() => {
  // 1. Create The Vault
  const scenes = useMemo(() => [
    new THREE.Scene(), // 0: Liquid
    new THREE.Scene(), // 1: Cyberpunk
    new THREE.Scene(), // 2: Sakura
    new THREE.Scene(), // 3: Lofi
    new THREE.Scene(), // 4: Royal
  ], []);



  // Bridge Context into Canvas
  const ContextBridge = useContextBridge(SettingsContext);

  return (
    <div className="fixed inset-0 z-0 bg-bg">
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', autoClear: false }}
        eventSource={document.body}
        className="pointer-events-none"
      >
        <ContextBridge>
          {/* PORTALS: Render the Engines into the Vault */}
          {createPortal(<LiquidEngine config={THEMES.default} />, scenes[0])}
          {createPortal(<NeonCity config={THEMES.cyberpunk} />, scenes[1])}
          {createPortal(<ZenBlossom config={THEMES.sakura} />, scenes[2])}
          {createPortal(<MidnightCruise3D config={THEMES.lofi} />, scenes[3])}
          {createPortal(<GoldenMandala3D config={THEMES.royal} />, scenes[4])}

          {/* ORCHESTRATOR: Handles the switching */}
          <RenderOrchestrator scenes={scenes} />
        </ContextBridge>
      </Canvas>
    </div>
  );
});