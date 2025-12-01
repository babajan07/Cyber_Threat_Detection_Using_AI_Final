import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';
import { 
  Shield, Search, AlertTriangle, CheckCircle, BrainCircuit, Download, Activity, 
  Github, Twitter, Linkedin, Globe, Lock, Mail, ChevronRight, Check, Bell,
  Code, Terminal, FileJson, Copy, Key, Server, FileText, Youtube, PlayCircle,
  CreditCard, Zap, Briefcase, ChevronDown, HelpCircle, FileDigit, ShieldAlert
} from 'lucide-react';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState('email'); 
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const aboutMenuRef = useRef(null); // Ref for detecting clicks outside

  // --- CLICK OUTSIDE HANDLER ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target)) {
        setShowAboutMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aboutMenuRef]);

  // --- EMAIL SCANNER STATE ---
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); 
  const [breaches, setBreaches] = useState([]);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // --- PASSWORD AUDITOR STATE ---
  const [password, setPassword] = useState('');
  const [pwdScore, setPwdScore] = useState(0);

  // --- EMAIL LOGIC ---
  const checkBreach = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setAiReport(null);
    
    // Simulate hacking delay
    setTimeout(async () => {
        try {
            // eslint-disable-next-line no-template-curly-in-string
            const res = await axios.post('${API_URL}/api/search', { email });
            setStatus(res.data.status);
            setBreaches(res.data.breaches);

            if (res.data.status === 'pwned') {
                generateAiReport(email, res.data.breaches);
            }
        } catch (err) {
            alert("Connection Error. Ensure Backend is running on port 5000.");
        }
        setLoading(false);
    }, 1500);
  };

  const generateAiReport = async (email, breachData) => {
    setAiLoading(true);
    try {
      const res = await axios.post('https://cyber-threat-detection-using-ai-final.onrender.com/api/analyze', { 
        email, breaches: breachData 
      });
      setAiReport(res.data);
    } catch (err) {
      console.error("AI Failed");
    }
    setAiLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(10, 10, 20);
    doc.rect(0, 0, 210, 297, 'F'); 
    
    doc.setTextColor(0, 243, 255);
    doc.setFontSize(22);
    doc.text("CYBERGUARD AI REPORT", 20, 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Target: ${email}`, 20, 40);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);
    
    if (aiReport) {
        doc.setTextColor(255, 0, 60);
        doc.text(`Threat Level: ${aiReport.riskLevel}`, 20, 65);
        
        doc.setTextColor(255, 255, 255);
        const summary = doc.splitTextToSize(aiReport.summary, 170);
        doc.text(summary, 20, 80);
        
        doc.setTextColor(0, 243, 255);
        doc.text("IMMEDIATE ACTIONS REQUIRED:", 20, 110);
        doc.setTextColor(200, 200, 200);
        
        let y = 120;
        aiReport.actions.forEach((act, i) => {
            const line = doc.splitTextToSize(`${i+1}. ${act}`, 170);
            doc.text(line, 20, y);
            y += 10 + (line.length * 5);
        });
    }
    doc.save('Security_Report.pdf');
  };

  const calculateScore = () => {
    if (status === 'safe') return 100;
    if (status === 'pwned') return Math.max(0, 100 - (breaches.length * 20));
    return 0;
  };

  const checkPassword = (e) => {
    const val = e.target.value;
    setPassword(val);
    let score = 0;
    if (val.length > 0) {
        if (val.length >= 8) score += 40;
        if (/[0-9]/.test(val)) score += 20;
        if (/[!@#$%^&*]/.test(val)) score += 20;
        if (/[A-Z]/.test(val)) score += 20;
    }
    setPwdScore(score);
  };

  const getChartData = () => {
    const dataMap = {};
    breaches.forEach(b => {
        const year = b.BreachDate.split('-')[0];
        dataMap[year] = (dataMap[year] || 0) + 1;
    });
    return Object.keys(dataMap).map(year => ({ year, Breaches: dataMap[year] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="App">
      {/* NAVBAR HEADER */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setActiveTab('email')}>
          <Shield size={28} color="#00f3ff"/> 
          CYBER<span>GUARD</span>
        </div>
        <ul className="nav-menu">
            <li 
              className={`nav-link ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              Check Identity
            </li>
            <li 
              className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Passwords
            </li>
            <li 
              className={`nav-link ${activeTab === 'notify' ? 'active' : ''}`}
              onClick={() => setActiveTab('notify')}
            >
              Notify Me
            </li>
            <li 
              className={`nav-link ${activeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveTab('api')}
            >
              API
            </li>
            <li 
              className={`nav-link ${activeTab === 'demos' ? 'active' : ''}`}
              onClick={() => setActiveTab('demos')}
            >
              Demos
            </li>
            <li 
              className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              Pricing
            </li>
            
            {/* ABOUT DROPDOWN (Click Trigger) */}
            <li 
              className="nav-link dropdown-container"
              ref={aboutMenuRef}
              onClick={() => setShowAboutMenu(!showAboutMenu)}
            >
              <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                About <ChevronDown size={14} style={{ transform: showAboutMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}/>
              </span>
              
              {showAboutMenu && (
                <ul className="dropdown-menu">
                  <li onClick={(e) => { e.stopPropagation(); setActiveTab('about'); setShowAboutMenu(false); }}>Who, What & Why</li>
                  <li onClick={(e) => { e.stopPropagation(); setActiveTab('faq'); setShowAboutMenu(false); }}>FAQs</li>
                  <li onClick={(e) => { e.stopPropagation(); setActiveTab('terms'); setShowAboutMenu(false); }}>Terms of Use</li>
                  <li onClick={(e) => { e.stopPropagation(); setActiveTab('privacy'); setShowAboutMenu(false); }}>Privacy Policy</li>
                  <li onClick={(e) => { e.stopPropagation(); setActiveTab('optout'); setShowAboutMenu(false); }}>Opt Out</li>
                </ul>
              )}
            </li>
        </ul>
      </nav>

      <div className="container">
        
        {/* Dynamic Title for Main Tools */}
        {(activeTab === 'email' || activeTab === 'password') && (
            <>
                <h1>CYBER<span>GUARD</span></h1>
                <p className="subtitle">AI-POWERED THREAT INTELLIGENCE SUITE</p>
            </>
        )}

        {/* === TAB 1: EMAIL SCANNER === */}
        {activeTab === 'email' && (
            <>
                <form onSubmit={checkBreach} className="search-box">
                    <input 
                        type="email" 
                        placeholder="ENTER TARGET EMAIL ADDRESS..." 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="scan-btn" disabled={loading}>
                        {loading ? 'SCANNING...' : <><Search size={18} /> ANALYZE</>}
                    </button>
                </form>

                {status && (
                <div className="dashboard-grid">
                    <div className="glass-panel status-section">
                        <div className={`score-circle ${status === 'safe' ? 'score-safe' : 'score-danger'}`}>
                            <span className="score-number">{calculateScore()}%</span>
                            <span className="score-label">SECURITY SCORE</span>
                        </div>
                        {status === 'safe' ? (
                            <div className="status-badge badge-safe">
                                <CheckCircle size={16} style={{marginRight:5}}/> SYSTEM SECURE
                            </div>
                        ) : (
                            <div className="status-badge badge-danger">
                                <AlertTriangle size={16} style={{marginRight:5}}/> BREACH DETECTED
                            </div>
                        )}
                    </div>

                    <div className="glass-panel details-section">
                        {status === 'pwned' && (
                            <div style={{marginBottom: '30px'}}>
                                <h3 style={{borderBottom:'1px solid #333', paddingBottom:'10px', marginTop:0}}>KNOWN BREACHES ({breaches.length})</h3>
                                {breaches.map((b, i) => (
                                    <div key={i} className="breach-item">
                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                            <h3>{b.Name}</h3>
                                            <small>{b.BreachDate}</small>
                                        </div>
                                        <p style={{fontSize:'0.9rem', color:'#aaa', margin:'5px 0 0 0'}}>{b.Description}</p>
                                    </div>
                                ))}
                                <div className="chart-container">
                                    <h4 className="chart-title"><Activity size={16} style={{display:'inline', verticalAlign:'middle'}}/> BREACH TIMELINE ANALYSIS</h4>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={getChartData()}>
                                            <XAxis dataKey="year" stroke="#888" />
                                            <YAxis stroke="#888" allowDecimals={false}/>
                                            <Tooltip contentStyle={{background: '#111', border: '1px solid #333'}} itemStyle={{color: '#ff003c'}} />
                                            <Bar dataKey="Breaches" fill="#ff003c" barSize={30} radius={[5, 5, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {(aiLoading || aiReport) && (
                            <div className="ai-container">
                                <div className="ai-header">
                                    <span className="ai-title"><BrainCircuit size={20}/> GEMINI INTELLIGENCE</span>
                                    {aiReport && (
                                        <button className="download-btn" onClick={downloadPDF}><Download size={14}/> REPORT</button>
                                    )}
                                </div>
                                {aiLoading ? (
                                    <div className="terminal-loader">
                                        <div className="terminal-line"> ESTABLISHING UPLINK TO GEMINI...</div>
                                        <div className="terminal-line" style={{animationDelay: '0.5s'}}> ANALYZING THREAT VECTORS...</div>
                                        <div className="terminal-line" style={{animationDelay: '1s'}}> GENERATING DEFENSE PROTOCOLS...</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{background:'rgba(255,0,60,0.1)', padding:'15px', borderRadius:'8px', border:'1px solid rgba(255,0,60,0.3)', marginBottom:'20px'}}>
                                            <strong style={{color:'#ff003c', display:'block', marginBottom:'5px'}}>RISK LEVEL: {aiReport.riskLevel.toUpperCase()}</strong>
                                            <p style={{margin:0, fontSize:'0.95rem'}}>{aiReport.summary}</p>
                                        </div>
                                        <ul className="action-list">
                                            {aiReport.actions.map((act, i) => <li key={i}>{act}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {status === 'safe' && !aiLoading && (
                            <div style={{padding:'40px', textAlign:'center', color:'#00ff9d'}}>
                                <Activity size={50} style={{marginBottom:'15px'}} />
                                <p style={{fontSize: '1.2rem', margin:0}}>No immediate threats detected.</p>
                                <p style={{fontSize: '0.9rem', opacity: 0.7}}>This identity does not appear in our known breach database.</p>
                            </div>
                        )}
                    </div>
                </div>
                )}
            </>
        )}

        {/* === TAB 2: PASSWORD AUDITOR === */}
        {activeTab === 'password' && ( <div className="glass-panel password-meter-container"> <h2 style={{marginTop:0, display:'flex', alignItems:'center', gap:'10px'}}><Lock color="#00f3ff"/> PASSWORD AUDITOR</h2> <p style={{color:'#aaa', marginBottom:'30px'}}>Check the cryptographic strength of your credentials.</p> <div className="search-box" style={{marginBottom:'20px'}}> <input type="text" placeholder="ENTER PASSWORD TO TEST..." value={password} onChange={checkPassword} style={{width: '100%', paddingRight:'25px'}} /> </div> <div className="password-strength-bar"> <div className={`password-strength-fill ${pwdScore < 40 ? 'strength-weak' : pwdScore < 80 ? 'strength-medium' : 'strength-strong'}`} style={{width: `${Math.max(5, pwdScore)}%`}} /> </div> <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'30px'}}> <div className={`check-item ${password.length >= 8 ? 'valid' : ''}`}>{password.length >= 8 ? <Check size={18}/> : <ChevronRight size={18}/>} Minimum 8 Characters</div> <div className={`check-item ${/[A-Z]/.test(password) ? 'valid' : ''}`}>{/[A-Z]/.test(password) ? <Check size={18}/> : <ChevronRight size={18}/>} Uppercase Letters</div> <div className={`check-item ${/[0-9]/.test(password) ? 'valid' : ''}`}>{/[0-9]/.test(password) ? <Check size={18}/> : <ChevronRight size={18}/>} Numbers</div> <div className={`check-item ${/[!@#$%^&*]/.test(password) ? 'valid' : ''}`}>{/[!@#$%^&*]/.test(password) ? <Check size={18}/> : <ChevronRight size={18}/>} Special Symbols</div> </div> {password.length > 0 && ( <div style={{marginTop:'30px', padding:'20px', background:'rgba(0,0,0,0.3)', borderRadius:'10px', borderLeft:`4px solid ${pwdScore < 80 ? '#ff003c' : '#00ff9d'}`}}> <h4 style={{margin:'0 0 10px 0', color: pwdScore < 80 ? '#ff003c' : '#00ff9d'}}>VERDICT: {pwdScore < 40 ? 'WEAK' : pwdScore < 80 ? 'MODERATE' : 'STRONG'}</h4> <p style={{margin:0, fontSize:'0.9rem', color:'#ccc'}}>{pwdScore < 80 ? "This password is vulnerable to brute-force attacks. We recommend adding more complexity." : "Excellent. This password meets current cryptographic standards."}</p> </div> )} </div> )}
        
        {/* === TAB 3: NOTIFY === */}
        {activeTab === 'notify' && ( <div className="glass-panel" style={{maxWidth: '900px', margin: '0 auto', textAlign: 'left', padding: '40px', position: 'relative'}}> <div style={{textAlign: 'center', marginBottom: '50px'}}> <h2 style={{fontSize: '2.5rem', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px'}}>Get Breach <span style={{color: '#00f3ff'}}>Notifications</span></h2> <p style={{color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto'}}> We'll notify you when your email address appears in new data breaches, helping you stay ahead of potential security threats. </p> </div> <div style={{marginBottom: '50px'}}> <h3 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px'}}>How it works</h3> <div style={{display: 'grid', gap: '30px'}}> <div style={{display: 'flex', gap: '20px'}}> <div style={{background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid #00f3ff', flexShrink: 0}}>1</div> <div> <h4 style={{margin: '0 0 8px 0', color: 'white', fontSize: '1.1rem'}}>Enter your email address</h4> <p style={{margin: 0, color: '#aaa'}}>Provide the email address you want to monitor for future compromise.</p> </div> </div> <div style={{display: 'flex', gap: '20px'}}> <div style={{background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid #00f3ff', flexShrink: 0}}>2</div> <div> <h4 style={{margin: '0 0 8px 0', color: 'white', fontSize: '1.1rem'}}>Verify your email</h4> <p style={{margin: 0, color: '#aaa'}}>Click the verification link sent to your inbox to confirm ownership.</p> </div> </div> <div style={{display: 'flex', gap: '20px'}}> <div style={{background: 'rgba(0, 243, 255, 0.1)', color: '#00f3ff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid #00f3ff', flexShrink: 0}}>3</div> <div> <h4 style={{margin: '0 0 8px 0', color: 'white', fontSize: '1.1rem'}}>Stay protected</h4> <p style={{margin: 0, color: '#aaa'}}>Get immediate notifications via email whenever your data appears in a new breach.</p> </div> </div> </div> </div> <div style={{background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '12px'}}> <h3 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', marginTop: 0, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}> <Bell size={24} color="#00f3ff" /> Sign up for notifications </h3> <form onSubmit={(e) => { e.preventDefault(); alert("Verification email sent! Check your inbox."); }}> <div style={{marginBottom: '15px', fontWeight: 'bold', color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Email Address</div> <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}> <input type="email" placeholder="Enter your email address" required style={{ flex: 1, padding: '15px 20px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', minWidth: '250px' }} /> <button type="submit" style={{ padding: '15px 40px', background: '#00f3ff', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', transition: 'all 0.3s' }} onMouseOver={(e) => e.target.style.boxShadow = '0 0 15px rgba(0,243,255,0.5)'} onMouseOut={(e) => e.target.style.boxShadow = 'none'} > Notify Me </button> </div> <p style={{fontSize: '0.85rem', color: '#666', marginTop: '20px', borderTop: '1px solid #222', paddingTop: '15px'}}> <CheckCircle size={14} style={{display: 'inline', marginRight: '5px', verticalAlign: 'middle', color: '#00f3ff'}}/> We'll never share your email with anyone else. By signing up, you agree to our Terms. </p> </form> </div> </div> )}
        
        {/* === TAB 4: API === */}
        {activeTab === 'api' && ( <div className="glass-panel" style={{maxWidth: '1000px', margin: '0 auto', textAlign: 'left', padding: '40px'}}> <div style={{borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> <div> <h2 style={{fontSize: '2rem', fontFamily: 'Orbitron, sans-serif', margin: '0 0 10px 0'}}> CyberGuard <span style={{color: '#00f3ff'}}>API v3</span> </h2> <p style={{color: '#aaa', margin: 0}}>A RESTful API for querying data breaches and account compromises.</p> </div> <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}> <button style={{padding: '10px 20px', background: '#00f3ff', color: 'black', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}> Get API Key <Key size={16} /> </button> </a> </div> <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px'}}> <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}> <div> <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem'}}> <FileText size={18} color="#00f3ff" /> Authorization </h3> <p style={{fontSize: '0.9rem', color: '#aaa', lineHeight: '1.6'}}> Authentication is required for all API requests. You must include your API key in the request header <code style={{background:'rgba(255,255,255,0.1)', padding:'2px 5px', borderRadius:'4px', color:'#00f3ff'}}>hibp-api-key</code>. </p> <p style={{fontSize: '0.9rem', color: '#aaa', lineHeight: '1.6', marginTop: '10px'}}> Additionally, a <code style={{background:'rgba(255,255,255,0.1)', padding:'2px 5px', borderRadius:'4px', color:'#00f3ff'}}>user-agent</code> header is required to identify your application. </p> </div> <div> <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem'}}> <Server size={18} color="#00f3ff" /> Endpoints </h3> <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}> <div style={{background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #00ff9d', cursor: 'pointer'}}> <div style={{fontSize: '0.75rem', color: '#00ff9d', fontWeight: 'bold', marginBottom: '2px'}}>GET</div> <div style={{color: '#ddd', fontWeight: '500', fontSize: '0.9rem'}}>/breachedaccount/&#123;account&#125;</div> </div> <div style={{background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #00ff9d', cursor: 'pointer'}}> <div style={{fontSize: '0.75rem', color: '#00ff9d', fontWeight: 'bold', marginBottom: '2px'}}>GET</div> <div style={{color: '#ddd', fontWeight: '500', fontSize: '0.9rem'}}>/breaches</div> </div> <div style={{background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ffd700', cursor: 'pointer'}}> <div style={{fontSize: '0.75rem', color: '#ffd700', fontWeight: 'bold', marginBottom: '2px'}}>POST</div> <div style={{color: '#ddd', fontWeight: '500', fontSize: '0.9rem'}}>/analyze</div> </div> </div> </div> <div> <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem'}}> <Activity size={18} color="#00f3ff" /> Response Codes </h3> <table style={{width: '100%', fontSize: '0.85rem', color: '#aaa', borderCollapse: 'collapse'}}> <tbody> <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}> <td style={{padding: '8px', color: '#00ff9d'}}>200</td> <td style={{padding: '8px'}}>Success - Breach found</td> </tr> <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}> <td style={{padding: '8px', color: '#ffd700'}}>400</td> <td style={{padding: '8px'}}>Bad Request</td> </tr> <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}> <td style={{padding: '8px', color: '#ff5f56'}}>401</td> <td style={{padding: '8px'}}>Unauthorised - Invalid Key</td> </tr> <tr> <td style={{padding: '8px', color: '#00f3ff'}}>404</td> <td style={{padding: '8px'}}>Not found (Account safe)</td> </tr> </tbody> </table> </div> </div> <div> <div style={{marginBottom: '30px'}}> <h3 style={{color: 'white', marginBottom: '10px', fontFamily: 'Orbitron, sans-serif'}}>GET /breachedaccount/&#123;account&#125;</h3> <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '20px'}}> Returns a list of all breaches a particular account has been involved in. The account can be an email address or username. </p> <h4 style={{color: '#fff', fontSize: '0.9rem', marginBottom: '10px'}}>Query Parameters</h4> <table style={{width: '100%', fontSize: '0.85rem', color: '#ccc', borderCollapse: 'collapse', marginBottom: '25px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}> <thead> <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left'}}> <th style={{padding: '10px', color: '#00f3ff'}}>Parameter</th> <th style={{padding: '10px', color: '#00f3ff'}}>Description</th> </tr> </thead> <tbody> <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}> <td style={{padding: '10px'}}>truncateResponse</td> <td style={{padding: '10px', color: '#888'}}>Returns full model if false (default: true)</td> </tr> <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}> <td style={{padding: '10px'}}>domain</td> <td style={{padding: '10px', color: '#888'}}>Filters result to a specific domain</td> </tr> <tr> <td style={{padding: '10px'}}>includeUnverified</td> <td style={{padding: '10px', color: '#888'}}>Returns unverified breaches if true</td> </tr> </tbody> </table> </div> <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}> <Terminal size={20} color="#00f3ff" /> Request Example </h3> <div style={{background: '#0d1117', borderRadius: '8px', border: '1px solid #30363d', overflow: 'hidden', position: 'relative', marginBottom: '30px'}}> <div style={{background: '#161b22', padding: '10px 15px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> <div style={{display: 'flex', gap: '8px'}}> <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56'}}></div> <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e'}}></div> <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f'}}></div> </div> <div style={{color: '#8b949e', fontSize: '0.8rem'}}>bash</div> </div> <button onClick={() => copyToClipboard(`curl https://cyberguard-api.com/v3/breachedaccount/test@example.com \\\n -H "hibp-api-key: [your_key]" \\\n -H "user-agent: CyberGuard-Client"`)} style={{position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer'}} title="Copy to clipboard" > <Copy size={16} /> </button> <div style={{padding: '20px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#c9d1d9', lineHeight: '1.5'}}> <span style={{color: '#ff7b72'}}>curl</span> https://cyberguard-api.com/v3/breachedaccount/test@example.com \<br/> &nbsp;&nbsp;<span style={{color: '#79c0ff'}}>-H</span> <span style={{color: '#a5d6ff'}}>"hibp-api-key: [your_key]"</span> \<br/> &nbsp;&nbsp;<span style={{color: '#79c0ff'}}>-H</span> <span style={{color: '#a5d6ff'}}>"user-agent: CyberGuard-Client"</span> </div> </div> <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}> <Code size={20} color="#00f3ff" /> Response Schema </h3> <div style={{background: '#0d1117', borderRadius: '8px', border: '1px solid #30363d', padding: '20px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#c9d1d9', position: 'relative'}}> <button onClick={() => copyToClipboard(`[\n {\n "Name": "Adobe",\n "Domain": "adobe.com",\n "BreachDate": "2013-10-04",\n "Description": "Customer IDs and encrypted passwords..."\n }\n]`)} style={{position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer'}} title="Copy to clipboard" > <Copy size={16} /> </button> <span style={{color: '#79c0ff'}}>[</span><br/> &nbsp;&nbsp;<span style={{color: '#79c0ff'}}>&#123;</span><br/> &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#7ee787'}}>"Name"</span>: <span style={{color: '#a5d6ff'}}>"Adobe"</span>,<br/> &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#7ee787'}}>"Title"</span>: <span style={{color: '#a5d6ff'}}>"Adobe"</span>,<br/> &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#7ee787'}}>"Domain"</span>: <span style={{color: '#a5d6ff'}}>"adobe.com"</span>,<br/> &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#7ee787'}}>"BreachDate"</span>: <span style={{color: '#a5d6ff'}}>"2013-10-04"</span>,<br/> &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#7ee787'}}>"Description"</span>: <span style={{color: '#a5d6ff'}}>"Customer IDs and encrypted passwords..."</span><br/> &nbsp;&nbsp;<span style={{color: '#79c0ff'}}>&#125;</span><br/> <span style={{color: '#79c0ff'}}>]</span> </div> </div> </div> </div> )}
        {activeTab === 'demos' && ( <div className="glass-panel" style={{maxWidth: '1000px', margin: '0 auto', textAlign: 'left', padding: '40px'}}> <div style={{textAlign: 'center', marginBottom: '50px'}}> <h2 style={{fontSize: '2.5rem', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px'}}>Demos</h2> <p style={{color: '#aaa', fontSize: '1.1rem', margin: '0 auto'}}> Learn how to make the most of CyberGuard's features </p> </div> <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}> <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}> <div> <h3 style={{color: 'white', marginTop: '0', fontSize: '1.8rem', fontFamily: 'Orbitron, sans-serif'}}>Domain Search</h3> <p style={{color: '#aaa', lineHeight: '1.6', fontSize: '1rem', marginBottom: '25px'}}> Domains searches are one of CyberGuard's most popular features with hundreds of thousands of domains currently being monitored by organisations across the globe. This demo walks through adding a domain to your dashboard using the four available verification methods, then running a search. </p> <a href="https://www.youtube.com/watch?v=oi_xcOEx5uI" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}> <button style={{background: '#ff0000', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}> <PlayCircle size={18} /> Watch on YouTube </button> </a> </div> <div style={{borderRadius: '10px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}> <iframe width="100%" height="250" src="https://www.youtube.com/embed/oi_xcOEx5uI" title="Domain Search Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe> </div> </div> <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', background: 'rgba(0,0,0,0.4)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}> <div> <h3 style={{color: 'white', marginTop: '0', fontSize: '1.8rem', fontFamily: 'Orbitron, sans-serif'}}>Breached Account API</h3> <p style={{color: '#aaa', lineHeight: '1.6', fontSize: '1rem', marginBottom: '25px'}}> Searching breached accounts via the API is one of the most common integrations users create with the service. This demo shows how to use the free test API key, search by email address, the HTTP response codes you can expect and how rate limiting works. </p> <a href="https://www.youtube.com/watch?v=qCcb9I_Uf5Y" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}> <button style={{background: '#ff0000', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}> <PlayCircle size={18} /> Watch on YouTube </button> </a> </div> <div style={{borderRadius: '10px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}> <iframe width="100%" height="250" src="https://www.youtube.com/embed/qCcb9I_Uf5Y" title="Breached Account API Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe> </div> </div> </div> </div> )}
        {activeTab === 'pricing' && ( <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '20px'}}> <div style={{marginBottom: '50px'}}> <h2 style={{fontSize: '3rem', fontFamily: 'Orbitron, sans-serif', marginBottom: '15px'}}>Subscriptions</h2> <p style={{color: '#aaa', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6'}}> The vast majority of services in CyberGuard are completely free. However, searches for larger domains, enterprise stealer logs, and high-volume API access require a paid subscription. </p> </div> <h3 style={{color: '#00f3ff', fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', marginBottom: '30px', display: 'inline-block', borderBottom: '2px solid #00f3ff', paddingBottom: '10px'}}> <div style={{display:'flex', alignItems:'center', gap:'10px'}}> <CreditCard size={28}/> What We Offer </div> </h3> <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '60px', textAlign: 'left'}}> <div className="glass-panel" style={{padding: '30px'}}> <h3 style={{fontSize: '1.5rem', color: 'white', marginBottom: '15px', fontFamily: 'Orbitron, sans-serif'}}>Domain Search</h3> <p style={{color: '#aaa', lineHeight: '1.6'}}> The Domain Search feature allows verified domain owners to query all email addresses from their domain that have appeared in known data breaches and stealer logs. </p> </div> <div className="glass-panel" style={{padding: '30px'}}> <h3 style={{fontSize: '1.5rem', color: 'white', marginBottom: '15px', fontFamily: 'Orbitron, sans-serif'}}>API Access</h3> <p style={{color: '#aaa', lineHeight: '1.6'}}> The API provides programmatic access to breach data, allowing developers and security teams to automate the process of breach detection and response within their own systems. </p> </div> </div> <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px'}}> <div className="glass-panel" style={{padding: '30px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}> <h3 style={{fontSize: '1.8rem', color: 'white', margin: '0', fontFamily: 'Orbitron, sans-serif'}}>Pwned 1</h3> <div style={{color: '#888', marginBottom: '20px'}}>10 RPM</div> <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px'}}>₹380<span style={{fontSize: '1rem', color: '#888', fontWeight: 'normal'}}>/mo</span></div> <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', color: '#ccc', fontSize: '0.9rem', lineHeight: '2'}}> <li>• 10 email searches per minute</li> <li>• Up to 25 breached emails per domain</li> </ul> <button style={{width: '100%', padding: '12px', background: '#0066ff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Subscribe</button> </div> <div className="glass-panel" style={{padding: '30px', textAlign: 'center', border: '1px solid #00f3ff', background: 'rgba(0, 243, 255, 0.05)', transform: 'scale(1.05)'}}> <div style={{color: '#00f3ff', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px'}}>POPULAR</div> <h3 style={{fontSize: '1.8rem', color: 'white', margin: '0', fontFamily: 'Orbitron, sans-serif'}}>Pwned 2</h3> <div style={{color: '#888', marginBottom: '20px'}}>50 RPM</div> <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '00f3ff', marginBottom: '10px'}}>₹1,850<span style={{fontSize: '1rem', color: '#888', fontWeight: 'normal'}}>/mo</span></div> <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', color: '#ccc', fontSize: '0.9rem', lineHeight: '2'}}> <li>• 50 email searches per minute</li> <li>• Up to 100 breached emails per domain</li> </ul> <button style={{width: '100%', padding: '12px', background: '#00f3ff', color: 'black', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Subscribe</button> </div> <div className="glass-panel" style={{padding: '30px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}> <h3 style={{fontSize: '1.8rem', color: 'white', margin: '0', fontFamily: 'Orbitron, sans-serif'}}>Pwned 3</h3> <div style={{color: '#888', marginBottom: '20px'}}>100 RPM</div> <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px'}}>₹3,150<span style={{fontSize: '1rem', color: '#888', fontWeight: 'normal'}}>/mo</span></div> <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', color: '#ccc', fontSize: '0.9rem', lineHeight: '2'}}> <li>• 100 email searches per minute</li> <li>• Up to 500 breached emails per domain</li> </ul> <button style={{width: '100%', padding: '12px', background: '#0066ff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Subscribe</button> </div> </div> <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '60px'}}> <div className="glass-panel" style={{padding: '30px', textAlign: 'center', background: 'rgba(50, 20, 20, 0.6)', border: '1px solid #ff5f56'}}> <h3 style={{fontSize: '1.8rem', color: 'white', margin: '0', fontFamily: 'Orbitron, sans-serif'}}>Pwned 4</h3> <div style={{color: '#aaa', marginBottom: '20px'}}>500 RPM</div> <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px'}}>₹13,700<span style={{fontSize: '1rem', color: '#aaa', fontWeight: 'normal'}}>/mo</span></div> <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', color: '#ccc', fontSize: '0.9rem', lineHeight: '2'}}> <li>• 500 email searches per minute</li> <li>• Unlimited breached emails</li> </ul> <button style={{width: '100%', padding: '12px', background: '#ff5f56', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Subscribe</button> </div> <div className="glass-panel" style={{padding: '30px', textAlign: 'center', background: 'rgba(20, 30, 60, 0.6)', border: '1px solid #00f3ff'}}> <h3 style={{fontSize: '1.8rem', color: 'white', margin: '0', fontFamily: 'Orbitron, sans-serif'}}>Pwned 5</h3> <div style={{color: '#aaa', marginBottom: '20px'}}>1000 RPM</div> <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px'}}>₹27,400<span style={{fontSize: '1rem', color: '#aaa', fontWeight: 'normal'}}>/mo</span></div> <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', color: '#ccc', fontSize: '0.9rem', lineHeight: '2'}}> <li>• 1,000 email searches per minute</li> <li>• Unlimited breached emails</li> <li>• Domain level stealer logs</li> </ul> <button style={{width: '100%', padding: '12px', background: '#0066ff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Subscribe</button> </div> <div className="glass-panel" style={{padding: '30px', textAlign: 'center'}}> <h3 style={{fontSize: '1.8rem', color: 'white', margin: '0', fontFamily: 'Orbitron, sans-serif'}}>Enterprise</h3> <div style={{color: '#aaa', marginBottom: '20px'}}>Custom</div> <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px'}}>Custom<span style={{fontSize: '1rem', color: '#aaa', fontWeight: 'normal'}}> pricing</span></div> <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', color: '#ccc', fontSize: '0.9rem', lineHeight: '2'}}> <li>• Custom rate limits</li> <li>• Dedicated support</li> <li>• Volume discounts available</li> </ul> <button style={{width: '100%', padding: '12px', background: 'transparent', color: '#00f3ff', border: '1px solid #00f3ff', borderRadius: '5px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold'}}>Contact Us</button> </div> </div> <div style={{textAlign: 'center', marginBottom: '40px'}}> <h3 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}> <Zap size={28} color="#00f3ff" /> High-Performance Tiers </h3> <p style={{color: '#aaa', maxWidth: '700px', margin: '10px auto'}}>For organisations requiring higher API throughput, our Ultra tiers provide greater capability for volume queries.</p> </div> <div className="glass-panel" style={{padding: '40px', maxWidth: '900px', margin: '0 auto'}}> <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px', fontWeight: 'bold', color: '#aaa'}}> <div style={{textAlign: 'left'}}>Plan</div> <div>API Rate</div> <div>Price</div> <div></div> </div> <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '20px'}}> <div style={{textAlign: 'left'}}> <div style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold'}}>Pwned Ultra 4000</div> <div style={{color: '#666', fontSize: '0.85rem'}}>Unlimited domains, stealer logs</div> </div> <div style={{background: 'rgba(0, 102, 255, 0.2)', color: '#00f3ff', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block'}}>4,000 RPM</div> <div style={{color: 'white', fontWeight: 'bold'}}>₹1,09,600<span style={{color: '#666', fontWeight: 'normal'}}>/mo</span></div> <button style={{background: '#0066ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>Subscribe</button> </div> <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '20px'}}> <div style={{textAlign: 'left'}}> <div style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold'}}>Pwned Ultra 8000</div> <div style={{color: '#666', fontSize: '0.85rem'}}>Unlimited domains, stealer logs</div> </div> <div style={{background: 'rgba(0, 102, 255, 0.2)', color: '#00f3ff', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block'}}>8,000 RPM</div> <div style={{color: 'white', fontWeight: 'bold'}}>₹2,19,100<span style={{color: '#666', fontWeight: 'normal'}}>/mo</span></div> <button style={{background: '#0066ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>Subscribe</button> </div> <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center'}}> <div style={{textAlign: 'left'}}> <div style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold'}}>Pwned Ultra 12000</div> <div style={{color: '#666', fontSize: '0.85rem'}}>Unlimited domains, stealer logs</div> </div> <div style={{background: 'rgba(0, 102, 255, 0.2)', color: '#00f3ff', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block'}}>12,000 RPM</div> <div style={{color: 'white', fontWeight: 'bold'}}>₹3,28,700<span style={{color: '#666', fontWeight: 'normal'}}>/mo</span></div> <button style={{background: '#0066ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>Subscribe</button> </div> </div> </div> )}

        {/* === TAB 7: ABOUT & INFO PAGES (NEW) === */}
        {activeTab === 'about' && (
            <div className="glass-panel" style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '40px'}}>
                <h2 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '2.5rem', marginBottom: '20px'}}>Who, What & Why</h2>
                <div style={{color: '#ccc', lineHeight: '1.8', fontSize: '1rem'}}>
                    <p>Thanks for your interest in the CyberGuard AI Services. Further down this page you'll find the terms of use, written up by Australian lawyers, I just wanted to give a brief "friendlier" introduction before the formal bits.</p>
                    <p>The intention of the terms of use is to ensure that CyberGuard AI is used, as I've always said, "to do good things after bad things happen". Data breaches are an unfortunate reality of increasingly online lives, but post-breach we can use that data to help reduce the impact on breach victims. Using our Services to do that is awesome, whereas using our Services to disadvantage breach victims, is not (that includes using it to pitch them services or "ambulance chase"). You're welcome to go and build amazing things that use our Services, my ask is that if you do that and display information from CyberGuard AI, that you clearly indicate the source.</p>
                    <p>Most of what you'll read in the terms is obvious and common sense: don't deliberately attempt to disrupt the Services, don't redistribute your API key to other parties (this is your secret), if you don't pay a recurring invoice for the Services, they'll be cancelled and so on and so forth. By necessity, some of it is a bit "legal speak" which is why I wanted to set the context for why upfront.</p>
                    <p>I hope you use our Services to create something wonderful that helps breach victims, thank you for reading this and for your interest in CyberGuard AI.</p>
                    <p style={{marginTop: '20px'}}><strong>Troy Hunt</strong><br/>Founder and CEO<br/>CyberGuard AI</p>
                </div>
            </div>
        )}

        {activeTab === 'faq' && (
            <div className="glass-panel" style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '40px'}}>
                <h2 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '2.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <HelpCircle size={32} color="#00f3ff"/> Frequently Asked Questions
                </h2>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <details style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '15px'}}>
                        <summary style={{fontWeight: 'bold', color: '#00f3ff', cursor: 'pointer', fontSize: '1.1rem'}}>What does "compromised" mean?</summary>
                        <p style={{color: '#aaa', marginTop: '10px', lineHeight: '1.6'}}>It means your data appeared in a data breach. It doesn't necessarily mean your account was accessed, but your credentials were exposed.</p>
                    </details>
                    <details style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '15px'}}>
                        <summary style={{fontWeight: 'bold', color: '#00f3ff', cursor: 'pointer', fontSize: '1.1rem'}}>What is a "breach"?</summary>
                        <p style={{color: '#aaa', marginTop: '10px', lineHeight: '1.6'}}>A breach is an incident where data is inadvertently exposed in a vulnerable system, usually due to insufficient access controls or security weaknesses in the software.</p>
                    </details>
                    <details style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '15px'}}>
                        <summary style={{fontWeight: 'bold', color: '#00f3ff', cursor: 'pointer', fontSize: '1.1rem'}}>Are user passwords stored in this site?</summary>
                        <p style={{color: '#aaa', marginTop: '10px', lineHeight: '1.6'}}>No. We do not store full passwords. For the password checker, we use k-Anonymity models to verify exposure without ever knowing your actual password.</p>
                    </details>
                </div>
            </div>
        )}

        {activeTab === 'terms' && (
            <div className="glass-panel" style={{maxWidth: '900px', margin: '0 auto', textAlign: 'left', padding: '40px'}}>
                <h2 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '2.5rem', marginBottom: '20px'}}>Terms of Use</h2>
                <div style={{color: '#bbb', lineHeight: '1.6', height: '600px', overflowY: 'scroll', paddingRight: '15px'}}>
                    <h4 style={{color: 'white'}}>1. Introduction</h4>
                    <p>Welcome to CyberGuard AI, operated by Superlative Enterprises Pty Ltd trading as "CyberGuard AI" (we or us). We provide an online resource which facilitates the searching of email addresses, passwords and domains, allowing users to quickly assess if they, or people using their domain, may have been put at risk due to their online accounts having been compromised or "breached" in a data breach or leak.</p>
                    
                    <h4 style={{color: 'white'}}>2. PUBLIC GENERAL TERMS OF USE</h4>
                    <p>You may use the site for personal, non-commercial purposes to check your own data exposure. By accessing and/or purchasing any of our Services, you agree to be bound by these Terms.</p>

                    <h4 style={{color: 'white'}}>3. PAID SERVICES</h4>
                    <p>If you purchase any Paid Services from us, additional clauses apply. Once you have subscribed to the Paid Services, we will grant you a non-exclusive, non-transferable and revocable licence for the Subscription Period to access and use our API and Domain Name Search function.</p>

                    <h4 style={{color: 'white'}}>4. SUBSCRIPTION TERM</h4>
                    <p>Your Subscription will commence on the date you purchase a Paid Service from us and it will continue to be valid for the period set out on your Dashboard (Subscription Period). Your Subscription Period will automatically renew for an additional period of the same length unless you cancel your Subscription prior to the end of the then current Subscription Period.</p>

                    <h4 style={{color: 'white'}}>5. SUBSCRIPTION FEE</h4>
                    <p>You must pay the Subscription Fee associated with your Subscription, as outlined on our Website. Fees are non-refundable except as required by law.</p>

                    <h4 style={{color: 'white'}}>6. TAXES</h4>
                    <p>You are responsible for paying all taxes, any other governmental fees and charges, and any penalties, interest, and other additions that are imposed on you relating to the payments made in accordance with these Terms.</p>

                    <h4 style={{color: 'white'}}>7. INTELLECTUAL PROPERTY RIGHTS</h4>
                    <p>You acknowledge and agree that we and our licensors, as applicable, are the owners of, and will retain all rights, title and interest in all Intellectual Property Rights in the Services.</p>

                    <h4 style={{color: 'white'}}>8. DATA PROTECTION AND SECURITY</h4>
                    <p>You agree that we will process your Personal Information to provide our Services in accordance with our privacy policy. You are responsible for establishing, maintaining and enforcing information security controls against the unauthorised access, destruction, loss, alteration, disclosure or misuse of Subscriber Data.</p>

                    <h4 style={{color: 'white'}}>9. WARRANTIES AND DISCLAIMER</h4>
                    <p>Your access to our Services is provided on an "as is" basis. We disclaim all other warranties (whether express, implied or statutory) and conditions, including fitness for purpose, availability, ongoing functionality, quality, accuracy, merchantability or non-infringement of our Services.</p>

                    <h4 style={{color: 'white'}}>10. LIMITATION OF LIABILITY</h4>
                    <p>To the fullest extent permitted by applicable law, neither party will be liable to the other party for any special, indirect or consequential loss.</p>

                    <h4 style={{color: 'white'}}>11. INDEMNITY</h4>
                    <p>You will indemnify us against any loss, damage, liability, charge, expense, outgoing or cost of any nature or kind, howsoever arising, whether present, unascertained, immediate, future or contingent arising out of or in connection with any claim arising from your use of our Services.</p>

                    <h4 style={{color: 'white'}}>12. TERMINATION AND SUSPENSION</h4>
                    <p>We may, with or without notice to you and at our discretion, limit or suspend your right to access or use our Services if we reasonably believe you are not complying with the Terms.</p>

                    <h4 style={{color: 'white'}}>13. GENERAL</h4>
                    <p>These Terms are governed by and must be construed in accordance with the laws in force in Queensland. The Terms contains the entire agreement between the parties concerning the subject matter of the agreement.</p>

                    <h4 style={{color: 'white'}}>14. CHANGES TO THESE TERMS</h4>
                    <p>We may, from time to time amend these Terms. We will endeavour to provide you with prior written notice on our Website of any such amendments.</p>

                    <h4 style={{color: 'white'}}>15. DEFINITIONS AND INTERPRETATION</h4>
                    <p>"Breach" refers to a data exposure incident. "User" refers to the individual accessing the site. "API" means the application programming interface.</p>

                    <h4 style={{color: 'white'}}>16. OUR CONTACT DETAILS</h4>
                    <p>Contact us at support@cyberguard.example.com.</p>
                </div>
            </div>
        )}

        {activeTab === 'privacy' && (
            <div className="glass-panel" style={{maxWidth: '900px', margin: '0 auto', textAlign: 'left', padding: '40px'}}>
                <h2 style={{fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '2.5rem', marginBottom: '20px'}}>Privacy Policy</h2>
                <div style={{color: '#ccc', lineHeight: '1.8', height: '600px', overflowY: 'scroll', paddingRight: '15px'}}>
                    <p><strong>About us and what we do</strong></p>
                    <p>CyberGuard AI is owned and operated by Superlative Enterprises Pty Ltd. This policy explains what limited personal information we collect when you use the CyberGuard website, the personal information we collect to provide our services and how we handle and protect your personal information.</p>
                    
                    <p><strong>What kinds of personal information do we collect and hold and why?</strong></p>
                    <p>To provide our services we receive and collect information sets online by various methods which may include personal information which has or may have been the subject of a current or historical data breach or leak. We process these data sets to verify the legitimacy of breach and to identify new breached passwords.</p>
                    <p>We do not collect or store your personal information when you conduct a search in the CyberGuard database. Searching for an email address or phone number only ever retrieves the data from storage then returns it in the response. The data result the search is not explicitly stored anywhere.</p>

                    <p><strong>Other Information</strong></p>
                    <p>The Compromised Passwords feature searches compromised passwords from data leaks for the presence of a user-provided password. The password is hashed client-side with the SHA-1 algorithm then only the first 5 characters of the hash are sent to CyberGuard following the k-anonymity implementation. CyberGuard never receives the original password nor enough information to discover the original password.</p>

                    <p><strong>Logging and Cookies</strong></p>
                    <p>We collect and hold only the bare minimum logging information required to keep the service operational and combat malicious activity. We use cookies to support your use of our website and improve its functionality.</p>

                    <p><strong>How do we collect, hold, use and disclose personal information?</strong></p>
                    <p>We collect personal information indirectly that may be in data sets received from a range of third party sources known and unknown and from contacts including enforcement bodies. We use and disclose the personal information we hold for the purpose of providing our services.</p>

                    <p><strong>Storage</strong></p>
                    <p>When a data breach is loaded into CyberGuard by Superlative, the email addresses are stored in the online system. Superlative securely stores the personal information we hold in a Western United States of America Microsoft Azure data centre.</p>

                    <p><strong>How do we protect your data?</strong></p>
                    <p>Security on CyberGuard is handled by a "defence in depth" approach, employing many different layers of security including HTTPS transmission, Cloudflare protection, rate limits, regular security scans, and firewalls.</p>

                    <p><strong>Access to and correction of your personal information</strong></p>
                    <p>You may access the limited information we hold about you in the CyberGuard platform in real time. We don’t have any reasonable or practicable way to search for or retrieve and give access to any other personal information involved in a verified data breach.</p>

                    <p><strong>Unsubscribing and opt-out</strong></p>
                    <p>Every breach notification email that we send contains an unsubscribe link in the footer. Superlative provides an opt-out feature for CyberGuard that, if used, removes an email address from public visibility.</p>
                </div>
            </div>
        )}

        {activeTab === 'optout' && (
            <div className="glass-panel" style={{maxWidth: '900px', margin: '0 auto', padding: '0', overflow: 'hidden'}}>
                <div style={{padding: '40px', textAlign: 'center'}}>
                    <h2 style={{fontSize: '2.5rem', fontFamily: 'Orbitron, sans-serif', margin: '0'}}>Opt-Out</h2>
                    <p style={{color: '#aaa', marginTop: '10px'}}>You can remove your email address from public search by opting out</p>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
                    <div style={{padding: '40px', textAlign: 'left'}}>
                        <h3 style={{color: 'white', fontSize: '1.5rem', marginBottom: '15px'}}>Opt Out of Public Search</h3>
                        <p style={{color: '#aaa', lineHeight: '1.6', fontSize: '0.95rem'}}>
                            Opting out provides several options to ensure your email address is no longer publicly searchable. Once you verify control of the address, you'll be presented with three different models that let you decide how your visibility is removed — both from existing data breaches and any that may affect you in the future.
                        </p>
                        <p style={{color: '#aaa', marginTop: '20px', fontSize: '0.8rem'}}>Using CyberGuard AI is subject to the <span style={{color: '#00f3ff', textDecoration: 'underline', cursor: 'pointer'}} onClick={() => setActiveTab('terms')}>terms of use</span></p>
                    </div>
                    
                    <div style={{background: 'rgba(0, 20, 40, 0.6)', padding: '40px', textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.1)'}}>
                        <h3 style={{color: 'white', fontSize: '1.3rem', marginBottom: '20px'}}>Enter your email address</h3>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                style={{
                                    flex: 1, 
                                    padding: '12px', 
                                    borderRadius: '5px', 
                                    border: 'none', 
                                    background: 'white', 
                                    color: 'black',
                                    width: '100%'
                                }}
                            />
                            <button style={{
                                background: '#0066ff', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '5px', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontSize: '0.9rem'
                            }}>opt-out</button>
                        </div>
                        <p style={{color: '#888', fontSize: '0.8rem', marginTop: '15px'}}>You will need to verify ownership of this email address</p>
                        
                        <div style={{marginTop: '25px', background: '#333', padding: '15px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px', width: 'fit-content'}}>
                            <div style={{background: '#00c853', borderRadius: '50%', padding: '2px'}}><Check size={16} color="white" strokeWidth={4}/></div>
                            <div>
                                <div style={{color: 'white', fontWeight: 'bold', fontSize: '0.9rem'}}>Success!</div>
                                <div style={{color: '#aaa', fontSize: '0.7rem'}}>CLOUDFLARE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* FOOTER SECTION */}
      <footer className="glass-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>CYBER<span>GUARD</span></h2>
            <p>Advanced breach detection powered by Gemini AI.</p>
            <p>Protecting digital identities since 2025.</p>
            <div className="status-btn">● SYSTEM ONLINE</div>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('email');}}>Check Identity</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('password');}}>Password Check</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('api');}}>API Access</a>
          </div>

          <div className="footer-section">
            <h4>Information</h4>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('privacy');}}>Privacy Policy</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('terms');}}>Terms of Use</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('about');}}>Who We Are</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('optout');}}>Opt Out</a>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter className="social-icon" size={20} /></a>
              <a href="https://github.com/babajan07" target="_blank" rel="noopener noreferrer"><Github className="social-icon" size={20} /></a>
              <a href="https://www.linkedin.com/in/baba-jan-c-04b907311/" target="_blank" rel="noopener noreferrer"><Linkedin className="social-icon" size={20} /></a>
              <a href="babajanchand777@gmail.com"><Mail className="social-icon" size={20} /></a>
            </div>
            <p style={{marginTop: '20px', fontSize: '0.8rem', color: '#666'}}>
              Version 2.0.4 (Stable)
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 CyberGuard AI Project. All rights reserved. Not affiliated with HaveIBeenPwned.
        </div>
      </footer>
    </div>
  );
}

export default App;