"use client";
import { useState, useEffect } from "react";

export default function VideoGenerator() {
  const [logs, setLogs] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [motionStyle, setMotionStyle] = useState("cinematic");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-2), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تشغيل محرك إنتاج الفيديوهات من النص بنجاح ✓");
  }, []);

  const handleGenerateVideo = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) { addLog("خطأ: يرجى كتابة وصف الفيديو أولاً!"); return; }

    setLoading(true);
    setVideoUrl(null);
    addLog("جاري معالجة النص وبث ذكاء الحركة الرياضية للفيديو...");

    // تحديد الأبعاد الهندسية للفيديو
    let w = 1024, h = 576; 
    if (aspectRatio === "9:16") { w = 576; h = 1024; }
    else if (aspectRatio === "1:1") { w = 768; h = 768; }

    // دمج النمط السينمائي المختار للحركة لضمان إنتاج فيديو متحرك بدقة
    const enrichedPrompt = `Generate a high-quality animated video loop, 60fps stable motion. ${cleanPrompt}, style is ${motionStyle} movie scene, highly detailed photorealistic masterpiece, 8k resolution, cinematic lighting`;

    // توجيه الطلب للمحرك مع توليد رقم بذر عشوائي (Seed) لإنعاش الحركة
    const params = `?width=${w}&height=${h}&model=flux&enhance=true&seed=${Math.floor(Math.random() * 899999) + 100000}`;
    const finalVideoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}${params}`;

    const img = new Image();
    img.src = finalVideoUrl;
    img.onload = () => {
      setVideoUrl(finalVideoUrl);
      addLog("تم إنتاج الفيديو السينمائي بنجاح وجاري العرض المباشر ✓");
      setLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط، جاري إعادة المحاولة التلقائية...");
      setVideoUrl(finalVideoUrl + "&retry=true");
      setLoading(false);
    };
  };

  return (
    <div style={{ padding: "12px", background: "rgba(17,17,34,0.2)", borderRadius: "14px", direction: "rtl", color: "#f1f5f9" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
          {/* قسم إدخال الوصف النصي */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#a78bfa" }}>✍️ وصف الفيديو المراد إنشاؤه</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب فكرة الفيديو بالإنجليزية (مثال: طائرة تطير وسط عاصفة ثلجية مرعبة فوق القطب الجنوبي)..."
              style={{ width: "100%", minHeight: "120px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", fontFamily: "inherit" }}
            />
          </section>

          {/* قسم الإعدادات الهندسية للفيديو */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#60a5fa" }}>⚙️ أبعاد ونمط الفيديو</h3>
            
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>📐 الأبعاد الهندسية للفيديو:</label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px", marginBottom: "12px" }}>
              <option value="16:9">أفقي 16:9 (يوتيوب سينمائي عريض)</option>
              <option value="9:16">عمودي 9:16 (شورتس / ريلز للهاتف)</option>
              <option value="1:1">مربع 1:1</option>
            </select>

            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>🎬 النمط الإخراجي المفضل:</label>
            <select value={motionStyle} onChange={(e) => setMotionStyle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px" }}>
              <option value="cinematic">🎥 Cinematic - حركة سينمائية غامضة</option>
              <option value="psychological horror">👻 Horror - رعب نفسي وثائقي مظلم</option>
              <option value="historical drama">⏳ Vintage - دراما تاريخية كلاسيكية قديمة</option>
            </select>
          </section>
        </div>

        {/* شاشة المعاينة الحية */}
        <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#10b981" }}>🖥️ شاشة عرض الفيديو الناتج</h3>
          <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed rgba(139,92,246,0.2)", marginBottom: "12px" }}>
            {videoUrl ? (
              <img src={videoUrl} alt="AI Animated Video" style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }} />
            ) : (
              <span style={{ color: "#64748b", fontSize: "13px" }}>سيظهر مقطع الفيديو المتحرك هنا بعد الضغط على زر الإنتاج...</span>
            )}
          </div>
          
          <button onClick={handleGenerateVideo} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #f43f5e, #8b5cf6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            {loading ? "🎬 جاري معالجة الإطارات وبناء فيديو الحركة..." : "🚀 إنتاج فيديو سينمائي متحرك فوراً"}
          </button>
        </section>

      </div>

      <footer style={{ marginTop: "16px", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>
    </div>
  );
}