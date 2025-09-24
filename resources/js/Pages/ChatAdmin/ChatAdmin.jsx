import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

export default function ChatAdmin({ sessionId, messages = [], auth, chatSessions = [], currentSession = null }) {
    const { data, setData, post, reset } = useForm({
        message: '',
        sessionId: sessionId,
    });

    const [localMessages, setLocalMessages] = useState(messages);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const isAdmin = auth.user.role === 'admin';

    // Update local messages when props change
    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    // Smart polling untuk realtime updates menggunakan Inertia
    const fetchMessages = useCallback(() => {
        if (isLoading) return;

        router.reload({
            only: ['messages', 'chatSessions', 'currentSession'],
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                setLocalMessages(page.props.messages);
            }
        });
    }, [isLoading]);

    // Polling setiap 3 detik menggunakan Inertia
    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.message.trim() || isLoading) return;

        setIsLoading(true);
        setIsTyping(true);

        // Optimistic update - tambah pesan langsung ke UI
        const optimisticMessage = {
            id: Date.now(),
            message: data.message,
            sender_type: isAdmin ? 'admin' : 'user',
            sender_id: auth.user.id,
            created_at: new Date().toISOString(),
            is_optimistic: true
        };

        setLocalMessages(prev => [...prev, optimisticMessage]);
        const messageText = data.message;
        reset('message');

        try {
            await new Promise((resolve, reject) => {
                post(route('chat-admin.send'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setTimeout(() => {
                            router.reload({
                                only: ['messages'],
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: (page) => {
                                    setLocalMessages(page.props.messages);
                                }
                            });
                        }, 500);
                        resolve();
                    },
                    onError: (error) => {
                        setLocalMessages(prev => prev.filter(msg => !msg.is_optimistic));
                        setData('message', messageText);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatLastMessage = (message) => {
        return message.length > 50 ? message.substring(0, 50) + '...' : message;
    };

    const switchChat = (newSessionId) => {
        router.visit(`/chat-admin/${newSessionId}`);
    };

    // Filter chat sessions untuk admin - hanya tampilkan chat dari user (bukan admin)
    const filteredChatSessions = isAdmin ?
        chatSessions.filter(session => session.user?.role !== 'admin') :
        chatSessions;

    // SECTION 1: CAMABA VIEW (Modern & Keren)
    if (!isAdmin) {
        return (
            <>
                <Head title="Chat PMB - Tanyakan Apapun!" />

                {/* Background dengan gradient dan pattern */}
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Main Container */}
                    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                        <div className="w-full max-w-4xl h-screen max-h-[90vh] flex flex-col bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 overflow-hidden">

                            {/* Header dengan gradient */}
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-6 relative overflow-hidden">
                                {/* Header background pattern */}
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* Avatar dengan animasi */}
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Status online indicator */}
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                                        </div>

                                        <div className="text-white">
                                            <h1 className="text-xl font-bold tracking-tight">Admin PMB</h1>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-200"></div>
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-400"></div>
                                                </div>
                                                <span className="text-sm text-white/80 font-medium">Siap membantu Anda</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info badge */}
                                    <div className="hidden sm:flex items-center space-x-2">
                                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span className="text-sm text-white font-medium">Layanan 24/7</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area dengan custom scrollbar */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm custom-scrollbar">
                                {localMessages.length > 0 ? (
                                    localMessages.map((msg, index) => {
                                        const isMyMessage = msg.sender_id === auth.user.id;

                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${msg.is_optimistic ? 'opacity-70' : ''}`}>
                                                    {/* Avatar untuk pesan admin */}
                                                    {!isMyMessage && (
                                                        <div className="flex items-end space-x-2 mb-1">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                                <span className="text-xs font-bold text-white">A</span>
                                                            </div>
                                                            <span className="text-xs text-gray-500 font-medium">Admin PMB</span>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`relative px-6 py-4 shadow-lg transform transition-all duration-200 hover:scale-105 ${isMyMessage
                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl rounded-br-lg ml-12'
                                                            : 'bg-white text-gray-800 rounded-3xl rounded-bl-lg border border-gray-100 mr-12'
                                                            }`}
                                                    >
                                                        {/* Message bubble tail */}
                                                        <div className={`absolute w-4 h-4 transform rotate-45 ${isMyMessage
                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 -bottom-1 right-4'
                                                            : 'bg-white border-r border-b border-gray-100 -bottom-1 left-4'
                                                            }`}></div>

                                                        <p className="text-sm leading-relaxed break-words relative z-10">
                                                            {msg.message}
                                                        </p>

                                                        <div className="flex items-center justify-between mt-3 relative z-10">
                                                            <span className={`text-xs font-medium ${isMyMessage ? 'text-white/80' : 'text-gray-500'
                                                                }`}>
                                                                {formatTime(msg.created_at)}
                                                            </span>

                                                            {isMyMessage && (
                                                                <div className="flex items-center space-x-1">
                                                                    <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                                    </svg>
                                                                    <svg className="w-4 h-4 text-white/80 -ml-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center max-w-md mx-auto">
                                            {/* Welcome animation */}
                                            <div className="relative mb-8">
                                                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                    </svg>
                                                </div>
                                                {/* Floating elements */}
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                                                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-bounce animation-delay-200"></div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                                Selamat Datang di <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PMB Chat</span>! 👋
                                            </h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                Kami siap membantu menjawab semua pertanyaan Anda tentang pendaftaran, program studi, dan informasi kampus lainnya.
                                            </p>

                                            {/* Quick questions */}
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-gray-700 mb-3">💡 Pertanyaan yang sering ditanyakan:</p>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {['Biaya kuliah', 'Jadwal pendaftaran', 'Program studi', 'Beasiswa'].map((topic, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex justify-start animate-fade-in">
                                        <div className="flex items-end space-x-2 mb-1">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-xs font-bold text-white">A</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-3xl rounded-bl-lg px-6 py-4 shadow-lg border border-gray-100 ml-2">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area dengan design modern */}
                            <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 px-6 py-6">
                                <form onSubmit={handleSubmit} className="flex items-end space-x-4">
                                    {/* Attachment button */}
                                    <button
                                        type="button"
                                        className="p-3 text-gray-400 hover:text-blue-600 rounded-2xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                        </svg>
                                    </button>

                                    {/* Input field */}
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ketik pertanyaan Anda di sini... 💬"
                                            disabled={isLoading}
                                            className="w-full resize-none border-2 border-gray-200 rounded-3xl px-6 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 max-h-32 disabled:opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
                                            rows="1"
                                            style={{
                                                minHeight: '56px',
                                                height: 'auto',
                                            }}
                                        />

                                        {/* Character count */}
                                        <div className="absolute bottom-2 right-16 text-xs text-gray-400">
                                            {data.message.length}/500
                                        </div>
                                    </div>

                                    {/* Send button */}
                                    <button
                                        type="submit"
                                        disabled={!data.message.trim() || isLoading}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${data.message.trim() && !isLoading
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                            </svg>
                                        )}
                                    </button>
                                </form>

                                {/* Footer info */}
                                <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span>Respons cepat</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                        <span>Aman & terpercaya</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom CSS */}
                <style jsx>{`
                  @keyframes blob {
                      0% { transform: translate(0px, 0px) scale(1); }
                      33% { transform: translate(30px, -50px) scale(1.1); }
                      66% { transform: translate(-20px, 20px) scale(0.9); }
                      100% { transform: translate(0px, 0px) scale(1); }
                  }
                  
                  @keyframes fade-in-up {
                      from {
                          opacity: 0;
                          transform: translateY(20px);
                      }
                      to {
                          opacity: 1;
                          transform: translateY(0);
                      }
                  }
                  
                  @keyframes fade-in {
                      from { opacity: 0; }
                      to { opacity: 1; }
                  }
                  
                  .animate-blob {
                      animation: blob 7s infinite;
                  }
                  
                  .animation-delay-2000 {
                      animation-delay: 2s;
                  }
                  
                  .animation-delay-4000 {
                      animation-delay: 4s;
                  }
                  
                  .animation-delay-200 {
                      animation-delay: 200ms;
                  }
                  
                  .animation-delay-400 {
                      animation-delay: 400ms;
                  }
                  
                  .animate-fade-in-up {
                      animation: fade-in-up 0.6s ease-out forwards;
                  }
                  
                  .animate-fade-in {
                      animation: fade-in 0.3s ease-out forwards;
                  }
                  
                  .custom-scrollbar::-webkit-scrollbar {
                      width: 6px;
                  }
                  
                  .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(0, 0, 0, 0.1);
                      border-radius: 10px;
                  }
                  
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                      border-radius: 10px;
                  }
                  
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: linear-gradient(to bottom, #2563eb, #7c3aed);
                  }
              `}</style>
            </>
        );
    }

    // SECTION 2: ADMIN VIEW (Dengan Panel) - Lanjutan dari sebelumnya
    return (
        <>
            <Head title="Admin Chat Panel" />
            <div className="h-screen bg-gray-100 flex">
                {/* Left Sidebar - Chat List (Admin Only) */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold">A</span>
                            </div>
                            <div>
                                <h2 className="font-semibold">Admin Panel</h2>
                                <p className="text-xs opacity-80">Kelola chat camaba</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari camaba..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Chat List - Hanya tampilkan camaba */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredChatSessions && filteredChatSessions.length > 0 ? (
                            filteredChatSessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => switchChat(session.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${session.id === sessionId ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-gray-600">
                                                {session.user?.name?.charAt(0) || 'C'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium text-gray-900 truncate">                                                    {session.user?.name || 'Camaba'}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {session.last_message_time ? formatTime(session.last_message_time) : ''}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {session.last_message ? formatLastMessage(session.last_message) : 'Belum ada pesan'}
                                            </p>

                                            {/* Status indicators */}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center space-x-2">
                                                    {/* Online status */}
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span className="text-xs text-gray-400">Online</span>
                                                    </div>
                                                </div>

                                                {/* Unread count */}
                                                {session.unread_count > 0 && (
                                                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {session.unread_count > 9 ? '9+' : session.unread_count}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                <p className="text-sm">Belum ada chat camaba</p>
                            </div>
                        )}
                    </div>

                    {/* Footer dengan statistik */}
                    <div className="border-t p-4 bg-gray-50">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Total Chat: {filteredChatSessions.length}</span>
                            <span>Aktif: {filteredChatSessions.filter(s => s.unread_count > 0).length}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Chat Area */}
                <div className="flex-1 flex flex-col">
                    {currentSession ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {currentSession.user?.name?.charAt(0) || 'C'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {currentSession.user?.name || 'Camaba'}
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span className="text-sm text-gray-500">Online</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {localMessages.length > 0 ? (
                                    localMessages.map((msg, index) => {
                                        const isMyMessage = msg.sender_type === 'admin';

                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-xs lg:max-w-md ${msg.is_optimistic ? 'opacity-70' : ''}`}>
                                                    <div
                                                        className={`px-4 py-3 rounded-2xl shadow-sm ${isMyMessage
                                                            ? 'bg-blue-600 text-white rounded-br-md'
                                                            : 'bg-white text-gray-800 rounded-bl-md border'
                                                            }`}
                                                    >
                                                        <p className="text-sm break-words">{msg.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className={`text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-500'
                                                                }`}>
                                                                {formatTime(msg.created_at)}
                                                            </span>

                                                            {isMyMessage && (
                                                                <div className="flex items-center space-x-1">
                                                                    <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                                    </svg>
                                                                    <svg className="w-3 h-3 text-blue-200 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Mulai percakapan dengan {currentSession.user?.name || 'Camaba'}
                                            </h3>
                                            <p className="text-gray-500">Kirim pesan pertama untuk memulai chat</p>
                                        </div>
                                    </div>
                                )}

                                {/* Typing indicator untuk admin */}
                                {isTyping && (
                                    <div className="flex justify-end">
                                        <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area untuk Admin */}
                            <div className="bg-white border-t border-gray-200 px-6 py-4">
                                <form onSubmit={handleSubmit} className="flex items-end space-x-4">
                                    {/* Quick replies */}
                                    <div className="flex-shrink-0">
                                        <button
                                            type="button"
                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                            title="Quick Replies"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Text input */}
                                    <div className="flex-1">
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ketik balasan untuk camaba..."
                                            disabled={isLoading}
                                            className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 disabled:opacity-50"
                                            rows="1"
                                        />
                                    </div>

                                    {/* Send button */}
                                    <button
                                        type="submit"
                                        disabled={!data.message.trim() || isLoading}
                                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${data.message.trim() && !isLoading
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            'Kirim'
                                        )}
                                    </button>
                                </form>

                                {/* Quick action buttons */}
                                <div className="flex items-center space-x-2 mt-3">
                                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                                        Info Pendaftaran
                                    </button>
                                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                                        Biaya Kuliah
                                    </button>
                                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                                        Program Studi
                                    </button>
                                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                                        Jadwal
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* No chat selected state */
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Selamat Datang di Admin Panel
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Pilih chat camaba dari sidebar kiri untuk mulai membalas pesan mereka.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <div className="text-left">
                                            <h4 className="font-medium text-blue-900 mb-1">Tips Admin:</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li>• Gunakan quick replies untuk respons cepat</li>
                                                <li>• Chat akan terupdate otomatis setiap 3 detik</li>
                                                <li>• Badge merah menunjukkan pesan belum dibaca</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}