import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminSection({
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
    sessionId,
    chatSessions,
    currentSession,
    formatLastMessage,
    switchChat
}) {
    return (
        <>
            <Head title="Admin Chat Dashboard" />

            <div className="min-h-screen bg-gray-100">
                <div className="flex h-screen">

                    {/* Sidebar - Daftar Chat Sessions */}
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                        {/* Header Sidebar */}
                        <div className="bg-blue-600 px-6 py-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Admin Chat</h2>
                                    <p className="text-blue-200 text-sm">Kelola Percakapan PMB</p>
                                </div>
                                <button
                                    onClick={handleBackToDashboard}
                                    className="p-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                                    title="Kembali ke Dashboard"
                                >
                                    ←
                                </button>
                            </div>
                        </div>

                        {/* Chat Sessions List */}
                        <div className="flex-1 overflow-y-auto">
                            {chatSessions && chatSessions.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <p className="text-sm">Belum ada percakapan</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {chatSessions && chatSessions.map((session) => (
                                        <div
                                            key={session.id}
                                            onClick={() => switchChat(session.id)}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${currentSession?.id === session.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {/* Avatar */}
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>

                                                {/* Chat Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {session.user?.name || 'User'}
                                                        </h3>
                                                        <span className="text-xs text-gray-500">
                                                            {session.last_message_at ? formatTime(session.last_message_at) : ''}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-gray-600 truncate mt-1">
                                                        {session.last_message ? formatLastMessage(session.last_message) : 'Belum ada pesan'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Sidebar */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="text-center text-sm text-gray-600">
                                Total: {chatSessions ? chatSessions.length : 0} percakapan
                            </div>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {currentSession ? (
                            <>
                                {/* Chat Header */}
                                <div className="bg-white border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {/* User Avatar */}
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {currentSession.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {currentSession.user?.name || 'User'}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${otherUserTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                                                    <span className="text-sm text-gray-600">
                                                        {otherUserTyping ? 'Sedang mengetik...' : 'Online'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50">
                                    {localMessages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                💬
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Mulai Percakapan
                                                </h3>
                                                <p className="text-gray-600">
                                                    Kirim pesan pertama untuk memulai percakapan dengan {currentSession.user?.name || 'user ini'}.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Messages List */}
                                            {localMessages.map((message, index) => (
                                                <div
                                                    key={message.id || index}
                                                    className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex ${message.sender_type === 'admin' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                                                        {/* Avatar */}
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-medium ${message.sender_type === 'admin'
                                                                ? 'bg-blue-500'
                                                                : 'bg-green-500'
                                                            }`}>
                                                            {message.sender_type === 'admin' ? 'A' : 'U'}
                                                        </div>

                                                        {/* Message Bubble */}
                                                        <div className={`relative px-4 py-3 rounded-2xl max-w-full ${message.sender_type === 'admin'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-white border border-gray-200 text-gray-800'
                                                            } ${message.is_optimistic ? 'opacity-70' : ''}`}>

                                                            {/* Message Content */}
                                                            <div className="break-words">
                                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                                            </div>

                                                            {/* Timestamp */}
                                                            <div className={`text-xs mt-1 ${message.sender_type === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                                                }`}>
                                                                {formatTime(message.created_at)}
                                                                {message.is_optimistic && <span className="ml-2">⏳</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Typing Indicator */}
                                            {otherUserTyping && (
                                                <div className="flex justify-start">
                                                    <div className="flex items-end space-x-2">
                                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                            U
                                                        </div>
                                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                                                            <div className="flex space-x-1">
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="bg-white border-t border-gray-200 px-6 py-4">
                                    <form onSubmit={handleSubmit} className="flex items-end space-x-4">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={data.message}
                                                onChange={handleInputChange}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Ketik balasan Anda..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="1"
                                                style={{ minHeight: '44px', maxHeight: '120px' }}
                                                disabled={isLoading}
                                            />

                                            {/* Typing Indicator */}
                                            {isTyping && (
                                                <div className="absolute bottom-2 right-4 flex items-center space-x-1 text-blue-500">
                                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || !data.message.trim()}
                                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {isLoading ? '⏳' : '📤'}
                                        </button>
                                    </form>

                                    {/* Status Indicator */}
                                    {otherUserTyping && (
                                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                            <span>{currentSession.user?.name || 'User'} sedang mengetik...</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* No Chat Selected */
                            <div className="flex-1 flex items-center justify-center bg-gray-50">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                                        💬
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Pilih Percakapan
                                        </h3>
                                        <p className="text-gray-600 max-w-md">
                                            Pilih salah satu percakapan dari sidebar untuk mulai membalas pesan dari calon mahasiswa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
