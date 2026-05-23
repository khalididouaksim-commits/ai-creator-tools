"use client";
import { useState, useEffect } from "react";

export default function ImageGenerator() {
  const [logs, setLogs] = useState([]);
  
  // حالات مولد الصور المطوّر لمنع التشويه
  const [prompt, setPrompt] = useState("");
  const [refFile, setRefFile] = useState(null);
  const [refUrl, setRefUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [refStrength, setRefStrength] = useState(65); // القوة المثالية للحفاظ على ملامح الوجه في Flux
  const [customSeed, setCustomSeed] = useState("422422"); // بذرة ثابتة لمنع تغير ملامح الشخصية
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-3), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تشغيل محرك الصور الفرعي بنظام الـ Seed المستقر ✓");
  }, []);

  // دالة الرفع المصلحة باستخدام tmpfiles لضمان بقاء الرابط حياً وسريعاً
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setRefFile(file);
    const localPreview = URL.createObjectURL(file);
    setRefUrl(localPreview);
    addLog("جاري الرفع على سيرفر مستقر للمطابقة...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("https://tmpfiles.org/api/v1/upload", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      
      if (data && data.status === "success" && data.data && data.data.url) {
        // تحويل الرابط إلى رابط مباشر وقابل للقراءة الخارجية فورا
        const directLink = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
        setRefUrl(directLink);
        addLog("تم قفل الهوية بنجاح ✓ الرابط مستقر وجاهز للتوليد");
      } else {
        addLog("تنبيه: فشل استخراج الرابط المباشر، تم الاعتماد على المعاينة المحلية");
      }
    } catch (err) {
      addLog("خطأ في الرفع، سيتم الاعتماد على المعاينة المحلية");
    }
    setUploading(false);
  };

  // توليد لقطات سينمائية ثابتة الملامح
  const generateImage = async () => {
    const cleanPrompt = prompt.trim().replace(/\s+/g, " ");
    if (!cleanPrompt) { addLog("خطأ: اكتب وصفاً للمشهد أو الملابس أولاً"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى ينتهي رفع المرجع"); return; }
    
    setImageLoading(true);
    setImageUrl(null);
    addLog("جاري دمج الهوية والملامح مع محرك Flux الدقيق...");
    
    let w = 1280, h = 720;
    if (aspectRatio === "9:16") { w = 720; h = 1280; }
    else if (aspectRatio === "1:1") { w = 1024; h = 1024; }
    
    // فرض الهوية التشريحية نصياً لمنع انقسام الصورة أو تشوه العينين والوجه
    const structuredPrompt = `High resolution cinematic photo of the exact same person from the reference image, maintaining identical facial structure, beard, and expressions. ${cleanPrompt}, highly detailed, photorealistic, 8k, dramatic studio lighting, captured on 50mm lens, depth of field`;

    let params = `?width=${w}&height=${h}&model=flux&enhance=true&nologo=true&seed=${customSeed}`;
    
    if (refUrl && refUrl.startsWith("https://")) {
      params += `&image=${encodeURIComponent(refUrl)}&weight=${refStrength / 100}`;
      addLog(`تم تمرير المرجع البرمجي الثابت بنجاح بوزن: ${refStrength}%`);
    }
    
    const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(structuredPrompt)}${params}`;
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم إنتاج اللقطة الجديدة المتطابقة تماماً ✓");
      setImageLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط، جاري إعادة المحاولة التلقائية...");
      setImageUrl(fullUrl + "&retry=true");
      setImageLoading(false);
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
      addLog("تم حفظ الصورة بنجاح في معرض الهاتف ✓");
    } catch (err) {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div style={{ padding: "12px", background: "rgba(17,17,34,0.2)", borderRadius: "14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
          
          {/* قسم الإدخال */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>📝 المشهد والملابس الجديدة</h3>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="اكتب فقط الملابس أو البيئة الجديدة هنا بالإنجليزية..." style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", fontFamily: "inherit" }} />
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "10px", marginBottom: "4px" }}>📎 ارفع صورة الشخص الأساسي هنا:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "12px", width: "100%" }} />
            {refUrl && <div style={{ marginTop: "8px" }}><img src={refUrl} alt="ref" style={{ width: "100%", maxHeight: "100px", objectFit: "cover", borderRadius: "6px" }} /></div>}
          </section>

          {/* قسم الضبط المطور */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#60a5fa" }}>⚙️ التحكم في ثبات الملامح</h3>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>📐 الأبعاد الهندسية للفيلم:</label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a" }}>
              <option value="16:9">أفقي 16:9 (يوتيوب سينمائي)</option>
              <option value="9:16">عمودي 9:16</option>
              <option value="1:1">مربع 1:1</option>
            </select>

            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "12px", marginBottom: "4px" }}>
              🎯 قوة الارتباط بالمرجع (Weight): <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{refStrength}%</span>
            </label>
            <input type="range" min="30" max="90" value={refStrength} onChange={(e) => setRefStrength(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />

            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "12px", marginBottom: "4px" }}>🔑 رقم البذرة للشخصية (Seed):</label>
            <input type="text" value={customSeed} onChange={(e) => setCustomSeed(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", background: "#090915", color: "#fbbf24", border: "1px solid #27274a", fontSize: "13px", fontWeight: "bold", textAlign: "center" }} />
          </section>

          {/* المعاينة */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#10b981" }}>🖥️ النتيجة السينمائية الجديدة</h3>
            <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed rgba(139,92,246,0.2)" }}>
              {imageUrl ? <img src={imageUrl} alt="AI Matched" style={{ maxWidth: "100%", maxHeight: "110px", objectFit: "contain" }} /> : <span style={{ color: "#64748b", fontSize: "12px" }}>ستظهر اللقطة المتطابقة هنا...</span>}
            </div>
            <button onClick={handleImageDownload} disabled={!imageUrl} style={{ width: "100%", padding: "10px", background: imageUrl ? "linear-gradient(135deg, #10b981, #059669)" : "#1e1e2f", color: "#fff", border: "none", borderRadius: "10px", cursor: imageUrl ? "pointer" : "not-allowed", fontSize: "13px" }}>⬇️ حفظ اللقطة المصلحة بجهازي</button>
          </section>
        </div>
        
        <button onClick={generateImage} disabled={imageLoading || uploading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
          {imageLoading ? "🎨 جاري معالجة الهوية وتغيير السياق..." : "🚀 إنتاج اللقطة الجديدة المتطابقة تماماً"}
        </button>
      </div>

      <footer style={{ marginTop: "16px", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>
    </div>
  );
}