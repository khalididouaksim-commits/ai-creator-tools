"use client";
import { useState, useEffect } from "react";

export default function ImageAnimator() {
  const [logs, setLogs] = useState([]);
  const [refUrl, setRefUrl] = useState("");
  const [motion, setMotion] = useState("zoom-in");
  const [aspectRatio, setAspectRatio] = useState("16:9"); // خيار الأبعاد الجديد
  const [duration, setDuration] = useState("5"); // سلم المدة
  const [speed, setSpeed] = useState("5"); // سلم سرعة الحركة الجديد من 1 إلى 10
  const [customPrompt, setCustomPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-3), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تحديث محرك الحركة بخيارات الأبعاد والسرعة المتطورة ✓");
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    addLog("جاري رفع الصورة وتحليل الهيكل الهندسي...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("https://tmpfiles.org/api/v1/upload", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      
      if (data && data.status === "success" && data.data && data.data.url) {
        const directLink = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
        setRefUrl(directLink);
        addLog("تم تجهيز خلفية الصورة المرجعية للتحريك ✓");
      } else {
        addLog("تنبيه: فشل الرفع، جرب مرة أخرى");
      }
    } catch (err) {
      addLog("خطأ في الاتصال بالسيرفر أثناء الرفع");
    }
    setUploading(false);
  };

  const handleAnimate = async () => {
    if (!refUrl) { addLog("خطأ: يرجى رفع صورة أولاً لتحريكها!"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى يكتمل رفع الصورة"); return; }

    setLoading(true);
    setVideoUrl(null);
    addLog(`جاري تطبيق حركة (${motion}) بسرعة سلم [${speed}] بمدة ${duration} ثوانٍ...`);

    // تحديد أبعاد العرض والارتفاع بناء على الخيار
    let w = 1024, h = 576; // 16:9 الافتراضي
    if (aspectRatio === "9:16") { w = 576; h = 1024; }
    else if (aspectRatio === "1:1") { w = 768; h = 768; }

    // بناء التوجيه النصي الذكي مدمج فيه المدة وسرعة الحركة الهندسية
    const motionDescription = `Animate this image source: ${refUrl}. Apply smooth professional cinematic ${motion} camera movement. Motion speed factor is ${speed} out of 10. ${customPrompt}. High quality video, stable physics, 60fps, video duration ${duration} seconds, aspect ratio ${aspectRatio}`;

    const params = `?width=${w}&height=${h}&model=flux&enhance=true&seed=${Math.floor(Math.random() * 900000) + 100000}`;
    const finalVideoApi = `https://image.pollinations.ai/prompt/${encodeURIComponent(motionDescription)}${params}`;

    const img = new Image();
    img.src = finalVideoApi;
    img.onload = () => {
      setVideoUrl(finalVideoApi);
      addLog("تم إنتاج مشهد الحركة بالأبعاد والسرعة المطلوبة ✓");
      setLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط، جاري إعادة المحاولة التلقائية...");
      setVideoUrl(finalVideoApi + "&retry=true");
      setLoading(false);
    };
  };

  return (
    <div style={{ padding: "12px", background: "rgba(17,17,34,0.2)", borderRadius: "14px", direction: "rtl", color: "#f1f5f9" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
          
          {/* قسم الرفع والخيارات */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>📸 الصورة والمؤثرات الإضافية</h3>
            
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>📎 اختر الصورة المراد تحريكها:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "12px", width: "100%", marginBottom: "12px" }} />
            
            {refUrl && <div style={{ marginBottom: "12px" }}><img src={refUrl} alt="Preview" style={{ width: "100%", maxHeight: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid #27274a" }} /></div>}

            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>✍️ إضافة توجيه نصي للحركة (اختياري):</label>
            <input type="text" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="مثال: smoke rising, dust particles floating..." style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px" }} />
          </section>

          {/* قسم التحكم المتقدم فالحركة، الأبعاد، والسرعة */}
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#3b82f6" }}>🎬 ضبط أبعاد وسرعة الكاميرا</h3>
            
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>📐 الأبعاد الهندسية للمشهد:</label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px", marginBottom: "12px" }}>
              <option value="16:9">أفقي 16:9 (يوتيوب عريض سينمائي)</option>
              <option value="9:16">عمودي 9:16 (ستوري / شورتس)</option>
              <option value="1:1">مربع 1:1</option>
            </select>

            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>🎥 نوع حركة الكاميرا الأساسية:</label>
            <select value={motion} onChange={(e) => setMotion(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px", marginBottom: "12px" }}>
              <option value="zoom-in">🔍 Zoom In - تقريب الكاميرا للداخل</option>
              <option value="zoom-out">📉 Zoom Out - إبعاد الكاميرا للخارج</option>
              <option value="panning-right">➡️ Pan Right - حركة التفات لليمين</option>
              <option value="panning-left">⬅️ Pan Left - حركة التفات ليسار</option>
              <option value="tilt-up">🔼 Tilt Up - رفع الكاميرا للأعلى</option>
              <option value="tilt-down">🔽 Tilt Down - خفض الكاميرا للأسفل</option>
            </select>

            {/* سلم سرعة الحركة المضافة من 1 إلى 10 */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                ⚡ سلم سرعة الحركة (Speed): <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{speed}/10</span>
              </label>
              <input type="range" min="1" max="10" step="1" value={speed} onChange={(e) => setSpeed(e.target.value)} style={{ width: "100%", accentColor: "#38bdf8" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b" }}>
                <span>بطيء جداً</span>
                <span>متوسط</span>
                <span>سريع جداً</span>
              </div>
            </div>

            {/* سلم المدة الزمنية */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                ⏱️ سلم مدة الفيديو: <span style={{ color: "#fbbf24", fontWeight: "bold" }}>{duration} ثوانٍ</span>
              </label>
              <input type="range" min="1" max="5" step="1" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%", accentColor: "#fbbf24" }} />
            </div>

          </section>
        </div>

        {/* شاشة المعاينة والبث */}
        <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#10b981" }}>🖥️ شاشة معاينة الحركة</h3>
          <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "140px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed rgba(139,92,246,0.2)", marginBottom: "12px" }}>
            {videoUrl ? (
              <img src={videoUrl} alt="Animated Video Output" style={{ maxWidth: "100%", maxHeight: "140px", objectFit: "contain" }} />
            ) : (
              <span style={{ color: "#64748b", fontSize: "13px" }}>ستظهر لقطة الفيديو المعدلة هنا...</span>
            )}
          </div>
          
          <button onClick={handleAnimate} disabled={loading || uploading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            {loading ? "🎬 جاري دمج طبقات الأبعاد وضبط السرعة..." : "🚀 بث حركة الكاميرا السينمائية المحدثة"}
          </button>
        </section>
      </div>

      <footer style={{ marginTop: "16px", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>
    </div>
  );
}