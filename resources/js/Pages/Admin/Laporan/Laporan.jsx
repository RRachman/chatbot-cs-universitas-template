import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Search, Filter, Bot, Users, MessageCircle, Calendar, User, TrendingUp, Eye, Download, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '@/Components/Sidebar';

// Fungsi untuk kategorisasi otomatis
function getCategoryFromMessage(message) {
    if (!message) return 'Umum';

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('daftar') || lowerMessage.includes('pendaftaran') || lowerMessage.includes('registrasi')) {
        return 'Pendaftaran';
    }
    if (lowerMessage.includes('biaya') || lowerMessage.includes('ukt') || lowerMessage.includes('bayar')) {
        return 'Keuangan';
    }
    if (lowerMessage.includes('jadwal') || lowerMessage.includes('waktu') || lowerMessage.includes('kapan')) {
        return 'Jadwal';
    }
    if (lowerMessage.includes('syarat') || lowerMessage.includes('dokumen') || lowerMessage.includes('berkas')) {
        return 'Persyaratan';
    }
    return 'Umum';
}

// Komponen untuk menampilkan satu sesi chat
const ChatSession = ({ session, type }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-4 border rounded-lg overflow-hidden">
            <div
                className={`p-4 flex justify-between items-center cursor-pointer ${type === 'chatbot' ? 'bg-blue-50' : 'bg-green-50'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h4 className="font-medium">{session.user_name}</h4>
                    <p className="text-sm text-gray-600">Sesi ID: {session.session_id}</p>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isExpanded && (
                <div className="p-4 bg-white">
                    {type === 'chatbot' ? (
                        <div className="space-y-3">
                            {session.logs.map((log, idx) => (
                                <div key={log.id || idx} className="border-b pb-3 mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <User size={16} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">Pertanyaan:</p>
                                            <p className="text-gray-700">{log.user_message}</p>
                                            <p className="text-xs text-gray-500">{log.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 mt-2">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <Bot size={16} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">Jawaban Bot:</p>
                                            <p className="text-gray-700">{log.bot_reply}</p>
                                            <div className="mt-2">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {log.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {session.messages.map((msg, idx) => (
                                <div key={idx} className={`flex items-start gap-3 ${msg.sender_type === 'admin' ? 'justify-end' : ''}`}>
                                    <div className={`p-3 rounded-full ${msg.sender_type === 'admin' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                        {msg.sender_type === 'admin' ? (
                                            <User size={16} className="text-green-600" />
                                        ) : (
                                            <User size={16} className="text-blue-600" />
                                        )}
                                    </div>
                                    <div className={`flex-1 ${msg.sender_type === 'admin' ? 'text-right' : ''}`}>
                                        <p className="font-medium text-gray-800">
                                            {msg.sender_type === 'admin' ? session.admin_name || 'Admin' : session.user_name}
                                        </p>
                                        <p className="text-gray-700">{msg.message}</p>
                                        <p className="text-xs text-gray-500">{msg.created_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function Laporan({ chatbotReports = [], chatAdminReports = [], statistics = {} }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [adminFilter, setAdminFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSelections, setExportSelections] = useState({ chatbot: true, admin: true, faq: true });

    // CSV Export Handler
    const handleExport = () => {
        setIsExporting(true);
        let allCSVs = [];
        let fileNames = [];
        // Chatbot
        if (exportSelections.chatbot) {
            const rows = filteredChatbot.map(item => ({
                ID: item.id,
                Tanggal: item.created_at,
                Nama: item.user_name,
                Email: item.user_email,
                Pertanyaan: item.user_message,
                JawabanBot: item.bot_reply,
                Kategori: item.category
            }));
            if (rows.length > 0) {
                const header = Object.keys(rows[0]);
                const csvContent = [header.join(','), ...rows.map(row => header.map(h => '"' + (row[h] ?? '') + '"').join(','))].join('\r\n');
                allCSVs.push({ name: 'chatbot.csv', content: csvContent });
                fileNames.push('chatbot.csv');
            }
        }
        // Admin
        if (exportSelections.admin) {
            const rows = filteredChatAdmin.flatMap(item =>
                item.messages.map((msg, idx) => ({
                    ID: item.id,
                    Tanggal: msg.created_at,
                    Nama: item.user_name,
                    Email: item.user_email,
                    Admin: item.admin_name,
                    Pengirim: msg.sender_type,
                    Pesan: msg.message
                }))
            );
            if (rows.length > 0) {
                const header = Object.keys(rows[0]);
                const csvContent = [header.join(','), ...rows.map(row => header.map(h => '"' + (row[h] ?? '') + '"').join(','))].join('\r\n');
                allCSVs.push({ name: 'admin.csv', content: csvContent });
                fileNames.push('admin.csv');
            }
        }
        // FAQ
        if (exportSelections.faq) {
            const rows = faqData.map((faq, idx) => ({
                No: idx + 1,
                Pertanyaan: faq.question,
                Jumlah: faq.count
            }));
            if (rows.length > 0) {
                const header = Object.keys(rows[0]);
                const csvContent = [header.join(','), ...rows.map(row => header.map(h => '"' + (row[h] ?? '') + '"').join(','))].join('\r\n');
                allCSVs.push({ name: 'faq.csv', content: csvContent });
                fileNames.push('faq.csv');
            }
        }
        // Download CSVs
        if (allCSVs.length === 1) {
            // Single file
            const blob = new Blob([allCSVs[0].content], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', allCSVs[0].name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (allCSVs.length > 1) {
            // Multiple files: create zip
            import('jszip').then(JSZipModule => {
                const JSZip = JSZipModule.default || JSZipModule;
                const zip = new JSZip();
                allCSVs.forEach(file => {
                    zip.file(file.name, file.content);
                });
                zip.generateAsync({ type: 'blob' }).then(blob => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute('download', 'laporan.zip');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            });
        }
        setTimeout(() => {
            setIsExporting(false);
            setShowExportModal(false);
        }, 1000);
    };

    // Process data from props - kelompokkan chatbot per sesi
    const processedChatbotData = useMemo(() => {
        // Group by session_id
        const sessions = {};
        chatbotReports.forEach((item) => {
            const sessionId = item.session_id || item.id;
            if (!sessions[sessionId]) {
                sessions[sessionId] = {
                    session_id: sessionId,
                    session_token: item.session_token,
                    user_name: item.user_name,
                    user_email: item.user_email,
                    logs: []
                };
            }
            sessions[sessionId].logs.push({
                id: item.id,
                created_at: item.created_at,
                created_at_raw: item.created_at_raw,
                user_message: item.user_message,
                bot_reply: item.bot_reply,
                source: item.source || 'chatbot',
                category: getCategoryFromMessage(item.user_message)
            });
        });
        // Sort logs per session by created_at_raw
        Object.values(sessions).forEach(session => {
            session.logs.sort((a, b) => new Date(a.created_at_raw) - new Date(b.created_at_raw));
        });
        // Return array of sessions
        return Object.values(sessions);
    }, [chatbotReports]);

    const processedChatAdminData = useMemo(() => {
        // Group admin chats by session/user
        const sessions = {};
        chatAdminReports.forEach((item) => {
            const sessionKey = item.user_email || item.user_name;
            if (!sessions[sessionKey]) {
                sessions[sessionKey] = {
                    id: item.id,
                    created_at: item.created_at,
                    user_name: item.user_name,
                    user_email: item.user_email,
                    admin_name: item.admin_name || (item.sender_type === 'admin' ? 'Admin' : null),
                    messages: []
                };
            }
            sessions[sessionKey].messages.push({
                message: item.message,
                sender_type: item.sender_type,
                created_at: item.created_at
            });
        });

        return Object.values(sessions);
    }, [chatAdminReports]);

    // Gunakan statistik dari backend jika tersedia
    const backendStats = statistics?.totals || {};
    const backendFaqData = statistics?.frequent_questions || [];
    const backendCategoryStats = statistics?.categories || [];
    const backendAdminStats = statistics?.admin_performance || [];

    // Filter dan search logic untuk chatbot per sesi
    const filteredChatbot = useMemo(() => {
        return processedChatbotData.filter(session => {
            // Cari di nama user atau di salah satu log
            const matchesSearch = searchTerm === '' ||
                session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.logs.some(log =>
                    (log.user_message && log.user_message.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (log.bot_reply && log.bot_reply.toLowerCase().includes(searchTerm.toLowerCase()))
                );

            // Filter tanggal: salah satu log dalam sesi cocok
            const matchesDate = dateFilter === '' ||
                session.logs.some(log => log.created_at.includes(dateFilter));

            // Filter kategori: salah satu log dalam sesi cocok
            const matchesCategory = categoryFilter === '' ||
                session.logs.some(log => log.category === categoryFilter);

            return matchesSearch && matchesDate && matchesCategory;
        });
    }, [processedChatbotData, searchTerm, dateFilter, categoryFilter]);

    const filteredChatAdmin = useMemo(() => {
        return processedChatAdminData.filter(item => {
            const matchesSearch = searchTerm === '' ||
                item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.admin_name && item.admin_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.messages.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDate = dateFilter === '' || item.created_at.includes(dateFilter);
            const matchesAdmin = adminFilter === '' || (item.admin_name && item.admin_name.includes(adminFilter));

            return matchesSearch && matchesDate && matchesAdmin;
        });
    }, [processedChatAdminData, searchTerm, dateFilter, adminFilter]);

    // Statistics dengan data real dari backend atau fallback ke perhitungan lokal
    const stats = useMemo(() => {
        if (Object.keys(backendStats).length > 0) {
            return {
                totalChatbot: backendStats.chatbot_interactions || 0,
                totalChatAdmin: backendStats.admin_chats || 0,
                uniqueUsers: backendStats.unique_users || 0,
                uniqueAdmins: backendStats.active_admins || 0
            };
        }

        // Fallback ke perhitungan lokal jika tidak ada data dari backend
        const totalChatbot = filteredChatbot.length;
        const totalChatAdmin = filteredChatAdmin.length;

        const chatbotUsers = new Set(filteredChatbot.map(item => item.user_name));
        const chatAdminUsers = new Set(filteredChatAdmin.map(item => item.user_name));
        const uniqueUsers = new Set([...chatbotUsers, ...chatAdminUsers]).size;

        const uniqueAdmins = new Set(
            filteredChatAdmin
                .filter(item => item.admin_name && item.admin_name !== 'Sistem')
                .map(item => item.admin_name)
        ).size;

        return { totalChatbot, totalChatAdmin, uniqueUsers, uniqueAdmins };
    }, [filteredChatbot, filteredChatAdmin, backendStats]);

    // FAQ Analysis berdasarkan data real dari backend atau fallback
    const faqData = useMemo(() => {
        if (backendFaqData.length > 0) {
            return backendFaqData.map(item => ({
                question: item.question,
                count: item.count
            }));
        }

        // Fallback ke analisis lokal
        const questions = {};
        filteredChatbot.forEach(item => {
            const question = item.user_message.toLowerCase();
            const key = question.substring(0, 50) + '...';
            questions[key] = (questions[key] || 0) + 1;
        });

        return Object.entries(questions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([question, count]) => ({ question, count }));
    }, [filteredChatbot, backendFaqData]);

    // Analisis admin performance dari backend atau fallback
    const adminStats = useMemo(() => {
        if (backendAdminStats.length > 0) {
            return backendAdminStats.map(item => ({
                admin: item.admin_name,
                count: item.total_responses,
                avgDaily: item.avg_daily
            }));
        }

        // Fallback ke analisis lokal
        const adminActivity = {};
        filteredChatAdmin.forEach(item => {
            if (item.admin_name) {
                adminActivity[item.admin_name] = (adminActivity[item.admin_name] || 0) + item.messages.filter(m => m.sender_type === 'admin').length;
            }
        });

        return Object.entries(adminActivity)
            .sort(([, a], [, b]) => b - a)
            .map(([admin, count]) => ({ admin, count, avgDaily: (count / 7).toFixed(1) }));
    }, [filteredChatAdmin, backendAdminStats]);

    // Category distribution dari backend atau fallback
    const categoryStats = useMemo(() => {
        if (backendCategoryStats.length > 0) {
            return backendCategoryStats.map(item => ({
                category: item.category,
                count: item.count,
                percentage: item.percentage
            }));
        }

        // Fallback ke analisis lokal
        const categories = {};
        filteredChatbot.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
        });

        return Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => ({ category, count }));
    }, [filteredChatbot, backendCategoryStats]);

    const resetFilters = () => {
        setSearchTerm('');
        setDateFilter('');
        setCategoryFilter('');
        setAdminFilter('');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title="Dashboard Laporan Interaksi" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Laporan Interaksi</h1>
                        <p className="text-gray-600">Analisis komprehensif interaksi mahasiswa dengan sistem</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'chatbot', label: 'Chatbot', icon: Bot },
                            { id: 'admin', label: 'Chat Admin', icon: Users },
                            { id: 'faq', label: 'FAQ Analysis', icon: MessageCircle }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search and Filter Section */}
                    <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            {/* Search Bar */}
                            <div className="relative flex-1 min-w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nama user, pesan, atau jawaban..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Filter size={18} />
                                <span>Filter</span>
                            </button>

                            {/* Export Button triggers modal */}
                            <button
                                onClick={() => setShowExportModal(true)}
                                disabled={isExporting}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isExporting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                    } text-white`}
                            >
                                <Download size={18} />
                                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                            </button>
                            {/* Export Modal */}
                            {showExportModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                        <h2 className="text-lg font-bold mb-4">Pilih Data yang Ingin Diexport</h2>
                                        <form onSubmit={e => { e.preventDefault(); handleExport(); }}>
                                            <div className="space-y-3 mb-6">
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={exportSelections.chatbot} onChange={e => setExportSelections(s => ({ ...s, chatbot: e.target.checked }))} className="mr-2" />
                                                    Interaksi Chatbot
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={exportSelections.admin} onChange={e => setExportSelections(s => ({ ...s, admin: e.target.checked }))} className="mr-2" />
                                                    Chat Admin
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={exportSelections.faq} onChange={e => setExportSelections(s => ({ ...s, faq: e.target.checked }))} className="mr-2" />
                                                    FAQ Analysis
                                                </label>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <button type="button" className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => setShowExportModal(false)}>Batal</button>
                                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg" disabled={isExporting || (!exportSelections.chatbot && !exportSelections.admin && !exportSelections.faq)}>
                                                    {isExporting ? 'Exporting...' : 'Export'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Expandable Filters */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Tanggal</label>
                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Kategori</label>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Kategori</option>
                                            <option value="Pendaftaran">Pendaftaran</option>
                                            <option value="Keuangan">Keuangan</option>
                                            <option value="Jadwal">Jadwal</option>
                                            <option value="Persyaratan">Persyaratan</option>
                                            <option value="Umum">Umum</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Admin</label>
                                        <select
                                            value={adminFilter}
                                            onChange={(e) => setAdminFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Admin</option>
                                            {adminStats.map((admin, index) => (
                                                <option key={index} value={admin.admin}>{admin.admin}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { title: 'Interaksi Chatbot', value: stats.totalChatbot, icon: Bot, color: 'bg-blue-100 text-blue-600' },
                                    { title: 'Chat Admin', value: stats.totalChatAdmin, icon: Users, color: 'bg-green-100 text-green-600' },
                                    { title: 'Pengguna Aktif', value: stats.uniqueUsers, icon: User, color: 'bg-orange-100 text-orange-600' },
                                    { title: 'Admin Aktif', value: stats.uniqueAdmins, icon: MessageCircle, color: 'bg-purple-100 text-purple-600' }
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                                <stat.icon className="" size={20} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                        <p className="text-gray-600 text-sm">{stat.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Category Distribution */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Kategori Pertanyaan</h3>
                                <div className="space-y-3">
                                    {categoryStats.map((cat, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-800">{cat.category}</span>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-blue-600 text-sm">{cat.count} pertanyaan</span>
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${(cat.count / Math.max(...categoryStats.map(c => c.count))) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Performance */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Performa Admin</h3>
                                <div className="space-y-3">
                                    {adminStats.map((admin, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-800">{admin.admin}</span>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-green-600 text-sm">{admin.count} respon</span>
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${(admin.count / Math.max(...adminStats.map(a => a.count))) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chatbot Tab */}
                    {activeTab === 'chatbot' && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                                    <Bot className="text-blue-600" />
                                    <span>Laporan Interaksi Chatbot ({filteredChatbot.length})</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {filteredChatbot.length > 0 ? (
                                    filteredChatbot.map((item, index) => (
                                        <ChatSession key={item.id} session={item} type="chatbot" />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Tidak ada data yang ditemukan</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Admin Chat Tab */}
                    {activeTab === 'admin' && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                                    <Users className="text-green-600" />
                                    <span>Laporan Chat Admin ({filteredChatAdmin.length})</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {filteredChatAdmin.length > 0 ? (
                                    filteredChatAdmin.map((item, index) => (
                                        <ChatSession key={item.id} session={item} type="admin" />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Tidak ada data yang ditemukan</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FAQ Analysis Tab */}
                    {activeTab === 'faq' && (
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                    <MessageCircle className="text-yellow-600" />
                                    <span>Pertanyaan Yang Sering Diajukan</span>
                                </h3>
                                <div className="space-y-3">
                                    {faqData.map((faq, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-gray-800">{faq.question}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-yellow-600 font-bold">{faq.count}x</span>
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-500 h-2 rounded-full"
                                                        style={{ width: `${(faq.count / Math.max(...faqData.map(f => f.count))) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}