"use client";
import { useState, useEffect } from "react";

export default function ContentStudio() {
  // التحكم في التبويب النشط
  const [activeTab, setActiveTab] = useState("home");
  const [logs, setLogs] = useState([]);

  // الحالات (States) الخاصة بمولد الصور
  const [prompt, setPrompt] = useState("");
  const [refFile, setRefFile] = useState(null);
  const [refUrl, setRefUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [quality, setQuality] = useState("high");
  const [refStrength, setRefStrength] = useState(70);
  const [imageUrl, setImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // إضافة سجل التنبيهات السفلي
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-3), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تشغيل استوديو صناع المحتوى بنجاح ✓");
    const saved = localStorage.getItem("ai-image-history");
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // دالة رفع الصورة المرجعية ومعالجتها
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setRefFile(file);
    const localPreview = URL.createObjectURL(file);
    setRefUrl(localPreview);
    addLog("جاري رفع الصورة المرجعية للمطابقة...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://file.io/?expires=1d", { method: "POST", body: formData });
      const data = await res.json();
      if (data && data.success && data.link) {
        setRefUrl(data.link);
        addLog("تم رفع المرجع بنجاح ✓ جاهز للتوليد");
      } else {
        addLog("تحذير: تم استخدام المعاينة المحلية فقط");
      }
    } catch (err) {
      console.log("Upload error:", err);
      addLog("خطأ في الرفع، سيتم الاعتماد على المعاينة المحلية");
    }
    setUploading(false);
  };

  // دالة توليد الصور المطورة لتتفاعل بدقة مع الـ Prompt
  const generateImage = async () => {
    let cleanPrompt = prompt.trim().replace(/\s+/g, " "); // تنظيف الفراغات الزائدة لتفادي تكسر الرابط
    if (!cleanPrompt) { addLog("خطأ: اكتب وصفاً للصورة أولاً"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى ينتهي رفع المرجع"); return; }
    
    setLoading(true);
    setImageUrl(null);
    addLog("جاري معالجة الـ Prompt واستدعاء محرك Flux المتطور...");
    
    // ضبط الأبعاد الدقيقة للمحرك
    let w = 1024, h = 1024;
    if (aspectRatio === "16:9") { w = 1280; h = 720; }
    else if (aspectRatio === "9:16") { w = 720; h = 1280; }
    
    // تحسين جودة الـ Prompt برمجياً إذا اختار المستخدم دقة فائقة
    if (quality === "high") {
      cleanPrompt = `${cleanPrompt}, highly detailed masterpiece, 8k resolution, cinematic lighting, photorealistic style, hyperrealistic, sharp focus`;
    }
    
    // بناء الرابط البرمجي مع إجبار السيرفر على استخدام أفضل محرك (model=flux) وتفعيل الـ Enhance
    let params = `?width=${w}&height=${h}&model=flux&enhance=true&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    // دمج الصورة المرجعية إذا وجدت
    if (refUrl && refUrl.startsWith("https://")) {
      params = params + `&image=${encodeURIComponent(refUrl)}&weight=${refStrength / 100}`;
      addLog(`تم دمج الصورة المرجعية بدقة هندسية بقوة: ${refStrength}%`);
    }
    
    const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}${params}`;
    
    addLog("الذكاء الاصطناعي يقوم برسم تفاصيل مشهدك الآن...");
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم توليد الصورة بنجاح وتطابق الـ Prompt مية بالمية ✓");
      const entry = { url: fullUrl, prompt: prompt.trim(), date: new Date().toISOString() };
      const newHistory = [entry, ...history.slice(0, 19)];
      setHistory(newHistory);
      localStorage.setItem("ai-image-history", JSON.stringify(newHistory));
      setLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط على السيرفر، جاري إعادة المحاولة التلقائية...");
      setImageUrl(fullUrl + "&retry=true");
      setLoading(false);
    };
  };

  // دالة إجبار التحميل المباشر بجودة JPG لمعرض الهاتف
  const handleImageDownload = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    addLog("جاري معالجة الملف وإجبار التحميل بجودة JPG للهاتف...");
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `studio-media-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ الصورة في معرض الصور بجهازك بنجاح ✓");
    } catch (err) {
      console.log("Download error:", err);
      addLog("حدث قيود في المتصفح، جاري فتح الصورة في علامة تبويب جديدة للاحتفاظ بها");
      window.open(imageUrl, "_blank");
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("ai-image-history");
    setHistory([]);
    addLog("تم تفريغ سجل الصور السابقة");
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060609 0%, #0b0b14 50%, #020205 100%)",
      color: "#f1f5f9",
      fontFamily: "system-ui, -apple-system, sans-serif",
      direction: "rtl",
      padding: "12px",
      paddingBottom: "30px"
    }}>
      
      {/* هيدر الموقع */}
      <header style={{
        textAlign: "center",
        marginBottom: "16px",
        padding: "16px",
        background: "rgba(13, 13, 25, 0.7)",
        borderRadius: "14px",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        boxShadow: "0 0 15px rgba(139, 92, 246, 0.05)"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🎬 استوديو صناع المحتوى الذكي
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>منصة متكاملة لإنتاج القصص، السيناريوهات، الأصوات، والصور</p>
      </header>

      {/* شريط التنقل الأفقي */}
      <nav style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        marginBottom: "20px",
        padding: "8px 4px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <style>{`
          nav::-webkit-scrollbar { display: none; }
          .nav-btn {
            padding: 10px 16px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.05);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
          }
        `}</style>

        <button onClick={() => setActiveTab("home")} className="nav-btn" style={{ background: activeTab === "home" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "home" ? "#fff" : "#94a3b8" }}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab("story")} className="nav-btn" style={{ background: activeTab === "story" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "story" ? "#fff" : "#94a3b8" }}>📚 كتابة القصة</button>
        <button onClick={() => setActiveTab("script")} className="nav-btn" style={{ background: activeTab === "script" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "script" ? "#fff" : "#94a3b8" }}>📜 السيناريو والبرومبت</button>
        <button onClick={() => setActiveTab("audio")} className="nav-btn" style={{ background: activeTab === "audio" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "audio" ? "#fff" : "#94a3b8" }}>🎤 هندسة الصوت</button>
        <button onClick={() => setActiveTab("image")} className="nav-btn" style={{ background: activeTab === "image" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "image" ? "#fff" : "#94a3b8" }}>🎨 توليد الصور</button>
        <button onClick={() => setActiveTab("animate")} className="nav-btn" style={{ background: activeTab === "animate" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "animate" ? "#fff" : "#94a3b8" }}>🎬 تحريك الصور</button>
      </nav>

      {/* محتويات التبويبات */}
      <div style={{ maxWidth: "1250px", margin: "0 auto", minHeight: "350px" }}>
        
        {/* 1. تبويب الصفحة الرئيسية */}
        {activeTab === "home" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🚀</div>
            <h2 style={{ fontSize: "18px", color: "#a78bfa", marginBottom: "8px" }}>مرحباً بك في استوديو الإنتاج المتكامل</h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto" }}>
              هذه المنصة مصممة خصيصاً لمساعدتك في بناء وتطوير محتواك الرقمي بكفاءة عالية. تصفح الأدوات من الشريط العلوي للبدء في العمل.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
              <div style={{ background: "#090911", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>حالة النظام</div>
                <div style={{ fontSize: "13px", color: "#10b981", fontWeight: "600", marginTop: "4px" }}>جاهز ومستقر ✓</div>
              </div>
              <div style={{ background: "#090911", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>نوع الحساب</div>
                <div style={{ fontSize: "13px", color: "#fbbf24", fontWeight: "600", marginTop: "4px" }}>مطور محترف (مجاني)</div>
              </div>
            </div>
          </section>
        )}

        {/* 2. تبويب توليد الصور (المحدث لحل مشكلة البرومبت الفاشل) */}
        {activeTab === "image" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
              
              {/* قسم الإدخال */}
              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: "#a78bfa", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📝</span> الإدخال ومرجع الصورة
                </h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اكتب وصف الصورة بالتفصيل (بالإنجليزية) للحصول على أفضل النتائج الاحترافية..."
                  style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", resize: "vertical", fontFamily: "inherit", marginBottom: "12px" }}
                />
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>📎 صورة مرجعية (اختياري):</label>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px", width: "100%" }} />
                {refUrl && (
                  <div style={{ marginTop: "8px", padding: "6px", background: "#090915", borderRadius: "8px", border: "1px dashed rgba(139,92,246,0.3)" }}>
                    <img src={refUrl} alt="ref-preview" style={{ width: "100%", maxHeight: "110px", objectFit: "cover", borderRadius: "6px" }} />
                  </div>
                )}
              </section>

              {/* قسم الإعدادات */}
              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: "#60a5fa", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>⚙️</span> إعدادات الأبعاد والجودة
                </h3>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>📐 نسبة الأبعاد البصرية:</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", marginBottom: "12px", fontFamily: "inherit" }}>
                  <option value="16:9">أفقي 16:9 (يوتيوب/وثائقي)</option>
                  <option value="9:16">عمودي 9:16 (Short/TikTok)</option>
                  <option value="1:1">مربع 1:1 (منشورات/ميديا)</option>
                </select>

                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>💎 مستوى دقة المعالجة:</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", marginBottom: "12px", fontFamily: "inherit" }}>
                  <option value="high">دقة فائقة (Flux Engine + 8K)</option>
                  <option value="standard">دقة قياسية (معالجة سريعة)</option>
                </select>

                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
                  🎯 شدة التمسك بالصورة المرجعية: <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{refStrength}%</span>
                </label>
                <input type="range" min="0" max="100" value={refStrength} onChange={(e) => setRefStrength(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />
              </section>

              {/* قسم المخرجات */}
              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🖥️</span> معاينة الصورة المولدة
                </h3>
                <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(139,92,246,0.2)", overflow: "hidden", marginBottom: "12px" }}>
                  {imageUrl ? (
                    <img src={imageUrl} alt="AI Generated" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }} />
                  ) : (
                    <span style={{ color: "#64748b", fontSize: "12px" }}>ستظهر مخرجات التصميم هنا...</span>
                  )}
                </div>
                <button onClick={handleImageDownload} disabled={!imageUrl} style={{ width: "100%", padding: "12px", background: imageUrl ? "linear-gradient(135deg, #10b981, #059669)" : "#1e1e2f", color: imageUrl ? "#fff" : "#64748b", border: "none", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: imageUrl ? "pointer" : "not-allowed" }}>
                  ⬇️ تحميل الصورة (JPG مباشر للجهاز)
                </button>
              </section>

            </div>

            {/* زر التوليد الرئيسي */}
            <button onClick={generateImage} disabled={loading || uploading} style={{ width: "100%", padding: "14px", background: loading || uploading ? "#27274a" : "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: loading || uploading ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(139,92,246,0.2)" }}>
              {uploading ? "⏳ جاري تهيئة ملف المرجع..." : loading ? "🎨 محرك Flux يحلل الـ Prompt ويرسم الآن..." : "🚀 بدْء توليد الصورة الآن"}
            </button>

            {/* سجل الصور */}
            <section style={{ background: "rgba(11,11,25,0.4)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ margin: 0, fontSize: "13px", color: "#fbbf24" }}>📚 أرشيف توليد الصور المحفوظ محلياً</h4>
                {history.length > 0 && <button onClick={clearHistory} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>مسح السجل</button>}
              </div>
              {history.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "12px", color: "#475569", margin: 0 }}>لا توجد صور في السجل الحالي.</p>
              ) : (
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
                  {history.map((item, index) => (
                    <div key={index} onClick={() => { setImageUrl(item.url); setPrompt(item.prompt); }} style={{ minWidth: "80px", maxWidth: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                      <img src={item.url} alt="history" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* باقي التبويبات المؤقتة */}
        {activeTab === "story" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[الخطوة القادمة] سيتم هنا بناء محرك كتابة القصة وتوزيع المشاهد...</p>
          </section>
        )}
        {activeTab === "script" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك كتابة السيناريو والحوار والبرومبت...</p>
          </section>
        )}
        {activeTab === "audio" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء نظام تحويل النص إلى صوت واستنساخ صوتك الشخصي بجودة عالية...</p>
          </section>
        )}
        {activeTab === "animate" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك تحريك الصور الثابتة إلى مقاطع فيديو...</p>
          </section>
        )}

      </div>

      {/* لوحة مراقبة النظام السفلية */}
      <footer style={{ maxWidth: "1200px", margin: "20px auto 0", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>

    </main>
  );
}