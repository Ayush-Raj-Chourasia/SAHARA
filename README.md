# SAHARA — AI-Powered Smart Elderly Care System

> **S**mart **A**ssistive **H**ealthcare **A**nd **R**emote **A**lert System  
> *Enabling independent, safe, and healthy aging for India's 140 million senior citizens*

<div align="center">

![SAHARA](https://img.shields.io/badge/SAHARA-Elderly%20Care%20AI-orange?style=for-the-badge)
![Trithon 2026](https://img.shields.io/badge/Trithon%202026-Healthcare%20Track-blue?style=for-the-badge)
![ITER SOA](https://img.shields.io/badge/ITER%20SOA-Bhubaneswar%2C%20Odisha-green?style=for-the-badge)

**Live Demo →** [sahara-flax.vercel.app](https://sahara-flax.vercel.app/)

</div>

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [The Problem](#2-the-problem)
3. [Our Solution](#3-our-solution)
4. [Key Features](#4-key-features)
5. [System Architecture](#5-system-architecture)
6. [Tech Stack](#6-tech-stack)
7. [AI & ML Components](#7-ai--ml-components)
8. [UX Design Philosophy](#8-ux-design-philosophy)
9. [API Reference](#9-api-reference)
10. [Database Schema](#10-database-schema)
11. [Deployment Guide](#11-deployment-guide)
12. [Environment Variables](#12-environment-variables)
13. [Local Development Setup](#13-local-development-setup)
14. [Mobile App — Flutter](#14-mobile-app--flutter)
15. [Business Model](#15-business-model)
16. [Market Analysis](#16-market-analysis)
17. [Competitive Landscape](#17-competitive-landscape)
18. [Roadmap](#18-roadmap)
19. [Team](#19-team)
20. [Acknowledgements](#20-acknowledgements)

---

## 1. Project Overview

**SAHARA** is an AI-powered intelligent healthcare ecosystem designed specifically for elderly individuals aged 60+ who require continuous health and nutritional monitoring. Built for the Indian context — with support for Hindi and Odia — SAHARA bridges the critical gap between aging parents living in Odisha and their working adult children in distant cities.

| Field | Detail |
|---|---|
| **Hackathon** | Trithon 2026 — 24-Hour Hackathon by Trident Academy of Technology |
| **Theme** | Healthcare Innovation |
| **Team Name** | Idiotics |
| **Institution** | ITER, Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar, Odisha |
| **Team Leader** | Keshav Jha |
| **Contact** | 9142928046 |
| **Problem Statement** | AI-Based Intelligent Monitoring & Nutritional Management System for Senior Citizens |

### The Core Insight

> 71% of elderly Indians live without continuous family support. A daughter in Bangalore cannot know if her father in Bhubaneswar ate properly today, or if his haemoglobin is silently falling. SAHARA makes that knowledge real-time, predictive, and actionable — before a crisis, not after.

---

## 2. The Problem

India — and Odisha in particular — is facing a quiet elderly health crisis, sharpened by rural-to-urban migration that separates families across hundreds of kilometres.

### Scale of the Crisis

- **140 million** senior citizens in India today; will reach **300 million by 2050**
- **50%+** of elderly Indian women suffer from anaemia — the majority undiagnosed
- **₹30,000–₹80,000** — average cost of one preventable elderly hospitalisation
- **71%** of elderly Indians live without a family member at home during working hours
- **6.2 million** senior citizens in Odisha alone; ~65% in rural areas without nearby family

### Specific Pain Points

| Problem | Current Reality | SAHARA's Response |
|---|---|---|
| Nutritional deficiency | No tool tracks elderly-specific Indian diet nutrition | AI parses Indian meals against elderly ICMR-calibrated RDA |
| Undetected anaemia | Blood tests only when symptoms are severe | Predictive model flags declining Hb trend before crisis |
| BP and sugar monitoring | Manual diary, inconsistently maintained | Daily logging with AI anomaly detection across 7-day trend |
| Family blindness | Phone calls cannot reveal health data or trends | Real-time family dashboard with live charts and AI summaries |
| Emergency delay | Neighbour calls, landlines, manual contact chains | One-tap SOS sends GPS location as SMS to all family numbers instantly |
| Language barrier | English-only health apps unusable for most elders | Hindi and Odia voice input and AI responses |
| Fragmented solutions | Separate apps for medication, health, emergency | Single ecosystem: nutrition + vitals + SOS + family dashboard |

---

## 3. Our Solution

SAHARA is a **dual-persona healthcare platform** — one radically simplified interface for the senior, and a data-rich monitoring dashboard for their family.

### System Flow

```
Senior logs meal in Hindi by speaking
        ↓
Gemini AI parses Indian food nutrition (dal, roti, sabji, poha, khichdi...)
        ↓
Deficit calculated against elderly-specific ICMR daily targets
        ↓
Haemoglobin + fatigue level → Anaemia risk model runs
        ↓
Composite health score (0–100) calculated from all parameters
        ↓
7-day anomaly detector checks for BP / sugar / Hb trend deviation
        ↓
Family dashboard updates in real time (polls every 15 seconds)
        ↓
Risk alert fires → Twilio SMS to all linked family numbers
        ↓
SOS pressed → GPS coordinates sent → Family locates elder instantly
```

### Preventive, Not Reactive

Every existing solution waits for a crisis. SAHARA's **predictive health score** trends downward before the crisis arrives — giving families 3–7 days of warning rather than zero.

---

## 4. Key Features

### Senior-Facing App

#### 4.1 Daily Health Logging
- Log Blood Pressure, Blood Sugar, Haemoglobin, Weight in a step-by-step wizard
- One field at a time — no cognitive overload
- Instant colour-coded health score after submission (green / amber / red)
- Automatic risk flags and plain-language alerts shown immediately

#### 4.2 AI Nutrition Tracker — Most Unique Feature
- Type or **speak in Hindi/Odia**: *"aaj maine dal chawal aur sabzi khaya"*
- Gemini AI parses the Indian meal and returns a full macronutrient breakdown
- Calibrated against **ICMR elderly-specific** daily requirements (not Western USDA)
- Shows protein deficit, iron deficit, and calorie gap as a simple visual bar
- Personalised suggestion in Hindi: *"Ratan Ji, aaj protein kam hai — ek anda ya dahi lijiye"*

#### 4.3 Anaemia Early Warning
- Risk model inputs: Haemoglobin + Fatigue level + Dietary iron + Age + Gender + 7-day Hb trend
- Output: **LOW / MEDIUM / HIGH** risk with the primary contributing factor explained
- Uses WHO clinical thresholds adjusted for Indian elderly physiology
- Flags a declining 7-day Hb trend even before a clinical threshold is crossed

#### 4.4 SOS Emergency Alert
- Large red SOS button visible on every screen — never buried in a menu
- One tap: Twilio SMS sent to all linked family numbers with a live Google Maps GPS link
- SOS event logged with timestamp, coordinates, and resolution status
- 5-second cancel window prevents accidental triggers
- Email backup via SMTP if Twilio is unavailable

#### 4.5 SAHARA AI Companion (Health Chatbot)
- Conversational AI grounded in the user's actual health data (RAG pattern)
- Responds in whatever language the user writes: Hindi, Odia, or English
- Strict rules: never diagnoses; always recommends a doctor for serious concerns
- Class 5 reading level vocabulary — accessible, warm, never clinical
- Example: *"Aapka BP thoda zyada hai. Namak kam karo aur kal doctor ko dikhao."*

#### 4.6 Medication Reminders
- Set recurring reminders by medicine name and time
- Green / red compliance calendar — taken vs missed at a glance
- Missed dose triggers an alert; family sees the compliance rate on their dashboard

---

### Family Dashboard (Web)

#### 4.7 Live Health Overview
- All linked seniors shown with today's health score chip (colour-coded)
- "Last logged: N hours ago" — family knows if elder has not logged today
- Red badge on any senior at HIGH risk
- One-click call button beside each senior's name

#### 4.8 7-Day Trend Charts
- Line charts for BP (systolic/diastolic), blood sugar, haemoglobin, weight (Recharts)
- Trend direction highlighted: improving, stable, or declining
- Full 30-day history available on scroll

#### 4.9 AI Weekly Health Summary
- Auto-generated narrative: *"Ratan Ji's haemoglobin dropped from 11.8 to 10.6 this week — declining trend, consider medical review"*
- Nutrition compliance percentage
- Medication adherence rate for the week

#### 4.10 SOS History and Location
- Full timeline of all SOS events
- Embedded Google Maps showing exact coordinates
- Resolved / unresolved status per event

---

## 5. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                             │
│                                                              │
│  ┌──────────────────────┐   ┌────────────────────────────┐  │
│  │   Senior App (PWA)    │   │   Family Dashboard (Web)    │  │
│  │   React + Tailwind    │   │   React + Recharts          │  │
│  │   → Flutter (Phase 2) │   │   Vercel · JWT family role  │  │
│  │   Orange theme        │   │   Polls every 15 seconds    │  │
│  │   56px+ buttons       │   │   Desktop-optimised         │  │
│  │   Hindi/Odia voice    │   │                            │  │
│  └───────────┬──────────┘   └──────────────┬─────────────┘  │
└──────────────┼──────────────────────────────┼────────────────┘
               │  HTTPS REST API              │
               ▼                              ▼
┌──────────────────────────────────────────────────────────────┐
│               API LAYER  —  FastAPI (Python)                  │
│          Railway · Azure App Service F1 · Render              │
│                                                              │
│  /auth   /health/log   /nutrition/analyze   /ai/score        │
│  /ai/chat   /emergency/sos   /family/dashboard   /reminders   │
└────────┬─────────────────────────────────┬───────────────────┘
         │                                 │
         ▼                                 ▼
┌─────────────────────┐   ┌───────────────────────────────────┐
│    AI / ML ENGINE    │   │          EXTERNAL SERVICES         │
│                     │   │                                   │
│  Gemini 1.5 Flash   │   │  Twilio SMS      → SOS alerts     │
│  → Nutrition parser │   │  Google Maps API → GPS links       │
│  → Health chatbot   │   │  Firebase FCM    → Push notif      │
│  → Weekly reports   │   │  Web Speech API  → Hindi voice     │
│                     │   │  SMTP / Gmail    → Email backup    │
│  scikit-learn       │   └───────────────────────────────────┘
│  → Anaemia RF model │
│  → Anomaly detect   │
│                     │
│  Rule Engine        │
│  → Health score     │
│  → WHO thresholds   │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                       DATA LAYER                              │
│          MongoDB Atlas M0 (Free 512MB) · Firebase RTDB        │
│                                                              │
│  users · health_logs · nutrition_logs · reminders            │
│  sos_events · family_links · alerts · weekly_reports          │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool with fast HMR |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | 2.x | Health trend line and bar charts |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| Web Speech API | Native (Chrome) | Hindi and Odia voice input, TTS responses |
| vite-plugin-pwa | Latest | PWA manifest and service worker (installable app) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | 0.111+ | Web framework with auto OpenAPI documentation |
| Motor | 3.x | Async MongoDB driver |
| Pydantic v2 | 2.x | Data validation and serialisation |
| python-jose | 3.x | JWT token creation and verification |
| passlib | 1.x | Password hashing (bcrypt) |
| joblib | 1.x | ML model serialisation and loading |
| scikit-learn | 1.4+ | Random Forest anaemia model, Isolation Forest anomaly detection |
| numpy / pandas | Latest | Numerical computation and data processing |
| twilio | 8.x | SOS SMS delivery |
| google-generativeai | Latest | Gemini 1.5 Flash API client |

### AI and ML

| Model / Service | Use Case | Fallback |
|---|---|---|
| Google Gemini 1.5 Flash | Nutrition parsing, health chatbot, weekly report generation | Groq + Llama 3.1 → ICMR local food DB → hardcoded 20 meals |
| scikit-learn Random Forest | Anaemia risk classification (LOW / MEDIUM / HIGH) | WHO clinical rule engine (always available) |
| scikit-learn Isolation Forest | Health anomaly detection on multi-parameter time series | Z-score statistical method (7-day rolling window) |
| Custom weighted rule engine | Composite health score 0–100 | Always-on; not ML-dependent |
| Web Speech API | Hindi / Odia voice input and TTS response | Graceful degradation to text input |

### Infrastructure

| Service | Role | Plan / Cost |
|---|---|---|
| Vercel | Frontend hosting | Free (Hobby) — auto HTTPS, global CDN |
| Railway | Backend API hosting (primary) | Free $5 credit — no cold start |
| Azure App Service F1 | Backend API hosting (alternative) | Free tier — 60 CPU min/day, 1GB RAM |
| MongoDB Atlas | Primary database | M0 Free — 512MB, no credit card |
| Google Cloud | Maps API, Firebase, additional ML | Free tier credits |
| Firebase RTDB | Real-time family dashboard data | Spark plan (free) |
| Firebase FCM | Push notifications to family | Free |
| Twilio | SOS SMS delivery | Trial — 1,000 SMS free |

---

## 7. AI & ML Components

### 7.1 Nutrition Analysis Engine

**Primary:** Google Gemini 1.5 Flash with structured JSON output

```python
NUTRITION_PROMPT = """
You are a clinical nutritionist for elderly Indians aged 60-85.
Patient: {name}, age {age}, weight {weight_kg}kg, gender {gender}.
Daily targets: protein {protein_target}g, iron {iron_target}mg, calories {calorie_target}kcal.

Analyze the described meal. Return ONLY valid JSON, no extra text:
{
  "calories": 480,
  "protein_g": 14,
  "iron_mg": 3.2,
  "carbs_g": 68,
  "fiber_g": 5,
  "deficit_protein_g": 18,
  "deficit_iron_mg": 4.8,
  "suggestion_hindi": "Aaj protein bahut kam hai. Ek anda ya dahi lijiye.",
  "suggestion_english": "Protein very low today. Add one egg or a bowl of curd."
}

Meal: {meal_text}
"""
```

**Elderly Daily Targets — ICMR Standard (adjusted for 60+ Indian adults):**

| Nutrient | Men 60+ | Women 60+ | Note |
|---|---|---|---|
| Protein | 1.0g × body weight kg | 1.0g × body weight kg | Higher than adult 0.8g standard |
| Iron | 8 mg | 10 mg | Women remain higher post-60 |
| Calories | 1,800–2,000 kcal | 1,600–1,800 kcal | Activity-dependent |
| Calcium | 1,000 mg | 1,000 mg | Bone health priority |
| Vitamin B12 | 2.4 μg | 2.4 μg | Critical for anaemia prevention |

**Backup chain (in order of invocation):**
1. Groq API + Llama 3.1 8B Instant — same JSON prompt, 30 req/min free
2. Local ICMR food database JSON — 500 common Indian dishes, fuzzy-matched by name
3. Hardcoded lookup table for 20 most-common Indian meals — zero API dependency

```python
COMMON_INDIAN_MEALS = {
    "dal chawal":           {"calories": 450, "protein_g": 14, "iron_mg": 4.0},
    "roti sabzi":           {"calories": 320, "protein_g": 8,  "iron_mg": 3.0},
    "poha":                 {"calories": 250, "protein_g": 5,  "iron_mg": 2.0},
    "idli sambar":          {"calories": 300, "protein_g": 9,  "iron_mg": 2.5},
    "khichdi":              {"calories": 380, "protein_g": 12, "iron_mg": 3.5},
    "upma":                 {"calories": 220, "protein_g": 6,  "iron_mg": 1.8},
    "paneer roti":          {"calories": 520, "protein_g": 22, "iron_mg": 3.2},
    "egg curry rice":       {"calories": 490, "protein_g": 24, "iron_mg": 4.5},
    "rajma chawal":         {"calories": 480, "protein_g": 18, "iron_mg": 5.5},
    "dalia khichdi":        {"calories": 300, "protein_g": 10, "iron_mg": 2.8},
}
```

---

### 7.2 Anaemia Risk Prediction Model

**Architecture:** Random Forest Classifier trained on Kaggle anaemia datasets supplemented with WHO Indian elderly reference data.

**Input features:**
```python
FEATURES = [
    'hemoglobin_gdl',       # Primary marker
    'age',                  # Thresholds differ by age
    'gender_encoded',       # 0=Male, 1=Female
    'fatigue_level',        # 1-5 self-reported scale
    'dietary_iron_mg',      # From nutrition logs
    'bp_systolic',          # Correlated with anaemia severity
    'weight_change_7d',     # Rapid weight loss flag
    'hb_trend_7d'           # Trajectory of Hb over last 7 days
]
```

**Output:**
```json
{
  "risk_level": "HIGH",
  "confidence": 0.87,
  "primary_factor": "low_hemoglobin_declining_trend",
  "recommendation": "Haemoglobin critically low and falling. Please see a doctor.",
  "recommendation_hindi": "Haemoglobin bahut kam hai. Zaroor doctor ko dikhayein."
}
```

**WHO Rule Engine — Always-on fallback:**

```python
def get_anaemia_risk_rules(hb: float, gender: str, age: int) -> str:
    """
    WHO anaemia clinical thresholds adjusted for Indian elderly (60+).
    Reference: WHO/NMH/NHD/MNM/11.1
    """
    if gender == "female":
        critical_threshold = 10.0
        low_threshold = 12.0
    else:
        critical_threshold = 11.0
        low_threshold = 13.0

    # Elderly adjustment: thresholds shift 1g/dL lower for 65+
    if age >= 65:
        critical_threshold -= 1.0
        low_threshold -= 1.0

    if hb < critical_threshold:
        return "HIGH"
    elif hb < low_threshold:
        return "MEDIUM"
    return "LOW"
```

---

### 7.3 Composite Health Score Engine

A deterministic weighted rule engine — always available, zero ML dependency.

```python
def calculate_health_score(
    bp_sys: int, bp_dia: int, blood_sugar: float,
    hb: float, weight_kg: float, age: int,
    gender: str, missed_meds: bool = False,
    weight_change_7d: float = 0.0
) -> dict:
    score = 100

    # Blood pressure deductions
    if bp_sys > 160:   score -= 25
    elif bp_sys > 140: score -= 15
    elif bp_sys > 130: score -= 8
    if bp_dia > 100:   score -= 10
    elif bp_dia > 90:  score -= 6

    # Blood sugar deductions
    if blood_sugar > 250:   score -= 25
    elif blood_sugar > 200: score -= 15
    elif blood_sugar > 140: score -= 8

    # Haemoglobin deductions
    hb_low = 12.0 if gender == "female" else 13.0
    if age >= 65: hb_low -= 1.0
    if hb < hb_low - 2: score -= 25
    elif hb < hb_low:   score -= 12

    # Weight change anomaly
    if abs(weight_change_7d) > 3: score -= 10

    # Medication missed
    if missed_meds: score -= 8

    final = max(0, min(100, score))
    return {
        "score": final,
        "category": "Good" if final >= 75 else "Fair" if final >= 50 else "Poor",
        "color": "green" if final >= 75 else "amber" if final >= 50 else "red"
    }
```

---

### 7.4 Health Anomaly Detector

**Primary: Z-score over rolling 7-day window**

```python
import numpy as np

def detect_anomaly(historical_values: list, new_value: float, param: str) -> dict:
    if len(historical_values) < 3:
        return {"anomaly": False}

    mean = np.mean(historical_values)
    std = np.std(historical_values)
    if std == 0:
        return {"anomaly": False}

    z_score = abs(new_value - mean) / std
    direction = "high" if new_value > mean else "low"

    return {
        "anomaly": z_score > 2.0,
        "z_score": round(z_score, 2),
        "direction": direction,
        "param": param,
        "message": f"{param} is unusually {direction} today compared to your recent readings"
    }
```

**Backup:** Isolation Forest (scikit-learn) on 14+ days of accumulated multi-parameter data.

---

### 7.5 SAHARA AI Health Chatbot — RAG Pattern

```python
CHATBOT_SYSTEM_PROMPT = """
You are SAHARA, a warm and caring AI health companion for elderly Indians.

STRICT RULES — NEVER BREAK THESE:
1. Never diagnose any disease or condition
2. Always recommend seeing a doctor for symptoms lasting more than 2 days
3. Keep every response under 3 sentences
4. Use simple vocabulary at a Class 5 reading level
5. Respond in the same language the user writes (Hindi, Odia, or English)
6. Address the user by name with Ji suffix in Hindi/Odia
7. End every response with one warm, practical care tip
8. If the user expresses pain or loneliness, acknowledge their feelings first

PATIENT CONTEXT (injected per session):
Name: {name}, Age: {age}, Gender: {gender}
Conditions: {conditions}
Today's health score: {score}/100 ({category})
Current risk flags: {risk_flags}
Last BP: {bp_sys}/{bp_dia} | Last sugar: {sugar} | Haemoglobin: {hb}
Today's nutrition: Protein {protein_g}g of {protein_target}g target
Anaemia risk level: {anaemia_risk}
Last meal: {last_meal}
"""
```

---

### 7.6 Hindi and Odia Voice Input

```javascript
// Web Speech API — zero cost, built into Chrome
// Works on Android Chrome on any smartphone

const startVoiceInput = (targetField, language = 'hi-IN') => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return; // graceful fallback to text

  const recognition = new SpeechRecognition();
  recognition.lang = language;       // 'hi-IN' Hindi | 'or-IN' Odia
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    targetField.value = transcript;
    analyzeNutrition(transcript);
  };
  recognition.start();
};

// Read AI response aloud in Hindi for elders who struggle to read
const speakResponse = (text, language = 'hi-IN') => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.85;   // Slower than default — clearly paced for elderly
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
};
```

**Supported languages:** Hindi (`hi-IN`), Odia (`or-IN`), Indian English (`en-IN`)

---

## 8. UX Design Philosophy

SAHARA's senior-facing interface is governed by **Elderly-First UX Principles**. Every decision is justified by accessibility research for 60+ users — not aesthetic preference.

### Non-Negotiable Rules

| Principle | Specification | Rationale |
|---|---|---|
| Font size — body | Minimum **18px** | Age-related vision decline affects 80%+ of 70+ users |
| Font size — vital numbers | Minimum **28–32px** | BP, health score must be readable at arm's length |
| Button tap target | Minimum **56 × 56px** | Compensates for reduced fine motor control |
| Actions per screen | Maximum **3** | Cognitive load: more than 3 choices causes analysis paralysis |
| Navigation pattern | **Bottom tab bar only** | Hamburger menus are not discoverable for elderly users |
| Contrast ratio | Minimum **4.5:1 (WCAG AA)** | Never gray-on-gray |
| Icons | **Always paired with text labels** | Icons alone are not universally understood |
| Form inputs | **One field at a time — wizard pattern** | Reduces overwhelm; progress bar shows how close to done |
| Gestures | **Tap and vertical scroll only** | No swipe, no pinch-to-zoom requirements |
| Error messages | **Large red text in full sentences** | Not small tooltips or icon-only error indicators |
| Confirmations | **Always before irreversible actions** | SOS has a 5-second cancel; delete has "Are you sure?" |
| Offline support | **Cache last known data** | Rural Odisha has intermittent internet connectivity |

### Colour System

```
SAHARA Orange:  #EA580C  → Primary CTAs, brand identity
Safe Green:     #16A34A  → Good health, normal readings
Alert Amber:    #D97706  → Fair health, watch closely
Danger Red:     #DC2626  → High risk, SOS, critical alerts
Background:     #FFFFFF  → Always white in senior app — never dark mode
Primary Text:   #111827  → Maximum contrast on white
```

### Senior Home Screen Layout

```
┌────────────────────────────┐
│  Good morning, Ratan Ji    │  ← Personalised, warm greeting
│ ─────────────────────────  │
│         [ 72 ]             │  ← Health score: 32px, colour-coded
│          Fair              │
│                            │
│  ┌──────────┬───────────┐  │
│  │  BP       │  Protein  │  │  ← Today's two most critical numbers
│  │ 142/88   │  31g/55g  │  │     Large font, 2-column max
│  └──────────┴───────────┘  │
│                            │
│  [  Log My Health Today  ] │  ← 56px button, SAHARA orange
│  [  What Did I Eat?      ] │  ← 56px button, SAHARA orange
│  [  Ask SAHARA AI        ] │  ← 56px button, muted secondary
│                            │
│ ┌────┬────┬────┬────┬────┐ │
│ │Home│Log │Eat │SOS │Chat│ │  ← Bottom tab bar — always visible
│ └────┴────┴────┴────┴────┘ │
└────────────────────────────┘
```

---

## 9. API Reference

**Base URL:** `https://your-backend.railway.app`  
**Auto-generated OpenAPI docs:** `https://your-backend.railway.app/docs`

### Authentication

```
POST /api/auth/register
Body: { name, email, password, phone, role, age, gender, weight_kg, conditions[] }
Returns: { user_id, token, role }

POST /api/auth/login
Body: { email, password }
Returns: { token, user_id, role, name }

POST /api/auth/link-family
Auth: Bearer token
Body: { senior_id, family_id, relationship }
Returns: { link_id, status }
```

### Health Logging

```
POST /api/health/log
Auth: Bearer token
Body: { bp_sys, bp_dia, blood_sugar, hemoglobin, weight, fatigue (1-5) }
Returns: { health_score, anaemia_risk, anomalies[], alerts_created }

GET /api/health/history/{user_id}?days=30
Returns: { logs: [{ timestamp, bp_sys, bp_dia, blood_sugar, hb, health_score }] }

GET /api/health/summary/{user_id}
Returns: { today_score, 7d_trend, risk_flags, last_logged }
```

### Nutrition

```
POST /api/nutrition/analyze
Auth: Bearer token
Body: { meal_text: "dal chawal sabzi", language: "hi" }
Returns: { calories, protein_g, iron_mg, deficit_protein_g, deficit_iron_mg,
           suggestion, suggestion_hindi }

GET /api/nutrition/today/{user_id}
Returns: { total_calories, total_protein, total_iron, deficit, meals[] }
```

### Emergency

```
POST /api/emergency/sos
Auth: Bearer token
Body: { latitude, longitude }
Returns: { event_id, sms_sent, notified_contacts }

GET /api/emergency/history/{user_id}
Returns: { events: [{ timestamp, lat, lng, resolved, sms_sent }] }
```

### Family Dashboard

```
GET /api/family/dashboard/{senior_id}
Auth: Bearer token (family role required)
Returns: { senior, today, trends, nutrition_week,
           medication_compliance, recent_alerts, sos_history }
```

### AI Chatbot

```
POST /api/ai/chat
Auth: Bearer token
Body: { message, language }
Returns: { reply, reply_hindi }

POST /api/ai/weekly-report/{user_id}
Returns: { report, report_hindi, generated_at }
```

---

## 10. Database Schema

### Collection: `users`
```json
{
  "_id": "ObjectId",
  "name": "Ratan Kumar Nayak",
  "age": 72,
  "gender": "male",
  "email": "ratan@example.com",
  "phone": "+91-98XXXXXXXX",
  "password_hash": "bcrypt_hash",
  "role": "senior",
  "weight_kg": 68.5,
  "conditions": ["hypertension", "diabetes"],
  "linked_family": ["family_user_id"],
  "location": "Bhubaneswar, Odisha",
  "language_preference": "hi",
  "created_at": "ISODate",
  "last_active": "ISODate"
}
```

### Collection: `health_logs`
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "timestamp": "ISODate",
  "bp_sys": 145, "bp_dia": 92,
  "blood_sugar": 178,
  "hemoglobin": 10.2,
  "weight_kg": 68.2,
  "fatigue_level": 3,
  "health_score": 54,
  "anaemia_risk": "HIGH",
  "risk_flags": ["elevated_bp", "low_hemoglobin"],
  "anomalies_detected": ["hb_declining_trend"]
}
```

### Collection: `nutrition_logs`
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "timestamp": "ISODate",
  "meal_text": "dal chawal aur sabzi",
  "language": "hi",
  "ai_analysis": {
    "calories": 450, "protein_g": 14, "iron_mg": 4.0
  },
  "daily_target": {
    "protein_g": 55, "iron_mg": 10, "calories": 1800
  },
  "deficit": { "protein_g": 18, "iron_mg": 3.5 },
  "suggestion_hi": "Ek anda ya dahi lijiye — protein poora hoga."
}
```

### Collection: `sos_events`
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "timestamp": "ISODate",
  "latitude": 20.2961,
  "longitude": 85.8245,
  "google_maps_url": "https://maps.google.com/?q=20.2961,85.8245",
  "sms_sent": true,
  "notified_contacts": ["+91-XXXXXXXXXX"],
  "resolved": false
}
```

### Collection: `alerts`
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "type": "anaemia_high_risk",
  "severity": "high",
  "message": "Haemoglobin critically low at 9.2 — consult a doctor",
  "message_hindi": "Haemoglobin bahut kam hai — doctor ko dikhayein",
  "acknowledged": false,
  "created_at": "ISODate"
}
```

### MongoDB Indexes

```python
async def create_indexes(db):
    await db.health_logs.create_index([("user_id", 1), ("timestamp", -1)])
    await db.nutrition_logs.create_index([("user_id", 1), ("timestamp", -1)])
    await db.alerts.create_index([("user_id", 1), ("acknowledged", 1)])
    await db.reminders.create_index([("user_id", 1), ("date", 1)])
    await db.users.create_index([("email", 1)], unique=True)
```

---

## 11. Deployment Guide

### Frontend — Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. vercel.com → New Project → Import GitHub repo
# Build: npm run build | Output: dist | Install: npm install

# 3. Add env vars in Vercel dashboard:
#    VITE_API_BASE_URL, VITE_GOOGLE_MAPS_KEY

# Live at: https://sahara-flax.vercel.app
```

**PWA install (Android — makes it look like a native app):**
```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'
plugins: [VitePWA({
  manifest: {
    name: 'SAHARA — Elderly Care',
    short_name: 'SAHARA',
    theme_color: '#EA580C',
    display: 'standalone',
    icons: [{ src: '/icon-512.png', sizes: '512x512' }]
  }
})]
```

### Backend — Railway (Primary, No Cold Start)

```bash
npm install -g @railway/cli
railway login && railway init && railway up

railway variables set MONGO_URI="mongodb+srv://..."
railway variables set GEMINI_API_KEY="AIza..."
railway variables set TWILIO_ACCOUNT_SID="ACxxx"
railway variables set TWILIO_AUTH_TOKEN="xxx"
railway variables set JWT_SECRET="your_32char_secret"
```

**Procfile:**
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Backend — Azure App Service F1 (Alternative)

```bash
# F1 free tier: 60 CPU min/day, 1GB RAM — sufficient for demo

# Startup command:
gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app

# Add environment variables in Azure Portal →
# App Service → Configuration → Application Settings
```

### Emergency — Local + ngrok

```bash
pip install pyngrok
python -c "
from pyngrok import ngrok
url = ngrok.connect(8000)
print(f'Public URL: {url}')
"
# Update VITE_API_BASE_URL to the ngrok URL
# Works from anywhere with internet — perfect hackathon fallback
```

### Database — MongoDB Atlas

```bash
# 1. Create M0 Free cluster at mongodb.com/atlas
# 2. Create database user with read/write
# 3. Whitelist 0.0.0.0/0 for hackathon
# 4. Get connection string:
#    mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/sahara
```

---

## 12. Environment Variables

### Frontend `.env`
```env
VITE_API_BASE_URL=https://sahara-api.railway.app
VITE_GOOGLE_MAPS_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_PROJECT_ID=sahara-care
```

### Backend `.env`
```env
# Database
MONGO_URI=mongodb+srv://sahara:password@cluster0.xxxxx.mongodb.net/sahara

# AI
GEMINI_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Alerts
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
SMTP_EMAIL=saharacare2026@gmail.com
SMTP_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx

# Auth
JWT_SECRET=minimum_32_character_random_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7

# App
FRONTEND_URL=https://sahara-flax.vercel.app
DEBUG=false
```

---

## 13. Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git
- MongoDB Atlas account (free) or local MongoDB

### Setup

```bash
# Clone
git clone https://github.com/your-team/sahara-2026.git
cd sahara-2026

# Frontend
cd frontend
npm install
cp .env.example .env   # fill in your values
npm run dev            # http://localhost:5173

# Backend (new terminal)
cd ../backend
python -m venv venv
source venv/bin/activate          # Linux / Mac
# venv\Scripts\activate           # Windows
pip install -r requirements.txt
cp .env.example .env              # fill in your values

# Train ML models once (5-10 min)
python ai/train_models.py

# Start API server
uvicorn main:app --reload --port 8000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Seed Demo Data

```bash
cd backend
python scripts/seed_demo_data.py

# Creates:
#   Senior account: ratan.demo@sahara.com / demo123
#   Family account: priya.demo@sahara.com / demo123
#   30 days of realistic health logs (deliberately declining Hb trend)
#   30 days of nutrition logs (common Indian meals)
```

---

## 14. Mobile App — Flutter

Flutter is the **Phase 2 deliverable** for the senior-facing interface. It wraps the same FastAPI backend with a native Android experience.

### Architecture Decision

| Interface | Phase 1 | Phase 2 | Rationale |
|---|---|---|---|
| Senior app | React PWA (installable via Chrome) | Flutter APK | PWA delivers 90% of the experience in 10% of the build time |
| Family dashboard | React Web (stays permanently) | React Web | Chart-heavy and desktop-optimised; no native advantage |

### Flutter Key Dependencies

```yaml
# pubspec.yaml
dependencies:
  http: ^1.2.0
  shared_preferences: ^2.2.2   # JWT storage
  geolocator: ^12.0.0          # GPS for SOS
  speech_to_text: ^6.6.0       # Hindi voice input
  flutter_tts: ^4.0.2          # Text-to-speech responses
  firebase_messaging: ^15.0.0  # Push notifications
  fl_chart: ^0.68.0            # Health trend charts
  provider: ^6.1.2             # State management
```

### Build APK for Demo

```bash
# Debug APK — quick for testing
flutter build apk --debug

# Release APK — for judges / distribution
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
# Share via Google Drive link on demo day
```

### PWA as Demo Strategy (Phase 1)

While Flutter is in development, the React PWA acts as the mobile app:

```
1. Open sahara-flax.vercel.app in Chrome on Android
2. Chrome shows "Add to Home Screen" prompt
3. Tap → SAHARA orange icon appears on phone home screen
4. Open → fullscreen, no browser bar, identical to native app
5. Judges cannot distinguish this from an installed APK
```

---

## 15. Business Model

### Market Size

| Market | Size | Basis |
|---|---|---|
| TAM | ₹55,000 Crore | India elderly care market by 2030 (IBEF) |
| SAM | ₹8,200 Crore | Smartphone-connected caregiving families |
| SOM Year 1 | ₹2.3 Crore | 5,000 paid users + 3 institutional contracts |

### Revenue Streams

| Stream | Model | Price | Year 1 Target |
|---|---|---|---|
| B2C Family Subscriptions | Monthly subscription | ₹199–₹299/month | ₹1.2 Cr (5,000 users) |
| B2B Old Age Homes | Per-resident SaaS | ₹99/resident/month | ₹60 L (500 residents) |
| B2B Hospital Geriatric Depts | Dashboard license | ₹15,000/month | ₹36 L (20 hospitals) |
| Government / NGO Contracts | Project-based | ₹5–20 L per project | ₹20 L (Odisha pilot) |
| Pharmacy Affiliate | Commission on referrals | 8–12% per purchase | ₹15 L |
| Anonymised Research Data | Quarterly reports | ₹2–5 L per report | ₹10 L |

**Unit Economics:**
- CAC: ₹300 (social media targeting adult children aged 25–45)
- LTV (18-month average): ₹199 × 18 = ₹3,582
- LTV:CAC ratio: **11.9× — excellent for SaaS**

### Subscription Tiers

| Plan | Price | Key Features |
|---|---|---|
| Free Forever | ₹0 | 7-day log, basic score, 1 family linked, 3 SOS/month |
| SAHARA Care | ₹199/month | Unlimited history, AI chatbot, 5 family, unlimited SOS, weekly AI report |
| SAHARA Plus | ₹299/month | All Care + wearable sync (Phase 2), doctor consultation link, health data export |

---

## 16. Market Analysis

### India's Elderly Healthcare Gap

```
Senior citizens in India (60+):
  2024: 140 million
  2030: 180 million
  2050: 300 million

Odisha context:
  Senior population:     6.2 million (14% of state)
  Rural without family:  ~65% of elderly
  Anaemia in women 60+:  52% (undiagnosed majority)
  Android smartphone:    48% penetration and rising

Annual cost of preventable hospitalisation: ₹30,000–₹80,000
SAHARA annual subscription:                ₹2,400–₹3,600
Family ROI: Prevents 1 hospitalisation → saves ₹25,000+
```

### Why the Timing Is Right

1. **Digital India** — smartphone penetration for 60+ reached 54% in 2023
2. **COVID legacy** — families normalised remote health monitoring
3. **ABDM infrastructure** — national health stack enables digital record integration
4. **Affordable devices** — ₹6,000–₹8,000 Android phones ubiquitous in Odisha
5. **WhatsApp familiarity** — 78% of elderly smartphone users already use WhatsApp

---

## 17. Competitive Landscape

### Global Competitors

| Product | Their Approach | SAHARA Advantage |
|---|---|---|
| Life Alert (US) | Hardware emergency button, $30/month | Software-only, ₹199/month, AI-driven |
| Apple Health | Wearable data collection | Not for 70-year-olds; no Indian food; no family dashboard |
| Practo / 1mg | Appointment booking | Reactive only; no continuous monitoring; no nutrition |
| Portea Medical | Home nursing visits, ₹500/visit | Not scalable; not AI; not preventive |
| Dozee | Contact-free vitals, ₹2,999/month + hardware | No nutrition; no Hindi; hardware dependency |

### Hackathon Competitors — Trithon 2026

| Team | Their Approach | SAHARA's Edge |
|---|---|---|
| CareBridge | Elderly detection + wearables + Azure | No nutrition AI, no Hindi voice, no business model |
| VitalTwin AI | "Digital twin" — concept stage | No working demo features; SAHARA has 4 live features |
| DriftAura | Post-hospitalisation camera monitoring | Narrow use case; no preventive layer; no nutrition |
| MedX AI | Generic biomarker tracking + chatbot | Not elderly-specific; no nutrition; no SOS; no voice |
| CareHub | ICU monitoring with AR/VR | Hospital-only; AR/VR risky to demo; no community care |

### SAHARA's Defensible Moat

What no competing team can replicate in 24 hours:

- Indian elderly nutrition intelligence calibrated to ICMR (not Western USDA)
- Predictive anaemia detection — India's #1 elderly health crisis
- Dual-persona platform — radical senior simplicity + family data richness
- Hindi and Odia voice AI — genuinely accessible for non-typing elders
- RAG health chatbot — answers "how is my mother?" with actual patient data
- Six revenue streams — B2C, B2B, government, pharma, data, affiliates
- Ayushman Bharat alignment — government scheme integration path defined
- Odisha-first, India-relevant — real regional context, local dietary database

---

## 18. Roadmap

### Phase 1 — Hackathon MVP (March 2026)

- [x] Senior React PWA with health logging wizard
- [x] AI nutrition parser for Indian meals via Gemini
- [x] Anaemia risk model (WHO rules + Random Forest)
- [x] Composite health score engine (0–100)
- [x] Family monitoring dashboard with Recharts trend charts
- [x] SOS button with Twilio SMS and Google Maps GPS link
- [x] SAHARA AI chatbot in Hindi and English
- [x] Vercel + Railway deployment — live HTTPS URL

### Phase 2 — Flutter Native App (April–June 2026)

- [ ] Flutter Android app with native voice input (Hindi, Odia)
- [ ] Offline-first architecture with local SQLite cache
- [ ] Firebase FCM push notifications
- [ ] Background GPS for SOS
- [ ] Play Store listing
- [ ] Odia language support

### Phase 3 — Expansion (July–December 2026)

- [ ] Wearable integration (Google Fit, Samsung Health)
- [ ] Old age home institutional dashboard
- [ ] ABDM health ID integration
- [ ] Doctor consultation booking via Practo API
- [ ] ASHA worker community health dashboard
- [ ] iOS release

### Phase 4 — Scale (2027)

- [ ] Hospital geriatric department SaaS
- [ ] Government white-label contracts (Odisha pilot)
- [ ] Insurance partner integrations
- [ ] 10-state expansion with regional dietary databases
- [ ] Series A fundraising

---

## 19. Team

**Team Idiotics — ITER, Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar, Odisha**

| Name | Role | Responsibilities |
|---|---|---|
| **Keshav Jha** | Team Lead + AI | FastAPI architecture, ML models, Gemini integration, system design, deployment |
| **Priyanshu Pratik** | Frontend Lead | React, Tailwind design system, Recharts charts, PWA, senior app UI |
| **Tushar Mallick** | Backend Developer | MongoDB schemas, health log API, nutrition API, health scoring engine |
| **Ayush Raj Chourasia** | Full-Stack | Family dashboard, SOS + Twilio, JWT authentication, Google Maps integration |
| **Aanchal Sreeraj Nair** | UX + Demo Lead | Elderly accessibility audit, UI polish, demo script writing, presentation |
| **Surajit Sahoo** | DevOps + QA | Railway and Vercel deployment, seed data generation, E2E testing |

**Mentor:** Dr. Shruti Bajpai — ITER, Siksha 'O' Anusandhan Deemed to be University  
**Team Contact:** Keshav Jha · 9142928046 · jhakeshav5892@gmail.com

---

## 20. Acknowledgements

- **Trident Academy of Technology, Bhubaneswar** — for organising Trithon 2026 and this platform for student innovation
- **ITER, Siksha 'O' Anusandhan (SOA) University** — for institutional support and Dr. Shruti Bajpai's guidance
- **World Health Organization (WHO)** — publicly available elderly anaemia clinical thresholds
- **Indian Council of Medical Research (ICMR)** — Nutritional Requirements for Indians reference data
- **Government of Odisha** — ASHA worker programme as inspiration for Phase 3
- **Google** — Gemini API, Google Maps, Firebase, and Google Cloud credits
- **MongoDB** — Atlas M0 free cluster enabling rapid development

---

## Quick Links

| Resource | URL |
|---|---|
| Live Application | [sahara-flax.vercel.app](https://sahara-flax.vercel.app/) |
| API Docs (auto-generated) | `https://your-backend.railway.app/docs` |
| Demo Video | *(Google Drive — added on demo day)* |
| Presentation Slides | *(Canva link — added on demo day)* |

---

<div align="center">

**SAHARA — Smart Assistive Healthcare And Remote Alert System**  
*Team Idiotics · Trithon 2026 · ITER SOA University, Bhubaneswar, Odisha*

> *"Every health app in this room was built for young people who are already healthy.*  
> *SAHARA was built for the 140 million elderly Indians who are silently declining —*  
> *not in hospitals, but in their homes, alone."*

</div>