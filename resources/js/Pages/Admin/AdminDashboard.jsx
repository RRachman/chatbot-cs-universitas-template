import React, { useRef, useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Users, GraduationCap, Activity, TrendingUp, MessageCircle, FileText, Eye, Clock, LogOut } from 'lucide-react';
import * as THREE from 'three';

// Enhanced Robot Three.js Component
function Robot3D({ containerRef }) {
    const mountRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Enhanced Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 8, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const spotLight = new THREE.SpotLight(0x00ffff, 0.5);
        spotLight.position.set(0, 10, 0);
        scene.add(spotLight);

        // Robot parts
        const robotGroup = new THREE.Group();

        // Enhanced Body - More sleek design
        const bodyGeometry = new THREE.CylinderGeometry(1.2, 1.4, 2.5, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x2563eb,
            shininess: 100,
            specular: 0x111111
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        robotGroup.add(body);

        // Large Professional Head
        const headGeometry = new THREE.SphereGeometry(1.0, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            shininess: 100,
            specular: 0x222222
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        robotGroup.add(head);

        // Helmet/Visor
        const visorGeometry = new THREE.SphereGeometry(1.05, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
        const visorMaterial = new THREE.MeshPhongMaterial({
            color: 0x1e40af,
            transparent: true,
            opacity: 0.8,
            shininess: 200
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.y = 2.4;
        robotGroup.add(visor);

        // Large Expressive Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 12, 12);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            emissive: 0x004422
        });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 2.3, 0.8);
        rightEye.position.set(0.3, 2.3, 0.8);
        robotGroup.add(leftEye);
        robotGroup.add(rightEye);

        // Eye pupils
        const pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.3, 2.3, 0.87);
        rightPupil.position.set(0.3, 2.3, 0.87);
        robotGroup.add(leftPupil);
        robotGroup.add(rightPupil);

        // Mouth/Speaker
        const mouthGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const mouthMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            emissive: 0x001122
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.8, 0.9);
        mouth.rotation.x = Math.PI / 2;
        robotGroup.add(mouth);

        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x64748b });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, 3.4, 0);
        robotGroup.add(antenna);

        // Antenna tip
        const antennaTipGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const antennaTipMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x440000
        });
        const antennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
        antennaTip.position.set(0, 3.7, 0);
        robotGroup.add(antennaTip);

        // Robotic Arms - More articulated
        const shoulderGeometry = new THREE.SphereGeometry(0.3, 12, 12);
        const shoulderMaterial = new THREE.MeshPhongMaterial({ color: 0x1e40af });
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-1.6, 0.8, 0);
        rightShoulder.position.set(1.6, 0.8, 0);
        robotGroup.add(leftShoulder);
        robotGroup.add(rightShoulder);

        // Upper arms
        const upperArmGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 12);
        const upperArmMaterial = new THREE.MeshPhongMaterial({ color: 0x2563eb });
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
        leftUpperArm.position.set(-1.6, 0, 0);
        rightUpperArm.position.set(1.6, 0, 0);
        robotGroup.add(leftUpperArm);
        robotGroup.add(rightUpperArm);

        // Hands
        const handGeometry = new THREE.SphereGeometry(0.25, 12, 12);
        const handMaterial = new THREE.MeshPhongMaterial({ color: 0x1e40af });
        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-1.6, -0.8, 0);
        rightHand.position.set(1.6, -0.8, 0);
        robotGroup.add(leftHand);
        robotGroup.add(rightHand);

        // Base/Platform
        const baseGeometry = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x1e293b,
            shininess: 50
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -1.5;
        robotGroup.add(base);

        // Chest panel
        const chestGeometry = new THREE.PlaneGeometry(0.8, 0.6);
        const chestMaterial = new THREE.MeshPhongMaterial({
            color: 0x0ea5e9,
            emissive: 0x002233
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.set(0, 0.5, 1.35);
        robotGroup.add(chest);

        // Store references for animation
        const animatedParts = {
            leftEye,
            rightEye,
            leftPupil,
            rightPupil,
            mouth,
            leftUpperArm,
            rightUpperArm,
            leftHand,
            rightHand,
            antennaTip,
            chest
        };

        scene.add(robotGroup);
        camera.position.set(0, 2, 7);
        camera.lookAt(0, 1, 0);

        // Enhanced Animation
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Gentle rotation
            robotGroup.rotation.y += 0.005;

            // Floating motion
            robotGroup.position.y = Math.sin(time * 0.5) * 0.1;

            // Breathing effect on body
            body.scale.y = 1 + Math.sin(time * 2) * 0.05;

            // Blinking animation
            if (Math.sin(time * 3) > 0.95) {
                animatedParts.leftEye.scale.y = 0.1;
                animatedParts.rightEye.scale.y = 0.1;
            } else {
                animatedParts.leftEye.scale.y = 1;
                animatedParts.rightEye.scale.y = 1;
            }

            // Eye movement
            const eyeMovement = Math.sin(time * 0.7) * 0.1;
            animatedParts.leftPupil.position.x = -0.3 + eyeMovement;
            animatedParts.rightPupil.position.x = 0.3 + eyeMovement;

            // Arm animations
            animatedParts.leftUpperArm.rotation.z = Math.sin(time * 0.8) * 0.3;
            animatedParts.rightUpperArm.rotation.z = Math.sin(time * 0.8 + Math.PI) * 0.3;

            // Hand gestures
            animatedParts.leftHand.rotation.y = Math.sin(time * 1.2) * 0.5;
            animatedParts.rightHand.rotation.y = Math.sin(time * 1.2 + Math.PI) * 0.5;

            // Antenna blinking
            animatedParts.antennaTip.material.emissive.r = Math.sin(time * 4) * 0.3 + 0.2;

            // Chest panel pulsing
            animatedParts.chest.material.emissive.b = Math.sin(time * 2) * 0.1 + 0.1;

            // Mouth animation (like speaking)
            animatedParts.mouth.scale.x = 1 + Math.sin(time * 8) * 0.2;
            animatedParts.mouth.scale.z = 1 + Math.sin(time * 8) * 0.2;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full flex items-center justify-center" />;
}

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const startValue = 0;
        const endValue = parseInt(value);

        const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const currentCount = Math.floor(startValue + (endValue - startValue) * progress);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{count}</span>;
}

// Logout Component
function LogoutButton() {
    const handleLogout = (e) => {
        e.preventDefault();

        if (confirm('Apakah Anda yakin ingin logout?')) {
            router.post(route('logout'));
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg group"
            title="Logout"
        >
            <LogOut className="w-5 h-5 mr-3 group-hover:transform group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
        </button>
    );
}

export default function AdminDashboard({ auth }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Dashboard Admin" />
            <AdminLayout>
                <div className="space-y-6 ">
                    {/* Header with Logout */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                {auth?.user && (
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Selamat Datang, {auth.user.name}! 👋
                                    </h1>
                                )}
                                <p className="text-gray-600 mt-1">
                                    {currentTime.toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>{currentTime.toLocaleTimeString('id-ID')}</span>
                                </div>
                                <div className="border-l border-gray-200 pl-4">
                                    <LogoutButton />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Robot + System Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                            AI Customer Service
                        </h3>
                        <div className="h-72 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-blue-100">
                            <Robot3D />
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center p-4 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Chat Admin</p>
                                    <p className="text-xs text-green-600">Siap Melayani</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Database</p>
                                    <p className="text-xs text-blue-600">Terkoneksi</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                            <span>Last updated: {currentTime.toLocaleTimeString('id-ID')}</span>
                            <span className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                All systems operational
                            </span>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}