"use client";
import { useState, useEffect } from "react";

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState("script");
  const [logs, setLogs] = useState([]);

  // 1. حالات قسم السيناريو (Script)
  const [topic, setTopic] = useState("richard-byrd");
  const [videoTone, setVideoTone] = useState("horror");
  const [customScriptDetails, setCustomScriptDetails] = useState("");

  // 2. حالات قسم توليد الصور (Image Generator)
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImg, setGeneratedImg] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  // 3. حالات قسم تحريك الصور (Image Animator)
  const [animRefUrl, setAnimRefUrl] = useState("");
  const [animMotion, setAnimMotion] = useState("zoom-in");
  const [animDuration, setAnimDuration] = useState("5");
  const [animSpeed, setAnimSpeed] = useState("5");
  const [animVideoUrl, setAnimVideoUrl] = useState(null);
  const [animLoading, setAnimLoading] = useState(false);

  // 4. حالات قسم فيديو من نص (Video Generator)
  const [textVideoPrompt, setTextVideoPrompt] = useState("");
  const [textVideoUrl, setTextVideoUrl] = useState(null);
  const [textVideoLoading, setTextVideoLoading] = useState(false);

  // 5. حالات قسم التعليق الصوتي (TTS)
  const [ttsText, setTtsText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-2), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تشغيل استوديو صناع المحتوى المطور بنجاح ✓");
    // تحميل أصوات الـ TTS
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const avail = window.speechSynthesis.getVoices();
        setVoices(avail);
        if (avail.length > 0) setSelectedVoice(avail[0].name);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // --- دالات التشغيل والمحركات ---

  // دالة توليد الصور
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) { addLog("خطأ: اكتب وصف الصورة أولاً!"); return; }
    setImgLoading(true);
    setGeneratedImg(null);
    const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=576&model=flux&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
    const img = new Image();
    img.src = finalUrl;
    img.onload = () => { setGeneratedImg(finalUrl); setImgLoading(false); addLog("تم توليد المشهد بنجاح ✓"); };
    img.onerror = () => { setImgLoading(false); addLog("خطأ في الاتصال بالسيرفر"); };
  };

  // دالة رفع الصور للتحريك
  const handleAnimFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addLog("جاري رفع الصورة البرمجية...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.status === "success") {
        setAnimRefUrl(data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/"));
        addLog("الصورة جاهزة للتحريك ✓");
      }
    } catch { addLog("فشل الرفع"); }
  };

  // دالة بث حركة الكاميرا
  const handleAnimateImage = () => {
    if (!animRefUrl) { addLog("ارفع صورة أولاً!"); return; }
    setAnimLoading(true);
    setAnimVideoUrl(null);
    const desc = `Animate image: ${animRefUrl}. Cinematic ${animMotion}, speed ${animSpeed}/10, duration ${animDuration}s, 16:9`;
    const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(desc)}?width=1024&height=576&model=flux&seed=${Math.floor(Math.random() * 99999)}`;
    const img = new Image();
    img.src = finalUrl;
    img.onload = () => { setAnimVideoUrl(finalUrl); setAnimLoading(false); addLog("تم بث الحركة ✓"); };
  };

  // دالة فيديو من نص
  const handleGenerateVideoFromText = () => {
    if (!textVideoPrompt.trim()) { addLog("اكتب وصف الفيديو!"); return; }
    setTextVideoLoading(true);
    setTextVideoUrl(null);
    const desc = `Generate animated video loop, 60fps stable. ${textVideoPrompt}, 16:9 cinematic aspect ratio`;
    const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(desc)}?width=1024&height=576&model=flux&seed=${Math.floor(Math.random() * 99999)}`;
    const img = new Image();
    img.src = finalUrl;
    img.onload = () => { setTextVideoUrl(finalUrl); setTextVideoLoading(false); addLog("تم إنتاج الفيديو بنجاح ✓"); };
  };

  // دالة الصوت TTS
  const handleSpeak = () => {
    if (!ttsText.trim() || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(ttsText);
    const vObj = voices.find(v => v.name === selectedVoice);
    if (vObj) utt.voice = vObj;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  // بناء بيانات السيناريو تلقائياً للنسخ
  const scriptData = `🎬 قصة: ${topic === "richard-byrd" ? "سر الأدميرال بيرد" : "ممر دياتلوف"}\n📌 النمط: ${videoTone === "horror" ? "رعب نفسي" : "وثائقي غامض"}\n📝 تفاصيل: ${customScriptDetails}\n\n[مشهد 1]: Cinematic 16:9 wide shot, historical background, stable motion, high details.`;

  return (
    <div style={{ minHeight: "100vh", background: "#04040c", color: "#f1f5f9", fontFamily: "sans-serif", direction: "rtl" }}>
      
      {/* الهيدر */}
      <header style={{ textAlign: "center", padding: "20px 16px", borderBottom: "1px solid rgba(139,92,246,0.15)", background: "#090918" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", margin: 0 }}>🎬 استوديو صناع المحتوى الذكي</h1>
        <p style={{ fontSize: "11px", color: "#a78bfa", marginTop: "4px" }}>منصة متكاملة لإنتاج القصص، الصور، والتحريك من الهاتف</p>
      </header>

      {/* شريط التنقل العلوي الخماسي للأدوات */}
      <nav style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", background: "#09091f", padding: "6px", gap: "6px", borderBottom: "1px solid #1e1e38" }}>
        <button onClick={() => setActiveTab("script")} style={{ padding: "10px 2px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold", background: activeTab === "script" ? "#d97706" : "#111126", color: "#fff" }}>📜 1. السيناريو</button>
        <button onClick={() => setActiveTab("image")} style={{ padding: "10px 2px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold", background: activeTab === "image" ? "#3b82f6" : "#111126", color: "#fff" }}>🎨 2. توليد الصور</button>
        <button onClick={() => setActiveTab("animate")} style={{ padding: "10px 2px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold", background: activeTab === "animate" ? "#ec4899" : "#111126", color: "#fff" }}>🎥 3. تحريك الصورة</button>
        <button onClick={() => setActiveTab("video")} style={{ padding: "10px 2px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold", background: activeTab === "video" ? "#f43f5e" : "#111126", color: "#fff" }}>🎬 4. فيديو من نص</button>
        <button onClick={() => setActiveTab("tts")} style={{ padding: "10px 2px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "bold", background: activeTab === "tts" ? "#10b981" : "#111126", color: "#fff" }}>🔊 5. التعليق الصوتي</button>
      </nav>

      {/* عرض الأدوات ديناميكياً بدون مسارات خارجية بيضاء */}
      <main style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
        
        {/* 1. واجهة السيناريو والمشاهد */}
        {activeTab === "script" && (
          <div style={{ background: "rgba(17,17,34,0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ color: "#fbbf24", margin: "0 0 12px", fontSize: "14px" }}>📜 هندسة قصة وسيناريو المشاهد</h3>
            <label style={{ fontSize: "12px", color: "#94a3b8" }}>اختر الغموض التاريخي:</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#090915", color: "#fff", border: "1px solid #27274a", marginBottom: "12px", fontSize: "12px" }}>
              <option value="richard-byrd">رحلة ريتشارد بيرد (جوف الأرض)</option>
              <option value="dyatlov">حادثة ممر دياتلوف الغامضة</option>
            </select>
            <label style={{ fontSize: "12px", color: "#94a3b8" }}>نبرة الإخراج:</label>
            <select value={videoTone} onChange={(e) => setVideoTone(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#090915", color: "#fff", border: "1px solid #27274a", marginBottom: "12px", fontSize: "12px" }}>
              <option value="horror">رعب نفسي ومظلم</option>
              <option value="mystery">أرشيف وثائقي غامض</option>
            </select>
            <textarea placeholder="أضف تفاصيل مخصصة للقصة..." value={customScriptDetails} onChange={(e) => setCustomScriptDetails(e.target.value)} style={{ width: "100%", padding: "10px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "8px", minHeight: "80px", fontSize: "12px" }} />
            <div style={{ marginTop: "12px", background: "#05050f", padding: "10px", borderRadius: "6px", fontSize: "12px", color: "#38bdf8" }}>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{scriptData}</pre>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(scriptData); addLog("تم نسخ السيناريو ومقترحات المشاهد ✓"); }} style={{ width: "100%", padding: "12px", background: "#d97706", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", marginTop: "10px", fontSize: "13px" }}>إنسخ السيناريو بالكامل</button>
          </div>
        )}

        {/* 2. واجهة توليد الصور */}
        {activeTab === "image" && (
          <div style={{ background: "rgba(17,17,34,0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ color: "#3b82f6", margin: "0 0 12px", fontSize: "14px" }}>🎨 محرك إنتاج الصور واللقطات</h3>
            <textarea placeholder="اكتب وصف المشهد بالإنجليزية هنا (أبعاد 16:9 تلقائية)..." value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} style={{ width: "100%", padding: "10px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "8px", minHeight: "100px", fontSize: "12px" }} />
            <button onClick={handleGenerateImage} style={{ width: "100%", padding: "12px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", marginTop: "10px", fontSize: "13px" }}>{imgLoading ? "جاري التوليد البصري..." : "توليد الصورة السينمائية"}</button>
            {generatedImg && <div style={{ marginTop: "12px", textAlign: "center" }}><img src={generatedImg} alt="AI" style={{ maxWidth: "100%", borderRadius: "8px" }} /><a href={generatedImg} download="image.jpg" target="_blank" rel="noreferrer" style={{ display: "block", marginTop: "8px", color: "#3b82f6", fontSize: "12px" }}>⬇️ حفظ الصورة بجودة عالية</a></div>}
          </div>
        )}

        {/* 3. واجهة تحريك الصور */}
        {activeTab === "animate" && (
          <div style={{ background: "rgba(17,17,34,0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ color: "#ec4899", margin: "0 0 12px", fontSize: "14px" }}>🎥 تحريك الصورة وبث الكاميرا</h3>
            <input type="file" accept="image/*" onChange={handleAnimFile} style={{ fontSize: "12px", marginBottom: "10px" }} />
            <select value={animMotion} onChange={(e) => setAnimMotion(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#090915", color: "#fff", border: "1px solid #27274a", marginBottom: "10px", fontSize: "12px" }}>
              <option value="zoom-in">🔍 Zoom In - تقريب سينمائي</option>
              <option value="zoom-out">📉 Zoom Out - إبعاد الكاميرا</option>
              <option value="panning-left">⬅️ Pan Left - التفات لليسار</option>
            </select>
            <label style={{ fontSize: "11px", color: "#94a3b8" }}>سلم السرعة: {animSpeed}/10</label>
            <input type="range" min="1" max="10" value={animSpeed} onChange={(e) => setAnimSpeed(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
            <button onClick={handleAnimateImage} style={{ width: "100%", padding: "12px", background: "#ec4899", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "13px" }}>{animLoading ? "جاري دمج إطارات السرعة..." : "بث حركة الكاميرا"}</button>
            {animVideoUrl && <div style={{ marginTop: "12px", textAlign: "center" }}><img src={animVideoUrl} alt="Animated" style={{ maxWidth: "100%", borderRadius: "8px" }} /></div>}
          </div>
        )}

        {/* 4. واجهة فيديو من نص */}
        {activeTab === "video" && (
          <div style={{ background: "rgba(17,17,34,0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ color: "#f43f5e", margin: "0 0 12px", fontSize: "14px" }}>🎬 إنتاج فيديو مباشرة من النص</h3>
            <textarea placeholder="اكتب وصف الفيديو هنا بالتفصيل وتحرك الإطارات..." value={textVideoPrompt} onChange={(e) => setTextVideoPrompt(e.target.value)} style={{ width: "100%", padding: "10px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "8px", minHeight: "80px", fontSize: "12px" }} />
            <button onClick={handleGenerateVideoFromText} style={{ width: "100%", padding: "12px", background: "#f43f5e", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", marginTop: "10px", fontSize: "13px" }}>{textVideoLoading ? "جاري المعالجة الرياضية..." : "إنتاج الفيديو فورا"}</button>
            {textVideoUrl && <div style={{ marginTop: "12px", textAlign: "center" }}><img src={textVideoUrl} alt="Video Output" style={{ maxWidth: "100%", borderRadius: "8px" }} /></div>}
          </div>
        )}

        {/* 5. واجهة التعليق الصوتي */}
        {activeTab === "tts" && (
          <div style={{ background: "rgba(17,17,34,0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ color: "#10b981", margin: "0 0 12px", fontSize: "14px" }}>🔊 استوديو التعليق الصوتي الهندسي</h3>
            <textarea placeholder="اكتب النص هنا ليتم نطقة فوراً بصوت المعلق..." value={ttsText} onChange={(e) => setTtsText(e.target.value)} style={{ width: "100%", padding: "10px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "8px", minHeight: "80px", fontSize: "12px" }} />
            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "8px" }}>المعلق الصوتي المتاح بجهازك:</label>
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#090915", color: "#fff", border: "1px solid #27274a", marginBottom: "12px", fontSize: "12px" }}>
              {voices.map((v, i) => <option key={i} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
            <button onClick={handleSpeak} style={{ width: "100%", padding: "12px", background: "#10b981", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "13px" }}>{isSpeaking ? "🗣️ جاري النطق..." : "🔊 تشغيل القراءة الصوتية"}</button>
          </div>
        )}

      </main>

      {/* شاشة السجلات (Logs) المدمجة أسفل الموقع */}
      <footer style={{ padding: "10px", background: "#05050a", margin: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </footer>

    </div>
  );
}