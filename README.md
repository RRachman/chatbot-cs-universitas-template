# 🤖 Chatbot CS Universitas

<div align="center">

![Chatbot Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Rasa](https://img.shields.io/badge/Rasa-3.0-orange)

**Template siap pakai untuk chatbot layanan universitas**

[🚀 Demo](#) | [📥 Download](#) | [🎯 Quick Start](#-quick-start)

</div>

## 🎯 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/RRachman/chatbot-cs-universitas-template.git
cd chatbot-cs-universitas-template
```

### 2. Backend (Terminal 1)
```bash
cd rasa-chatbot
pip install -r requirements.txt
rasa train
rasa run actions &
rasa run --enable-api --cors "*"
```

### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

**Done!** Buka `http://localhost:3000` 🎉

## ✨ Fitur

- 💬 Chat interface modern
- 🎨 Custom logo & branding
- 📱 Responsive design
- 🧠 AI-powered responses
- 🎓 Info akademik & administrasi

## 🎨 Customisasi

1. **Ganti logo**: `frontend/public/university-logo.png`
2. **Edit warna**: `frontend/src/styles/colors.css`
3. **Tambah pertanyaan**: `rasa-chatbot/data/nlu.yml`

## 📞 Support

Buka [Issues](https://github.com/RRachman/chatbot-cs-universitas-template/issues) untuk bantuan.

---

<div align="center">

**Dibuat dengan ❤️ untuk pendidikan Indonesia**

</div>
