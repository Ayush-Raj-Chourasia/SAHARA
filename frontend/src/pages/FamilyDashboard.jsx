import React, { useState, useEffect } from 'react';
import { Card, CH, Label, G } from '../components/DashboardComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Shield, Pulse, Drop, Heart, Clock, AlertCircle, Phone, ArrowUp, ArrowDown } from '../components/Icons';
import { AIWeeklySummary, SOSHistory } from '../components/FamilyComponents';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

const FamilyDashboard = (props) => {
    const { th, dark, show } = props;
    const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [sosEvents, setSosEvents] = useState([]);
    const [seniorName, setSeniorName] = useState('Linked Senior');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('sahara_token');
                if (!token || !user?.id) {
                    if (isMounted) setLoading(false);
                    return;
                }
                const authHeaders = { Authorization: `Bearer ${token}` };
                const meRes = await apiFetch('/api/auth/me', { headers: authHeaders });
                if (!meRes.ok) {
                    if (isMounted) setLoading(false);
                    return;
                }
                const me = await meRes.json();
                const linkedSeniorId = me?.linked_senior_ids?.[0] || me?.family?.senior_id;
                const targetId = me?.role === 'family' ? linkedSeniorId : me?.id;

                if (!targetId) {
                    if (isMounted) {
                        setHistory([]);
                        setSosEvents([]);
                        setSeniorName('Linked Senior');
                        setLoading(false);
                    }
                    return;
                }

                if (isMounted && me?.role === 'family') {
                    setSeniorName('Linked Senior');
                } else if (isMounted) {
                    setSeniorName(me?.name || 'Linked Senior');
                }

                const [hRes, sRes] = await Promise.all([
                    apiFetch(`/api/health/history/${targetId}`, { headers: authHeaders }),
                    apiFetch(`/api/emergency/history/${targetId}`, { headers: authHeaders }),
                ]);

                if (isMounted && hRes.ok) setHistory(await hRes.json());
                if (isMounted && sRes.ok) setSosEvents(await sRes.json());
            } catch (err) {
                console.error('Fetch data error', err);
            }
            if (isMounted) setLoading(false);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 15000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [user?.id, user?.role]);

    const latest = history?.[0];
    const previous = history?.[1];
    const latestBp = latest ? `${latest.bp_sys}/${latest.bp_dia}` : '--/--';
    const latestSugar = latest?.sugar ?? '--';
    const hbLatest = latest?.haemoglobin ?? '--';
    const riskLabel = !latest
        ? 'No Data'
        : latest.score >= 80
            ? 'Low Risk'
            : latest.score >= 60
                ? 'Moderate Risk'
                : 'High Risk';
    const riskColor = riskLabel === 'High Risk' ? G.red : riskLabel === 'Moderate Risk' ? G.orange : G.green;
    const lastLogged = latest?.timestamp ? new Date(latest.timestamp).toLocaleString('en-IN') : 'No logs yet';

    const chartData = history.length > 0
        ? history
                .slice()
                .reverse()
                .map((h, i, arr) => ({
                    day: new Date(h.timestamp).toLocaleDateString('en-IN', { weekday: 'short' }),
                    bp: h.bp_sys,
                    sugar: h.sugar,
                    hb: h.haemoglobin ?? null,
                    score: h.score || 0,
                    bpDir: i > 0 ? h.bp_sys - arr[i - 1].bp_sys : 0,
                }))
        : [];

    const bpTrend = latest && previous ? latest.bp_sys - previous.bp_sys : 0;
    const bpTrendLabel = !latest || !previous ? 'No trend yet' : bpTrend > 0 ? 'Rising' : bpTrend < 0 ? 'Improving' : 'Stable';
    const bpTrendIcon = bpTrend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
    const summaryText = latest
        ? `${seniorName} has a latest health score of ${latest.score}/100. Blood pressure is ${latestBp} and sugar is ${latestSugar} mg/dL. Continue medication and monitor trends daily.`
        : 'No recent health logs found. Ask your senior family member to submit vitals so AI monitoring can generate actionable insights.';
    const nutritionAdherence = latest ? Math.max(60, Math.min(98, Math.round((latest.score || 70) * 0.95))) : 0;
    const medsCompliance = latest ? Math.max(55, Math.min(97, Math.round((latest.score || 70) * 0.9))) : 0;
    const sosViewData = sosEvents.map((ev, idx) => ({
        id: ev._id || String(idx),
        time: ev.timestamp ? new Date(ev.timestamp).toLocaleString('en-IN') : 'Unknown',
        loc: `Lat ${Number(ev.latitude).toFixed(4)}, Lng ${Number(ev.longitude).toFixed(4)}`,
        coord: `${ev.latitude},${ev.longitude}`,
        status: ev.status || 'triggered',
    }));

    const onCallNow = () => {
        const phone = user?.phone || '';
        if (!phone) {
            alert('No phone number available for this profile.');
            return;
        }
        window.open(`tel:${phone}`);
    };

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px" }}>
        
        {/* Senior Header & Global Status (§4.7) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 15 }}>
            <div>
                <h1 style={{ fontSize: 32, fontWeight: 900 }}>
                                    Monitoring {seniorName}
                </h1>
                <p style={{ color: th.sub, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> Last logged: {lastLogged}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: riskColor, padding: '10px 18px', borderRadius: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle w={20} /> {loading ? 'Loading...' : riskLabel}
                </div>
                <button onClick={onCallNow} style={{ background: '#111827', color: '#FFF', padding: '10px 18px', borderRadius: 16, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={18} /> Call Now
                </button>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 20 }}>
            
            {/* AI Weekly Narrative (§4.9) */}
            <div style={{ gridColumn: '1 / -1' }}>
                                <AIWeeklySummary
                                    summaryText={summaryText}
                                    nutritionAdherence={nutritionAdherence}
                                    medsCompliance={medsCompliance}
                                />
            </div>

            {/* Health Trend Charts (§4.8) */}
            <Card th={th} full d={1} show={show}>
                <CH th={th} icon={<Pulse color={G.green} />} title="7-Day Blood Pressure Trend">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: bpTrend > 0 ? G.red : G.green, fontSize: 13, fontWeight: 800 }}>
                        {bpTrendIcon} {bpTrendLabel}
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
                            <YAxis axisLine={false} tickLine={false} tick={{fill: th.sub, fontWeight: 700, fontSize: 12}} domain={['auto', 'auto']} />
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
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                    <div><Label>Latest</Label><p style={{ fontWeight: 800 }}>{latestSugar}</p></div>
                    <div><Label>Status</Label><p style={{ fontWeight: 800, color: latest && latest.sugar > 140 ? G.red : G.green }}>{latest && latest.sugar > 140 ? 'High' : latest ? 'Stable' : 'No Data'}</p></div>
                </div>
            </Card>

            <Card th={th} d={2} show={show}>
                <CH th={th} icon={<Heart color="#ef4444" />} title="Haemoglobin Trend" />
                <div style={{ height: 180, width: '100%' }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={th.border} />
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="hb" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                    <div><Label>Current Hb</Label><p style={{ fontWeight: 800, color: G.red }}>{hbLatest}</p></div>
                    <div><Label>Alert</Label><p style={{ fontWeight: 800, color: bpTrend > 0 ? G.red : G.green }}>{bpTrendLabel}</p></div>
                </div>
            </Card>

            {/* SOS History (§4.10) */}
            <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
                <Card th={th} full d={2.5} show={show}>
                    <CH th={th} icon={<Shield color={G.red} />} title="Emergency / SOS History" />
                    <SOSHistory th={th} events={sosViewData} />
                </Card>
            </div>

        </div>
    </main>
  );
};

export default FamilyDashboard;
