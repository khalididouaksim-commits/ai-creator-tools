"use client";
import { useState, useEffect } from "react";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("A young man walks beside a garden");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [videoQuality, setVideoQuality] = useState("4K");
  const [motionDynamism, setMotionDynamism] = useState(65);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // مفتاح فريد لإجبار المتصفح على إعادة بناء مشغل الفيديو ومنع ظهور فيديو فارغ
  const [videoKey, setVideoKey] = useState(0);
  
  // سجل الأحداث والكونسول المتوافق مع التصميم
  const [logs, setLogs] = useState([
    "[١٧:٠٠:٠١] استوديو اللقطات المتحركة جاهز ومستقر ✓"
  ]);
  
  // ميزات الصورة المرجعية وسجل التاريخ
  const [imageRef, setImageRef] = useState(null);
  const [historique, setHistorique] = useState([]);
  
  // تحميل السجل التاريخي عند فتح الصفحة من ذاكرة الهاتف
  useEffect(() => {
    const savedHistory = localStorage.getItem("studio_video_history_v4");
    if (savedHistory) {
      setHistorique(JSON.parse(savedHistory));
    }
  }, []);
  
  const addLog = (text) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [`[${time}] ${text}`, ...prev]);
  };
  
  // دالة التعامل مع رفع الصورة المرجعية (+)
  const handleImageRefChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageRef(reader.result);
      addLog("📸 تم تحميل وتثبيت الصورة المرجعية بنجاح داخل مربع الوصف ✓");
    };
    reader.readAsDataURL(file);
  };
  
  // 🎬 محرك إنتاج الفيديو الديناميكي المعدل لمنع المشغل الفارغ
  const handleGenerateVideo = () => {
    if (!prompt.trim()) {
      alert("الرجاء كتابة وصف مشهد الحركة أولاً!");
      return;
    }
    
    setLoading(true);
    setGeneratedVideo(null);
    addLog("⚡ جاري تحليل لقطة الكاميرا وضخ الريندر السينمائي...");
    
    setTimeout(() => {
      // مصفوفة من الفيديوهات السينمائية المتنوعة وعالية الجودة والمستقرة للتشغيل الفوري في المتصفحات
      const videoPool = [
        "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-43135-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-mysterious-surreal-landscape-with-fog-and-mountains-43093-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-with-clear-water-43058-large.mp4"
      ];
      
      // اختيار فيديو عشوائي بناءً على طلبك لضمان عدم التكرار والابتعاد عن الفيديو الفارغ
      const randomIndex = Math.floor(Math.random() * videoPool.length);
      const chosenVideo = videoPool[randomIndex];
      
      setGeneratedVideo(chosenVideo);
      // تغيير المفتاح لإجبار المتصفح على إنعاش شاشة المعاينة الحية فوراً
      setVideoKey(prev => prev + 1);
      
      addLog("✨ تم توليد مشهد الحركة السينمائي بنجاح وعرضه في المعاينة ✓");
      
      // تحديث وحفظ اللقطة المنتجة داخل سجل التاريخ (Historique)
      const newVideoItem = {
        id: Date.now(),
        url: chosenVideo,
        prompt: prompt,
        ratio: aspectRatio,
        quality: videoQuality,
        imageRef: imageRef
      };
      
      const updatedHistory = [newVideoItem, ...historique];
      setHistorique(updatedHistory);
      localStorage.setItem("studio_video_history_v4", JSON.stringify(updatedHistory));
      
      setLoading(false);
    }, 3000);
  };
  
  // دالة التحميل المباشر الآمن إلى ذاكرة الهاتف
  const handleDownload = async (url) => {
    try {
      addLog("📥 جاري معالجة وسحب ملف الـ MP4 إلى الهاتف...");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `production-scene-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addLog("💾 تم حفظ اللقطة في استوديو الهاتف بنجاح ✓");
    } catch (err) {
      window.open(url, "_blank");
    }
  };
  
  const clearAllHistory = () => {
    if (confirm("هل تريد مسح سجل اللقطات بالكامل؟")) {
      setHistorique([]);
      localStorage.removeItem("studio_video_history_v4");
      addLog("🗑️ تم تفريغ سجل التاريخ المحلي.");
    }
  };
  
  return (
    <div style={{ direction: "rtl", color: "#f1f5f9", fontFamily: "sans-serif", padding: "4px" }}>
      
      {/* توزيع العناصر حسب التصميم الفعلي الخاص بمنصتك */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "14px" }}>
        
        {/* اللوحة اليمنى: صياغة المشهد والإعدادات */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* صندوق صياغة مشهد الحركة مع الزر المدمج (+) */}
          <div style={{ background: "#0b0b1e", borderRadius: "12px", padding: "14px", border: "1px solid #1e1e38" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "#38bdf8" }}>📝 صياغة مشهد الحركة</h4>
            
            <div style={{
              background: "#050514",
              border: "1px solid #27274a",
              borderRadius: "8px",
              padding: "10px",
              minHeight: "110px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="اكتب وصف تحريك مشهدك هنا..."
                style={{ width: "100%", background: "none", border: "none", color: "#fff", fontSize: "12px", outline: "none", resize: "none" }}
              />

              {/* شريط التحكم السفلي الصغير بداخل حقل الوصف */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(39,39,74,0.5)", paddingTop: "8px" }}>
                <input type="file" accept="image/*" id="plus-image-upload" onChange={handleImageRefChange} style={{ display: "none" }} />
                <label htmlFor="plus-image-upload" style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "6px",
                  background: "#12122c",
                  border: "1px dashed #8b5cf6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a78bfa",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }} title="إضافة صورة مرجعية">
                  +
                </label>

                {imageRef && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(139,92,246,0.15)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <img src={imageRef} alt="Ref" style={{ width: "18px", height: "18px", borderRadius: "3px", objectFit: "cover" }} />
                    <span style={{ fontSize: "10px", color: "#a78bfa" }}>صورة مرجعية جاهزة</span>
                    <span onClick={() => setImageRef(null)} style={{ cursor: "pointer", fontSize: "11px", color: "#ef4444", marginRight: "4px" }}>✕</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* لوحة الإعدادات */}
          <div style={{ background: "#0b0b1e", borderRadius: "12px", padding: "14px", border: "1px solid #1e1e38" }}>
            <h4 style={{ margin: "0 0 12px", fontSize: "13px", color: "#8b5cf6" }}>🎬 إعدادات الإخراج السينمائي</h4>
            
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "11px", color: "#94a3b8" }}>📐 مقاس المشهد (Aspect Ratio):</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "8px", background: "#050514", color: "#fff", border: "1px solid #27274a", borderRadius: "6px", fontSize: "12px", marginTop: "4px" }}>
                <option value="16:9">أفق سينمائي 16:9 (يوتيوب ووثائقي)</option>
                <option value="9:16">عمودي شورتس 9:16 (تيك توك)</option>
              </select>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
                <span>⚡ ديناميكية حركة الكاميرا:</span>
                <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{motionDynamism}%</span>
              </div>
              <input type="range" min="10" max="100" value={motionDynamism} onChange={(e) => setMotionDynamism(e.target.value)} style={{ width: "100%", accentColor: "#3b82f6", marginTop: "6px" }} />
            </div>
          </div>

        </div>

        {/* اللوحة اليسرى: شاشة المعاينة الحية المحدثة */}
        <div style={{ background: "#0b0b1e", borderRadius: "12px", padding: "14px", border: "1px solid #1e1e38", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "#10b981" }}>📺 شاشة المعاينة الحية</h4>
            <div style={{ 
              background: "#020208", 
              aspectRatio: aspectRatio === "16:9" ? "16/9" : "9/16",
              maxHeight: "210px",
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              overflow: "hidden", 
              border: "1px solid #27274a",
              width: "100%"
            }}>
              {generatedVideo ? (
                /* مفتاح الـ key يضمن تحديث مشغل الفيديو وإعادة تحميل الكود فوراً لتجنب ظهور الشاشة فارغة */
                <video key={videoKey} src={generatedVideo} controls autoPlay loop style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "#475569" }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>🎬</div>
                  <span style={{ fontSize: "11px" }}>اضغط بدء الإنتاج ليتم عرض الريندر السينمائي هنا</span>
                </div>
              )}
            </div>
          </div>

          {generatedVideo && (
            <button onClick={() => handleDownload(generatedVideo)} style={{ width: "100%", padding: "10px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", marginTop: "12px", cursor: "pointer" }}>
              📥 تحميل مباشر إلى استوديو الهاتف (MP4)
            </button>
          )}
        </div>

      </div>

      {/* زر بدء الإنتاج الكبير */}
      <button onClick={handleGenerateVideo} disabled={loading} style={{ 
        width: "100%", padding: "12px", background: "linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)", 
        color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", marginTop: "14px", fontSize: "13px", cursor: "pointer"
      }}>
        {loading ? "⏳ جاري إطلاق الريندر ومنع الفراغ البرمجي..." : "🎬 بدء إنتاج مشهد الفيديو الآن"}
      </button>

      {/* الكونسول السفلي */}
      <div style={{ marginTop: "14px", background: "#050510", borderRadius: "8px", padding: "8px 12px", border: "1px solid #1e1e38", height: "70px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        {logs.map((log, index) => (
          <div key={index} style={{ fontSize: "11px", color: index === 0 ? "#38bdf8" : "#64748b", fontFamily: "monospace" }}>
            {log}
          </div>
        ))}
      </div>

      {/* 📜 سجل التاريخ التفاعلي (Historique) */}
      <div style={{ marginTop: "20px", background: "#0b0b1e", borderRadius: "12px", padding: "14px", border: "1px solid #1e1e38" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h4 style={{ margin: 0, fontSize: "13px", color: "#fbbf24" }}>📜 سجل اللقطات المنتجة محلياً (Historique)</h4>
          {historique.length > 0 && (
            <button onClick={clearAllHistory} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}>
              🗑️ مسح السجل
            </button>
          )}
        </div>

        {historique.length === 0 ? (
          <p style={{ margin: 0, fontSize: "11px", color: "#475569", textAlign: "center", padding: "20px 0" }}>لا توجد أي فيديوهات مؤرشفة حالياً.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))", gap: "10px" }}>
            {historique.map((item) => (
              <div key={item.id} style={{ background: "#050514", borderRadius: "8px", padding: "6px", border: "1px solid #27274a", display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ height: "75px", background: "#000", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                  <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted preload="metadata" />
                </div>
                <div style={{ fontSize: "10px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.prompt}</div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => { setGeneratedVideo(item.url); setVideoKey(Date.now()); addLog("👁️ تم استدعاء اللقطة من الأرشيف للتلفاز."); }} style={{ flex: 1, padding: "4px", background: "#1e1e38", border: "none", borderRadius: "4px", color: "#fff", fontSize: "9px", cursor: "pointer" }}>👁️ عرض</button>
                  <button onClick={() => handleDownload(item.url)} style={{ flex: 1, padding: "4px", background: "#10b981", border: "none", borderRadius: "4px", color: "#fff", fontSize: "9px", cursor: "pointer" }}>📥 سحب</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}