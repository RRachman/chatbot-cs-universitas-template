import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    MessageCircle,
    FileText,
    ChevronRight
} from 'lucide-react';

export default function Sidebar() {
    const { url } = usePage();

    // Function to determine active section based on current URL
    const getActiveSectionFromUrl = (currentUrl) => {
        if (currentUrl.startsWith('/admin/users') || currentUrl.startsWith('/admin/knowledge')) {
            return 'users';
        } else if (currentUrl.startsWith('/admin/chat')) {
            return 'chat';
        } else if (currentUrl.startsWith('/admin/reports')) {
            return 'report';
        } else {
            return 'dashboard';
        }
    };

    const [activeSection, setActiveSection] = useState(() => getActiveSectionFromUrl(url));

    // Update active section when URL changes
    useEffect(() => {
        const newActiveSection = getActiveSectionFromUrl(url);
        setActiveSection(newActiveSection);
    }, [url]);

    const isActive = (href) => url.startsWith(href);

    const menuItems = [
        {
            id: 'dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
            items: [
                { href: '/admin/dashboard', label: 'Dashboard' }
            ]
        },
        {
            id: 'users',
            icon: Users,
            label: 'Kelola User',
            items: [
                { href: '/admin/users', label: 'Kelola User' },
                { href: '/admin/knowledge', label: 'Kelola Knowledge' }
            ]
        },
        {
            id: 'chat',
            icon: MessageCircle,
            label: 'Chat Admin Live',
            items: [
                { href: '/chat-admin', label: 'Chat Admin - Live' }
            ]
        },
        {
            id: 'report',
            icon: FileText,
            label: 'Laporan',
            items: [
                { href: '/admin/laporan', label: 'Laporan', icon: FileText }
            ]
        }
    ];

    const activeMenu = menuItems.find(item => item.id === activeSection);

    // Handle icon click - just expand the menu, don't navigate
    const handleIconClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar Kecil - Icons */}
            <aside className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
                {/* Logo */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg w-10 h-10 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-white">CS</span>
                </div>

                {/* Menu Icons */}
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleIconClick(item.id)}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${activeSection === item.id
                                ? 'bg-indigo-100 text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                            title={item.label}
                        >
                            <Icon className="w-5 h-5" />

                            {/* Tooltip */}
                            <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                {item.label}
                            </div>
                        </button>
                    );
                })}
            </aside>

            {/* Sidebar Detail - Menu */}
            <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                {/* Header */}
                <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${activeSection === 'dashboard' ? 'bg-indigo-100 text-indigo-600' :
                            activeSection === 'users' ? 'bg-emerald-100 text-emerald-600' :
                                activeSection === 'chat' ? 'bg-blue-100 text-blue-600' :
                                    'bg-orange-100 text-orange-600'
                            }`}>
                            {React.createElement(activeMenu.icon, { className: "w-4 h-4" })}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{activeMenu.label}</h3>
                            <p className="text-xs text-gray-500">
                                {activeMenu.items.length} menu tersedia
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="px-4 py-4">
                    <ul className="space-y-1">
                        {activeMenu.items.map((menuItem, index) => (
                            <li key={index}>
                                <Link
                                    href={menuItem.href}
                                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group ${isActive(menuItem.href)
                                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full mr-3 ${isActive(menuItem.href)
                                        ? 'bg-indigo-500'
                                        : 'bg-gray-300 group-hover:bg-gray-400'
                                        }`}></div>
                                    <span className="flex-1">{menuItem.label}</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Info Section */}
                    <div className="mt-8 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Quick Access</p>
                        <p className="text-sm text-gray-700">
                            Klik menu di sebelah kiri untuk mengakses fitur lainnya
                        </p>
                    </div>
                </nav>
            </aside>
        </div>
    );
}