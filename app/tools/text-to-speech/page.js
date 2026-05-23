"use client";
import { useState, useEffect } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [logs, setLogs] = useState([]);
  
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-2), "[" + time + "] " + msg]);
  };
  
  // تحميل الأصوات المتاحة في جهاز المستخدم (هاتف أو حاسوب)
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // اختيار صوت عربي أو إنجليزي تلقائياً كخيار أول
        const defaultVoice = availableVoices.find(v => v.lang.includes("ar") || v.lang.includes("en"))?.name || "";
        setSelectedVoice(defaultVoice);
        addLog("تم تحميل محرك الأصوات بنجاح ✓");
      } else {
        addLog("تنبيه: متصفحك لا يدعم تقنية تحويل النص إلى صوت");
      }
    };
    
    loadVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);
  
  // دالة تشغيل النطق
  const handleSpeak = () => {
    if (!text.trim()) {
      addLog("خطأ: يرجى كتابة النص المراد تحويله أولاً!");
      return;
    }
    
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // إذا كان هناك نطق شغال حالياً، نقوم بإيقافه
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // تحديد الصوت المختار
      const voiceObj = voices.find((v) => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
      
      // ضبط الإعدادات الصوتية
      utterance.pitch = pitch; // حدة الصوت
      utterance.rate = rate; // سرعة النطق
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        addLog("جاري قراءة النص صوتياً حالياً...");
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        addLog("تم الانتهاء من قراءة النص بنجاح ✓");
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        addLog("حدث خطأ أثناء معالجة النطق");
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // دالة إيقاف النطق فوراً
  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      addLog("تم إيقاف القراءة الصوتية");
    }
  };
  
  return (
    <div style={{ padding: "12px", background: "rgba(17,17,34,0.2)", borderRadius: "14px", direction: "rtl", color: "#f1f5f9" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
          
          {/* قسم إدخال النص */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>✍️ النص المراد تحويله إلى صوت</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب النص هنا (يدعم العربية والإنجليزية وكل اللغات)..."
              style={{ width: "100%", minHeight: "140px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "14px", fontFamily: "inherit" }}
            />
          </section>

          {/* قسم إعدادات الصوت والتحكم */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#60a5fa" }}>🎛️ هندسة وضبط الصوت</h3>
            
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>🗣️ اختر المعلق / الصوت المتاح:</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "12px" }}
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>

            <div style={{ marginTop: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                ⏩ سرعة النطق: <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{rate}x</span>
              </label>
              <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />
            </div>

            <div style={{ marginTop: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                🎼 حدة الصوت (Pitch): <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{pitch}</span>
              </label>
              <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />
            </div>
          </section>
        </div>
        
        {/* أزرار التحكم والتشغيل */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            style={{ flex: 2, padding: "14px", background: isSpeaking ? "#1e1e2f" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: isSpeaking ? "not-allowed" : "pointer", fontSize: "14px" }}
          >
            🔊 تشغيل النطق الصوتي
          </button>
          
          <button
            onClick={handleStop}
            disabled={!isSpeaking}
            style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: !isSpeaking ? "not-allowed" : "pointer", fontSize: "14px" }}
          >
            🛑 إيقاف
          </button>
        </div>
      </div>

      {/* شاشة السجلات الصغير (Logs) */}
      <footer style={{ marginTop: "16px", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>
    </div>
  );
}