def predict_anaemia_risk(hemoglobin: float, gender: str, age: int) -> str:
    """
    Predict anaemia risk based on WHO standards.
    Normal ranges:
    - Men: 13.0 g/dL or higher
    - Women: 12.0 g/dL or higher
    - Elderly (65+): Slight variations, but generally 12-13.
    """
    if gender.lower() == "male":
        if hemoglobin < 11.0: return "High"
        if hemoglobin < 13.0: return "Medium"
        return "Low"
    else: # female
        if hemoglobin < 10.0: return "High"
        if hemoglobin < 12.0: return "Medium"
        return "Low"

def get_nutritional_advice(risk_level: str) -> str:
    if risk_level == "High":
        return "Urgent: Consult a doctor. Increase intake of iron-rich foods like liver, red meat, and fortified cereals immediately."
    if risk_level == "Medium":
        return "Preventive Care: Include more leafy greens (Palak), lentils (Dal), and Vitamin C to help iron absorption."
    return "Maintain a balanced diet with adequate iron and protein."
