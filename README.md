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
- Difficulty in manually tracking vitals and medication  
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