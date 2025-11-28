# Chatbot CS Universitas Template 🤖🎓

Template interaktif untuk membangun chatbot layanan customer service (CS) universitas dengan Rasa + React.js

## 🌟 Demo Live

[🔗 Coba Demo di Sini](https://your-demo-link.vercel.app) | [📱 Telegram Bot](https://t.me/your_bot)

![Chatbot Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=University+Chatbot+Demo)

## 🚀 Fitur Utama

- 💬 **Chat Interface Modern** - UI/UX yang responsive dan user-friendly
- 🎨 **Custom Branding** - Dapat disesuaikan dengan identitas universitas
- 📱 **Multi-Platform** - Web, Mobile, Telegram, WhatsApp
- 🧠 **AI Powered** - Natural Language Understanding dengan Rasa
- 🔄 **Real-time Updates** - Live chat dengan action server
- 📊 **Analytics Dashboard** - Monitor performa chatbot

## 🛠️ Tech Stack

**Frontend:**
- React.js 18 + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Axios untuk API calls

**Backend:**
- Rasa 3.x
- Python 3.8+
- FastAPI (optional)
- SQLite/PostgreSQL

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/RRachman/chatbot-cs-universitas-template.git
cd chatbot-cs-universitas-template
```

### 2. Setup Backend (Rasa)

```bash
# Masuk ke directory rasa
cd rasa-chatbot

# Install dependencies
pip install -r requirements.txt

# Train model
rasa train

# Jalankan action server
rasa run actions &

# Jalankan rasa server
rasa run --enable-api --cors "*"
```

### 3. Setup Frontend (React)

```bash
# Kembali ke root directory dan masuk ke frontend
cd ../frontend

# Install dependencies
npm install

# Jalankan development server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasil.

## 🎨 Customisasi

### Mengganti Logo dan Branding

Edit file `frontend/src/components/Branding.js`:

```jsx
// Ganti dengan logo universitas Anda
const UniversityBranding = () => (
  <div className="branding">
    <img 
      src="/path/to/your-university-logo.png" 
      alt="University Logo" 
      className="logo"
    />
    <h1>Nama Universitas Anda</h1>
    <p>Chatbot Layanan Mahasiswa</p>
  </div>
);
```

### Warna Custom

Edit `frontend/tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#YourColor', // Warna utama universitas
        }
      }
    }
  }
}
```

## 📁 Struktur Proyek Lengkap

```
chatbot-cs-universitas-template/
├── 📁 rasa-chatbot/                 # Backend Rasa
│   ├── data/
│   │   ├── nlu.yml
│   │   ├── stories.yml
│   │   └── rules.yml
│   ├── actions/
│   │   └── actions.py
│   ├── domain.yml
│   └── config.yml
├── 📁 frontend/                     # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── university-logo.png     # Logo universitas
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.js
│   │   │   ├── MessageBubble.js
│   │   │   └── UniversityHeader.js
│   │   ├── styles/
│   │   │   └── chatbot.css
│   │   └── App.js
│   └── package.json
├── 📁 docs/                         # Dokumentasi
├── 📁 screenshots/                  # Screenshot aplikasi
└── README.md
```

## 🎯 Komponen Interaktif

### Chat Interface React Component

```jsx
// frontend/src/components/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import UniversityHeader from './UniversityHeader';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = { type: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    
    // Send to Rasa backend
    try {
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'user', message: inputMessage })
      });
      
      const data = await response.json();
      data.forEach(msg => {
        setMessages(prev => [...prev, { type: 'bot', text: msg.text }]);
      });
    } catch (error) {
      console.error('Error:', error);
    }
    
    setInputMessage('');
  };

  return (
    <div className="chat-container">
      <UniversityHeader />
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Tanyakan tentang universitas..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">
          <span>Kirim</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
```

### Animasi dengan Framer Motion

```jsx
// frontend/src/components/AnimatedMessage.js
import { motion } from 'framer-motion';

const AnimatedMessage = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`message ${isUser ? 'user-message' : 'bot-message'}`}
    >
      {message}
    </motion.div>
  );
};
```

## 🎨 Styling dengan Tailwind CSS

```css
/* frontend/src/styles/chatbot.css */
.chat-container {
  @apply flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100;
}

.university-header {
  @apply bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg;
}

.messages-container {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

.user-message {
  @apply bg-blue-500 text-white p-3 rounded-2xl rounded-br-none max-w-xs ml-auto shadow-md;
}

.bot-message {
  @apply bg-white text-gray-800 p-3 rounded-2xl rounded-bl-none max-w-xs shadow-md;
}

.message-input {
  @apply flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.send-button {
  @apply bg-blue-500 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg;
}
```

## 📱 Integrasi Platform

### Telegram Bot

```python
# rasa-chatbot/credentials.yml
telegram:
  access_token: "YOUR_TELEGRAM_TOKEN"
  verify: "your_bot"
  webhook_url: "https://yourdomain.com/webhooks/telegram/webhook"
```

### WhatsApp via Twilio

```python
twilio:
  account_sid: "YOUR_ACCOUNT_SID"
  auth_token: "YOUR_AUTH_TOKEN"
  twilio_number: "YOUR_TWILIO_NUMBER"
```

## 🚀 Deployment

### Deploy Frontend (Vercel/Netlify)

```bash
# Build project
npm run build

# Deploy ke Vercel
npm install -g vercel
vercel --prod
```

### Deploy Rasa Backend

```bash
# Menggunakan Docker
docker build -t university-chatbot .
docker run -p 5005:5005 university-chatbot

# Atau deploy ke Heroku
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

## 📊 Analytics & Monitoring

```python
# actions/analytics_actions.py
class ActionLogConversation(Action):
    def name(self) -> Text:
        return "action_log_conversation"

    def run(self, dispatcher, tracker, domain):
        # Log conversation ke database
        conversation_data = {
            'user_id': tracker.sender_id,
            'message': tracker.latest_message.get('text'),
            'intent': tracker.latest_message.get('intent', {}).get('name'),
            'timestamp': datetime.now()
        }
        # Simpan ke database
        return []
```

## 🤝 Kontribusi

Kami welcome kontribusi! Silakan:

1. Fork repository
2. Buat feature branch: `git checkout -b feature/fitur-keren`
3. Commit changes: `git commit -am 'Tambahkan fitur keren'`
4. Push branch: `git push origin feature/fitur-keren`
5. Submit pull request

## 📞 Support

- 📧 Email: support@university-chatbot.dev
- 💬 Discord: [Join Community](https://discord.gg/your-link)
- 🐛 Issues: [GitHub Issues](https://github.com/RRachman/chatbot-cs-universitas-template/issues)

## 📄 License

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

---

<div align="center">

**Dibuat dengan ❤️ untuk Pendidikan Indonesia yang Lebih Baik**

![University Logo](https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=UNIV)

[🚀 Coba Sekarang] • [📚 Dokumentasi] • [🌟 Beri Bintang]

</div>
