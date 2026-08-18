import React, { useRef, Suspense, useLayoutEffect, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Html, useProgress, SpotLight } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
    const { progress } = useProgress();
    return <Html center><div className="text-[#C29B62] font-heading text-sm uppercase tracking-widest">{progress.toFixed(0)}%</div></Html>;
}

function PremiumPlatform() {
    return (
        <mesh position={[0, -0.80, 0]} receiveShadow>
            <cylinderGeometry args={[3.5, 3.6, 0.04, 64]} />
            <meshPhysicalMaterial 
                color="#222222" 
                roughness={0.4} 
                metalness={0.8} 
            />
        </mesh>
    );
}

function HangingLight() {
    const [lightTarget] = useState(() => {
        const obj = new THREE.Object3D();
        obj.position.set(0, -5, 0); // Point straight down in local space
        return obj;
    });

    return (
        <group position={[0, 1.8, 0]}>
            <primitive object={lightTarget} />
            {/* The stylish rope/cable */}
            <mesh position={[0, 1.7, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 3]} />
                <meshStandardMaterial color="#555555" roughness={0.9} />
            </mesh>
            
            {/* The stylish conical pendant lamp shade */}
            <mesh position={[0, 0, 0]}>
                <coneGeometry args={[0.25, 0.4, 64]} />
                <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            
            {/* The glowing bulb/diffusion panel inside */}
            <mesh position={[0, -0.19, 0]}>
                <cylinderGeometry args={[0.23, 0.23, 0.01, 64]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* The pure white volumetric light scattering down onto the car */}
            <SpotLight 
                position={[0, -0.2, 0]} 
                angle={1.2} 
                penumbra={0.6} 
                intensity={3.0} // Dimmed intensity
                color="#ffffff" 
                castShadow 
                distance={12}
                attenuation={3.0} 
                anglePower={5}
                opacity={0.2} // Dimmed volumetric scattering
                target={lightTarget} // explicitly target straight down
            />
        </group>
    );
}

