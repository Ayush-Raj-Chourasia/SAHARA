export const MOCK_HEALTH_HISTORY = [
    {
        _id: "mock-1",
        timestamp: new Date().toISOString(),
        bp_sys: 142,
        bp_dia: 88,
        sugar: 156,
        heart_rate: 78,
        haemoglobin: 11.2,
        score: 64,
        anaemia_risk: "MEDIUM",
        anomalies: [
            { param: "Blood Pressure", message: "Your systolic BP is slightly elevated compared to your 7-day average." }
        ]
    },
    {
        _id: "mock-2",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        bp_sys: 138,
        bp_dia: 85,
        sugar: 148,
        heart_rate: 75,
        haemoglobin: 11.4,
        score: 72,
        anaemia_risk: "LOW",
        anomalies: []
    },
    {
        _id: "mock-3",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        bp_sys: 145,
        bp_dia: 92,
        sugar: 162,
        heart_rate: 80,
        haemoglobin: 11.5,
        score: 58,
        anaemia_risk: "MEDIUM",
        anomalies: []
    },
    {
        _id: "mock-4",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        bp_sys: 140,
        bp_dia: 88,
        sugar: 150,
        heart_rate: 76,
        haemoglobin: 11.8,
        score: 70,
        anaemia_risk: "LOW",
        anomalies: []
    },
    {
        _id: "mock-5",
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        bp_sys: 135,
        bp_dia: 82,
        sugar: 140,
        heart_rate: 72,
        haemoglobin: 12.0,
        score: 82,
        anaemia_risk: "LOW",
        anomalies: []
    }
];

export const MOCK_NUTRITION_TODAY = {
    summary: {
        kcal: 1450,
        protein: 42,
    },
    logs: [
        { _id: "n-1", meal_type: "breakfast", food_name: "Oats & Milk", kcal: 350, protein: 12 },
        { _id: "n-2", meal_type: "lunch", food_name: "Dal Chawal & Sabzi", kcal: 550, protein: 18 },
    ],
    meal_status: [
        { meal_type: "breakfast", logged: true, entry: { food_name: "Oats & Milk", kcal: 350 } },
        { meal_type: "lunch", logged: true, entry: { food_name: "Dal Chawal & Sabzi", kcal: 550 } },
        { meal_type: "snacks", logged: false, missed: true, due_hour: 17 },
        { meal_type: "dinner", logged: false, missed: false, due_hour: 20 },
    ]
};

export const MOCK_SOS_HISTORY = [
    {
        _id: "sos-1",
        timestamp: new Date(Date.now() - 432000000).toISOString(),
        latitude: 20.2961,
        longitude: 85.8245,
        status: "resolved"
    }
];

export const MOCK_ME = {
    id: "demo-user-id",
    _id: "demo-user-id",
    email: "demo@sahara.com",
    name: "Demo User (Local)",
    role: "senior",
    onboarded: true,
    linked_senior_ids: ["demo-user-id"]
};
