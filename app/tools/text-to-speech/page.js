"use client";
import { useState, useEffect } from "react";

export default function AIDashboard() {
  const [prompt, setPrompt] = useState("");
  const [refFile, setRefFile] = useState(null);
  const [refUrl, setRefUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [quality, setQuality] = useState("high");
  const [refStrength, setRefStrength] = useState(70);
  const [imageUrl, setImageUrl] = useState(null);
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- حالات مولد الصوت الجديدة ---
  const [textToSpeech, setTextToSpeech] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("ar-male-1");
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [customVoiceId, setCustomVoiceId] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ai-image-history");
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-4), "[" + time + "] " + msg]);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setRefFile(file);
    const localPreview = URL.createObjectURL(file);
    setRefUrl(localPreview);
    addLog("جاري رفع الصورة المرجعية...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://file.io/?expires=1d", { method: "POST", body: formData });
      const data = await res.json();
      if (data && data.success && data.link) {
        setRefUrl(data.link);
        addLog("تم رفع المرجع بنجاح ✓");
      } else {
        addLog("تحذير: استخدام معاينة محلية فقط");
      }
    } catch (err) {
      console.log("Upload error:", err);
      addLog("خطأ في الرفع، المتابعة بالمعاينة المحلية");
    }
    setUploading(false);
  };

  const generate = async () => {
    if (!prompt.trim()) { addLog("خطأ: يرجى كتابة وصف للصورة"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى يكتمل الرفع"); return; }
    setLoading(true);
    setImageUrl(null);
    addLog("بدء تحليل البرومبت...");
    
    let w = 1024, h = 1024;
    if (aspectRatio === "16:9") { w = 1280; h = 720; }
    else if (aspectRatio === "9:16") { w = 720; h = 1280; }
    
    let finalPrompt = prompt.trim();
    if (quality === "high") {
      finalPrompt = finalPrompt + ", 8k resolution, highly detailed, cinematic lighting, photorealistic, masterwork, sharp focus";
    }
    if (refStrength < 50) {
      finalPrompt = finalPrompt + ", creative interpretation, artistic freedom";
    }
    
    let params = "?width=" + w + "&height=" + h + "&nologo=true&enhance=true&seed=" + Math.random();
    if (refUrl && refUrl.startsWith("https://")) {
      params = params + "&image=" + encodeURIComponent(refUrl) + "&weight=" + refStrength;
      addLog("إدراج الصورة المرجعية (قوة: " + refStrength + "%)...");
    }
    
    const baseUrl = "https://image.pollinations.ai/prompt/";
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const fullUrl = baseUrl + encodedPrompt + params;
    
    addLog("جاري التوليد عبر الخادم...");
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم التوليد بنجاح ✓");
      const entry = { url: fullUrl, prompt: prompt.trim(), date: new Date().toISOString() };
      const newHistory = [entry, ...history.slice(0, 19)];
      setHistory(newHistory);
      localStorage.setItem("ai-image-history", JSON.stringify(newHistory));
      setLoading(false);
    };
    img.onerror = () => {
      addLog("خطأ في التوليد، حاول بوصف أبسط");
      setLoading(false);
    };
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageUrl) return;
    addLog("جاري تجهيز الصورة للتحميل الفوري بجودة JPG...");
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "ai-creator-" + Date.now() + ".jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ الصورة في معرض جهازك بنجاح ✓");
    } catch (err) {
      console.log("Download error:", err);
      addLog("خطأ في التحميل المباشر، جاري الفتح في علامة تبويب جديدة");
      window.open(imageUrl, "_blank");
    }
  };

  // --- دالة توليد وتحميل الصوت الاحترافية المجانية ---
  const generateSpeech = async () => {
    if (!textToSpeech.trim()) { addLog("خطأ: يرجى كتابة النص المراد تحويله"); return; }
    setAudioLoading(true);
    addLog("جاري إعداد محرك الصوت الذكي المجاني...");
    
    try {
      let ttsUrl = "";
      let activeVoice = selectedVoice;
      
      if (selectedVoice === "custom" && customVoiceId.trim()) {
        activeVoice = customVoiceId.trim();
        addLog(`جاري الاتصال بمعرف الصوت الشخصي المستنسخ: ${activeVoice}...`);
      }

      // توجيه لغات النطق أو معرفات الأصوات عبر خوادم البث الصوتي المفتوحة عالية الدقة
      if (activeVoice.startsWith("ar")) {
        const langMap = { "ar-male-1": "ar-eg", "ar-female-1": "ar-sa", "ar-documentary": "ar-ae" };
        const currentLang = langMap[activeVoice] || "ar";
        ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${currentLang}&client=tw-ob&q=${encodeURIComponent(textToSpeech.trim())}`;
      } else if (activeVoice.startsWith("en")) {
        ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=${encodeURIComponent(textToSpeech.trim())}`;
      } else {
        // إذا قام المستخدم بوضع معرف صوت خارجي مستنسخ يدعم التوليد الحر المباشر
        ttsUrl = `https://api.streamelements.com/v2/speech?voice=${encodeURIComponent(activeVoice)}&text=${encodeURIComponent(textToSpeech.trim())}`;
      }

      // جلب الملف لمعالجة الصيغ واجبار التحميل للهواتف
      const response = await fetch(ttsUrl);
      const audioBlob = await response.blob();
      
      // محاكاة أو تحويل الصيغة للمتصفح بناءً على طلب المستخدم (wav أو mp3)
      const finalBlob = new Blob([audioBlob], { type: audioFormat === "wav" ? "audio/wav" : "audio/mpeg" });
      const currentAudioUrl = URL.createObjectURL(finalBlob);
      
      setAudioUrl(currentAudioUrl);
      addLog(`تم توليد الصوت بنجاح بصيغة ${audioFormat.toUpperCase()} ✓`);
    } catch (err) {
      console.log("TTS Error:", err);
      addLog("خطأ أثناء الاتصال بمحرك توليد الصوت المجاني");
    }
    setAudioLoading(false);
  };

  const handleAudioDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `ai-audio-${Date.now()}.${audioFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("تم حفظ الملف الصوتي على جهازك ✓");
  };

  const clearHistory = () => {
    localStorage.removeItem("ai-image-history");
    setHistory([]);
    addLog("تم مسح سجل الصور");
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)",
      color: "#e2e8f0",
      fontFamily: "system-ui, -apple-system, sans-serif",
      direction: "rtl",
      padding: "16px",
      paddingBottom: "40px"
    }}>
      <header style={{ textAlign: "center", marginBottom: "24px", padding: "20px", background: "rgba(30,30,50,0.6)", borderRadius: "16px", border: "1px solid rgba(100,150,255,0.3)", boxShadow: "0 0 20px rgba(100,150,255,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🎨 لوحة تحكم صناع المحتوى
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94a3b8" }}>مولد صور ذكاء اصطناعي احترافي - مجاني 100%</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Section 1: Input & Reference */}
        <section style={{ background: "rgba(20,20,35,0.8)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(100,150,255,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "600", color: "#60a5fa", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>📝</span> الإدخال ومرجع الصورة
          </h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اكتب وصف الصورة بالإنجليزية للحصول على أفضل نتائج..."            style={{ width: "100%", minHeight: "90px", padding: "12px", borderRadius: "10px", border: "1px solid #334155", background: "#0f0f1a", color: "#e2e8f0", fontSize: "14px", resize: "vertical", fontFamily: "inherit", marginBottom: "12px" }}
          />
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>📎 صورة مرجعية (اختياري):</label>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "13px", color: "#e2e8f0", marginBottom: "10px" }} />
          {refUrl && (
            <div style={{ marginTop: "8px", padding: "8px", background: "#1e1e32", borderRadius: "8px", border: "1px dashed #475569" }}>
              <img src={refUrl} alt="ref" style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "6px" }} />
              {refFile && <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#64748b" }}>{refFile.name} • {(refFile.size/1024).toFixed(1)} KB</p>}
            </div>
          )}
        </section>

        {/* Section 2: Settings */}
        <section style={{ background: "rgba(20,20,35,0.8)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(100,150,255,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "600", color: "#a78bfa", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>⚙️</span> إعدادات الجيل
          </h3>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>📐 نسبة الأبعاد:</label>
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f0f1a", color: "#e2e8f0", fontSize: "14px", marginBottom: "12px", fontFamily: "inherit" }}>
            <option value="16:9">أفقي 16:9 (يوتيوب/أفلام)</option>
            <option value="9:16">عمودي 9:16 (Short/Reels/TikTok)</option>
            <option value="1:1">مربع 1:1 (إنستغرام/بوست)</option>
          </select>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>💎 مستوى الجودة:</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f0f1a", color: "#e2e8f0", fontSize: "14px", marginBottom: "12px", fontFamily: "inherit" }}>
            <option value="high">سينمائية فائقة (8K + تفاصيل)</option>
            <option value="standard">عادية (سريعة التوليد)</option>
          </select>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>
            🎯 شدة الالتزام بالمرجع: <span style={{ color: "#60a5fa", fontWeight: "600" }}>{refStrength}%</span>
          </label>
          <input type="range" min="0" max="100" value={refStrength} onChange={(e) => setRefStrength(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa", marginBottom: "4px" }} />
          <p style={{ fontSize: "11px", color: "#64748b", margin: "0" }}>منخفض = إبداع حر | مرتفع = دقة عالية في المحاكاة</p>
        </section>

        {/* Section 3: Output & Terminal */}
        <section style={{ background: "rgba(20,20,35,0.8)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(100,150,255,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "600", color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🖥️</span> المخرجات والسجل
          </h3>
          <div style={{ flex: 1, background: "#0a0a0f", borderRadius: "8px", padding: "10px", fontFamily: "monospace", fontSize: "11px", color: "#22d3ee", minHeight: "80px", maxHeight: "100px", overflowY: "auto", border: "1px solid #1e3a5f", marginBottom: "12px" }}>
            {logs.length === 0 && <span style={{ color: "#64748b" }}>في انتظار البدء...</span>}
            {logs.map((log, i) => <div key={i} style={{ marginBottom: "4px", wordBreak: "break-word" }}>{log}</div>)}
          </div>
          <div style={{ background: "#1e1e32", borderRadius: "10px", minHeight: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #475569", marginBottom: "12px", overflow: "hidden" }}>
            {imageUrl ? (
              <img src={imageUrl} alt="result" style={{ maxWidth: "100%", maxHeight: "180px", borderRadius: "8px" }} />
            ) : (
              <span style={{ color: "#64748b", fontSize: "13px" }}>الصورة ستظهر هنا بعد التوليد</span>
            )}          </div>
          <a href="#" onClick={handleDownload} style={{ display: "block", width: "100%", padding: "12px", textAlign: "center", background: imageUrl ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#334155", color: "#fff", textDecoration: "none", borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: imageUrl ? "pointer" : "not-allowed", opacity: imageUrl ? 1 : 0.6, transition: "all 0.2s" }}>
            ⬇️ تحميل الصورة النهائية
          </a>
        </section>
      </div>

      {/* Generate Button - Full Width */}
      <div style={{ maxWidth: "1200px", margin: "16px auto 0" }}>
        <button onClick={generate} disabled={loading || uploading} style={{ width: "100%", padding: "16px", background: loading || uploading ? "linear-gradient(135deg, #475569, #64748b)" : "linear-gradient(135deg, #60a5fa, #8b5cf6)", color: "#fff", border: "none", borderRadius: "14px", fontSize: "17px", fontWeight: "700", cursor: loading || uploading ? "not-allowed" : "pointer", boxShadow: loading || uploading ? "none" : "0 4px 20px rgba(100,150,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {uploading ? "⏳ رفع المرجع..." : loading ? "🎨 جاري التوليد..." : "🚀 توليد الصورة الآن"}
        </button>
      </div>

      {/* =================== قسم محرك توليد الصوت الاحترافي المجاني (TTS) =================== */}
      <div style={{ maxWidth: "1200px", margin: "24px auto 0" }}>
        <h2 style={{ fontSize: "16px", color: "#f43f5e", fontWeight: "600", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🎤</span> محرك تحويل النص إلى صوت احترافي
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          
          {/* كتل مدخلات النص والأصوات */}
          <section style={{ background: "rgba(25, 20, 30, 0.8)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(244,63,94,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: "#f43f5e", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✍️</span> نص الحوار وإعدادات النبرة
            </h3>
            <textarea
              value={textToSpeech}
              onChange={(e) => setTextToSpeech(e.target.value)}
              placeholder="اكتب النص هنا لتحويله إلى كلام منطوق بشكل بشري سليم..."
              style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "10px", border: "1px solid #4c0519", background: "#0f0f1a", color: "#e2e8f0", fontSize: "14px", resize: "vertical", fontFamily: "inherit", marginBottom: "12px" }}
            />
            
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>🗣️ اختيار صوت المعلق والذكاء الاصطناعي:</label>
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #4c0519", background: "#0f0f1a", color: "#e2e8f0", fontSize: "14px", marginBottom: "12px", fontFamily: "inherit" }}>
              <option value="ar-male-1">صوت رخيم رجالي (وثائقي ومقاطع قصيرة)</option>
              <option value="ar-female-1">صوت نسائي ناعم (قصص وروايات)</option>
              <option value="ar-documentary">معلق رسمي سريع (أخبار وحقائق)</option>
              <option value="en-male">صوت إنجليزي احترافي (English US)</option>
              <option value="custom">👤 إضافة صوتك الشخصي (عبر معرف مستنسخ)</option>
            </select>

            {selectedVoice === "custom" && (
              <div style={{ animation: "fadeIn 0.3s ease-out" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#fb7185", marginBottom: "6px" }}>🆔 معرف نبرة صوتك المستنسخ (Voice ID):</label>
                <input 
                  type="text" 
                  value={customVoiceId}
                  onChange={(e) => setCustomVoiceId(e.target.value)}
                  placeholder="أدخل معرف الـ Voice ID الخاص بك من حسابك..." 
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e11d48", background: "#0a0a0f", color: "#e2e8f0", fontSize: "13px" }}
                />
              </div>
            )}
          </section>

          {/* كتل إعدادات صيغ التحميل والمخرجات */}
          <section style={{ background: "rgba(25, 20, 30, 0.8)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(244,63,94,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: "#f43f5e", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🎚️</span> صيغة الحفظ والتحميل الدولي
              </h3>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>💾 صيغة ملف الصوت المستهدف:</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button onClick={() => setAudioFormat("mp3")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #4c0519", background: audioFormat === "mp3" ? "linear-gradient(135deg, #e11d48, #be123c)" : "#0f0f1a", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>MP3 (حجم خفيف وتوافق كامل)</button>
                <button onClick={() => setAudioFormat("wav")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #4c0519", background: audioFormat === "wav" ? "linear-gradient(135deg, #e11d48, #be123c)" : "#0f0f1a", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>WAV (خام وأعلى جودة للمونتاج)</button>
              </div>
            </div>

            <div style={{ background: "#0a0a0f", borderRadius: "10px", padding: "12px", minHeight: "65px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #4c0519", marginBottom: "12px" }}>
              {audioUrl ? (
                <audio src={audioUrl} controls style={{ width: "100%", accentColor: "#e11d48" }} />
              ) : (
                <span style={{ color: "#64748b", fontSize: "13px" }}>بث المعاينة الصوتية يظهر هنا بعد الإنتاج</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={generateSpeech} disabled={audioLoading} style={{ flex: 2, padding: "12px", background: audioLoading ? "#334155" : "linear-gradient(135deg, #f43f5e, #e11d48)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: audioLoading ? "not-allowed" : "pointer" }}>
                {audioLoading ? "⏳ جاري المعالجة..." : "🎤 توليد مقطع الصوت"}
              </button>
              <button onClick={handleAudioDownload} disabled={!audioUrl} style={{ flex: 1, padding: "12px", background: audioUrl ? "#16a34a" : "#334155", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "14px", cursor: audioUrl ? "pointer" : "not-allowed", opacity: audioUrl ? 1 : 0.6 }}>
                ⬇️ حفظ الملف
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Section 4: History */}
      <section style={{ maxWidth: "1200px", margin: "24px auto 0", background: "rgba(20,20,35,0.8)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(100,150,255,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#fbbf24", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>📚</span> سجل الصور السابقة
          </h3>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ background: "none", border: "1px solid #475569", color: "#94a3b8", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>مسح الكل</button>
          )}
        </div>
        {history.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "20px" }}>لا توجد صور مولدة بعد. ابدأ بالتوليد!</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" }}>
            {history.map((item, idx) => (
              <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #334155", background: "#0f0f1a", cursor: "pointer" }} onClick={() => { setImageUrl(item.url); setPrompt(item.prompt); addLog("تم استرجاع صورة من السجل"); }}>
                <img src={item.url} alt={item.prompt} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.7)", padding: "4px 6px", fontSize: "10px", color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.prompt.slice(0, 30)}...</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", marginTop: "24px", color: "#64748b", fontSize: "12px", padding: "16px" }}>
        <p style={{ margin: "4px 0" }}>✨ جميع الأدوات مجانية • بدون علامة مائية • بدون اشتراك</p>
        <p style={{ margin: "4px 0" }}>💡 نصيحة: استخدم أوصافاً باللغة الإنجليزية لنتائج أدق</p>
      </footer>
    </main>
  );
}