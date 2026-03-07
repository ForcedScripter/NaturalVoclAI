"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AudioSphere() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const hoverValue = useRef(0);
    const [hovered, setHovered] = useState(false);
    const count = 1500; // Number of particles

    // Memoize positions and target states
    const { positions, randomFactors } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const randomFactors = new Float32Array(count);

        // Create a sphere point distribution
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            const r = 2; // base radius
            const x = r * Math.cos(theta) * Math.sin(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            randomFactors[i] = Math.random();
        }

        return { positions, randomFactors };
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();

        // Rotate the entire group slowly
        meshRef.current.rotation.y = time * 0.1;

        for (let i = 0; i < count; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];

            // Smooth lerp hoverValue
            hoverValue.current = THREE.MathUtils.lerp(hoverValue.current, hovered ? 1 : 0, delta * 5);

            // Calculate audio wave undulating effect based on time and position
            const wave = Math.sin(x * 2 + time * 2) * Math.cos(y * 2 + time * 3) * 0.2;

            // Determine if we are hovering to dismantle
            const factor = randomFactors[i];
            const targetDist = hoverValue.current * (factor * 3); // Explosion force smoothed

            // Calculate current position with lerp
            const currentX = x * (1 + wave) + (x * targetDist);
            const currentY = y * (1 + wave) + (y * targetDist);
            const currentZ = z * (1 + wave) + (z * targetDist);

            dummy.position.set(currentX, currentY, currentZ);

            // Update instance matrix
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            // Add purple coloring based on wave amplitude
            if (meshRef.current.instanceColor) {
                const color = new THREE.Color();
                color.setHSL(0.75, 0.8, 0.2 + (wave + 0.2)); // Deep purple base varying lightness
                meshRef.current.setColorAt(i, color);
            }
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <group>
            {/* Invisible interactive sphere to provide a huge hit area for hover */}
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={false}
            >
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial />
            </mesh>

            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, count]}
            >
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </instancedMesh>
        </group>
    );
}

export default function Footer3DSphere() {
    return (
        <footer className="relative h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden">

            {/* Absolute positioning for 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <AudioSphere />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Canvas>
            </div>

            {/* CTA Layered on top */}
            <div className="relative z-10 pointer-events-none text-center">
                <h2 className="text-4xl md:text-7xl font-light tracking-[0.3em] text-white mb-6 uppercase">
                    C O N N E C T
                </h2>
                <p className="text-zinc-400 tracking-widest text-sm max-w-md mx-auto">
                    DISMANTLE THE ORDINARY. RECONSTRUCT THE EXTRAORDINARY.
                </p>
                <p className="text-brand-purple mt-8 tracking-widest text-xs uppercase opacity-60">
                    HOVER TO INTERACT
                </p>
            </div>

        </footer>
    );
}
