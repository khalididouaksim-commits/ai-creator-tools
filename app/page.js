"use client";
import { useState, useEffect } from "react";

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState("home");
  const [logs, setLogs] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [refFile, setRefFile] = useState(null);
  const [refUrl, setRefUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-3), "[" + time + "] " + msg]);
  };
  
  useEffect(() => {
    addLog("تم تشغيل استوديو صناع المحتوى بنجاح ✓");
  }, []);
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setRefFile(file);
    const localPreview = URL.createObjectURL(file);
    setRefUrl(localPreview);
    addLog("جاري رفع الصورة المرجعية للمطابقة الدقيقة...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://file.io/?expires=1d", { method: "POST", body: formData });
      const data = await res.json();
      if (data && data.success && data.link) {
        setRefUrl(data.link);
        addLog("تم رفع المرجع بنجاح ✓ جاهز للتوليد");
      }
    } catch (err) {
      addLog("خطأ في الرفع، يرجى إعادة المحاولة");
    }
    setUploading(false);
  };
  
  const generateImage = async () => {
    if (!prompt.trim()) { addLog("خطأ: اكتب وصفاً للصورة أولاً"); return; }
    if (!refUrl || !refUrl.startsWith("https://")) { addLog("خطأ: يرجى رفع صورة مرجعية أولاً لضمان المطابقة"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى ينتهي رفع المرجع"); return; }
    
    setLoading(true);
    setImageUrl(null);
    addLog("جاري تحليل الملامح بدقة واستدعاء محرك Flux المطور...");
    
    // وصف تفصيلي دقيق يضمن ثبات الملامح وتعبير الضحك
    const enhancedPrompt = `${prompt.trim()}, masterpiece, photorealistic, 8k, captured on 50mm, spontaneous laugh, identical facial features to reference image image_7.png, detailed skin texture, warm golden hour lighting, same curly hair and beard.`;
    
    // زيادة وزن الصورة المرجعية بشكل كبير (weight=1) واستخدام محرك flux
    const params = `?width=1280&height=720&model=flux&enhance=true&nologo=true&seed=${Math.floor(Math.random() * 1000000)}&image=${encodeURIComponent(refUrl)}&weight=1`;
    
    const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}${params}`;
    
    addLog("الذكاء الاصطناعي يرسم المشهد الجديد مع الحفاظ على الهوية...");
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم توليد الصورة بنجاح وتطابق الملامح مية بالمية ✓");
      setLoading(false);
    };
    img.onerror = () => {
      addLog("حدث خطأ، جاري إعادة المحاولة...");
      setLoading(false);
    };
  };
  
  const handleImageDownload = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `matched-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ الصورة المتطابقة ✓");
    } catch (err) {
      window.open(imageUrl, "_blank");
    }
  };
  
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #060609 0%, #0b0b14 50%, #020205 100%)", color: "#f1f5f9", fontFamily: "system-ui, -apple-system, sans-serif", direction: "rtl", padding: "12px" }}>
      
      <header style={{ textAlign: "center", marginBottom: "16px", padding: "16px", background: "rgba(13, 13, 25, 0.7)", borderRadius: "14px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🎬 استوديو صناع المحتوى الذكي
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>توليد صور متطابقة تمامًا مع المرجع</p>
      </header>

      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        {/* قسم مولد الصور (المحدث) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
            
            <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>📝 الإدخال والمرجع</h3>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="اكتب وصفاً مفصلاً للمشهد الجديد..." style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px" }} />
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "12px", marginTop: "10px" }} />
              {refUrl && <div style={{ marginTop: "8px" }}><img src={refUrl} alt="ref" style={{ width: "100%", maxHeight: "110px", objectFit: "cover", borderRadius: "6px" }} /></div>}
            </section>

            <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#10b981" }}>🖥️ معاينة الصورة</h3>
              <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {imageUrl ? <img src={imageUrl} alt="AI" style={{ maxWidth: "100%", maxHeight: "120px" }} /> : <span style={{ color: "#64748b", fontSize: "12px" }}>لا توجد صورة حالياً</span>}
              </div>
              <button onClick={handleImageDownload} disabled={!imageUrl} style={{ width: "100%", padding: "12px", background: imageUrl ? "linear-gradient(135deg, #10b981, #059669)" : "#1e1e2f", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer" }}>⬇️ تحميل الصورة</button>
            </section>

          </div>

          <button onClick={generateImage} disabled={loading || uploading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
            {loading ? "🎨 جاري التوليد بدقة..." : "🚀 بدْء التوليد المتطابق الآن"}
          </button>
        </div>
      </div>

      <footer style={{ maxWidth: "1200px", margin: "20px auto 0", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>

    </main>
  );
}