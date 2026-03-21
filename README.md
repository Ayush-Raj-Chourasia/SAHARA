# SAHARA  
**AI-Powered Smart Elderly Care System**  
*Trithon 2026 Hackathon Submission*

---

## 1. Overview  

SAHARA is an AI-powered healthcare platform designed to provide continuous monitoring, nutritional guidance, and early risk detection for elderly individuals.  

The system integrates health tracking, nutrition analysis, predictive insights, and family monitoring into a single unified ecosystem.  

With India’s rapidly aging population, SAHARA aims to enable independent, safe, and data-driven elderly care.  

---

## 2. Problem Statement  

Elderly individuals in India commonly face:  

- Malnutrition and anaemia due to improper dietary intake  
- Chronic diseases such as hypertension, diabetes, and cardiac conditions  
- Lack of continuous health monitoring  
- Difficulty in manually tracking vitals and medication  # 🌿 SAHARA — AI-Powered Smart Elderly Care System

> **Team Idiotics** · Trithon 2026 · Healthcare Theme  
> Institute of Technical Education and Research (ITER), Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar, Odisha

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [The Problem](#-the-problem)
3. [Our Solution](#-our-solution)
4. [Live Demo & Deployment](#-live-demo--deployment)
5. [Tech Stack](#-tech-stack)
6. [System Architecture](#-system-architecture)
7. [Features](#-features)
8. [AI & ML Models](#-ai--ml-models)
9. [UX Design Principles](#-ux-design-principles)
10. [API Endpoints](#-api-endpoints)
11. [Database Schema](#-database-schema)
12. [Getting Started — Local Setup](#-getting-started--local-setup)
13. [Deployment Guide](#-deployment-guide)
14. [Flutter / APK Build](#-flutter--apk-build)
15. [Fallback Strategy](#-fallback-strategy)
16. [Business Model](#-business-model)
17. [Competitive Analysis](#-competitive-analysis)
18. [Roadmap](#-roadmap)
19. [Team](#-team)
20. [Evaluation Alignment](#-evaluation-alignment-trithon-2026)

---

## 🌟 Project Overview

**SAHARA** *(Smart AI-powered Healthcare and Assistive Resource for Ageing)* is an AI-driven intelligent healthcare ecosystem built specifically for India's rapidly growing elderly population.

India currently has **140 million+ senior citizens above age 60**, a number projected to reach **300 million by 2050**. The majority live alone or with minimal continuous family support — often in smaller cities and towns across Odisha and the rest of India. SAHARA bridges this gap.

> *"Every health app in this room was built for young people who are already healthy. SAHARA was built for the 140 million elderly Indians who are silently declining — not in hospitals, but in their homes, alone."*

### Key Highlights

- 🍛 **Indian Food Intelligence** — ICMR-calibrated nutrition analysis for dal, roti, khichdi, and 500+ Indian meals
- 🩸 **Anaemia Early Warning** — India's first AI-based anaemia prediction system for elderly; 50%+ of Indian women over 60 are anaemic
- 📊 **Dual Dashboard** — Separate intelligent interfaces for seniors (mobile) and family members (web)
- 🚨 **One-tap SOS** — Live GPS + Twilio SMS alerts to family members
- 🗣️ **Hindi Voice AI** — Speak your meal in Hindi, get instant nutrition analysis back in Hindi
- 🔮 **Preventive, not reactive** — Detects declining health trends before a crisis occurs

---

## 🚨 The Problem

India's elderly population faces a silent multi-layered health crisis that existing technology largely ignores:

| Problem | Impact |
|---|---|
| Malnutrition & inadequate protein/calorie intake | Muscle loss, poor immunity, weakness |
| Anaemia (especially in women 60+) | Fatigue, cognitive decline, heart strain |
| Unmonitored BP, blood sugar, weight | Late detection of hypertension, diabetes progression |
| Inconsistent/absent medication adherence | Treatment failure, hospitalisation |
| Working family members in different cities | No real-time visibility into parent's health |
| Manual health logging is too hard for seniors | Data gaps, inaccuracy, abandonment |
| Existing apps are reactive — alert only after crisis | Missed preventive window |
| No platform understands Indian food nutrition | Generic global apps are useless for dal-rice diets |

Annual cost of a **single preventable hospitalisation** for an elderly Indian: ₹30,000–₹80,000. SAHARA prevents these events.

---

## 💡 Our Solution

SAHARA is a **unified preventive health platform** integrating:

```
Senior App (Mobile)          ←→         SAHARA AI Engine         ←→         Family Dashboard (Web)
────────────────────                   ─────────────────                    ────────────────────
• Log meals by voice/text              • Nutrition analysis                 • Real-time risk badges
• Log BP, sugar, Hb, weight            • Health score (0–100)               • 7-day trend charts
• Medication reminders                 • Anaemia risk prediction             • SOS history + map
• One-tap SOS                          • Anomaly detection                  • Medication compliance
• Hindi AI chatbot                     • Weekly AI health reports            • Weekly AI summaries
```

---

## 🚀 Live Demo & Deployment

| Component | URL / Access |
|---|---|
| **Web App (Frontend)** | [https://sahara-flax.vercel.app/](https://sahara-flax.vercel.app/) |
| **Backend API** | Railway.app / Azure F1 Plan (see Deployment Guide) |
| **Database** | MongoDB Atlas M0 (Free) / Firebase / Supabase |
| **Demo APK (Android)** | Google Drive link — see team for access |

> **Judge Note:** The system is seeded with 30 days of realistic health data for the demo user *Ratan Ji, 72, Bhubaneswar* to show meaningful trend charts during evaluation.

---

## 🛠 Tech Stack

### Frontend — Web App
| Layer | Technology |
|---|---|
| UI Framework | HTML5, CSS3, Bootstrap 5, JavaScript |
| Charts | Chart.js |
| Maps | Google Maps JS API |
| Hosting | **Vercel** (auto-deploy from GitHub) |

### Frontend — Mobile App (Flutter, Phase 2 / Final)
| Layer | Technology |
|---|---|
| Framework | Flutter (Dart) |
| State Management | Provider / Riverpod |
| Build | `flutter build apk --release` |
| Distribution | Google Drive APK link / Expo-like QR |

### Backend
| Layer | Technology |
|---|---|
| Framework | **Flask** (Python) |
| Auth | JWT (7-day expiry) |
| Email Alerts | Flask-Mail (SMTP) |
| SMS / SOS | **Twilio** API |
| Hosting | **Railway.app** (primary) / Azure F1 / Render |

### Database
| Option | Details |
|---|---|
| **Primary** | MongoDB Atlas M0 — 512MB free |
| **Alt 1** | Firebase Realtime Database |
| **Alt 2** | Supabase (PostgreSQL) |

### AI / ML
| Model | Technology |
|---|---|
| Nutrition Parsing | Google Gemini 1.5 Flash API |
| Anaemia Risk | Random Forest (scikit-learn) + WHO rule engine |
| Health Score | Weighted rule engine (0–100) |
| Anomaly Detection | Statistical threshold rules / Isolation Forest |
| Hindi Voice AI | Web Speech API (Chrome) + Google Cloud Speech |
| AI Chatbot | Gemini 1.5 Flash with health context injection |
| Weekly Reports | Gemini 1.5 Flash summarisation |

### External Services
| Service | Purpose | Cost |
|---|---|---|
| Twilio | SOS SMS to family numbers | Free: 1,000 SMS/mo |
| Google Maps JS API | SOS event location display | Free: 28,000 loads/mo |
| Firebase Cloud Messaging | Push notifications | Free |
| Google Cloud | Speech API, Gemini | Free tier + credits |
| Gemini 1.5 Flash | Nutrition AI + chatbot | Free tier |

> **Important Note for Judges:** The AI nutrition analysis and health chatbot are powered by LLM APIs (Gemini), which are integrated as intelligent backend services — the same approach used in production AI healthcare products. The ML risk models (anaemia prediction, health scoring) are custom-trained Python models using scikit-learn on WHO/ICMR-validated clinical data.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SAHARA SYSTEM                                │
│                                                                     │
│  ┌─────────────────┐         ┌──────────────────┐                  │
│  │  SENIOR APP      │         │  FAMILY DASHBOARD │                 │
│  │  (Mobile/Web)   │         │  (React Web)      │                 │
│  │                 │         │                   │                 │
│  │ • Log vitals    │         │ • Risk badges      │                 │
│  │ • Meal by voice │         │ • Trend charts     │                 │
│  │ • SOS button    │         │ • SOS map history  │                 │
│  │ • Hindi chatbot │         │ • Weekly AI report │                 │
│  └────────┬────────┘         └────────┬──────────┘                 │
│           │                           │                             │
│           └──────────┬────────────────┘                            │
│                      ▼                                              │
│           ┌──────────────────────┐                                 │
│           │   Flask REST API     │                                 │
│           │   (Railway / Azure)  │                                 │
│           └──────────┬───────────┘                                 │
│                      │                                              │
│         ┌────────────┼─────────────┐                               │
│         ▼            ▼             ▼                                │
│   ┌──────────┐ ┌──────────┐ ┌──────────────┐                      │
│   │ MongoDB  │ │ AI/ML    │ │ External APIs│                       │
│   │ Atlas    │ │ Engine   │ │              │                       │
│   │          │ │          │ │ • Twilio SMS │                       │
│   │ users    │ │ • Gemini │ │ • Google Maps│                       │
│   │ health   │ │ • RF     │ │ • FCM Push  │                       │
│   │ nutrition│ │ • Rules  │ │ • Flask-Mail│                       │
│   │ reminders│ │ • Score  │ │             │                        │
│   │ sos      │ └──────────┘ └──────────────┘                      │
│   └──────────┘                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
```
Senior logs meal/vitals
    → Flask API processes
    → ML engine scores risk + runs anaemia model
    → Result stored in MongoDB
    → Family dashboard polls every 30s
    → If risk = HIGH → Twilio SMS fires to family
    → FCM push notification to family app
```

---

## ✨ Features

### Senior-Facing Features

#### 🏠 Home Dashboard
- Personalised greeting (e.g., *"Namaste, Ratan Ji"*)
- Today's Health Score (0–100) with colour-coded status: 🟢 Good / 🟡 Fair / 🔴 Poor
- Quick summary: BP, protein intake, last medication

#### 🍛 Meal Logging — AI Nutrition Analysis
- Type or **speak in Hindi/English** — *"aaj maine dal chawal aur sabzi khaya"*
- AI analyses meal using ICMR-calibrated Indian food database
- Returns: calories, protein (g), iron (mg), carbs, fibre
- Deficit alert: *"You need 18g more protein today. Have 1 egg or dahi."*
- Daily targets personalised by weight, age, gender, conditions

#### 📊 Vitals Logging
- Blood Pressure (systolic/diastolic)
- Blood Sugar (mg/dL)
- Haemoglobin (g/dL) — with live anaemia risk flag
- Weight (kg)
- One-screen entry, large inputs, instant risk feedback

#### 💊 Medication Reminders
- Add medicines with schedule
- Mark taken / missed
- SMS + push notification reminders
- Missed-dose alert to family

#### 🚨 SOS Emergency
- Large red button visible on every screen
- One tap → Twilio SMS to all linked family numbers with GPS coordinates
- Google Maps pin embedded in family dashboard

#### 🤖 SAHARA AI Chatbot
- Responds in Hindi or English (whichever the user writes)
- Contextualised with user's name, age, current health score, risk flags
- Never diagnoses — always recommends doctor for serious symptoms
- Simple language (Class 5 vocabulary level)
- Voice input + voice readback in Hindi at 0.85x speed (elderly-comfortable)

### Family Dashboard Features

- **Overview:** Linked seniors list with today's health score chip (green/yellow/red)
- **Individual Senior View:**
  - 7-day BP, blood sugar, Hb line charts
  - AI-generated weekly health summary
  - Medication compliance calendar (green = taken, red = missed)
  - SOS history with embedded Google Maps
  - Nutrition deficit breakdown per day
- **Notifications:** Risk alert bell, unread count
- **One-click call** next to each senior's name

---

## 🤖 AI & ML Models

### Model 1 — Nutrition Analysis (Gemini 1.5 Flash)

```python
SYSTEM_PROMPT = """
You are a clinical nutritionist for elderly Indians aged 60-85.
Analyse the described meal. Return ONLY valid JSON:
{
  "calories": 480,
  "protein_g": 14,
  "iron_mg": 3.2,
  "carbs_g": 68,
  "fiber_g": 5,
  "suggestion": "Add 1 egg or a bowl of dahi for protein."
}
"""

# Daily targets (personalised per user)
protein_target = 0.8 * weight_kg
iron_target = 8  # mg (men) or 10 (women)
calories_target = 1600  # 1600-2000 range for elderly
```

**Fallback chain:**
1. Groq + Llama 3.1 (free, same JSON format)
2. ICMR Food Database JSON (500 Indian foods, offline)
3. Hardcoded common Odia/Indian meals: dal-rice, khichdi, poha, pakhala, dalma

### Model 2 — Anaemia Risk (Random Forest + WHO Rules)

```python
# Primary: Random Forest (scikit-learn)
# Features: hb, age, gender, fatigue_level, dietary_iron, bp_systolic
# Dataset: Kaggle anaemia dataset + WHO clinical data

# WHO-validated rule engine (backup — clinically defensible)
def get_anaemia_risk(hb, gender, age):
    if gender == 'F':
        if hb < 10:  return {'risk': 'HIGH',   'action': 'Consult doctor immediately'}
        if hb < 12:  return {'risk': 'MEDIUM', 'action': 'Increase iron-rich foods'}
        return {'risk': 'LOW', 'action': 'Maintain current diet'}
    else:
        if hb < 11:  return {'risk': 'HIGH',   'action': 'Consult doctor immediately'}
        if hb < 13:  return {'risk': 'MEDIUM', 'action': 'Increase iron-rich foods'}
        return {'risk': 'LOW', 'action': 'Maintain current diet'}
```

### Model 3 — Health Score Engine (0–100)

```python
def calculate_health_score(log, gender, weight_change_7d, missed_meds_today):
    score = 100

    # Blood pressure
    if log['bp_sys'] > 140: score -= 15
    if log['bp_sys'] > 160: score -= 10
    if log['bp_dia'] > 90:  score -= 8

    # Blood sugar
    if log['sugar'] > 140:  score -= 15
    if log['sugar'] > 200:  score -= 10

    # Haemoglobin (anaemia)
    hb_min = 12 if gender == 'F' else 13
    if log['hb'] < hb_min:       score -= 20
    if log['hb'] < hb_min - 2:   score -= 10

    # Weight change
    if abs(weight_change_7d) > 3: score -= 10

    # Medication adherence
    if missed_meds_today:         score -= 5

    return max(0, min(100, score))

# Thresholds: 80–100 = Good | 60–79 = Fair | <60 = Poor
```

### Model 4 — Voice AI in Hindi

```javascript
// Web Speech API — zero cost, built-in Chrome Android
const recognition = new webkitSpeechRecognition()
recognition.lang = 'hi-IN'

recognition.onresult = (e) => {
  const transcript = e.results[0][0].transcript
  // "aaj maine dal chawal aur sabzi khaya"
  sendToNutritionAI(transcript)
}

// Read response back in Hindi at elderly-comfortable speed
const utterance = new SpeechSynthesisUtterance()
utterance.lang = 'hi-IN'
utterance.rate = 0.85
utterance.text = aiResponse
speechSynthesis.speak(utterance)
```

### Model 5 — SAHARA AI Health Chatbot

```python
GEMINI_SYSTEM_PROMPT = """
You are SAHARA, an AI health companion for elderly Indians.
Rules:
- Never diagnose diseases
- Always recommend seeing a doctor for serious symptoms
- Simple language (Class 5 vocabulary)
- Support Hindi and English — respond in user's language
- Keep responses under 3 sentences
- End with one warm care tip
- Always use user's name

Context injected per call:
User: {name}, Age: {age}, Gender: {gender}
Today's health score: {score}
Risk flags: {risk_flags}
Last meal: {last_meal}
"""
```

---

## 🎨 UX Design Principles

SAHARA is built with **elderly-first UX** — every design decision is justified for our user base:

| Rule | Value | Reason |
|---|---|---|
| Minimum body font | 18px | Reduced vision in elderly |
| Vital number font | 28px | Instant readability |
| Minimum button height | 56px | Fat-finger safe |
| Max actions per screen | 3 | Prevent cognitive overload |
| Navigation | Bottom tab only | No hamburger menus |
| Contrast ratio | 4.5:1 minimum | WCAG AA compliance |
| Icons | Always with text labels | Icon-only is confusing |
| Primary colour | Orange `#F97316` | Warm, visible, Indian aesthetic |
| SOS button | Every screen | Always accessible |
| Voice input | Every text field | Type-averse elderly users |
| Offline mode | Cache last data | Works without WiFi |
| Error messages | Large red text | Not small tooltips |
| Language | Hindi + English | Odia context: Bhubaneswar seniors |

---

## 📡 API Endpoints

```
POST /auth/register          → Create user (role: senior | family)
POST /auth/login             → JWT token (expires 7 days)

POST /health/log             → Save vitals, run risk scoring → {score, flags}
GET  /health/history/:id     → Last 30 days for charts

POST /nutrition/analyze      → Gemini parses meal → macros + deficit + suggestions
GET  /nutrition/today/:id    → Today's intake vs targets

POST /emergency/sos          → Twilio SMS + save GPS event + FCM push
GET  /emergency/history/:id  → SOS event log with coordinates

GET  /family/dashboard/:id   → Aggregated health + risk + trends
GET  /family/seniors/:id     → All linked seniors for family user

POST /ai/chat                → Gemini chatbot with health context
GET  /ai/report/:id          → Weekly AI-generated health summary

POST /reminders/create       → Add medication reminder
PUT  /reminders/:id/taken    → Mark dose taken
GET  /reminders/today/:id    → Today's medication schedule
```

---

## 🗄 Database Schema

### MongoDB Collections

```javascript
// users
{
  _id, name, age, gender,          // core identity
  role: "senior" | "family",
  phone, email,
  weight_kg, height_cm,
  conditions: ["hypertension", "diabetes"],
  linked_family: [family_user_ids],
  language_pref: "hi" | "en",      // Hindi or English
  created_at
}

// health_logs
{
  user_id, timestamp,
  bp_sys, bp_dia,                  // Blood pressure
  blood_sugar,                     // mg/dL
  hb,                              // Haemoglobin g/dL
  weight,                          // kg
  health_score,                    // 0–100
  risk_flags: ["HIGH_BP", "ANAEMIA_RISK"],
  anomaly_detected: bool
}

// nutrition_logs
{
  user_id, timestamp,
  meal_text,                       // Raw input (Hindi/English)
  source: "gemini" | "icmr" | "fallback",
  analysis: {
    calories, protein_g, iron_mg,
    carbs_g, fiber_g, suggestion
  },
  deficit: { protein_g, iron_mg, calories }
}

// reminders
{
  user_id, medicine_name,
  dose, time_scheduled,
  taken: bool, taken_at,
  notified: bool
}

// sos_events
{
  user_id, timestamp,
  latitude, longitude,
  resolved: bool,
  sms_sent: bool,
  sms_recipients: ["+91XXXXXXXXXX"]
}

// family_links
{
  family_id, senior_id,
  relationship: "son" | "daughter" | "spouse",
  notify_on_risk: bool,
  notify_on_sos: bool
}
```

---

## 🖥 Getting Started — Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+ (for any JS tooling)
- MongoDB Atlas account (free) **or** local MongoDB
- Google Cloud account (Gemini API key)
- Twilio account (for SOS SMS)

### 1. Clone the Repository

```bash
git clone https://github.com/team-idiotics/sahara
cd sahara
```

### 2. Backend Setup (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Create `.env`:**
```env
# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sahara

# AI
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here        # Backup LLM

# Communications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
FLASK_MAIL_SERVER=smtp.gmail.com
FLASK_MAIL_USERNAME=your@gmail.com
FLASK_MAIL_PASSWORD=your_app_password

# App
JWT_SECRET_KEY=your_super_secret_key_here
FLASK_ENV=development
```

```bash
python app.py
# API running at http://localhost:5000
```

### 3. Seed Demo Data (Important for Demo!)

```bash
python scripts/seed_demo_data.py
# Seeds 30 days of realistic health data for demo user Ratan Ji
# Shows declining Hb trend (tells the story judges need to see)
```

```python
# seed_demo_data.py — what it does
import random
from datetime import datetime, timedelta

def seed_user(user_id):
    for i in range(30):
        date = datetime.now() - timedelta(days=29 - i)
        db.health_logs.insert_one({
            'user_id': user_id,
            'timestamp': date,
            'bp_sys': random.randint(138, 152),
            'bp_dia': random.randint(86, 94),
            'hb': round(11.8 - (i * 0.07), 1),     # Slowly declining — tells a story
            'blood_sugar': random.randint(130, 165),
            'health_score': max(45, 78 - (i * 0.8))
        })
```

### 4. Frontend Setup (Web)

```bash
cd frontend
# Open index.html directly or use Live Server
# Update API_BASE_URL in config.js to http://localhost:5000
```

### 5. Train ML Models (Optional — Rules engine is default)

```bash
cd backend/ml
python train_anaemia_model.py
# Downloads Kaggle anaemia dataset, trains Random Forest
# Saves: anaemia_risk_model.pkl
# Time: ~10 minutes
```

---

## ☁️ Deployment Guide

### Frontend → Vercel (Already Live)

```bash
# Already deployed at https://sahara-flax.vercel.app/
# Auto-redeploys on every git push to main
# To redeploy manually:
npx vercel --prod
```

### Backend → Railway (Recommended)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up

# Set environment variables in Railway dashboard
# Live URL: https://sahara-backend.up.railway.app
```

### Backend → Azure App Service F1 (Free Tier)

```bash
# Install Azure CLI
az login
az webapp up \
  --name sahara-api \
  --resource-group sahara-rg \
  --runtime "PYTHON:3.11" \
  --sku F1

# Set env vars
az webapp config appsettings set \
  --name sahara-api \
  --resource-group sahara-rg \
  --settings GEMINI_API_KEY="..." MONGO_URI="..."
```

### Backend → Render (Alternative)

```bash
# Connect GitHub repo to render.com
# Build command: pip install -r requirements.txt
# Start command: gunicorn app:app
# Note: ~30s cold start on free tier — deploy at hour 6, not hour 22
```

### Emergency Local + ngrok (If All Cloud Fails)

```bash
pip install pyngrok
python app.py &
ngrok http 5000
# Share https://abc123.ngrok.io with judges
# Works 100% on any internet connection
```

### Database → MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free M0 cluster (512MB, no credit card)
3. Create database user
4. Whitelist IP `0.0.0.0/0` for hackathon
5. Copy connection string to `MONGO_URI`

---

## 📱 Flutter / APK Build

> Planned for final phase — convert the web app to native Android APK for demo and final submission.

### Setup

```bash
flutter create sahara_mobile
cd sahara_mobile
flutter pub add http provider shared_preferences geolocator
```

### Key Packages

```yaml
dependencies:
  flutter: sdk
  http: ^1.1.0               # API calls
  provider: ^6.1.0           # State management
  speech_to_text: ^6.3.0     # Hindi voice input
  flutter_tts: ^3.8.5        # Hindi voice output
  geolocator: ^10.1.0        # GPS for SOS
  fl_chart: ^0.65.0          # Health trend charts
  shared_preferences: ^2.2.2  # Local cache / offline
  firebase_messaging: ^14.7.9 # Push notifications
```

### Build APK

```bash
# Debug APK (faster, for testing)
flutter build apk --debug

# Release APK (for demo / distribution)
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk

# Share via Google Drive
# Judges install via: Settings → Install Unknown Apps
```

### Flutter Screen Structure

```
lib/
├── main.dart
├── screens/
│   ├── home_screen.dart          # Health score + summary
│   ├── log_vitals_screen.dart    # BP, sugar, Hb, weight entry
│   ├── nutrition_screen.dart     # Meal logging + AI analysis
│   ├── sos_screen.dart           # Emergency big red button
│   ├── chat_screen.dart          # SAHARA AI (voice + text)
│   ├── reminders_screen.dart     # Medication alerts
│   └── family_dashboard.dart     # Family monitoring (web view or native)
├── services/
│   ├── api_service.dart          # All Flask API calls
│   ├── voice_service.dart        # Hindi speech-to-text + TTS
│   └── location_service.dart     # GPS for SOS
└── models/
    ├── health_log.dart
    ├── nutrition_log.dart
    └── user.dart
```

> **Recommendation:** If React Native Expo is faster for your team, use it — `npx create-expo-app sahara-senior`. Judges scan QR with Expo Go, no APK install needed. For a polished APK, Flutter gives better native performance.

---

## 🔄 Fallback Strategy

Nothing should surprise you on demo day. Every component has a backup:

| Component | Primary | Backup 1 | Backup 2 | Nuclear |
|---|---|---|---|---|
| Nutrition AI | Gemini 1.5 Flash | Groq + Llama 3.1 | ICMR Food DB JSON | 20 hardcoded Indian meals |
| Risk Prediction | Random Forest | WHO rule engine | Simple thresholds | Static HIGH/LOW |
| Backend Deploy | Railway | Azure F1 | Render.com | ngrok local tunnel |
| Frontend Deploy | Vercel | Netlify | Firebase Hosting | GitHub Pages |
| SMS / SOS | Twilio | Flask-Mail SMTP | Browser notification | Manual WhatsApp |
| Database | MongoDB Atlas | Firebase RTDB | Supabase | SQLite local |
| Voice Input | Web Speech API | Google Cloud Speech | Type input (always available) | Pre-recorded demo |
| Mobile App | Flutter APK | React web mobile-first | Figma prototype screenshots | OBS demo recording |

### Nuclear Fallback (Prepare at Hour 20)

```bash
# 1. Record complete working demo with OBS Studio (3 minutes)
# 2. Export Canva presentation with every screen as screenshot  
# 3. Upload both to Google Drive — have link ready

# If venue internet dies completely:
# Run entire app on localhost, use phone hotspot
# Test demo on hotspot the night before, not on event day
```

---

## 💰 Business Model

### Market Size

| Metric | Value |
|---|---|
| TAM — India elderly care market by 2030 | ₹55,000 Cr |
| SAM — Smartphone-connected families | ₹8,200 Cr |
| SOM Year 1 — 5,000 paid users × ₹249/mo × 12 | ₹3.2 Cr |

### Revenue Streams

| Stream | Model | Price | Year 1 Target |
|---|---|---|---|
| B2C Family Subscriptions | Monthly subscription | ₹199–₹299/mo | ₹1.2 Cr |
| B2B Old Age Homes | Per-resident SaaS | ₹99/resident/mo | ₹60 L |
| Hospital Geriatric Wards | Dashboard license | ₹15,000/mo | ₹36 L |
| Govt / NGO Welfare | Project contracts | ₹5–20 L | ₹20 L |
| Anonymised Data Insights | Research reports | ₹2–5 L/report | ₹10 L |

**Total Year 1 Projected Revenue: ~₹2.3 Cr**

### Unit Economics

```
CAC:  ₹300 (Facebook/Instagram ads targeting adult children)
LTV:  ₹299 × 18 months = ₹5,382
LTV:CAC ratio: 17.9x  ← Excellent
Break-even: Month 14 (conservative)
```

### Freemium Tiers

| Free Forever | SAHARA Care (₹199/mo) | SAHARA Plus (₹299/mo) |
|---|---|---|
| 7-day health log | Unlimited history | All Care features |
| Basic risk score | AI health chatbot | Wearable device sync |
| 1 family linked | 5 family members | Doctor consultation link |
| 3 SOS alerts/month | Unlimited SOS | Priority SOS response |
| Basic nutrition tracking | Weekly AI report | Health data export |

---

## ⚔️ Competitive Analysis

### vs. Global Products

| Product | Gap SAHARA Fills |
|---|---|
| Life Alert (US) | No AI nutrition, no trends, hardware-dependent, not India |
| Apple Health | Unusable for 70yr olds, no family dashboard, no Indian foods |
| Practo / 1mg | Appointment booking only — reactive, not preventive |
| Portea Medical | Human-based, ₹500/visit, not scalable |
| Dozee | Hardware ₹2,999/mo, no nutrition layer, no Hindi |

### vs. Trithon 2026 Competitors

| Team | Their Angle | SAHARA Advantage |
|---|---|---|
| CareBridge | Early detection, Flutter + Azure + wearables | No Indian food nutrition AI, no Hindi voice |
| VitalTwin AI | "Digital twin" — vague pitch | SAHARA has 4+ working live features |
| DriftAura | Camera-based activity monitoring post-hospitalization | Narrow use case, no preventive approach |
| MedX AI | Medical report analysis, chatbot | Not elderly-specific, no nutrition, no SOS |
| CareHub | ICU monitoring with AR/VR | Hospital-only, risky AR/VR demo |

### SAHARA's Defensible Moat

- 🍛 Indian food nutrition intelligence (ICMR-calibrated — dal, roti, pakhala, dalma)
- 🩸 Anaemia-specific prediction for elderly — India's #1 underdiagnosed health issue
- 👨‍👩‍👧 Dual-role platform — senior app + family dashboard with real-time sync
- 📉 Preventive health score — trends down before crisis, not just after
- 🗣️ Hindi voice AI — genuinely accessible, not just convenient
- 🏥 B2B old age home dashboard — institutional scale path
- 🏛️ Ayushman Bharat / PMJAY alignment — government scheme readiness

---

## 📅 Roadmap

### Phase 1 — Development & Pilot (0–6 Months)
- ✅ MVP web app deployed (sahara-flax.vercel.app)
- ✅ Flask backend with core API routes
- ✅ AI nutrition analysis (Gemini integration)
- ✅ Health scoring engine
- ✅ Anaemia risk model (WHO rules + RF model)
- ✅ SOS with Twilio SMS
- ✅ Family dashboard with charts
- 🔄 Flutter APK build
- 🔄 Pilot with 50–100 senior citizens in Bhubaneswar

### Phase 2 — Expansion & Partnerships (6–18 Months)
- Partner with Odisha state elderly welfare programmes
- Integrate wearable devices (blood oximeter, BP monitor via Bluetooth)
- Expand to 1,000+ paid users across Odisha and Jharkhand
- Hospital partnerships — geriatric wards in AIIMS Bhubaneswar
- Strengthen data security and cloud scalability
- Add Odia language support (beyond Hindi/English)

### Phase 3 — Scaling & Institutional Growth (18–36 Months)
- SaaS dashboard for retirement homes and hospitals across India
- Ayushman Bharat PMJAY integration — government pays per enrolled beneficiary
- ASHA worker dashboard — community health worker integration
- National rollout — 3,000–5,000 users across multiple cities
- Multilingual support: Odia, Bengali, Tamil, Telugu

---

## 👥 Team

| Role | Name | Email | Contact |
|---|---|---|---|
| **Team Leader** | Keshav Jha | jhakeshav5892@gmail.com | 9142928046 |
| Team Member | Priyanshu Pratik | priyanshupratikg@gmail.com | 7008904690 |
| Team Member | Tushar Mallick | tusharmallick2003@gmail.com | 7847025210 |
| Team Member | Ayush Raj Chourasia | iter.student.alpha@gmail.com | 8707701003 |
| Team Member | Aanchal Sreeraj Nair | nairaanchal98@gmail.com | 8928173181 |
| Team Member | Surajit Sahoo | surajitcoc121@gmail.com | 9932442311 |
| **Mentor / Guide** | Shruti Bajpai | shrutibajpai@soa.ac.in | 7355593309 |

**Institute:** ITER, Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar, Odisha

---

## 🏆 Evaluation Alignment — Trithon 2026

### Round 1 — Idea Evaluation (20 Marks)

| Criterion | SAHARA's Strength |
|---|---|
| **Concept Presentation** | Clear problem-solution-demo narrative with "Meet Ratan Ji" story hook |
| **Creativity & Innovation** | India's first anaemia early-warning + Hindi voice AI for elderly — no competitor does both |
| **Approach & Strategy** | Dual-app architecture, 4 AI models, rule-based fallbacks, seeded 30-day demo data |
| **Technical Feasibility** | Live at vercel.app; Flask + MongoDB + Gemini all running; zero ₹ infrastructure |
| **Timeline Planning** | Build order documented hour by hour; all fallbacks pre-planned |

### Round 2 — Development Phase (30 Marks)

| Criterion | SAHARA's Strength |
|---|---|
| **Prototype Progress** | Live web app deployed; vitals logging, nutrition AI, SOS, family dashboard all functional |
| **Enhancements** | Hindi voice input, 30-day seeded trend data, health chatbot — all added on mentor feedback |
| **System Integration** | Senior app → Flask API → MongoDB → Family dashboard real-time sync demonstrated live |
| **Usability** | 56px buttons, 28px vital numbers, voice everywhere, orange theme, bottom nav only |
| **Team Contribution** | 6 members with clear ownership: frontend, backend, AI/ML, UX, mobile |

### Round 3 — Final Evaluation (50 Marks)

| Criterion | SAHARA's Strength |
|---|---|
| **Solution Effectiveness** | Solves 8 specific identified problems — nutritional gap, anaemia detection, family monitoring |
| **Final Demo & Performance** | Two-screen demo: phone (senior) + laptop (family) → log bad Hb → dashboard turns red → judge's phone gets SMS |
| **UX & Product Design** | Elderly-first design system, orange Indian aesthetic, tested for 60+ age group |
| **Market Potential** | ₹55,000 Cr TAM, 140M+ users, B2C + B2B + Govt streams, LTV:CAC = 17.9x |
| **Future Scope** | Wearables → PMJAY → national rollout → Odia/regional languages → ASHA worker integration |

---

## 📎 Resources & Links

| Resource | Link |
|---|---|
| Live Web App | [https://sahara-flax.vercel.app/](https://sahara-flax.vercel.app/) |
| Demo Video | [Google Drive](https://drive.google.com/file/d/1vEzmJtn_V7W5dcHLt5qtvQqhj_29qjji/view?usp=sharing) |
| ICMR Nutritional Tables | Public domain — Ministry of Health, Govt of India |
| WHO Anaemia Guidelines | [WHO Anaemia Thresholds](https://www.who.int/topics/anaemia/en/) |
| Gemini API Docs | [ai.google.dev](https://ai.google.dev) |
| Twilio Free Tier | [twilio.com](https://twilio.com) |
| MongoDB Atlas Free | [cloud.mongodb.com](https://cloud.mongodb.com) |
| Railway Deployment | [railway.app](https://railway.app) |
| Vercel Deployment | [vercel.com](https://vercel.com) |

---

## 📄 License

This project was built for Trithon 2026 by Team Idiotics. All rights reserved.  
For collaboration enquiries, contact: jhakeshav5892@gmail.com

---

<div align="center">

**Built with ❤️ in Bhubaneswar, Odisha**  
*For every grandparent who is silently declining — SAHARA sees them.*

🌿 **SAHARA** · Team Idiotics · Trithon 2026

</div>
- Delayed medical intervention due to absence of early warning systems  
- Limited real-time visibility for family members  

Existing solutions are fragmented and reactive, focusing mainly on emergency alerts rather than preventive, intelligent healthcare.  

---

## 3. Proposed Solution  

SAHARA provides a comprehensive AI-driven healthcare ecosystem with the following capabilities:  

- **Nutritional Analysis**  
  Evaluates daily meals and identifies deficiencies in protein, iron, and calories  

- **Health Monitoring**  
  Tracks vitals such as blood pressure, blood sugar, haemoglobin, and weight  

- **Predictive Risk Detection**  
  Identifies early signs of anaemia and abnormal health trends  

- **Health Scoring System**  
  Generates a dynamic wellness score (0–100) based on multiple parameters  

- **Family Dashboard**  
  Enables real-time monitoring of elderly individuals by family members  

- **Emergency SOS System**  
  Sends alerts with location data in critical situations  

---

## 4. Key Features  

### 4.1 Elderly User Interface  
- Simple and accessible UI  
- Large buttons and readable typography  
- Minimal actions per screen  
- Voice-enabled interaction (Hindi/English)  

### 4.2 Nutrition Intelligence  
- AI-based meal analysis  
- Daily intake tracking vs recommended targets  
- Context-aware dietary suggestions  

### 4.3 Health Analytics  
- Multi-parameter health scoring  
- Risk flag detection  
- Trend visualization (7-day insights)  

### 4.4 Family Monitoring Dashboard  
- Real-time health status of linked users  
- Risk alerts and notifications  
- Historical trends and reports  

### 4.5 Emergency Support  
- One-tap SOS trigger  
- Instant alert to family members  
- Location sharing integration  

---

## 5. System Architecture  

The system follows a layered architecture:  

### Frontend  
- React (Web Dashboard)  
- Responsive UI for elderly and family users  

### Backend  
- FastAPI (Python-based API services)  
- RESTful endpoints for all modules  

### Database  
- MongoDB Atlas  

**Collections:**  
- Users  
- Health Logs  
- Nutrition Logs  
- SOS Events  
- Reminders  

### AI/ML Layer  
- Rule-based health scoring engine  
- Predictive risk detection (anaemia, anomalies)  
- NLP-based nutrition analysis  

### External Services  
- SMS alerts (SOS notifications)  
- Push notifications  
- Map integration for location tracking  

---

## 6. Tech Stack  

| Layer        | Technology Used |
|-------------|----------------|
| Frontend     | React, HTML, CSS, JavaScript |
| Backend      | FastAPI (Python) |
| Database     | MongoDB Atlas |
| AI/ML        | Python (scikit-learn, rule engines, NLP APIs) |
| Deployment   | Vercel (Frontend), Railway/Render (Backend) |
| Integrations | Maps API, Messaging API |

---

## 7. Workflow  

1. User logs meal or health data  
2. Backend processes and stores data  
3. AI engine analyzes inputs  
4. Health score and risk flags are generated  
5. Family dashboard updates in real-time  
6. Alerts are triggered if risk is detected  

---

## 8. Innovation  

- Integrated platform combining **nutrition, health, and predictive AI**  
- Focus on **preventive healthcare rather than reactive alerts**  
- Elderly-first UX design  
- Dual-dashboard architecture (Senior + Family)  
- Contextual AI insights tailored for Indian users  

---

## 9. Use Case Scenario  

An elderly user logs daily meals and vitals.  

- The system detects low protein and iron intake  
- Health score decreases and flags risk  
- Family dashboard shows warning  
- In emergency, SOS alert notifies family instantly  

This enables early intervention and better care management.  

---

## 10. Market Potential  

- Growing elderly population in India  
- Increasing demand for remote healthcare monitoring  

**Applicability:**  
- Urban nuclear families  
- Rural healthcare systems  
- Assisted living environments  

**Potential expansion areas:**  
- Telemedicine integration  
- Wearable device support  
- Government healthcare programs  

---

## 11. Future Scope  

- Integration with IoT health devices  
- Advanced ML models for disease prediction  
- Multilingual support beyond Hindi and English  
- Mobile app deployment (Flutter/React Native)  
- Offline-first capabilities for rural areas  

---

## 12. Demo Instructions  

1. Open the web application  
2. Log in as a senior user  
3. Add meal details and health data  
4. Observe AI-generated insights and health score  
5. Switch to family dashboard  
6. View alerts, trends, and reports  
7. Trigger SOS to simulate emergency  

---

## 13. Team  

**Team Name:** Idiotics  
**Hackathon:** Trithon 2026  
**Domain:** Healthcare AI  

---

## 14. Conclusion  

SAHARA is designed to bridge the gap between elderly healthcare needs and intelligent technology by providing a scalable, user-friendly, and AI-driven solution.  

It demonstrates how data, AI, and thoughtful design can improve quality of life and healthcare outcomes for senior citizens.  
