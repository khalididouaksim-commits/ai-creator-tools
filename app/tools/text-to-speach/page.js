"use client";
import { useState, useEffect } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => { window.speechSynthesis.cancel(); };
  }, []);
  
  const speak = () => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) utterance.voice = voices[selectedVoiceIndex];
    utterance.lang = voices[selectedVoiceIndex]?.lang || "ar-SA";
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };
  
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };
  
  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>🔊 تحويل النص إلى كلام</h2>
      <textarea
        placeholder="اكتب النص هنا..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "10px", minHeight: "120px", fontFamily: "inherit", resize: "vertical" }}
      />
      <select
        value={selectedVoiceIndex}
        onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "15px", fontFamily: "inherit", backgroundColor: "#fff" }}
      >
        {voices.length === 0 ? <option>جاري تحميل الأصوات...</option> :
          voices.map((v, i) => (
            <option key={i} value={i}>{v.name} ({v.lang})</option>
          ))
        }
      </select>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={speak} disabled={isPlaying || !text} style={{ flex: 1, padding: "12px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontFamily: "inherit", opacity: (isPlaying || !text) ? 0.6 : 1 }}>
          ▶️ تشغيل
        </button>
        <button onClick={stop} disabled={!isPlaying} style={{ flex: 1, padding: "12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontFamily: "inherit", opacity: !isPlaying ? 0.6 : 1 }}>
          ⏹️ إيقاف
        </button>
      </div>
      <p style={{ marginTop: "15px", fontSize: "13px", color: "#666", textAlign: "center" }}>
        💡 ملاحظة: المتصفح لا يسمح بتحميل الصوت مباشرة لأسباب أمنية. يمكنك استخدام مسجل شاشة/صوت خارجي لحفظ المخرجات كـ MP3.
      </p>
    </main>
  );
}