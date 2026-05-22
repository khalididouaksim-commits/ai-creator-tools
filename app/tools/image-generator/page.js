"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [quality, setQuality] = useState("high");
  const [refUrl, setRefUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // رفع صورة مرجعية من الهاتف والحصول على رابط عام
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setRefUrl(localUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("https://file.io/?expires=1d", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data?.success && data?.link) {
        setRefUrl(data.link);
      }
    } catch (err) {
      console.log("Upload error:", err);
    }
    setUploading(false);
  };

  // توليد الصورة عبر Pollinations.ai
  const generate = () => {
    const text = prompt.trim();
    if (!text) {
      alert("الرجاء كتابة وصف للصورة أولاً!");
      return;
    }

    if (uploading) {
      alert("يرجى الانتظار حتى يكتمل رفع الصورة المرجعية");      return;
    }

    setLoading(true);
    setImageUrl(null);

    // تحديد الأبعاد حسب النسبة المختارة
    let width = 1024, height = 1024;
    if (aspectRatio === "16:9") { width = 1280; height = 720; }
    else if (aspectRatio === "9:16") { width = 720; height = 1280; }

    // إضافة كلمات تحسين الجودة للبرومبت
    let finalPrompt = text;
    if (quality === "high") {
      finalPrompt += ", 8k resolution, highly detailed, cinematic lighting, photorealistic, masterwork";
    }

    // بناء الرابط النهائي
    let params = `?width=${width}&height=${height}&nologo=true&enhance=true&seed=${Math.random()}`;
    if (refUrl && refUrl.startsWith("https://")) {
      params += `&image=${encodeURIComponent(refUrl)}`;
    }
    
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}${params}`;
    setImageUrl(url);
  };

  // تحميل الصورة بجودة كاملة (حل متوافق مع جميع المتصفحات)
  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, sans-serif", direction: "rtl" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "15px", textAlign: "center" }}>🎬 مولد الصور السينمائي</h2>
            {/* حقل وصف الصورة */}
      <textarea
        placeholder="اكتب وصف الصورة بالإنجليزية (مثال: a futuristic city at sunset, cinematic lighting...)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "10px", minHeight: "70px", fontFamily: "inherit" }}
      />

      {/* رفع صورة مرجعية */}
      <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>📱 صورة مرجعية (اختياري):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: "14px" }} />
        {refUrl && (
          <img src={refUrl} alt="Reference" style={{ marginTop: "8px", maxWidth: "100%", maxHeight: "150px", borderRadius: "6px", objectFit: "cover" }} />
        )}
      </div>

      {/* خيارات الأبعاد والجودة */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>📐 المقاس:</label>
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#fff" }}>
            <option value="16:9">أفقي 16:9 (يوتيوب)</option>
            <option value="9:16">عمودي 9:16 (Short/Reels)</option>
            <option value="1:1">مربع 1:1 (إنستغرام)</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>💎 الجودة:</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#fff" }}>
            <option value="high">عالية جداً (Cinematic)</option>
            <option value="standard">عادية (Standard)</option>
          </select>
        </div>
      </div>
      
      {/* زر التوليد */}
      <button 
        onClick={generate} 
        disabled={loading || uploading}
        style={{ 
          width: "100%", padding: "12px", 
          backgroundColor: (loading || uploading) ? "#9ca3af" : "#2563eb", 
          color: "#fff", border: "none", borderRadius: "8px", 
          fontSize: "16px", cursor: (loading || uploading) ? "not-allowed" : "pointer",
          fontWeight: "bold", fontFamily: "inherit"
        }}
      >
        {uploading ? "⏳ جاري رفع المرجع..." : loading ? "⏳ جاري التوليد..." : "🚀 توليد الصورة"}
      </button>
      {/* عرض النتيجة وزر التحميل */}
      {imageUrl && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img 
            src={imageUrl} 
            alt="Generated" 
            onLoad={() => setLoading(false)}
            onError={() => { alert("خطأ في جلب الصورة، حاول مجدداً"); setLoading(false); }}
            style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} 
          />
          <button 
            onClick={downloadImage}
            style={{ display: "block", width: "100%", marginTop: "10px", padding: "10px 20px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "15px", fontFamily: "inherit" }}
          >
            ⬇️ تحميل الصورة بالجودة الكاملة
          </button>
        </div>
      )}
    </main>
  );
}