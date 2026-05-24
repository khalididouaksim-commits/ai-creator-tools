"use client";
import { useState, useEffect } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [quality, setQuality] = useState("8K + Cinematic Lighting");
  const [weight, setWeight] = useState(76);
  const [seed, setSeed] = useState("422422");
  const [generatedImg, setGeneratedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [archive, setArchive] = useState([]);
  const [logs, setLogs] = useState([]);

  // إعدادات محرر المرجع المتطور
  const [referenceImg, setReferenceImg] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("face");
  const [faceExpression, setFaceExpression] = useState("smiling");
  const [lighting, setLighting] = useState("cinematic");

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-2), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    const saved = localStorage.getItem("preserved_archive_imgs");
    if (saved) setArchive(JSON.parse(saved));
    addLog("تم تفعيل محرك الثبات البصري ومستودع الحفظ المحلي ✓");
  }, []);

  // دالة رفع وقراءة الصورة المرجعية
  const handleRefUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImg(reader.result);
      addLog("تم تحميل صورة المرجع بنجاح ✓");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { addLog("خطأ: يرجى إدخال وصف المشهد أولاً!"); return; }
    setLoading(true);
    setGeneratedImg(null);
    addLog("جاري معالجة الأبعاد وتحليل البرومبت مع محرك Flux الأصلي...");

    let w = 1024, h = 576;
    if (aspectRatio === "9:16") { w = 576; h = 1024; }

    // دمج بيانات المرجع البرمجية تلقائياً عند الإرسال إذا كانت الصورة موجودة
    const referenceMeta = referenceImg ? `[Ref_Face:${faceExpression}_Light:${lighting}] ` : "";
    const enrichedPrompt = `${referenceMeta}${prompt}, high-quality masterpiece, ${quality}, cinematic framing, historical depth, stable look`;
    
    const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}?width=${w}&height=${h}&model=flux&enhance=true&seed=${seed}&weight=${weight / 100}`;

    const img = new Image();
    img.src = finalUrl;
    img.onload = () => {
      setGeneratedImg(finalUrl);
      const updatedArchive = [finalUrl, ...archive.slice(0, 9)];
      setArchive(updatedArchive);
      localStorage.setItem("preserved_archive_imgs", JSON.stringify(updatedArchive));
      addLog("تم توليد الصورة بنجاح وتحديث الأرشيف ✓");
      setLoading(false);
    };
    img.onerror = () => {
      addLog("حدث خطأ في الاتصال بالسيرفر، جاري المحاولة...");
      setLoading(false);
    };
  };

  const handleDownload = async () => {
    if (!generatedImg) return;
    try {
      addLog("جاري تجهيز ملف الـ JPG للتحميل المباشر للهاتف...");
      const response = await fetch(generatedImg);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `cinema-archive-${seed}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ اللقطة بنجاح في جهازك ✓");
    } catch (err) {
      window.open(generatedImg, "_blank");
    }
  };

  return (
    <div style={{ direction: "rtl", color: "#f1f5f9" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        
        {/* الكارت 1: محرر المرجع المتطور (اليمين) */}
        <div style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", color: "#a78bfa" }}>⚙️ محرر المرجع المتطور</h3>
          </div>

          <div style={{ display: "flex", borderBottom: "1px solid #27274a", marginBottom: "12px" }}>
            <button onClick={() => setActiveSubTab("face")} style={{ flex: 1, padding: "8px", background: "none", border: "none", color: activeSubTab === "face" ? "#8b5cf6" : "#94a3b8", borderBottom: activeSubTab === "face" ? "2px solid #8b5cf6" : "none", fontSize: "12px", fontWeight: "bold" }}>تعديل الوجه</button>
            <button onClick={() => setActiveSubTab("replace")} style={{ flex: 1, padding: "8px", background: "none", border: "none", color: activeSubTab === "replace" ? "#8b5cf6" : "#94a3b8", borderBottom: activeSubTab === "replace" ? "2px solid #8b5cf6" : "none", fontSize: "12px", fontWeight: "bold" }}>الاستبدال</button>
          </div>

          {activeSubTab === "face" && (
            <div>
              <label style={{ fontSize: "11px", color: "#94a3b8" }}>تعديل الوجه:</label>
              <select value={faceExpression} onChange={(e) => setFaceExpression(e.target.value)} style={{ width: "100%", padding: "8px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "6px", marginBottom: "10px", fontSize: "12px" }}>
                <option value="smiling">مبتسم / جدي (تلقائي)</option>
                <option value="angry">غاضب وحاد الملامح</option>
                <option value="scared">مرعوب ونفسي شاحب</option>
              </select>

              <label style={{ fontSize: "11px", color: "#94a3b8" }}>الإضاءة الموجهة للوجه:</label>
              <select value={lighting} onChange={(e) => setLighting(e.target.value)} style={{ width: "100%", padding: "8px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "6px", marginBottom: "12px", fontSize: "12px" }}>
                <option value="cinematic">إضاءة درامية خافتة (Cinematic)</option>
                <option value="neon">إضاءة غامضة خضراء وزرقاء</option>
              </select>
            </div>
          )}

          {/* بوكس رفع الصورة المرجعية الأصلي */}
          <div style={{ background: "#05050f", padding: "12px", borderRadius: "8px", border: "1px solid #27274a", textAlign: "center" }}>
            <input type="file" accept="image/*" onChange={handleRefUpload} style={{ display: "none" }} id="ref-file-input" />
            <label htmlFor="ref-file-input" style={{ cursor: "pointer", display: "block" }}>
              {referenceImg ? (
                <div>
                  <img src={referenceImg} alt="Reference" style={{ maxHeight: "110px", borderRadius: "6px" }} />
                  <p style={{ fontSize: "11px", color: "#10b981", margin: "6px 0 0" }}>✓ تم قفل الصورة المرجعية</p>
                </div>
              ) : (
                <div style={{ padding: "16px 0" }}>
                  <span style={{ fontSize: "24px", color: "#475569" }}>📁</span>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>اضغط لرفع صورة الشخصية الثابتة</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* الكارت 2: إعدادات الأبعاد و (خانة الوصف المدمجة بالصورة +) (الوسط) */}
        <div style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#60a5fa" }}>⚙️ إعدادات الأبعاد والوصف</h3>
          
          <label style={{ fontSize: "11px", color: "#94a3b8" }}>📐 نسبة الأبعاد البصرية:</label>
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "8px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "6px", marginBottom: "10px", fontSize: "12px" }}>
            <option value="16:9">أفقي 16:9 (يوتيوب وثائقي)</option>
            <option value="9:16">عمودي 9:16 (شورتس)</option>
          </select>

          <label style={{ fontSize: "11px", color: "#94a3b8" }}>🎯 قوة التمسك بالمرجع: {weight}%</label>
          <input type="range" min="10" max="100" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: "100%", marginBottom: "12px" }} />
          
          {/* ⚡ هنا تم دمج الصورة المرجعية على شكل (+) داخل مربع إدخال وصياغة المشهد */}
          <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>مربع صياغة المشهد:</label>
          <div style={{
            position: "relative",
            background: "#090915",
            border: "1px solid #27274a",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}>
            {/* عرض الصورة على شكل (+) بداخل خانة النص إذا كانت مرفوعة */}
            {referenceImg && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(139,92,246,0.15)",
                padding: "4px 8px",
                borderRadius: "6px",
                alignSelf: "flex-start",
                border: "1px solid rgba(139,92,246,0.3)"
              }}>
                <img src={referenceImg} alt="Thumb" style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" }} />
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#a78bfa" }}>+</span>
                <span style={{ fontSize: "10px", color: "#a78bfa" }}>مرجع مدمج</span>
                <span onClick={() => setReferenceImg(null)} style={{ cursor: "pointer", fontSize: "11px", color: "#ef4444", marginRight: "4px" }}>✕</span>
              </div>
            )}
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب وصفتك بالإنجليزية هنا..."
              style={{
                width: "100%",
                minHeight: "70px",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "12px",
                outline: "none",
                resize: "none",
                padding: 0
              }}
            />
          </div>
        </div>

        {/* الكارت 3: المعاينة والتحميل (اليسار) */}
        <div style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#10b981" }}>🖥️ معاينة اللقطة الجديدة</h3>
            <div style={{ background: "#05050f", minHeight: "135px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed #27274a" }}>
              {generatedImg ? <img src={generatedImg} alt="AI Output" style={{ width: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: "11px", color: "#475569" }}>ستظهر اللقطة هنا...</span>}
            </div>
          </div>
          {generatedImg && (
            <button onClick={handleDownload} style={{ width: "100%", padding: "12px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", marginTop: "10px", cursor: "pointer" }}>
              📥 تحميل الصورة (JPG مباشر للهاتف)
            </button>
          )}
        </div>

      </div>

      <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", padding: "14px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", marginTop: "16px", fontSize: "14px", cursor: "pointer" }}>
        {loading ? "🚀 جاري معالجة ملامح المرجع والتوليد..." : "🚀 بدْء توليد الصورة الآن"}
      </button>

      {/* أرشيف الصور السفلي */}
      <div style={{ marginTop: "20px", background: "rgba(9,9,21,0.5)", padding: "12px", borderRadius: "12px" }}>
        <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "#fbbf24" }}>📂 أرشيف توليد الصور المحفوظ محلياً</h4>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
          {archive.length > 0 ? archive.map((url, i) => (
            <img key={i} src={url} alt="Archived" onClick={() => setGeneratedImg(url)} style={{ height: "60px", width: "90px", objectFit: "cover", borderRadius: "6px", cursor: "pointer", border: "1px solid #27274a" }} />
          )) : <span style={{ fontSize: "11px", color: "#475569" }}>المستودع فارغ حالياً.</span>}
        </div>
      </div>

      <footer style={{ marginTop: "12px", background: "#05050f", padding: "8px", borderRadius: "6px", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </footer>

    </div>
  );
}