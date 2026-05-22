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
      addLog("خطأ في الرفع، المتابعة بالمعاينة المحلية");    }
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
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ai-creator-" + Date.now() + ".png";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("بدأ تحميل الصورة...");
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
          <a href={imageUrl || "#"} onClick={handleDownload} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "12px", textAlign: "center", background: imageUrl ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#334155", color: "#fff", textDecoration: "none", borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: imageUrl ? "pointer" : "not-allowed", opacity: imageUrl ? 1 : 0.6, transition: "all 0.2s" }}>
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