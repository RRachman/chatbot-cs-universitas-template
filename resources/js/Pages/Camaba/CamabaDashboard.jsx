import React, { useRef, useEffect, useState } from 'react';

import { Head, router } from '@inertiajs/react';
import { Bot, MessageSquare, User, Clock, BookOpen, Users, HelpCircle, LogOut, Bell, Calendar, Award, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import * as THREE from 'three';
import { route } from 'ziggy-js';


// Enhanced Student Robot Three.js Component
function StudentRobot3D() {
    const mountRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 280 / 280, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(280, 280);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Enhanced Lighting for student theme
        const ambientLight = new THREE.AmbientLight(0x404040, 0.9);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 8, 5);
        scene.add(directionalLight);

        const spotLight = new THREE.SpotLight(0x10b981, 0.6); // Emerald color
        spotLight.position.set(0, 10, 0);
        scene.add(spotLight);

        // Robot parts with student theme
        const robotGroup = new THREE.Group();

        // Friendly Body
        const bodyGeometry = new THREE.CylinderGeometry(1.1, 1.3, 2.2, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x10b981, // Emerald
            shininess: 80,
            specular: 0x111111
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        robotGroup.add(body);

        // Friendly Head
        const headGeometry = new THREE.SphereGeometry(0.9, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0x34d399, // Light emerald
            shininess: 90,
            specular: 0x222222
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.0;
        robotGroup.add(head);

        // Student Cap
        const capGeometry = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 16);
        const capMaterial = new THREE.MeshPhongMaterial({
            color: 0x059669,
            shininess: 100
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 2.7;
        robotGroup.add(cap);

        // Cap visor
        const visorGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 16);
        const visorMaterial = new THREE.MeshPhongMaterial({
            color: 0x047857
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.y = 2.65;
        robotGroup.add(visor);

        // Large Friendly Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.18, 12, 12);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x60a5fa, // Blue eyes
            emissive: 0x1e40af
        });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.35, 2.1, 0.75);
        rightEye.position.set(0.35, 2.1, 0.75);
        robotGroup.add(leftEye);
        robotGroup.add(rightEye);

        // Eye pupils
        const pupilGeometry = new THREE.SphereGeometry(0.09, 8, 8);
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.35, 2.1, 0.82);
        rightPupil.position.set(0.35, 2.1, 0.82);
        robotGroup.add(leftPupil);
        robotGroup.add(rightPupil);

        // Friendly Smile
        const smileGeometry = new THREE.TorusGeometry(0.25, 0.05, 8, 16, Math.PI);
        const smileMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000
        });
        const smile = new THREE.Mesh(smileGeometry, smileMaterial);
        smile.position.set(0, 1.7, 0.8);
        smile.rotation.z = Math.PI;
        robotGroup.add(smile);

        // Book/Knowledge symbol
        const bookGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
        const bookMaterial = new THREE.MeshPhongMaterial({
            color: 0xf59e0b // Amber
        });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(0, 0.3, 1.25);
        robotGroup.add(book);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.0, 12);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x10b981 });
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.3, 0.5, 0);
        rightArm.position.set(1.3, 0.5, 0);
        robotGroup.add(leftArm);
        robotGroup.add(rightArm);

        // Hands
        const handGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        const handMaterial = new THREE.MeshPhongMaterial({ color: 0x34d399 });
        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-1.3, -0.2, 0);
        rightHand.position.set(1.3, -0.2, 0);
        robotGroup.add(leftHand);
        robotGroup.add(rightHand);

        // Base
        const baseGeometry = new THREE.CylinderGeometry(1.4, 1.6, 0.25, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x065f46,
            shininess: 40
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -1.3;
        robotGroup.add(base);

        // Store animation references
        const animatedParts = {
            leftEye, rightEye, leftPupil, rightPupil, smile, book,
            leftArm, rightArm, leftHand, rightHand, cap
        };

        scene.add(robotGroup);
        camera.position.set(0, 1.5, 6);
        camera.lookAt(0, 0.5, 0);

        // Student-friendly animation
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;

            // Gentle rotation
            robotGroup.rotation.y += 0.003;

            // Floating motion
            robotGroup.position.y = Math.sin(time * 0.4) * 0.08;

            // Breathing
            body.scale.y = 1 + Math.sin(time * 1.5) * 0.03;

            // Friendly blinking
            if (Math.sin(time * 2.5) > 0.97) {
                animatedParts.leftEye.scale.y = 0.1;
                animatedParts.rightEye.scale.y = 0.1;
            } else {
                animatedParts.leftEye.scale.y = 1;
                animatedParts.rightEye.scale.y = 1;
            }

            // Eye tracking
            const eyeMovement = Math.sin(time * 0.6) * 0.08;
            animatedParts.leftPupil.position.x = -0.35 + eyeMovement;
            animatedParts.rightPupil.position.x = 0.35 + eyeMovement;

            // Gentle arm movement
            animatedParts.leftArm.rotation.z = Math.sin(time * 0.7) * 0.2;
            animatedParts.rightArm.rotation.z = Math.sin(time * 0.7 + Math.PI) * 0.2;

            // Book floating
            animatedParts.book.rotation.y += 0.01;
            animatedParts.book.position.y = 0.3 + Math.sin(time * 2) * 0.05;

            // Cap slight movement
            animatedParts.cap.rotation.y = Math.sin(time * 0.5) * 0.1;

            renderer.render(scene, camera);
        };

        animate();

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

