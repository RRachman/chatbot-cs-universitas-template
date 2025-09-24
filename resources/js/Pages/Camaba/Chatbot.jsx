import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('unknown');
    const [retryCount, setRetryCount] = useState(0);
    const [lastHealthCheck, setLastHealthCheck] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // ✅ State untuk user_id
    const [unansweredMessage, setUnansweredMessage] = useState(null); // Tambahkan state untuk pesan yang tidak terjawab
    const messagesEndRef = useRef(null);

    // persist sender for the session so conversation stays consistent
    const senderRef = useRef(`ui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const mountedRef = useRef(true);

    const HEALTH_URL = '/api/chatbot/health';
    const CHAT_URL = '/api/chatbot/ask';

    // Data untuk topik chatbot (UI tetap sama)
    const chatTopics = [
        { id: 1, title: "Pendaftaran", icon: "📝" },
        { id: 2, title: "Biaya Kuliah", icon: "💰" },
        { id: 3, title: "Jurusan", icon: "🎓" },
        { id: 4, title: "Beasiswa", icon: "🏆" },
        { id: 5, title: "Fasilitas", icon: "🏢" },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ✅ Get user info dan CSRF token
    const getUserInfo = () => {
        // Method 1: Dari meta tag (paling reliable)
        const userIdFromMeta = document.querySelector('meta[name="user-id"]')?.content;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

        // Method 2: Dari window object (jika tersedia)
        const userIdFromWindow = window.currentUserId;
        const csrfFromWindow = window.csrfToken;

        return {
            userId: userIdFromMeta || userIdFromWindow || null,
            csrfToken: csrfToken || csrfFromWindow || null
        };
    };

    useEffect(() => {
        mountedRef.current = true;

        // ✅ Set user_id saat component mount
        const { userId } = getUserInfo();
        if (userId) {
            setCurrentUserId(parseInt(userId));
        }

        // run initial health check once
        checkConnectionStatus();

        // run periodic health check every 2 minutes regardless of status
        const interval = setInterval(() => {
            checkConnectionStatus();
        }, 120000);

        return () => {
            mountedRef.current = false;
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkConnectionStatus = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const response = await fetch(HEALTH_URL, {
                method: 'GET',
                headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log('Health check response:', data);

            if (!mountedRef.current) return;

            if (data.status === 'healthy' || data.status === 'success' || data.ok === true || data.status === 'ok') {
                setConnectionStatus('connected');
                setRetryCount(0);
            } else if (data.status === 'degraded') {
                setConnectionStatus('connected'); // still usable
            } else {
                setConnectionStatus('disconnected');
            }
            setLastHealthCheck(new Date().toLocaleTimeString());
        } catch (err) {
            console.warn('Health check failed:', err);
            if (!mountedRef.current) return;
            setConnectionStatus('disconnected');
            // functional update to ensure latest prev value
            setRetryCount(prev => {
                const next = prev + 1;
                if (next <= 3) {
                    const delay = Math.min(1000 * Math.pow(2, prev), 10000);
                    setTimeout(() => {
                        if (mountedRef.current) checkConnectionStatus();
                    }, delay);
                }
                return next;
            });
        }
    };

    // push message helper
    const pushMessage = (m) => setMessages(prev => [...prev, m]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        if (isLoading) return; // prevent double send

        // if disconnected, try a quick reconnect
        if (connectionStatus === 'disconnected') {
            await checkConnectionStatus();
            if (connectionStatus === 'disconnected') {
                alert('Chatbot sedang offline. Silakan coba lagi nanti.');
                return;
            }
        }

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { from: 'user', text: input, time: timestamp, id: Date.now() };
        pushMessage(userMessage);

        setIsLoading(true);
        const currentInput = input;
        setInput(''); // clear quickly for UX

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s

        try {
            // ✅ Get user info dan CSRF token
            const { userId, csrfToken } = getUserInfo();
            const finalUserId = userId || currentUserId;

            console.log('Sending message with user_id:', finalUserId); // Debug log

            const res = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }) // ✅ CSRF protection
                },
                body: JSON.stringify({
                    message: currentInput,
                    sender: senderRef.current,
                    user_id: finalUserId ? parseInt(finalUserId) : null // ✅ KIRIM USER_ID!
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);

            const data = await res.json();
            console.log('Chat API Response:', data);

            // ✅ Update currentUserId jika backend return user_id
            if (data.user_id && !currentUserId) {
                setCurrentUserId(data.user_id);
            }

            // Parse different possible formats
            let botText = null;
            let meta = {};

            if (Array.isArray(data)) {
                // raw rasa array
                botText = data.map(d => d.text).filter(Boolean).join('\n\n');
            } else if (data?.text && Array.isArray(data.text) && data.text.length > 0) {
                botText = data.text.join('\n\n');
                meta = { rasa_raw: data.rasa_raw };
            } else if (data?.status === 'success' && data?.jawaban) {
                botText = data.jawaban;
                meta = { source: data.source, confidence: data.confidence, responseTime: data.response_time_ms };
            } else if (data?.rasa_raw && Array.isArray(data.rasa_raw) && data.rasa_raw.length > 0) {
                botText = data.rasa_raw.map(d => d.text).filter(Boolean).join('\n\n');
            } else if (data?.message) {
                botText = data.message;
            }

            if (botText) {
                const botMessage = {
                    from: 'bot',
                    text: botText,
                    source: meta.source || 'rasa_bot',
                    confidence: meta.confidence,
                    responseTime: meta.responseTime,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    id: Date.now() + 1
                };
                pushMessage(botMessage);
                if (connectionStatus !== 'connected') {
                    setConnectionStatus('connected');
                    setRetryCount(0);
                }
            } else if (data?.status === 'rate_limit_exceeded') {
                pushMessage({
                    from: 'bot',
                    text: `Terlalu banyak permintaan. Silakan tunggu ${data.retry_after_seconds || 60} detik.`,
                    time: timestamp,
                    id: Date.now() + 1,
                    isError: true
                });
            } else {
                pushMessage({
                    from: 'bot',
                    text: data?.message || 'Maaf, terjadi kesalahan dalam memproses pertanyaan Anda.',
                    time: timestamp,
                    id: Date.now() + 1,
                    isError: true
                });
            }

            // Jika bot tidak bisa jawab, simpan pesan untuk dikirim ke admin
            if (botText && botText.trim().toLowerCase() === 'maaf, saya belum menemukan jawaban yang sesuai.') {
                setUnansweredMessage(currentInput);
            }
        } catch (err) {
            console.error('Chat Error:', err);
            let errorMessage = 'Maaf, chatbot sedang tidak tersedia. Silakan coba lagi dalam beberapa saat.';

            if (err.name === 'AbortError') {
                errorMessage = 'Permintaan timeout. Silakan coba lagi dengan pertanyaan yang lebih singkat.';
            } else if (err.message && err.message.includes('Failed to fetch')) {
                errorMessage = 'Koneksi terputus. Periksa koneksi internet Anda.';
                setConnectionStatus('disconnected');
            }

            pushMessage({
                from: 'bot',
                text: errorMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                id: Date.now() + 1,
                isError: true
            });

            // restore input only for non-timeout errors so user can retry
            if (err.name !== 'AbortError') setInput(currentInput);
        } finally {
            clearTimeout(timeoutId);
            if (mountedRef.current) setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        // ...existing code...
        // Setelah dapat jawaban dari bot
        if (botReply && botReply.trim() !== '' && botReply !== 'Maaf, saya tidak tahu jawabannya.') {
            // tampilkan jawaban
        } else {
            // Jika bot tidak bisa jawab, redirect ke chat admin dengan membawa pesan user
            router.visit(route('chat.admin'), {
                data: { initialMessage: userMessage },
                preserveState: true,
            });
        }
    };
    const sendQuickQuestion = (topic) => {
        const questions = {
            "Pendaftaran": "Bagaimana cara mendaftar di universitas ini?",
            "Biaya Kuliah": "Berapa biaya kuliah per semester?",
            "Jurusan": "Apa saja jurusan yang tersedia?",
            "Beasiswa": "Apakah ada program beasiswa yang ditawarkan?",
            "Fasilitas": "Fasilitas apa saja yang tersedia di kampus?"
        };

        const q = questions[topic];
        if (!q) return;
        setInput(q);

        setTimeout(() => {
            if (!isLoading) {
                // emulate user send but rely on sendMessage to handle network
                sendMessage();
            }
        }, 120);
    };

    const handleBack = () => {
        setMessages([]);
        setInput('');
        setSearchQuery('');
        setShowSearch(false);

        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/dashboard';
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        const filteredTopics = chatTopics.filter(topic =>
            topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredTopics.length > 0) {
            sendQuickQuestion(filteredTopics[0].title);
        } else {
            setInput(searchQuery);
        }

        setSearchQuery('');
        setShowSearch(false);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                document.getElementById('search-input')?.focus();
            }, 100);
        }
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'disconnected': return 'bg-red-500';
            default: return 'bg-yellow-500';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return `Chatbot Online${lastHealthCheck ? ` (${lastHealthCheck})` : ''}`;
            case 'disconnected': return `Chatbot Offline${retryCount > 0 ? ` (Retry ${retryCount}/3)` : ''}`;
            default: return 'Checking...';
        }
    };

    const clearChat = () => {
        if (window.confirm('Hapus semua percakapan?')) {
            setMessages([]);
        }
    };

    // ---------- RENDER (UI kept exactly like your original) ----------
    return (
        <div className="flex justify-center items-center min-h-screen bg-purple-100">
            <div className="flex w-full max-w-4xl h-[600px] mx-4">
                {/* Info Panel */}
                <div className="w-1/3 bg-indigo-600 rounded-l-3xl overflow-hidden flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <button
                                onClick={handleBack}
                                className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3 hover:bg-indigo-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-white text-2xl font-bold">Chatbot PMB</h1>
                        </div>

                        {/* ENHANCED CONNECTION STATUS */}
                        <div className="flex items-center mb-4">
                            <div className={`h-3 w-3 rounded-full ${getConnectionStatusColor()} mr-2 ${connectionStatus === 'unknown' ? 'animate-pulse' : ''}`}></div>
                            <span className="text-white text-sm flex-1">{getConnectionStatusText()}</span>
                            <button
                                onClick={checkConnectionStatus}
                                className="ml-2 text-white hover:text-indigo-200 text-xs hover:bg-indigo-500 rounded px-2 py-1 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳' : '🔄'}
                            </button>
                        </div>

                        {/* ✅ User info debug (hapus di production) */}
                        {currentUserId && (
                            <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 mb-4">
                                <p className="text-blue-800 text-xs">
                                    👤 User ID: {currentUserId}
                                </p>
                            </div>
                        )}

                        {/* Connection warning */}
                        {connectionStatus === 'disconnected' && (
                            <div className="bg-red-100 border border-red-300 rounded-lg p-2 mb-4">
                                <p className="text-red-800 text-xs">
                                    ⚠️ Chatbot offline. Fitur terbatas.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Information area */}
                    <div className="flex-1 bg-white rounded-tl-3xl p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-bold text-lg text-indigo-800">Informasi PMB</h2>
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                >
                                    🗑️ Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {chatTopics
                                .filter(topic =>
                                    !searchQuery || topic.title.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((topic) => (
                                    <div
                                        key={topic.id}
                                        onClick={() => sendQuickQuestion(topic.title)}
                                        className="flex items-center p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors group"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-xl group-hover:bg-indigo-300 transition-colors">
                                            {topic.icon}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-indigo-800">{topic.title}</h3>
                                            <p className="text-sm text-indigo-600">Tanya tentang {topic.title.toLowerCase()}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <h3 className="font-medium text-yellow-800 mb-1">Jam Operasional</h3>
                            <p className="text-sm text-yellow-700">Senin - Jumat: 08.00 - 16.00 WIB</p>
                            <p className="text-sm text-yellow-700">Sabtu: 08.00 - 12.00 WIB</p>
                        </div>

                        {/* Stats */}
                        {messages.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                                <h3 className="font-medium text-gray-800 mb-1 text-sm">Statistik Chat</h3>
                                <p className="text-xs text-gray-600">Total pesan: {messages.length}</p>
                                <p className="text-xs text-gray-600">
                                    Respons bot: {messages.filter(m => m.from === 'bot').length}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="w-2/3 bg-indigo-600 rounded-r-3xl flex flex-col">
                    {/* Chat header */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <h2 className="text-white text-2xl font-bold">Chatbot Penerimaan Mahasiswa Baru</h2>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={toggleSearch}
                                className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white hover:bg-indigo-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {showSearch && (
                        <div className="px-4 pb-2">
                            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                                <input
                                    id="search-input"
                                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari topik pertanyaan..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white ml-2 hover:bg-indigo-700 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowSearch(false)}
                                    className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white ml-1 hover:bg-gray-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Messages area */}
                    <div className="flex-1 bg-white rounded-tr-3xl p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl mb-4">
                                    🤖
                                </div>
                                <h3 className="text-xl font-medium text-indigo-800 mb-2">Selamat datang di Chatbot PMB</h3>
                                <p className="text-center max-w-md text-gray-600 mb-4">
                                    Tanyakan informasi seputar penerimaan mahasiswa baru, jurusan, biaya kuliah, dan hal lainnya.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {chatTopics.slice(0, 3).map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => sendQuickQuestion(topic.title)}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 transition-colors"
                                            disabled={connectionStatus === 'disconnected'}
                                        >
                                            {topic.icon} {topic.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={msg.id || index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.from === 'bot' && (
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mr-2">
                                                🤖
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.from === 'user'
                                                ? 'bg-indigo-100 text-gray-800'
                                                : msg.isError
                                                    ? 'bg-red-50 border border-red-200 text-red-800'
                                                    : 'bg-white border border-gray-200 text-gray-800'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-500">{msg.time}</span>
                                                    <div className="flex items-center space-x-1">
                                                        {msg.source && (
                                                            <span className="text-xs text-gray-400" title={`Source: ${msg.source}`}>
                                                                {msg.source === 'rasa_bot' ? '🤖' :
                                                                    msg.source === 'fallback' ? '⚠️' :
                                                                        msg.source === 'cache' ? '⚡' : ''}
                                                            </span>
                                                        )}
                                                        {msg.responseTime && (
                                                            <span className="text-xs text-gray-400" title={`Response time: ${msg.responseTime}ms`}>
                                                                {msg.responseTime < 1000 ? '🟢' : msg.responseTime < 3000 ? '🟡' : '🔴'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {msg.from === 'user' && (
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center ml-2">
                                                👨‍🎓
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mr-2">
                                            🤖
                                        </div>
                                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-gray-800">
                                            <div className="flex space-x-1 items-center">
                                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                                <span className="ml-2 text-xs text-gray-500">Mengetik...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Tombol Kirim ke Admin */}
                    {unansweredMessage && (
                        <div className="fixed bottom-8 right-8 z-50">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ minWidth: 'auto', minHeight: 'auto' }}
                                onClick={() => {
                                    router.visit(route('chat-admin.index'), {
                                        data: { initialMessage: unansweredMessage },
                                        preserveState: true,
                                    });
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                Kirim ke Admin
                            </button>
                        </div>
                    )}

                    {/* Input area */}
                    <div className="p-4 bg-white rounded-br-3xl">
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                            <input
                                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={connectionStatus === 'disconnected'
                                    ? "Chatbot offline..."
                                    : "Tulis pertanyaanmu..."}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                disabled={isLoading}
                                maxLength={1000}
                            />
                            <div className="flex items-center space-x-2 ml-2">
                                <span className="text-xs text-gray-400">
                                    {input.length}/1000
                                </span>
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${isLoading || !input.trim()
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                        } transition-colors`}
                                >
                                    {isLoading ? (
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