function CarModel({ isMobile }) {
    // Load local high-quality Ferrari GLTF model
    const { scene } = useGLTF('/models/car.glb');
    const group = useRef();
    const scrollRef = useRef(0);

    useEffect(() => {
        // Optimize scroll listener to prevent lag
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            scrollRef.current = Math.min(scrollY / maxScroll, 1);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Enhance materials for photorealistic, non-animated look
    useLayoutEffect(() => {
        scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                
                if (obj.material) {
                    // Upgrade material to MeshPhysicalMaterial for advanced photorealistic rendering
                    if (obj.material.isMeshStandardMaterial && !obj.material.isMeshPhysicalMaterial) {
                        const oldMat = obj.material;
                        obj.material = new THREE.MeshPhysicalMaterial({
                            map: oldMat.map,
                            normalMap: oldMat.normalMap,
                            roughnessMap: oldMat.roughnessMap,
                            metalnessMap: oldMat.metalnessMap,
                            color: oldMat.color,
                            emissive: oldMat.emissive,
                            emissiveIntensity: oldMat.emissiveIntensity,
                            roughness: oldMat.roughness,
                            metalness: oldMat.metalness,
                            transparent: oldMat.transparent,
                            opacity: oldMat.opacity
                        });
                    }

                    obj.material.envMapIntensity = 0.8; // Dramatically lowered for a moody, low-light studio environment
                    
                    const matName = (obj.material.name || '').toLowerCase();
                    const objName = obj.name.toLowerCase();
                    const combinedName = objName + matName;

                    // Realistic Clear Whitish Glass / Mirrors
                    if (combinedName.includes('glass') || combinedName.includes('window') || combinedName.includes('mirror') || combinedName.includes('windshield')) {
                        obj.material.color.set('#ffffff'); // Whitish glass
                        obj.material.transparent = true;
                        obj.material.opacity = 0.4; // Clearer, translucent glass
                        obj.material.metalness = 0.8;
                        obj.material.roughness = 0.05;
                        obj.material.envMapIntensity = 2.0;
                    }
                    
                    // True Flat Matte Car Paint
                    else if (combinedName.includes('body') || combinedName.includes('paint')) {
                        obj.material.color.set('#8A0000'); // Deep Red
                        obj.material.metalness = 0.4; // Low metallic base
                        obj.material.roughness = 0.8; // High diffusion (true flat matte)
                        if (obj.material.isMeshPhysicalMaterial) {
                            obj.material.clearcoat = 0.0; // Completely removed clearcoat shine
                            obj.material.sheen = 0.1; 
                        }
                    }
                    
                    // Matte Rubber Tires (grips)
                    else if (combinedName.includes('tire') || combinedName.includes('tyre') || combinedName.includes('rubber')) {
                        obj.material.color.set('#050505'); // Pure deep black
                        obj.material.metalness = 0.0; // No metallic reflection
                        obj.material.roughness = 1.0; // Completely rough rubber grip
                        obj.material.envMapIntensity = 0.0; // Do not reflect environment light at all
                    }
                    
                    // Realistic Silver Alloys / Rims
                    else if (combinedName.includes('rim') || combinedName.includes('alloy') || combinedName.includes('spoke')) {
                        obj.material.color.set('#dddddd'); // Bright Silver
                        obj.material.metalness = 1.0; // Fully metallic
                        obj.material.roughness = 0.15; // Smooth, polished silver finish
                        obj.material.envMapIntensity = 1.5; // Catch environment reflections beautifully
                        if (obj.material.isMeshPhysicalMaterial) {
                            obj.material.clearcoat = 1.0; // Glossy clearcoat for silver rims
                        }
                    }
                    
                    // Brake Calipers & Discs
                    else if (combinedName.includes('brake') || combinedName.includes('caliper') || combinedName.includes('disk') || combinedName.includes('disc')) {
                        if (combinedName.includes('caliper')) {
                            obj.material.color.set('#FFCC00'); // Sporty Yellow Calipers
                            obj.material.metalness = 0.6;
                            obj.material.roughness = 0.3;
                        } else {
                            obj.material.color.set('#444444'); // Darker steel brake discs so they don't look white
                            obj.material.metalness = 0.8;
                            obj.material.roughness = 0.4; 
                        }
                    }
                    
                    // Ferrari Logo / Badges
                    else if (combinedName.includes('logo') || combinedName.includes('badge') || combinedName.includes('emblem') || combinedName.includes('horse') || combinedName.includes('prancing')) {
                        obj.material.color.set('#FFD700'); // Ferrari Yellow
                        obj.material.metalness = 1.0;
                        obj.material.roughness = 0.2;
                    }
                    
                    // Interior, Seats & Dashboard
                    else if (combinedName.includes('seat') || combinedName.includes('interior') || combinedName.includes('leather') || combinedName.includes('fabric') || combinedName.includes('stitch') || combinedName.includes('dash')) {
                        obj.material.color.set('#6B3E11'); // Premium saddle brown leather
                        obj.material.metalness = 0.1;
                        obj.material.roughness = 0.85; // Matte leather texture
                        obj.material.envMapIntensity = 0.2; // Minimal reflection
                        if (obj.material.isMeshPhysicalMaterial) {
                            obj.material.clearcoat = 0.0;
                        }
                    }
                    
                    // Headlights / Taillights (Turn on lights)
                    else if (combinedName.includes('light') || combinedName.includes('lamp') || combinedName.includes('led') || combinedName.includes('emission')) {
                        if (combinedName.includes('tail') || combinedName.includes('rear') || combinedName.includes('brake') || combinedName.includes('red')) {
                            obj.material.emissive = new THREE.Color('#ff0000');
                            obj.material.emissiveIntensity = 5.0; // Turned up for red glow
                            obj.material.color.set('#ff0000');
                        } else {
                            // Front Headlights
                            obj.material.emissive = new THREE.Color('#dddddd');
                            obj.material.emissiveIntensity = 0.0; // Completely turned off to stop shine
                            obj.material.color.set('#333333');
                        }
                    }
                }
            }
        });
    }, [scene]);

    useFrame(() => {
        if (!group.current) return;
        
        const progress = scrollRef.current;

        // Rotate precisely on its center axis based on scroll
        const targetRotationY = (Math.PI / 2) + (progress * Math.PI * 1.5); 
        
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
        // Removed X and Z drift translations so it stays perfectly centered
    });

    const scale = isMobile ? 0.65 : 1.15;

    return (
        <group ref={group}>
            {/* The actual 3D model centered */}
            <primitive object={scene} scale={scale} position={[0, -0.8, 0]} />
        </group>
    );
}

const ThreeDCar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#B5B9F0]">
            {/* Lower field of view for a more cinematic, less distorted lens */}
            {/* Limited max DPR to 1.5 to dramatically improve performance on mobile devices */}
            <Canvas camera={{ position: [0, 1.2, 7.5], fov: 35 }} shadows dpr={[1, 1.5]}>
                
                {/* Dynamically center the car on mobile, move to right on desktop */}
                <group position={isMobile ? [0, -0.4, 0] : [1.5, 0, 0]}>
                    {/* Dramatic Studio Lighting - very low ambient for mood */}
                    <ambientLight intensity={0.05} />
                    <HangingLight />
                    
                    {/* Secondary rim light (converted to standard spotLight for massive performance boost) */}
                    <spotLight 
                        position={[6, 3, 2]} 
                        angle={0.6} 
                        penumbra={0.8} 
                        intensity={4.0} 
                        color="#ffffff" 
                        distance={12}
                        decay={1.5}
                    />
                    
                    <spotLight position={[-10, 5, -10]} angle={0.5} penumbra={1} intensity={0.5} color="#8A0303" />
                    
                    <Suspense fallback={<Loader />}>
                        {/* Professional studio HDR lighting for razor-sharp, photorealistic reflections */}
                        <Environment preset="studio" />
                        
                        {/* The physical circular showroom base */}
                        <PremiumPlatform />
                        
                        <CarModel isMobile={isMobile} />
                    </Suspense>
                </group>
                
                {/* Standard environment, no heavy post-processing for maximum performance during scroll */}
            </Canvas>
        </div>
    );
};

export default ThreeDCar;
