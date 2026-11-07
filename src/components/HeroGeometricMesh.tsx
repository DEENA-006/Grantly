"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom fluid WebGL gradient shader
const FluidGradientShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Simplex-inspired smooth noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.18;

      // Primary fluid attractor 1 (electric accent pulse #FF3366)
      vec2 p1 = vec2(
        0.58 + sin(t * 0.9) * 0.22 + (uMouse.x - 0.5) * 0.18,
        0.48 + cos(t * 0.7) * 0.22 + (uMouse.y - 0.5) * 0.18
      );
      float d1 = length(uv - p1);

      // Secondary soft aura attractor 2 (warm soft blush)
      vec2 p2 = vec2(
        0.42 + cos(t * 0.6) * 0.25,
        0.55 + sin(t * 0.8) * 0.2
      );
      float d2 = length(uv - p2);

      // Subtle organic turbulence
      float noise = snoise(uv * 1.8 + vec2(t * 0.2, -t * 0.15)) * 0.08;
      d1 += noise;
      d2 += noise;

      // Color definition
      // Calm off-white background #FAFAFA
      vec3 bg = vec3(0.98, 0.98, 0.98);
      // Soft ambient light warmth
      vec3 warmLight = vec3(0.99, 0.93, 0.93);
      // Electric accent #FF3366
      vec3 electricAccent = vec3(1.0, 0.2, 0.4);
      // Deep coral warmth
      vec3 coralGlow = vec3(1.0, 0.35, 0.45);

      // Calculate soft falloffs
      float intensity1 = smoothstep(0.75, 0.05, d1) * 0.55;
      float intensity2 = smoothstep(0.85, 0.1, d2) * 0.4;

      vec3 color = bg;
      color = mix(color, warmLight, intensity2);
      color = mix(color, coralGlow, intensity1 * 0.7);
      color = mix(color, electricAccent, pow(intensity1, 1.8) * 0.75);

      // Soft edge vignette towards pure canvas
      float edgeVignette = smoothstep(0.0, 0.4, uv.x) * smoothstep(1.0, 0.6, uv.x) *
                           smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.6, uv.y);

      color = mix(bg, color, edgeVignette * 0.85);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

function FluidShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    uniforms.uTime.value += delta;

    // Smooth lerp mouse reaction
    mouseRef.current.x = THREE.MathUtils.lerp(
      mouseRef.current.x,
      mouseRef.current.targetX,
      0.04
    );
    mouseRef.current.y = THREE.MathUtils.lerp(
      mouseRef.current.y,
      mouseRef.current.targetY,
      0.04
    );
    uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        args={[FluidGradientShader]}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function HeroGeometricMesh() {
  return (
    <div className="w-full h-full relative pointer-events-none filter blur-[65px] md:blur-[95px] opacity-75 md:opacity-85 transform-gpu">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          depth: false,
          stencil: false,
        }}
        dpr={1}
      >
        <FluidShaderPlane />
      </Canvas>
    </div>
  );
}
