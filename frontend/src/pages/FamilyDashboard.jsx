import React from 'react';
import { Card, CH, Label, G } from '../components/DashboardComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Shield, Pulse, Drop, Heart, Clock, AlertCircle, Phone, ArrowUp, ArrowDown } from '../components/Icons';
import { AIWeeklySummary, SOSHistory } from '../components/FamilyComponents';

const FamilyDashboard = (props) => {
  const { th, dark, score, show } = props;

  const chartData = [
    { day: 'Mon', bp: 135, sugar: 110, hb: 11.2 },
    { day: 'Tue', bp: 140, sugar: 115, hb: 11.0 },
    { day: 'Wed', bp: 138, sugar: 108, hb: 10.8 },
    { day: 'Thu', bp: 145, sugar: 121, hb: 10.6 },
    { day: 'Fri', bp: 142, sugar: 118, hb: 10.6 },
    { day: 'Sat', bp: 139, sugar: 112, hb: 10.5 },
    { day: 'Sun', bp: 141, sugar: 114, hb: 10.4 },
  ];

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px" }}>
        
        {/* Senior Header & Global Status (§4.7) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 15 }}>
            <div>
                <h1 style={{ fontSize: 32, fontWeight: 900 }}>Monitoring Ratan Ji</h1>
                <p style={{ color: th.sub, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> Last logged: 2 hours ago</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: G.red, padding: '10px 18px', borderRadius: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle w={20} /> HIGH RISK
                </div>
                <button style={{ background: '#111827', color: '#FFF', padding: '10px 18px', borderRadius: 16, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={18} /> Call Now
                </button>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 20 }}>
            
            {/* AI Weekly Narrative (§4.9) */}
            <div style={{ gridColumn: '1 / -1' }}>
                <AIWeeklySummary th={th} dark={dark} />
            </div>

            {/* Health Trend Charts (§4.8) */}
            <Card th={th} full d={1} show={show}>
                <CH th={th} icon={<Pulse color={G.green} />} title="7-Day Blood Pressure Trend">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: G.red, fontSize: 13, fontWeight: 800 }}>
                        <ArrowUp size={16} /> Declining
                    </div>
                </CH>
                <div style={{ height: 260, width: '100%', marginTop: 20 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={G.orange} stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor={G.orange} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={th.border} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: th.sub, fontWeight: 700, fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: th.sub, fontWeight: 700, fontSize: 12}} domain={[120, 160]} />
                            <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: th.shadow }} />
                            <Area type="monotone" dataKey="bp" stroke={G.orange} strokeWidth={4} fillOpacity={1} fill="url(#colorBp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card th={th} d={1.5} show={show}>
                <CH th={th} icon={<Drop color="#3b82f6" />} title="Blood Sugar (mg/dL)" />
                <div style={{ height: 180, width: '100%' }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={th.border} />
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={[100, 130]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                    <div><Label>Avg Today</Label><p style={{ fontWeight: 800 }}>114</p></div>
                    <div><Label>Status</Label><p style={{ fontWeight: 800, color: G.green }}>Stable</p></div>
                </div>
            </Card>

            <Card th={th} d={2} show={show}>
                <CH th={th} icon={<Heart color="#ef4444" />} title="Haemoglobin Trend" />
                <div style={{ height: 180, width: '100%' }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={th.border} />
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={[10, 12]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="hb" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                    <div><Label>Current Hb</Label><p style={{ fontWeight: 800, color: G.red }}>10.4</p></div>
                    <div><Label>Alert</Label><p style={{ fontWeight: 800, color: G.red }}>Declining</p></div>
                </div>
            </Card>

            {/* SOS History (§4.10) */}
            <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
                <Card th={th} full d={2.5} show={show}>
                    <CH th={th} icon={<Shield color={G.red} />} title="Emergency / SOS History" />
                    <SOSHistory th={th} />
                </Card>
            </div>

        </div>
    </main>
  );
};

export default FamilyDashboard;
