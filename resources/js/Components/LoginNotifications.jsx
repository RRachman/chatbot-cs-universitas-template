import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function LoginNotification({ message = "Berhasil login!", duration = 3000 }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!show) return null;

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div className="relative flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md bg-white/10 border border-white/20 text-white">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={() => setShow(false)}
                    className="ml-2 text-white/70 hover:text-white transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
t
