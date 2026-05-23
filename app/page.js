"use client";
import { useState, useEffect } from "react";

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState("image"); // جعل تبويب الصور نشطاً للتجربة مباشرة
  const [logs, setLogs] = useState([]);
  
  // الحالات (States) الخاصة بمولد الصور
  const [prompt, setPrompt] = useState("");
  const [refFile, setRefFile] = useState(null);
  const [refUrl, setRefUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [refStrength, setRefStrength] = useState(65); // القوة المثالية لـ Img2Img في Flux هي بين 60 و 70
  const [customSeed, setCustomSeed] = useState("422422"); // تثبيت الـ Seed لضمان ثبات الشخصية في اللقطات المختلفة
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-3), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تشغيل محرك الصور المطور بنظام الـ Seed الثابت ✓");
  }, []);

  // دالة رفع الصورة المرجعية
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setRefFile(file);
    const localPreview = URL.createObjectURL(file);
    setRefUrl(localPreview);
    addLog("جاري رفع واستخراج رابط الصورة المرجعية...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://file.io/?expires=1d", { method: "POST", body: formData });
      const data = await res.json();
      if (data && data.success && data.link) {
        setRefUrl(data.link);
        addLog("تم ربط المرجع بنجاح ✓ جاهز للمطابقة الدقيقة");
      } else {
        addLog("تحذير: تم الاعتماد على المعاينة المحلية فقط");
      }
    } catch (err) {
      addLog("خطأ في الرفع، سيتم استخدام المعاينة المحلية");
    }
    setUploading(false);
  };

  // دالة توليد الصور المصلحة هندسياً
  const generateImage = async () => {
    const cleanPrompt = prompt.trim().replace(/\s+/g, " ");
    if (!cleanPrompt) { addLog("خطأ: اكتب وصفاً للمشهد أولاً"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى ينتهي رفع المرجع"); return; }
    
    setLoading(true);
    setImageUrl(null);
    addLog("جاري دمج المرجع نصياً وبرمجياً مع محرك Flux...");
    
    // الأبعاد
    let w = 1280, h = 720;
    if (aspectRatio === "9:16") { w = 720; h = 1280; }
    else if (aspectRatio === "1:1") { w = 1024; h = 1024; }
    
    // هندسة البرومبت: هنا نقوم بإجبار المحرك على أخذ الهوية البنيوية والملامح فقط من المرجع، وتطبيق البيئة الجديدة
    const structuredPrompt = `High resolution cinematic photo of the exact same person from the reference image, maintaining identical facial structure, beard, and expressions. ${cleanPrompt}, highly detailed, photorealistic, 8k, dramatic studio lighting, captured on 50mm lens, depth of field`;

    // بناء الرابط البرمجي مع تمرير الـ seed الثابت والـ weight المناسب لتفادي تشويه الـ Close-up
    let params = `?width=${w}&height=${h}&model=flux&enhance=true&nologo=true&seed=${customSeed}`;
    
    if (refUrl && refUrl.startsWith("https://")) {
      // تمرير الوزن الرياضي بدقة (مثلا 0.65) لكي لا ينسخ المحرك الألوان القديمة أو يقسم الشاشة
      params += `&image=${encodeURIComponent(refUrl)}&weight=${refStrength / 100}`;
      addLog(`تم قفل الـ Seed على [${customSeed}] وتطبيق وزن مطابقة بقوة: ${refStrength}%`);
    }
    
    const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(structuredPrompt)}${params}`;
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم التوليد! تحقق من تطابق الوجه والسياق الجديد الآن ✓");
      setLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط على السيرفر، جاري المحاولة...");
      setImageUrl(fullUrl + "&retry=true");
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
      link.download = `studio-character-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ الصورة في معرض الهاتف بنجاح ✓");
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
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>نظام تثبيت ملامح الشخصية عبر الـ Seed الثابت والوزن الهندسي</p>
      </header>

      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
            
            {/* قسم الإدخال */}
            <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>📝 المشهد والملابس الجديدة</h3>
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="اكتب فقط الملابس أو البيئة الجديدة هنا (مثلاً: wearing an astronaut suit, in space station)..." 
                style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", fontFamily: "inherit" }} 
              />
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "10px", marginBottom: "4px" }}>📎 ارفع صورة الشخص الأساسي هنا:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "12px", width: "100%" }} />
              {refUrl && <div style={{ marginTop: "8px" }}><img src={refUrl} alt="ref" style={{ width: "100%", maxHeight: "100px", objectFit: "cover", borderRadius: "6px" }} /></div>}
            </section>

            {/* قسم الضبط المطور لمنع التشويه */}
            <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#60a5fa" }}>⚙️ التحكم في ثبات الملامح</h3>
              
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>📐 الأبعاد البصرية للفيلم:</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a" }}>
                <option value="16:9">أفقي 16:9 (يوتيوب سينمائي)</option>
                <option value="9:16">عمودي 9:16</option>
                <option value="1:1">مربع 1:1</option>
              </select>

              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "12px", marginBottom: "4px" }}>
                🎯 قوة الارتباط بالمرجع (Weight): <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{refStrength}%</span>
              </label>
              <input type="range" min="30" max="90" value={refStrength} onChange={(e) => setRefStrength(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />
              <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#64748b" }}>* (60%-70% هي القوة المثالية في محرك Flux لتغيير الملابس بنجاح دون تقسيم الصورة).</p>

              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "12px", marginBottom: "4px" }}>🔑 رقم البذرة للشخصية (Seed):</label>
              <input type="text" value={customSeed} onChange={(e) => setCustomSeed(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", background: "#090915", color: "#fbbf24", border: "1px solid #27274a", fontSize: "13px", fontWeight: "bold", textAlign: "center" }} />
            </section>

            {/* معاينة وتحميل */}
            <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#10b981" }}>🖥️ النتيجة السينمائية الجديدة</h3>
              <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed rgba(139,92,246,0.2)" }}>
                {imageUrl ? <img src={imageUrl} alt="AI Matched" style={{ maxWidth: "100%", maxHeight: "110px", objectFit: "contain" }} /> : <span style={{ color: "#64748b", fontSize: "12px" }}>ستظهر اللقطة المتطابقة هنا...</span>}
              </div>
              <button onClick={handleImageDownload} disabled={!imageUrl} style={{ width: "100%", padding: "10px", background: imageUrl ? "linear-gradient(135deg, #10b981, #059669)" : "#1e1e2f", color: "#fff", border: "none", borderRadius: "10px", cursor: imageUrl ? "pointer" : "not-allowed", fontSize: "13px" }}>⬇️ حفظ اللقطة المصلحة بجهازي</button>
            </section>

          </div>

          <button onClick={generateImage} disabled={loading || uploading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
            {loading ? "🎨 جاري معالجة الهوية وتغيير السياق..." : "🚀 إنتاج اللقطة الجديدة المتطابقة تماماً"}
          </button>

        </div>
      </div>

      <footer style={{ maxWidth: "1200px", margin: "20px auto 0", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>

    </main>
  );
}