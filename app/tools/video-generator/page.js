"use client";
import { useState, useEffect } from "react";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [videoQuality, setVideoQuality] = useState("4K Cinematic + Stable Motion");
  const [motionSpeed, setMotionSpeed] = useState(50);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [archive, setArchive] = useState([]);
  const [logs, setLogs] = useState([]);

  // إعدادات الصورة المرجعية المدمجة بداخل الوصف
  const [referenceImg, setReferenceImg] = useState(null);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-2), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    const saved = localStorage.getItem("preserved_archive_videos");
    if (saved) setArchive(JSON.parse(saved));
    addLog("تم تشغيل محرك إنتاج الفيديو واستوديو اللقطات المتحركة ✓");
  }, []);

  // دالة رفع وقراءة الصورة المرجعية (تظهر كـ + داخل الوصف)
  const handleRefUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImg(reader.result);
      addLog("تم ربط صورة المرجع بداخل مربع الوصف ✓");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { addLog("خطأ: يرجى كتابة وصف الحركة أولاً!"); return; }
    setLoading(true);
    setGeneratedVideo(null);
    addLog("جاري تحليل الحركة السينمائية وأبعاد الكاميرا...");

    // إعداد أبعاد العرض والارتفاع الرقمي
    let w = 1024, h = 576;
    if (aspectRatio === "9:16") { w = 576; h = 1024; }

    // محاكاة الاتصال الذكي بمحرك التوليد وتحريك المراجع البصرية
    setTimeout(() => {
      // نستخدم دمو فيديو عالي الجودة متوافق مع العرض السينمائي والشورتس للتأكد من نجاح التحميل الداخلي للهاتف
      const mockVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-mysterious-pale-looking-man-with-a-hoodie-42218-large.mp4";
      
      setGeneratedVideo(mockVideoUrl);
      const updatedArchive = [mockVideoUrl, ...archive.slice(0, 5)];
      setArchive(updatedArchive);
      localStorage.setItem("preserved_archive_videos", JSON.stringify(updatedArchive));
      
      addLog("تم إنتاج مشهد الفيديو وتحريك المرجع بنجاح ✓");
      setLoading(false);
    }, 4000);
  };

  // دالة التحميل المباشر الصارم إلى المخزن الداخلي للهاتف دون تحديث الصفحة
  const handleDownload = async () => {
    if (!generatedVideo) return;
    try {
      addLog("جاري سحب ملف الـ MP4 مباشرة وتخزينه في ذاكرة الهاتف...");
      const response = await fetch(generatedVideo);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `preserved-archive-motion-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ ومزامنة الفيديو في استوديو الهاتف بنجاح ✓");
    } catch (err) {
      addLog("فشل السحب المباشر، جاري فتح الرابط في نافذة مستقلة للتنزيل...");
      window.open(generatedVideo, "_blank");
    }
  };

  return (
    <div style={{ direction: "rtl", color: "#f1f5f9", fontFamily: "sans-serif", padding: "10px" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "14px" }}>
        
        {/* العمود الأيمن: إعدادات المقاس والجودة والمرجع */}
        <div style={{ background: "rgba(20,20,35,0.7)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(139,92,246,0.2)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#a78bfa" }}>🎬 إعدادات الإخراج السينمائي</h3>
          
          <label style={{ fontSize: "11px", color: "#94a3b8" }}>📐 مقاس المشهد (Aspect Ratio):</label>
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "8px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "6px", marginBottom: "10px", fontSize: "12px" }}>
            <option value="16:9">أفقي سينمائي 16:9 (يوتيوب وثائقي)</option>
            <option value="9:16">عمودي شورتس 9:16 (Shorts)</option>
          </select>

          <label style={{ fontSize: "11px", color: "#94a3b8" }}>💎 جودة معالجة الفيديو:</label>
          <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)} style={{ width: "100%", padding: "8px", background: "#090915", color: "#fff", border: "1px solid #27274a", borderRadius: "6px", marginBottom: "10px", fontSize: "12px" }}>
            <option value="4K Cinematic + Stable Motion">4K السينمائية + تثبيت الإطارات</option>
            <option value="1080p Ultra-Smooth">1080p معدل إطارات سلس وعالي</option>
          </select>

          <label style={{ fontSize: "11px", color: "#94a3b8" }}>⚡ ديناميكية حركة الكاميرا: {motionSpeed}%</label>
          <input type="range" min="10" max="100" value={motionSpeed} onChange={(e) => setMotionSpeed(e.target.value)} style={{ width: "100%", marginBottom: "12px" }} />
          
          {/* زر مخفي ومطور لرفع الصورة المرجعية لتمريرها بداخل مربع الوصف */}
          <input type="file" accept="image/*" onChange={handleRefUpload} style={{ display: "none" }} id="video-ref-input" />
          <label htmlFor="video-ref-input" style={{ display: "block", textAlign: "center", background: "#090915", padding: "10px", borderRadius: "6px", border: "1px dashed #4c1d95", cursor: "pointer", fontSize: "11px", color: "#c084fc" }}>
            {referenceImg ? "📸 تم دمج ملامح الصورة بنجاح" : "📁 اضغط هنا لتجهيز صورة مرجعية ثابتة"}
          </label>
        </div>

        {/* العمود الأوسط: مربع كتابة الوصف + الصورة المرجعية المدمجة */}
        <div style={{ background: "rgba(20,20,35,0.7)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(139,92,246,0.2)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#38bdf8" }}>📝 صياغة مشهد الحركة</h3>
          
          <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>حقل الوصف والتحريك ذو التغذية المرجعية:</label>
          <div style={{
            background: "#090915",
            border: "1px solid #27274a",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minHeight: "110px"
          }}>
            
            {/* عرض مظهر الـ (+) الاحترافي المدمج بداخل الخانة */}
            {referenceImg && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(139,92,246,0.18)",
                padding: "3px 6px",
                borderRadius: "5px",
                alignSelf: "flex-start",
                border: "1px solid rgba(139,92,246,0.3)"
              }}>
                <img src={referenceImg} alt="Ref Thumbnail" style={{ width: "22px", height: "22px", borderRadius: "4px", objectFit: "cover" }} />
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#c084fc" }}>+</span>
                <span style={{ fontSize: "9px", color: "#c084fc" }}>كائن مرجعي مقفل</span>
                <span onClick={() => setReferenceImg(null)} style={{ cursor: "pointer", fontSize: "11px", color: "#ef4444", marginRight: "6px" }}>✕</span>
              </div>
            )}
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب تفاصيل تحريك المشهد (مثال: حركات الكاميرا الصاعدة، تمايل الخلفية الغامضة...)"
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "12px",
                outline: "none",
                resize: "none",
                padding: 0,
                flex: 1
              }}
            />
          </div>
        </div>

        {/* العمود الأيسر: شاشة معاينة الفيديو المولد وزر التحميل الصارم */}
        <div style={{ background: "rgba(20,20,35,0.7)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(139,92,246,0.2)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#10b981" }}>📺 شاشة المعاينة الحية</h3>
            <div style={{ background: "#05050f", minHeight: "140px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed #27274a" }}>
              {generatedVideo ? (
                <video src={generatedVideo} controls autoPlay loop style={{ width: "100%", maxHeight: "100%" }} />
              ) : (
                <span style={{ fontSize: "11px", color: "#475569" }}>سيعرض الفيديو هنا فور انتهاء المعالجة...</span>
              )}
            </div>
          </div>

          {generatedVideo && (
            <button onClick={handleDownload} style={{ width: "100%", padding: "11px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", marginTop: "10px", cursor: "pointer" }}>
              📥 تحميل مباشر إلى استوديو الهاتف (MP4)
            </button>
          )}
        </div>

      </div>

      {/* زر إطلاق محرك المعالجة والتوليد التلقائي */}
      <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", padding: "14px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", marginTop: "14px", fontSize: "14px", cursor: "pointer" }}>
        {loading ? "⚡ جاري صهر ملامح المرجع وضخ الحركة..." : "🎬 بدء إنتاج مشهد الفيديو الآن"}
      </button>

      {/* شريط السجلات التقنية السفلي لتعقب بيئة العمل على الهاتف */}
      <footer style={{ marginTop: "12px", background: "#05050f", padding: "8px", borderRadius: "6px", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </footer>

    </div>
  );
}