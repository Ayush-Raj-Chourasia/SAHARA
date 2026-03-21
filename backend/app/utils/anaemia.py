def calculate_anaemia_risk(hb: float, gender: str, age: int, fatigue: int = 0) -> dict:
    """
    WHO anaemia clinical thresholds adjusted for Indian elderly (60+).
    Reference: WHO/NMH/NHD/MNM/11.1
    """
    if gender.lower() == "female":
        critical_threshold = 10.0
        low_threshold = 12.0
    else:
        critical_threshold = 11.0
        low_threshold = 13.0

    # Elderly adjustment: thresholds shift 1g/dL lower for 65+
    if age >= 65:
        critical_threshold -= 0.5 # Conservatively 0.5-1.0
        low_threshold -= 0.5 

    risk_level = "LOW"
    recommendation = "Your haemoglobin is in the healthy range. Continue a balanced diet."
    recommendation_hi = "Aapka haemoglobin sahi hai. Poshtik aahar lete rahein."

    if hb < critical_threshold:
        risk_level = "HIGH"
        recommendation = "Haemoglobin critically low. Please consult a doctor immediately."
        recommendation_hi = "Haemoglobin bahut kam hai. Zaroor doctor ko dikhayein."
    elif hb < low_threshold:
        risk_level = "MEDIUM"
        recommendation = "Borderline anaemia detected. Include more iron-rich foods like spinach and jaggery."
        recommendation_hi = "Haemoglobin thoda kam hai. Palak aur gud jaise loha-yukt khana khayein."
    
    # Fatigue booster
    if fatigue > 7 and risk_level == "MEDIUM":
        risk_level = "HIGH"
        recommendation = "Moderate anaemia with high fatigue. Clinical review recommended."
        recommendation_hi = "Haemoglobin kam hai aur thakaan zyada. Doctor se milein."

    return {
        "risk_level": risk_level,
        "hb": hb,
        "recommendation": recommendation,
        "recommendation_hindi": recommendation_hi,
        "primary_factor": "hemoglobin_level" if risk_level != "LOW" else None
    }

def get_nutritional_advice(risk_level: str) -> str:
    if risk_level == "High":
        return "Urgent: Consult a doctor. Increase intake of iron-rich foods like liver, red meat, and fortified cereals immediately."
    if risk_level == "Medium":
        return "Preventive Care: Include more leafy greens (Palak), lentils (Dal), and Vitamin C to help iron absorption."
    return "Maintain a balanced diet with adequate iron and protein."
