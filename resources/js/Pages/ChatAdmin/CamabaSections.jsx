import React from 'react';
import { Head } from '@inertiajs/react';

export default function CamabaSection({
    localMessages,
    isLoading,
    isTyping,
    otherUserTyping,
    typingUsers,
    messagesEndRef,
    data,
    handleInputChange,
    handleSubmit,
    handleKeyPress,
    handleBackToDashboard,
    formatTime,
    auth,
    sessionId
}) {
    return (
        <>
            <Head title="Chat PMB - Tanyakan Apapun!" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-4xl h-screen max-h-[90vh] flex flex-col bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 overflow-hidden">

                        {/* Header dengan Back Button untuk Camaba */}
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Back Button untuk Camaba */}
                                    <button
                                        onClick={handleBackToDashboard}
                                        className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 group"
                                        title="Kembali ke Dashboard"
                                    >
                                        <svg className="w-5 h-5 text-white group-hover:text-white/90 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                        </svg>
                                    </button>

                                    <div className="relative">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
                                                </svg>
                                            </div>
                                        </div>
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
                                            <span className="text-sm text-white/80 font-medium">
                                                {otherUserTyping ? 'Sedang mengetik...' : 'Siap membantu Anda'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center space-x-2">
                                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 rounded-full ${otherUserTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                                            <span className="text-sm text-white font-medium">
                                                {otherUserTyping ? 'Mengetik...' : 'Online'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm">
                            {/* Welcome Message */}
                            {localMessages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Selamat Datang! 👋</h3>
                                        <p className="text-gray-600 max-w-md">
                                            Halo! Saya Admin PMB siap membantu menjawab pertanyaan seputar penerimaan mahasiswa baru.
                                            Silakan tanyakan apa saja yang ingin Anda ketahui!
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Messages List */}
                            {localMessages.map((message, index) => (
                                <div
                                    key={message.id || index}
                                    className={`flex ${message.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex ${message.sender_type === 'admin' ? 'flex-row' : 'flex-row-reverse'} items-end space-x-2`}>
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${message.sender_type === 'admin'
                                                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                                : 'bg-gradient-to-br from-green-500 to-teal-600'
                                            }`}>
                                            {message.sender_type === 'admin' ? (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`relative px-6 py-4 rounded-3xl shadow-lg max-w-full ${message.sender_type === 'admin'
                                                ? 'bg-white border border-gray-100 text-gray-800'
                                                : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                            } ${message.is_optimistic ? 'opacity-70' : ''}`}>

                                            {/* Message Content */}
                                            <div className="break-words">
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                            </div>

                                            {/* Timestamp */}
                                            <div className={`text-xs mt-2 ${message.sender_type === 'admin' ? 'text-gray-500' : 'text-white/80'
                                                }`}>
                                                {formatTime(message.created_at)}
                                                {message.is_optimistic && (
                                                    <span className="ml-2">⏳</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {otherUserTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-xs lg:max-w-md xl:max-w-lg flex flex-row items-end space-x-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
                                            </svg>
                                        </div>
                                        <div className="bg-white border border-gray-100 px-6 py-4 rounded-3xl shadow-lg">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 px-6 py-6">
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="flex items-end space-x-4">
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={data.message}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ketik pertanyaan Anda di sini... 💬"
                                            className="w-full px-6 py-4 pr-16 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-3xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-lg"
                                            rows="1"
                                            style={{ minHeight: '56px', maxHeight: '120px' }}
                                            disabled={isLoading}
                                        />

                                        {/* Typing Indicator */}
                                        {isTyping && (
                                            <div className="absolute bottom-2 right-16 flex items-center space-x-1 text-blue-500">
                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !data.message.trim()}
                                        className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                    >
                                        {isLoading ? '⏳' : '📤'}
                                    </button>
                                </div>

                                {/* Status Indicator */}
                                {otherUserTyping && (
                                    <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                        <span>Admin sedang mengetik balasan...</span>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}