// Logout Component for Student
function StudentLogoutButton() {
    const handleLogout = (e) => {
        e.preventDefault();

        if (confirm('Apakah Anda yakin ingin logout?')) {
            router.post(route('logout'));
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg group text-sm"
            title="Logout"
        >
            <LogOut className="w-4 h-4 mr-2 group-hover:transform group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
        </button>
    );
}

// Quick Action Card Component
function QuickActionCard({ icon: Icon, title, description, color, onClick, badge = null }) {
    return (
        <button
            onClick={onClick}
            className={`p-6 ${color} hover:opacity-90 rounded-xl transition-all duration-200 text-left transform hover:scale-105 shadow-lg hover:shadow-xl`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {badge && (
                    <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-white text-opacity-90 text-sm">{description}</p>
        </button>
    );
}

export default function StudentDashboard({ auth }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications] = useState([
        {
            id: 1,
            message: "Pengumuman hasil seleksi tahap 1 telah diumumkan",
            time: "10 menit yang lalu",
            type: "info",
            read: false
        },
        {
            id: 2,
            message: "Jangan lupa lengkapi dokumen pendaftaran",
            time: "1 jam yang lalu",
            type: "warning",
            read: false
        },
        {
            id: 3,
            message: "Selamat! Anda lolos ke tahap selanjutnya",
            time: "2 jam yang lalu",
            type: "success",
            read: true
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleChatBot = () => {
        // Navigate to chatbot page (you'll need to implement this route)
        router.visit(route('Camaba.chatbot'));
    };

    const handleChatAdmin = () => {
        router.visit(route('chat-admin.index'));
    };

    const stats = [
        {
            title: "Status Pendaftaran",
            value: "Aktif",
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Dokumen Lengkap",
            value: "85%",
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Tahap Seleksi",
            value: "2 dari 3",
            icon: Award,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <>
            <Head title="Dashboard Calon Mahasiswa" />

            <div className="space-y-10 mx-14 px-20 py-">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            {auth?.user && (
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Selamat Datang, {auth.user.name}! 🎓
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
                                <StudentLogoutButton />
                            </div>
                        </div>
                    </div>
                </div>



                {/* Main Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuickActionCard
                        icon={Bot}
                        title="Chatbot AI"
                        description="Tanya jawab otomatis seputar informasi kampus, jurusan, dan pendaftaran 24/7"
                        color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                        onClick={handleChatBot}
                        badge="Online"
                    />
                    <QuickActionCard
                        icon={MessageSquare}
                        title="Chat dengan Admin"
                        description="Hubungi admin secara langsung untuk bantuan khusus dan konsultasi personal"
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        onClick={handleChatAdmin}
                        badge={unreadCount > 0 ? `${unreadCount} pesan` : "Aktif"}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    {/* AI Assistant Showcase */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Bot className="w-5 h-5 mr-2 text-emerald-500" />
                            Assistant Mahasiswa
                        </h3>
                        <div className="h-72 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-lg flex items-center justify-center border-2 border-emerald-100">
                            <StudentRobot3D />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                🤖 <strong>AI Siap Membantu</strong>
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                                Dapatkan informasi cepat dan akurat
                            </p>
                            <div className="flex justify-center space-x-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    ● Smart AI
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    24/7 Ready
                                </span>
                            </div>
                        </div>
                    </div>


                </div>

            </div>

        </>
    );
}